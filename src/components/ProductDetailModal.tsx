import React, { useState } from 'react';
import { Product, ProductColor } from '../types';
import { X, Check, ShieldCheck, Truck, Ruler, ShoppingBag } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: ProductColor, quantity: number) => void;
  lang: 'ar' | 'en';
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  lang,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-none shadow-2xl grid grid-cols-1 md:grid-cols-12 relative text-neutral-900 dark:text-[#f4f4f5]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 p-2 bg-white/80 dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-300 rounded-full transition-colors border border-neutral-200 dark:border-neutral-700 shadow-sm"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Column (Left) */}
        <div className="md:col-span-6 relative bg-neutral-100 dark:bg-neutral-900 min-h-[360px] md:min-h-[550px] flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={lang === 'ar' ? product.nameAr : product.nameEn}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter contrast-[1.02]"
          />
          {product.tagAr && (
            <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-white/90 dark:bg-black/80 px-3 py-1 text-xs tracking-widest uppercase text-neutral-900 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 font-mono">
              {lang === 'ar' ? product.tagAr : product.tagEn}
            </div>
          )}
        </div>

        {/* Purchase Module Column (Right) */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & SKU */}
            <div className="flex items-center justify-between text-xs text-neutral-500 font-mono tracking-wider">
              <span>
                {product.category === 'winter-jackets'
                  ? lang === 'ar'
                    ? 'جواكيت شتوية فاخرة'
                    : 'Winter Outerwear'
                  : lang === 'ar'
                  ? 'ملابس داخلية راقية'
                  : 'Luxury Intimates'}
              </span>
              <span>SKU: {product.sku}</span>
            </div>

            {/* Product Title */}
            <h2 className="font-editorial text-2xl sm:text-3xl text-neutral-950 dark:text-white font-medium leading-tight">
              {lang === 'ar' ? product.nameAr : product.nameEn}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-2xl font-bold text-neutral-950 dark:text-white tabular-nums">
                {product.price.toLocaleString()}{' '}
                <span className="text-sm font-sans text-neutral-500 font-normal">
                  {lang === 'ar' ? 'ر.س' : 'SAR'}
                </span>
              </span>
              {product.originalPrice && (
                <span className="font-mono text-sm text-neutral-400 line-through tabular-nums">
                  {product.originalPrice.toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}
                </span>
              )}
              <span className="text-[11px] text-neutral-500">
                {lang === 'ar' ? '(شامل ضريبة القيمة المضافة)' : '(VAT included)'}
              </span>
            </div>

            {/* Editorial Description */}
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
              {lang === 'ar' ? product.descriptionAr : product.descriptionEn}
            </p>

            {/* Fabric & Materials */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-900 text-xs">
              <div className="text-neutral-500 dark:text-neutral-400 font-semibold mb-1">
                {lang === 'ar' ? 'التركيبة والنسيج:' : 'Composition & Care:'}
              </div>
              <div className="text-neutral-700 dark:text-neutral-300">
                {lang === 'ar' ? product.materialAr : product.materialEn}
              </div>
            </div>

            {/* Color Swatches */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 dark:text-neutral-400">
                  {lang === 'ar' ? 'اللون المحدد:' : 'Selected Color:'}
                </span>
                <span className="text-neutral-900 dark:text-neutral-200 font-medium">
                  {lang === 'ar' ? selectedColor.nameAr : selectedColor.nameEn}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.nameEn}
                    onClick={() => setSelectedColor(c)}
                    className={`flex items-center gap-2 px-3 py-1.5 border rounded text-xs transition-all ${
                      selectedColor.nameEn === c.nameEn
                        ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-white font-medium'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-neutral-400"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{lang === 'ar' ? c.nameAr : c.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector with Size Guide Trigger */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 dark:text-neutral-400">
                  {lang === 'ar' ? 'المقاس:' : 'Size:'}
                </span>
                <button
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1 underline underline-offset-4"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'دليل المقاسات' : 'Size Guide'}</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-xs font-mono uppercase tracking-wider rounded border transition-colors ${
                      selectedSize === size
                        ? 'bg-neutral-950 dark:bg-white text-white dark:text-black font-bold border-neutral-950 dark:border-white'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Collapsible Size Guide Table */}
              {showSizeGuide && (
                <div className="mt-2 p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-700 dark:text-neutral-300 space-y-1.5">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-200">
                    {lang === 'ar' ? 'جدول المقاسات القياسي (سم)' : 'Standard Fit Guide (cm)'}
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center font-mono py-1 border-y border-neutral-200 dark:border-neutral-800">
                    <span>المقاس</span>
                    <span>الصدر</span>
                    <span>الخصر</span>
                    <span>الأكتاف</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center font-mono text-neutral-500">
                    <span>S</span>
                    <span>88-92</span>
                    <span>70-74</span>
                    <span>42</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center font-mono text-neutral-500">
                    <span>M</span>
                    <span>94-98</span>
                    <span>76-80</span>
                    <span>44</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center font-mono text-neutral-500">
                    <span>L</span>
                    <span>100-106</span>
                    <span>82-88</span>
                    <span>46</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {lang === 'ar' ? 'الكمية:' : 'Quantity:'}
              </span>
              <div className="flex items-center border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                >
                  -
                </button>
                <span className="px-3 py-1.5 font-mono text-xs text-neutral-950 dark:text-white font-bold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Button & Guarantees */}
          <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-900">
            <button
              onClick={handleAdd}
              className={`w-full py-4 text-xs font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                isAdded
                  ? 'bg-neutral-900 text-emerald-400 border border-emerald-500/30'
                  : 'bg-neutral-950 dark:bg-white text-white dark:text-black hover:opacity-90 shadow-md'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تمت الإضافة إلى الحقيبة بنجاح' : 'Added to Bag'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إضافة إلى حقيبة التسوق' : 'Add to Shopping Bag'}</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-500 pt-1">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                <span>{lang === 'ar' ? 'توصيل سريع خلال ٢-٤ أيام' : 'Express Delivery in 2-4 days'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                <span>{lang === 'ar' ? 'ضمان الأصالة ١٠٠٪' : '100% Authentic Quality'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
