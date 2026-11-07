import React, { useState } from 'react';
import { Product, ProductColor } from '../types';
import { Plus, Check, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: ProductColor) => void;
  onOpenQuickView: (product: Product) => void;
  lang: 'ar' | 'en';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenQuickView,
  lang,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <div
      onClick={() => onOpenQuickView(product)}
      className="group cursor-pointer flex flex-col bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all duration-300 relative"
    >
      {/* Top Media Container with Zara-aspect ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        {!imgError ? (
          <img
            src={product.image}
            alt={lang === 'ar' ? product.nameAr : product.nameEn}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center filter contrast-[1.02] group-hover:scale-104 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900 text-neutral-400 p-6 text-center">
            <span className="font-editorial text-2xl text-neutral-600 dark:text-neutral-400">NADA</span>
            <span className="text-xs mt-2">{lang === 'ar' ? product.nameAr : product.nameEn}</span>
          </div>
        )}

        {/* Subtle unboxed tag on top */}
        {product.tagAr && (
          <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-white/90 dark:bg-black/75 backdrop-blur-sm px-2.5 py-1 text-[10px] tracking-widest uppercase text-neutral-900 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 font-mono shadow-xs">
            {lang === 'ar' ? product.tagAr : product.tagEn}
          </div>
        )}

        {/* Quick View Button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenQuickView(product);
          }}
          className="absolute top-3 left-3 rtl:left-auto rtl:right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/90 dark:bg-black/80 hover:bg-white text-neutral-900 dark:text-white rounded-full border border-neutral-200 dark:border-white/20 shadow-md"
          title={lang === 'ar' ? 'عرض تفاصيل القطعة' : 'Quick View'}
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Hover Size Selector Bar (Zara style overlay at bottom of image) */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-0 inset-x-0 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md p-2.5 border-t border-neutral-200 dark:border-neutral-800 translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex items-center justify-between gap-2 shadow-lg"
        >
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`w-7 h-7 text-[11px] font-mono rounded flex items-center justify-center transition-colors ${
                  selectedSize === size
                    ? 'bg-neutral-950 dark:bg-white text-white dark:text-black font-bold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 shrink-0 ${
              isAdded
                ? 'bg-neutral-900 text-emerald-400 border border-emerald-500/30'
                : 'bg-neutral-950 dark:bg-white text-white dark:text-black hover:opacity-90'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تمت الإضافة' : 'Added'}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'أضف' : 'Add'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Metadata Section */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Subtle Category & Gender line */}
          <div className="text-[11px] text-neutral-500 tracking-wider uppercase mb-1">
            <span>
              {product.category === 'winter-jackets'
                ? lang === 'ar'
                  ? 'جواكيت شتوية'
                  : 'Winter Jacket'
                : lang === 'ar'
                ? 'ملابس داخلية فاخرة'
                : 'Luxury Intimate'}
            </span>
            <span className="mx-1.5 text-neutral-400">·</span>
            <span>
              {product.gender === 'women'
                ? lang === 'ar'
                  ? 'نسائي'
                  : 'Women'
                : product.gender === 'men'
                ? lang === 'ar'
                  ? 'رجالي'
                  : 'Men'
                : lang === 'ar'
                ? 'للجنسين'
                : 'Unisex'}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-black dark:group-hover:text-neutral-200 transition-colors line-clamp-1 leading-snug">
            {lang === 'ar' ? product.nameAr : product.nameEn}
          </h3>

          {/* Subtitle / Fabric info */}
          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5 font-light">
            {lang === 'ar' ? product.subtitleAr : product.subtitleEn}
          </p>
        </div>

        {/* Price and Color Swatches */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-900 text-xs">
          {/* Price with tabular numerals */}
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-sm font-bold text-neutral-950 dark:text-white tabular-nums">
              {product.price.toLocaleString()}{' '}
              <span className="text-xs font-sans text-neutral-500 font-normal">
                {lang === 'ar' ? 'ر.س' : 'SAR'}
              </span>
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through tabular-nums">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Color Indicators */}
          <div className="flex items-center gap-1.5">
            {product.colors.map((color) => (
              <span
                key={color.nameEn}
                title={lang === 'ar' ? color.nameAr : color.nameEn}
                className={`w-3.5 h-3.5 rounded-full border ${
                  selectedColor.nameEn === color.nameEn
                    ? 'border-neutral-900 dark:border-white scale-110 ring-1 ring-black/30 dark:ring-white/50'
                    : 'border-neutral-300 dark:border-neutral-700'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
