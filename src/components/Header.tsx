import React, { useState } from 'react';
import { ShoppingBag, Search, ClipboardList, X, LayoutGrid, Grid2X2 } from 'lucide-react';
import { Category } from '../types';

interface HeaderProps {
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  ordersCount: number;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  gridView: 'editorial' | 'catalog';
  onToggleGridView: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  searchQuery,
  onSearchChange,
  ordersCount,
  lang,
  onToggleLang,
  gridView,
  onToggleGridView,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems: { key: Category; labelAr: string; labelEn: string }[] = [
    { key: 'all', labelAr: 'المجموعة الكاملة', labelEn: 'All Collection' },
    { key: 'winter-jackets', labelAr: 'جواكيت شتوية', labelEn: 'Winter Jackets' },
    { key: 'lingerie', labelAr: 'ملابس داخلية', labelEn: 'Lingerie & Underwear' },
    { key: 'women', labelAr: 'نسائي', labelEn: 'Women' },
    { key: 'men', labelAr: 'رجالي', labelEn: 'Men' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0c0c0d]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      {/* Zara-inspired top minimalist announcement */}
      <div className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 py-1.5 px-4 text-center tracking-widest uppercase font-mono">
        <span className="font-medium text-neutral-900 dark:text-neutral-200">
          {lang === 'ar'
            ? 'توصيل مجاني للطلبات فوق ٥٠٠ ر.س · تغليف هدايا فاخر مستوحى من دار ندى'
            : 'Complimentary Express Delivery on orders over 500 SAR · Bespoke NADA Packaging'}
        </span>
      </div>

      {/* Main 3-Zone Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Zone 1: Iconic Brand Wordmark */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => {
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex flex-col items-start text-left focus:outline-none"
            aria-label="NADA Brand Home"
          >
            <span className="font-editorial text-3xl sm:text-4xl font-black tracking-[0.22em] text-neutral-950 dark:text-white transition-opacity group-hover:opacity-80">
              NADA
            </span>
            <span className="text-[9px] tracking-[0.35em] uppercase text-neutral-500 font-mono -mt-1">
              {lang === 'ar' ? 'أزياء شتوية فاخرة' : 'HAUTE COUTURE'}
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Zara stark uppercase typography) */}
        <nav className="hidden md:flex items-center gap-8 text-[12px] tracking-[0.15em] uppercase">
          {navItems.map((item) => {
            const isActive = activeCategory === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSelectCategory(item.key)}
                className={`transition-colors whitespace-nowrap py-1 relative ${
                  isActive
                    ? 'text-neutral-950 dark:text-white font-bold'
                    : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white font-normal'
                }`}
              >
                {lang === 'ar' ? item.labelAr : item.labelEn}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-neutral-950 dark:bg-white" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Interactive Affordances */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Grid Toggle (Zara signature feature) */}
          <button
            onClick={onToggleGridView}
            className="hidden lg:flex p-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={gridView === 'editorial' ? (lang === 'ar' ? 'عرض الكتالوج (٤ أعمدة)' : 'Catalog View') : (lang === 'ar' ? 'العرض التحريري (عمودين)' : 'Editorial View')}
          >
            {gridView === 'editorial' ? (
              <LayoutGrid className="w-4 h-4" />
            ) : (
              <Grid2X2 className="w-4 h-4" />
            )}
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors relative"
            title={lang === 'ar' ? 'بحث عن المنتجات' : 'Search Products'}
            aria-label="Search"
          >
            {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          {/* Admin Order Tracker Trigger */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white border border-neutral-300 dark:border-neutral-700 rounded hover:border-black dark:hover:border-white transition-colors whitespace-nowrap"
            title={lang === 'ar' ? 'لوحة تتبع طلبات المتجر' : 'Admin Order Tracker'}
          >
            <ClipboardList className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden sm:inline font-medium">
              {lang === 'ar' ? 'تتبع الطلبات' : 'Orders'}
            </span>
            {ordersCount > 0 && (
              <span className="text-[10px] bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-1.5 py-0.2 rounded font-mono font-bold">
                {ordersCount}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-1 text-[11px] font-mono tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-300 dark:border-neutral-800 rounded hover:border-black transition-colors"
            title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          {/* Shopping Bag Trigger with Live Count */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-950 dark:bg-white text-white dark:text-black hover:opacity-90 rounded font-medium text-xs tracking-wider transition-all whitespace-nowrap shadow-sm group"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-white dark:text-black group-hover:scale-105 transition-transform" />
            <span className="hidden sm:inline font-semibold">
              {lang === 'ar' ? 'الحقيبة' : 'Bag'}
            </span>
            <span className="font-mono text-xs font-bold bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black rounded-full w-5 h-5 flex items-center justify-center -mr-1">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Expanded Real-time Search Drawer */}
      {isSearchOpen && (
        <div className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-4 py-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Search className="w-5 h-5 text-neutral-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'ابحث بالاسم، القماش، أو النوع (مثل: كشمير، جاكيت، حرير، بليزر، كورسيه)...'
                  : 'Search by keyword (e.g. Cashmere, Jacket, Silk, Blazer, Corset, Shearling)...'
              }
              className="w-full bg-transparent text-sm sm:text-base text-neutral-950 dark:text-white placeholder-neutral-400 focus:outline-none font-medium"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-xs text-neutral-500 hover:text-black dark:hover:text-white px-2 py-1"
              >
                {lang === 'ar' ? 'مسح' : 'Clear'}
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded font-medium"
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
          {/* Quick Filter Tags */}
          <div className="max-w-4xl mx-auto mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <span className="text-neutral-500 font-medium">{lang === 'ar' ? 'مقترحات شائعة:' : 'Suggestions:'}</span>
            {['كشمير', 'حرير', 'معطف طويل', 'جاكيت طيار', 'كورسيه', 'ريش أوز'].map((keyword) => (
              <button
                key={keyword}
                onClick={() => onSearchChange(keyword)}
                className="hover:text-black dark:hover:text-white transition-colors underline underline-offset-4 decoration-neutral-400"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Category Nav Bar */}
      <div className="md:hidden flex items-center overflow-x-auto py-2.5 px-4 border-t border-neutral-200 dark:border-neutral-800 gap-3 text-xs tracking-wider uppercase no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeCategory === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectCategory(item.key)}
              className={`whitespace-nowrap px-3 py-1 rounded transition-colors ${
                isActive
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-black font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black'
              }`}
            >
              {lang === 'ar' ? item.labelAr : item.labelEn}
            </button>
          );
        })}
      </div>
    </header>
  );
};
