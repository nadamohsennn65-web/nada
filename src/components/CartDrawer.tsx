import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ArrowLeft, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onUpdateSize: (index: number, newSize: string) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  lang: 'ar' | 'en';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onUpdateSize,
  onRemoveItem,
  onProceedToCheckout,
  lang,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  if (!isOpen) return null;

  const isRtl = lang === 'ar';
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 500;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 45;
  const discountAmount = subtotal * (discountPercent / 100);
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.15; // 15% VAT
  const total = discountedSubtotal + shipping;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'NADA10') {
      setDiscountPercent(10);
      setPromoMessage(lang === 'ar' ? 'تم تطبيق خصم النخبة ١٠٪' : '10% Elite discount applied');
    } else {
      setPromoMessage(lang === 'ar' ? 'كوبون غير صالح' : 'Invalid coupon');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex pl-10 rtl:pl-0 rtl:pr-10">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-950 border-l rtl:border-l-0 rtl:border-r border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-[#f4f4f5] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              <h2 className="font-editorial text-xl font-bold tracking-wide text-neutral-950 dark:text-white">
                {lang === 'ar' ? 'حقيبة التسوق' : 'Shopping Bag'}
              </h2>
              <span className="font-mono text-xs bg-neutral-100 dark:bg-neutral-900 px-2.5 py-0.5 rounded text-neutral-600 dark:text-neutral-400 font-bold">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-black dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {subtotal > 0 && (
            <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-xs">
              {remainingForFreeShipping > 0 ? (
                <div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400 mb-1.5">
                    <span>
                      {lang === 'ar'
                        ? `أضف ${remainingForFreeShipping.toLocaleString()} ر.س للشحن المجاني`
                        : `Add ${remainingForFreeShipping.toLocaleString()} SAR for Free Delivery`}
                    </span>
                    <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-300">
                      {Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-neutral-950 dark:bg-white h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>
                    {lang === 'ar'
                      ? 'تهانينا! طلبيتك مؤهلة للشحن السريع المجاني'
                      : 'Congratulations! Eligible for Free Delivery'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-neutral-100 dark:divide-neutral-900">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="w-16 h-16 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-neutral-900 dark:text-neutral-200">
                    {lang === 'ar' ? 'حقيبة التسوق فارغة' : 'Your Bag is Empty'}
                  </p>
                  <p className="text-xs text-neutral-500 max-w-xs">
                    {lang === 'ar'
                      ? 'استكشف تشكيلتنا الشتوية الحصرية من الجواكيت والقطع الداخلية الفاخرة.'
                      : 'Explore our curated winter jackets and fine intimates.'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-neutral-950 dark:bg-white text-white dark:text-black text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  {lang === 'ar' ? 'تصفح المتجر' : 'Browse Catalog'}
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.nameEn}-${index}`} className="pt-6 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-26 bg-neutral-100 dark:bg-neutral-900 overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-800">
                    <img
                      src={item.product.image}
                      alt={lang === 'ar' ? item.product.nameAr : item.product.nameEn}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-neutral-950 dark:text-white line-clamp-1">
                          {lang === 'ar' ? item.product.nameAr : item.product.nameEn}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="text-neutral-400 hover:text-rose-500 p-1"
                          title={lang === 'ar' ? 'حذف من الحقيبة' : 'Remove item'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-neutral-500 flex items-center gap-2 mt-1">
                        <span>{lang === 'ar' ? item.selectedColor.nameAr : item.selectedColor.nameEn}</span>
                        <span>·</span>
                        {/* In-Cart Size Picker */}
                        <div className="flex items-center gap-1">
                          <span>{lang === 'ar' ? 'المقاس:' : 'Size:'}</span>
                          <select
                            value={item.selectedSize}
                            onChange={(e) => onUpdateSize(index, e.target.value)}
                            aria-label={lang === 'ar' ? 'تغيير المقاس' : 'Change size'}
                            className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs px-1.5 py-0.5 rounded font-mono focus:outline-none"
                          >
                            {item.product.sizes.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 rounded">
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono text-xs text-neutral-950 dark:text-white font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="font-mono text-sm font-bold text-neutral-950 dark:text-white tabular-nums">
                        {(item.product.price * item.quantity).toLocaleString()}{' '}
                        <span className="text-xs font-sans text-neutral-500 font-normal">
                          {lang === 'ar' ? 'ر.س' : 'SAR'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout Action */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-4">
              {/* Promo Code Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute top-2.5 right-2.5 rtl:right-2.5 rtl:left-auto left-2.5 text-neutral-400" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder={lang === 'ar' ? 'رمز الكوبون (مثال: NADA10)' : 'Promo Code (e.g. NADA10)'}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-8 py-1.5 text-xs text-neutral-900 dark:text-white uppercase font-mono placeholder:normal-case placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-3 py-1.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 text-neutral-900 dark:text-white text-xs font-medium rounded transition-colors"
                >
                  {lang === 'ar' ? 'تطبيق' : 'Apply'}
                </button>
              </div>
              {promoMessage && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {promoMessage}
                </div>
              )}

              <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span className="font-mono text-neutral-950 dark:text-white tabular-nums">
                    {subtotal.toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>{lang === 'ar' ? 'خصم الكوبون (١٠٪):' : 'Discount (10%):'}</span>
                    <span className="font-mono tabular-nums">
                      -{discountAmount.toFixed(1)} {lang === 'ar' ? 'ر.س' : 'SAR'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{lang === 'ar' ? 'ضريبة القيمة المضافة (١٥٪ مشمولة)' : 'Estimated VAT (15% Included)'}</span>
                  <span className="font-mono tabular-nums">
                    {tax.toFixed(1)} {lang === 'ar' ? 'ر.س' : 'SAR'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'ar' ? 'الشحن السريع' : 'Shipping'}</span>
                  <span className="font-mono tabular-nums">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {lang === 'ar' ? 'مجاني' : 'FREE'}
                      </span>
                    ) : (
                      `${shipping} ${lang === 'ar' ? 'ر.س' : 'SAR'}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-sm font-bold text-neutral-950 dark:text-white">
                  <span>{lang === 'ar' ? 'المجموع الإجمالي' : 'Total'}</span>
                  <span className="font-mono text-lg font-bold tabular-nums">
                    {total.toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-4 bg-neutral-950 dark:bg-white text-white dark:text-black hover:opacity-90 text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{lang === 'ar' ? 'متابعة الشراء (إتمام الطلب)' : 'Proceed to Checkout'}</span>
                <Arrow className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ar'
                    ? 'دفع مشفر وآمن ١٠٠٪ أو الدفع عند الاستلام'
                    : '100% Encrypted Checkout & Cash On Delivery'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
