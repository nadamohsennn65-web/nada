import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { X, Search, Phone, MapPin, Package, Clock, Check, AlertCircle } from 'lucide-react';

interface AdminOrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  lang: 'ar' | 'en';
}

export const AdminOrderTrackerModal: React.FC<AdminOrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  lang,
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  const statusLabels: Record<OrderStatus, { ar: string; en: string; colorClass: string }> = {
    new: {
      ar: 'جديد · بانتظار التأكيد',
      en: 'New',
      colorClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    },
    processing: {
      ar: 'قيد التجهيز في دار ندى',
      en: 'Processing',
      colorClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
    },
    shipped: {
      ar: 'تم الشحن مع المندوب',
      en: 'Shipped',
      colorClass: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
    },
    delivered: {
      ar: 'تم التسليم بنجاح',
      en: 'Delivered',
      colorClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    },
    cancelled: {
      ar: 'ملغي',
      en: 'Cancelled',
      colorClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
    },
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery) ||
      order.customer.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 w-full max-w-5xl h-[90vh] max-h-[850px] overflow-hidden flex flex-col shadow-2xl relative text-neutral-900 dark:text-[#f4f4f5]"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h2 className="font-editorial text-xl font-bold tracking-wide text-neutral-950 dark:text-white">
                {lang === 'ar' ? 'لوحة إدارة وتتبع الطلبات' : 'Admin Order Tracker'}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {lang === 'ar'
                ? 'متابعة وتحديث كافة طلبات متجر دار ندى الفاخر لحظياً'
                : 'Live order tracking and fulfillment control center'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black dark:hover:text-white rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Search input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute top-2.5 right-3 rtl:right-3 rtl:left-auto left-3 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث برقم الطلب، الاسم، أو الهاتف...' : 'Search by ID, name, or phone...'}
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded px-9 py-2 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {(['all', 'new', 'processing', 'shipped', 'delivered'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded uppercase tracking-wider text-[11px] whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-neutral-950 dark:bg-white text-white dark:text-black font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {st === 'all'
                  ? lang === 'ar' ? 'الكل' : 'All'
                  : lang === 'ar' ? statusLabels[st].ar.split('·')[0].trim() : statusLabels[st].en}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: Split Master-Detail Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Order List Column (Master) */}
          <div className="md:col-span-5 border-r rtl:border-r-0 rtl:border-l border-neutral-200 dark:border-neutral-800 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-900 bg-white dark:bg-neutral-950">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-neutral-400 text-xs">
                {lang === 'ar' ? 'لا توجد طلبات تطابق معايير البحث' : 'No orders found matching criteria'}
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                const statusInfo = statusLabels[order.status];

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-neutral-100 dark:bg-neutral-900/90 border-l-2 rtl:border-l-0 rtl:border-r-2 border-neutral-950 dark:border-white'
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono font-bold text-neutral-950 dark:text-white tracking-wider">
                        #{order.id}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      {order.customer.fullName}
                    </div>

                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      {order.customer.city} · {order.items.length} {lang === 'ar' ? 'قطع' : 'items'}
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs">
                      {/* Clean Status Tag */}
                      <span className={`px-2 py-0.5 text-[10px] font-mono border rounded ${statusInfo.colorClass}`}>
                        {lang === 'ar' ? statusInfo.ar : statusInfo.en}
                      </span>
                      <span className="font-mono font-bold text-neutral-950 dark:text-white">
                        {order.total.toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Order Details Column (Detail) */}
          <div className="md:col-span-7 overflow-y-auto p-6 bg-neutral-50/50 dark:bg-neutral-900/30 flex flex-col justify-between space-y-6">
            {selectedOrder ? (
              <div className="space-y-6">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xl font-bold text-neutral-950 dark:text-white">
                        #{selectedOrder.id}
                      </span>
                      <span className={`px-2.5 py-1 text-[11px] font-mono border rounded ${statusLabels[selectedOrder.status].colorClass}`}>
                        {lang === 'ar' ? statusLabels[selectedOrder.status].ar : statusLabels[selectedOrder.status].en}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 mt-1 font-mono">
                      {new Date(selectedOrder.createdAt).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                    </div>
                  </div>

                  {/* Status update action */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                      {lang === 'ar' ? 'تعديل الحالة:' : 'Update Status:'}
                    </span>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => onUpdateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)}
                      aria-label={lang === 'ar' ? 'تعديل حالة الطلب' : 'Update order status'}
                      className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-white text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-black dark:focus:border-white font-medium"
                    >
                      <option value="new">{lang === 'ar' ? 'جديد (New)' : 'New'}</option>
                      <option value="processing">{lang === 'ar' ? 'قيد التجهيز (Processing)' : 'Processing'}</option>
                      <option value="shipped">{lang === 'ar' ? 'تم الشحن (Shipped)' : 'Shipped'}</option>
                      <option value="delivered">{lang === 'ar' ? 'تم التسليم (Delivered)' : 'Delivered'}</option>
                      <option value="cancelled">{lang === 'ar' ? 'ملغي (Cancelled)' : 'Cancelled'}</option>
                    </select>
                  </div>
                </div>

                {/* Customer Information Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                    <div className="flex items-center gap-2 text-neutral-500 font-medium">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'بيانات العميل' : 'Customer Info'}</span>
                    </div>
                    <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                      {selectedOrder.customer.fullName}
                    </div>
                    <div className="font-mono text-neutral-700 dark:text-neutral-300">
                      {selectedOrder.customer.phone}
                    </div>
                    <div className="text-neutral-500 text-[11px]">
                      {lang === 'ar' ? 'طريقة الدفع:' : 'Payment:'}{' '}
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {selectedOrder.paymentMethod === 'cod'
                          ? lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'
                          : selectedOrder.paymentMethod === 'applepay'
                          ? 'Apple Pay'
                          : lang === 'ar' ? 'بطاقة مدى / ائتمان' : 'Credit / Mada'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                    <div className="flex items-center gap-2 text-neutral-500 font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'عنوان التوصيل' : 'Delivery Address'}</span>
                    </div>
                    <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                      {selectedOrder.customer.city}
                    </div>
                    <div className="text-neutral-700 dark:text-neutral-300 text-xs">
                      {selectedOrder.customer.address}
                    </div>
                    {selectedOrder.customer.notes && (
                      <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 p-1.5 rounded">
                        <span className="font-medium">{lang === 'ar' ? 'ملاحظة:' : 'Note:'}</span> {selectedOrder.customer.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-300 uppercase tracking-wider">
                    {lang === 'ar' ? 'القطع المطلوبة' : 'Ordered Items'} ({selectedOrder.items.length})
                  </h4>

                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div
                        key={`${item.productId}-${idx}`}
                        className="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.nameAr}
                            className="w-12 h-14 object-cover bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800"
                          />
                          <div>
                            <div className="font-semibold text-neutral-900 dark:text-white">
                              {lang === 'ar' ? item.nameAr : item.nameEn}
                            </div>
                            <div className="text-neutral-500 font-mono text-[11px] mt-0.5">
                              {lang === 'ar' ? 'المقاس:' : 'Size:'} {item.size} · {lang === 'ar' ? item.colorNameAr : item.colorNameEn}
                            </div>
                          </div>
                        </div>

                        <div className="text-right rtl:text-left font-mono">
                          <div className="text-neutral-950 dark:text-white font-bold">
                            {(item.price * item.quantity).toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}
                          </div>
                          <div className="text-neutral-500 text-[11px]">
                            {item.quantity} × {item.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals Summary */}
                <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex justify-between">
                    <span>{lang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                    <span className="font-mono text-neutral-900 dark:text-neutral-200">{selectedOrder.subtotal.toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'ar' ? 'ضريبة القيمة المضافة (١٥٪):' : 'VAT (15%):'}</span>
                    <span className="font-mono text-neutral-900 dark:text-neutral-200">{selectedOrder.tax.toFixed(1)} {lang === 'ar' ? 'ر.س' : 'SAR'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'ar' ? 'رسوم الشحن والتوصيل:' : 'Shipping:'}</span>
                    <span className="font-mono text-neutral-900 dark:text-neutral-200">
                      {selectedOrder.shipping === 0 ? (lang === 'ar' ? 'مجاني' : 'FREE') : `${selectedOrder.shipping} SAR`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-sm font-bold text-neutral-950 dark:text-white">
                    <span>{lang === 'ar' ? 'المجموع الكلي للطلب:' : 'Grand Total:'}</span>
                    <span className="font-mono text-base">{selectedOrder.total.toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-400 text-xs">
                {lang === 'ar' ? 'اختر طلباً من القائمة لعرض التفاصيل الكاملة' : 'Select an order to inspect fulfillment details'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
