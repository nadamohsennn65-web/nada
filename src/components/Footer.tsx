import React from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  lang: 'ar' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-100 dark:bg-[#050506] border-t border-neutral-200 dark:border-neutral-900 text-neutral-600 dark:text-neutral-400 text-xs transition-colors">
      {/* Brand Craftsmanship Spotlight */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-neutral-200 dark:border-neutral-900">
        <div className="space-y-3">
          <span className="font-editorial text-3xl font-black tracking-[0.2em] text-neutral-950 dark:text-white">
            NADA
          </span>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed font-light">
            {lang === 'ar'
              ? 'دار أزياء معاصرة ترتكز على فلسفة البساطة الأحادية (Monochrome Minimalism). نتخصص في هندسة الجواكيت الشتوية الثقيلة من أفخر خيوط الكشمير والصوف، وقطع الملبس الداخلي من الحرير الطبيعي لراحة لا تضاهى.'
              : 'A contemporary luxury fashion atelier grounded in monochromatic minimalism. Specializing in architectural winter outerwear cut from Italian cashmere, alongside Mulberry silk intimates.'}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-neutral-950 dark:text-white uppercase tracking-wider font-semibold text-xs">
            {lang === 'ar' ? 'فلسفة التصميم' : 'Atelier Philosophy'}
          </h4>
          <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 font-light">
            <li>{lang === 'ar' ? '· أقمشة صوف إيطالية وكشمير طبيعي 100%' : '· 100% Italian Wool & Mongolian Cashmere'}</li>
            <li>{lang === 'ar' ? '· حرير التوت الطبيعي النقي 19 مومي' : '· Pure Mulberry Silk (19-momme)'}</li>
            <li>{lang === 'ar' ? '· تفصيل هندسي حاد مستوحى من البساطة العالمية' : '· Sharp Architectural Geometric Silhouette'}</li>
            <li>{lang === 'ar' ? '· تغليف فاخر مخصص لكل قطعة بختم ندى' : '· Hand-packed in bespoke luxury presentation boxes'}</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-neutral-950 dark:text-white uppercase tracking-wider font-semibold text-xs">
            {lang === 'ar' ? 'النشرة الحصرية' : 'Private Bulletin'}
          </h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
            {lang === 'ar'
              ? 'احصل على وصول مبكر لإصدارات الكبسولات المحدودة ومعارض الإطلاق.'
              : 'Receive private access to capsule collection drops and winter lookbooks.'}
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder={lang === 'ar' ? 'بريدك الإلكتروني...' : 'Your email...'}
              className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 px-3 py-2 text-xs text-neutral-950 dark:text-white placeholder-neutral-400 rounded focus:outline-none focus:border-black dark:focus:border-white w-full"
            />
            <button
              onClick={() => alert(lang === 'ar' ? 'شكراً لانضمامكم إلى قائمة عملاء ندى الخاصة' : 'Subscribed to NADA private bulletin')}
              className="px-4 py-2 bg-neutral-950 dark:bg-white text-white dark:text-black hover:opacity-90 uppercase tracking-wider font-semibold text-[11px] rounded shrink-0 transition-opacity"
            >
              {lang === 'ar' ? 'انضمام' : 'Join'}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
        <div>
          © {new Date().getFullYear()} NADA ATELIER. {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}
        </div>

        <div className="flex items-center gap-6">
          <span>{lang === 'ar' ? 'الرياض · دبي · باريس' : 'Riyadh · Dubai · Paris'}</span>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <span>{lang === 'ar' ? 'إلى الأعلى' : 'Back to top'}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
