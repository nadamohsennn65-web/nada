import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Truck, RefreshCw } from 'lucide-react';
import { Category } from '../types';

interface HeroProps {
  onSelectCategory: (cat: Category) => void;
  lang: 'ar' | 'en';
}

export const Hero: React.FC<HeroProps> = ({ onSelectCategory, lang }) => {
  const isRtl = lang === 'ar';
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="relative w-full border-b border-neutral-200 dark:border-neutral-800 bg-[#fbfbfb] dark:bg-[#09090b] overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[660px] items-stretch">
        {/* Left Column: Zara-style high-impact editorial copy */}
        <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-12 lg:py-16 z-10 order-2 lg:order-1">
          <div className="space-y-6 max-w-xl">
            {/* Season Kicker */}
            <div className="flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-neutral-500 font-mono">
              <span className="w-8 h-px bg-neutral-400 dark:bg-neutral-600" />
              <span>{lang === 'ar' ? 'شتاء ٢٠٢٦ · المجموعة المعاصرة' : 'WINTER COLLECTION 2026'}</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-neutral-950 dark:text-white font-normal leading-[1.08] tracking-tight text-balance">
              {lang === 'ar' ? (
                <>
                  هندسة الدفء والحرير <br />
                  <span className="italic font-light text-neutral-500 dark:text-neutral-400">بأسلوب المينيماليزم الفاخر</span>
                </>
              ) : (
                <>
                  Architectural Warmth <br />
                  <span className="italic font-light text-neutral-500 dark:text-neutral-400">& Intimate Silk Precision</span>
                </>
              )}
            </h1>

            {/* Editorial Body */}
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
              {lang === 'ar'
                ? 'دار ندى تقدم تشكيلة الشتاء المتخصصة في الجواكيت الهيكلية الثقيلة المصنوعة من أفخر أنواع الكشمير والصوف الإيطالي، جنباً إلى جنب مع قطع الملابس الداخلية الحريرية فائقة الرقة للمرأة والرجل العصريين.'
                : 'NADA introduces a focused monochromatic edit of structured winter outerwear cut from Italian cashmere, alongside refined Mulberry silk and ribbed modal intimates.'}
            </p>

            {/* Direct Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  onSelectCategory('winter-jackets');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-3.5 bg-neutral-950 dark:bg-white text-white dark:text-black hover:opacity-90 text-xs font-semibold tracking-widest uppercase transition-all flex items-center gap-2 group shadow-md"
              >
                <span>{lang === 'ar' ? 'تسوق الجواكيت الشتوية' : 'Shop Winter Jackets'}</span>
                <Arrow className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  onSelectCategory('lingerie');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-3.5 bg-transparent text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-medium tracking-widest uppercase transition-colors"
              >
                {lang === 'ar' ? 'تشكيلة الملابس الداخلية' : 'Explore Intimates'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: High-Res Editorial Campaign Image */}
        <div className="lg:col-span-6 relative h-[420px] sm:h-[500px] lg:h-full order-1 lg:order-2 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          <img
            src="/src/assets/images/hero_nada_campaign_1794083940644.jpg"
            alt="NADA Winter Campaign Lookbook"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter contrast-[1.03] transition-transform duration-700 hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white/90 dark:bg-black/75 backdrop-blur-md px-3.5 py-1.5 border border-black/10 dark:border-white/10 text-[11px] text-neutral-900 dark:text-neutral-300 font-mono tracking-widest uppercase shadow-sm">
            {lang === 'ar' ? 'إطلالة الحملة · كشمير خالص' : 'LOOK 01 · PURE CASHMERE'}
          </div>
        </div>
      </div>

      {/* Trust & Craftsmanship Strip */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/60 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-neutral-800 dark:text-neutral-200 shrink-0" />
            <span>{lang === 'ar' ? 'توصيل مجاني للطلبات +٥٠٠ ر.س' : 'Free Express Delivery > 500 SAR'}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-neutral-800 dark:text-neutral-200 shrink-0" />
            <span>{lang === 'ar' ? 'أقمشة إيطالية وحرير توت أصلي' : 'Pure Cashmere & Mulberry Silk'}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-4 h-4 text-neutral-800 dark:text-neutral-200 shrink-0" />
            <span>{lang === 'ar' ? 'استبدال واسترجاع سهل خلال ١٤ يوماً' : '14-Day Complimentary Exchange'}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-neutral-800 dark:text-neutral-200 shrink-0" />
            <span>{lang === 'ar' ? 'دفع آمن أو عند الاستلام' : 'Secure Checkout & Cash on Delivery'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
