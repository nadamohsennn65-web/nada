import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { X, CheckCircle2, ShieldCheck, CreditCard, Banknote, Smartphone } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderPlaced: (order: Order) => void;
  onOpenOrderTracker: () => void;
  lang: 'ar' | 'en';
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderPlaced,
  onOpenOrderTracker,
  lang,
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('الرياض');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'applepay'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [validationError, setValidationError] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 500;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 45;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping;

  const citiesList = [
    { ar: 'الرياض', en: 'Riyadh' },
    { ar: 'جدة', en: 'Jeddah' },
    { ar: 'الدمام والخبر', en: 'Dammam & Khobar' },
    { ar: 'مكة المكرمة', en: 'Makkah' },
    { ar: 'المدينة المنورة', en: 'Madinah' },
    { ar: 'القصيم', en: 'Qassim' },
    { ar: 'دبي (الإمارات)', en: 'Dubai (UAE)' },
    { ar: 'الكويت', en: 'Kuwait City' },
    { ar: 'المنامة (البحرين)', en: 'Manama (Bahrain)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!fullName.trim()) {
      setValidationError(lang === 'ar' ? 'يرجى كتابة الاسم الكامل' : 'Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setValidationError(lang === 'ar' ? 'يرجى إدخال رقم هاتف صحيح للتوصيل' : 'Please enter a valid phone number');
      return;
    }
    if (!address.trim()) {
      setValidationError(lang === 'ar' ? 'يرجى كتابة عنوان التوصيل بالتفصيل' : 'Please enter your delivery address');
      return;
    }

    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: `ND-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        city,
        address: address.trim(),
        notes: notes.trim() || undefined,
      },
      items: cartItems.map((item) => ({
        productId: item.product.id,
        nameAr: item.product.nameAr,
        nameEn: item.product.nameEn,
        size: item.selectedSize,
        colorNameAr: item.selectedColor.nameAr,
        colorNameEn: item.selectedColor.nameEn,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod,
      status: 'new',
    };

    setTimeout(() => {
      onOrderPlaced(newOrder);
      setCompletedOrder(newOrder);
      setIsSubmitting(false);
    }, 600);
  };

  const handleCloseSuccess = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={completedOrder ? handleCloseSuccess : onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative text-neutral-900 dark:text-[#f4f4f5]"
      >
        {/* Close Button */}
        <button
          onClick={completedOrder ? handleCloseSuccess : onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-neutral-500 hover:text-black dark:hover:text-white p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* Order Confirmation View */
          <div className="text-center space-y-6 py-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-white/20 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
                {lang === 'ar' ? 'تم تأكيد طلبك بنجاح' : 'Order Confirmed'}
              </span>
              <h2 className="font-editorial text-3xl font-bold text-neutral-950 dark:text-white">
                {lang === 'ar' ? 'شكراً لثقتكم بدار ندى' : 'Thank You For Choosing NADA'}
              </h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                {lang === 'ar'
                  ? `تم تسجيل طلبكم برقم المرجع #${completedOrder.id}. سيتواصل معكم فريقنا لتأكيد موعد التوصيل السريع.`
                  : `Your order #${completedOrder.id} has been registered. Our atelier concierge will contact you shortly.`}
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 text-left rtl:text-right space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <span className="text-neutral-500">{lang === 'ar' ? 'رقم الطلب:' : 'Order ID:'}</span>
                <span className="font-mono text-neutral-950 dark:text-white font-bold">#{completedOrder.id}</span>
              </div>
              <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <span className="text-neutral-500">{lang === 'ar' ? 'العميل:' : 'Customer:'}</span>
                <span className="text-neutral-800 dark:text-neutral-200 font-medium">{completedOrder.customer.fullName} ({completedOrder.customer.phone})</span>
              </div>
              <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <span className="text-neutral-500">{lang === 'ar' ? 'عنوان التوصيل:' : 'Delivery Address:'}</span>
                <span className="text-neutral-800 dark:text-neutral-200">{completedOrder.customer.city} · {completedOrder.customer.address}</span>
              </div>
              <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <span className="text-neutral-500">{lang === 'ar' ? 'طريقة الدفع:' : 'Payment:'}</span>
                <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                  {completedOrder.paymentMethod === 'cod'
                    ? lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'
                    : completedOrder.paymentMethod === 'applepay'
                    ? 'Apple Pay'
                    : lang === 'ar' ? 'بطاقة بنكية / مدى' : 'Card'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 font-bold text-neutral-950 dark:text-white">
                <span>{lang === 'ar' ? 'المبلغ الكلي:' : 'Total Amount:'}</span>
                <span className="font-mono text-base">{completedOrder.total.toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}</span>
              </div>
            </div>

            {/* Post Order Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  handleCloseSuccess();
                  onOpenOrderTracker();
                }}
                className="flex-1 py-3.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                {lang === 'ar' ? 'تتبع الطلب في لوحة الإدارة' : 'Track in Order Tracker'}
              </button>
              <button
                onClick={handleCloseSuccess}
                className="flex-1 py-3.5 bg-neutral-950 dark:bg-white text-white dark:text-black hover:opacity-90 text-xs font-semibold tracking-wider uppercase transition-opacity"
              >
                {lang === 'ar' ? 'العودة للمتجر' : 'Return to Store'}
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="mb-6 space-y-1">
              <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
                {lang === 'ar' ? 'دار ندى · إتمام الشراء الفاخر' : 'NADA · Express Luxury Checkout'}
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-neutral-950 dark:text-white">
                {lang === 'ar' ? 'بيانات التوصيل والدفع' : 'Delivery & Payment Details'}
              </h2>
            </div>

            {validationError && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded">
                {validationError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Customer Contact */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-300 uppercase tracking-wider">
                  {lang === 'ar' ? '١. معلومات المستلم' : '1. Recipient Details'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-600 dark:text-neutral-400 mb-1">
                      {lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: سارة محمد العتيبي' : 'e.g. Sarah Al-Otaibi'}
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded px-3 py-2 text-xs text-neutral-950 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-600 dark:text-neutral-400 mb-1">
                      {lang === 'ar' ? 'رقم الهاتف الجوال *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={lang === 'ar' ? '+966 50 123 4567' : '+966 50 123 4567'}
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded px-3 py-2 text-xs text-neutral-950 dark:text-white placeholder-neutral-400 font-mono focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-900">
                <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-300 uppercase tracking-wider">
                  {lang === 'ar' ? '٢. عنوان التوصيل السريع' : '2. Delivery Address'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-600 dark:text-neutral-400 mb-1">
                      {lang === 'ar' ? 'المدينة *' : 'City *'}
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded px-3 py-2 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                    >
                      {citiesList.map((c) => (
                        <option key={c.en} value={lang === 'ar' ? c.ar : c.en}>
                          {lang === 'ar' ? c.ar : c.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-600 dark:text-neutral-400 mb-1">
                      {lang === 'ar' ? 'الحي واسم الشارع ورقم المبنى *' : 'Street & Neighborhood Details *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={lang === 'ar' ? 'حي النخيل، شارع تركي الأول، فيلا 14' : 'Al-Nakheel, Villa 14'}
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded px-3 py-2 text-xs text-neutral-950 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-600 dark:text-neutral-400 mb-1">
                    {lang === 'ar' ? 'ملاحظات خاصة بالتوصيل (اختياري)' : 'Delivery Notes (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: التوصيل بعد الساعة ٤ عصراً أو ترك الشحنة عند الاستقبال' : 'Special instructions...'}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded px-3 py-2 text-xs text-neutral-950 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-900">
                <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-300 uppercase tracking-wider">
                  {lang === 'ar' ? '٣. طريقة الدفع' : '3. Payment Method'}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 border rounded text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-neutral-950 dark:border-white bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-white font-bold shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                    <span className="text-xs">
                      {lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 border rounded text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-neutral-950 dark:border-white bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-white font-bold shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs">
                      {lang === 'ar' ? 'بطاقة مدى / ائتمان' : 'Mada / Card'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('applepay')}
                    className={`p-3 border rounded text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'applepay'
                        ? 'border-neutral-950 dark:border-white bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-white font-bold shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span className="text-xs">Apple Pay</span>
                  </button>
                </div>
              </div>

              {/* Order Items & Totals Breakdown */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
                <div className="font-semibold text-neutral-800 dark:text-neutral-300 pb-1 border-b border-neutral-200 dark:border-neutral-800 flex justify-between">
                  <span>{lang === 'ar' ? 'ملخص الحقيبة' : 'Order Summary'}</span>
                  <span>{cartItems.length} {lang === 'ar' ? 'قطع' : 'items'}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>{lang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                  <span className="font-mono text-neutral-900 dark:text-neutral-200">{subtotal.toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>{lang === 'ar' ? 'ضريبة القيمة المضافة (١٥٪ مشمولة):' : 'VAT (15% Included):'}</span>
                  <span className="font-mono text-neutral-800 dark:text-neutral-300">{tax.toFixed(1)} {lang === 'ar' ? 'ر.س' : 'SAR'}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>{lang === 'ar' ? 'الشحن السريع:' : 'Express Shipping:'}</span>
                  <span className="font-mono text-neutral-900 dark:text-neutral-200">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{lang === 'ar' ? 'مجاني' : 'FREE'}</span>
                    ) : (
                      `${shipping} ${lang === 'ar' ? 'ر.س' : 'SAR'}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-sm font-bold text-neutral-950 dark:text-white">
                  <span>{lang === 'ar' ? 'المجموع النهائي المطلوب:' : 'Final Payable Total:'}</span>
                  <span className="font-mono text-base">{total.toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-neutral-950 dark:bg-white text-white dark:text-black hover:opacity-90 text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{lang === 'ar' ? 'جاري تسجيل طلبكم...' : 'Registering Order...'}</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'تأكيد الطلب وشحن المشتريات' : 'Confirm Order & Ship'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
