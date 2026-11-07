import React from 'react';
import { Category } from '../types';
import { X } from 'lucide-react';

interface CategoryFilterBarProps {
  activeCategory: Category;
  onSelectCategory: (cat: Category) => void;
  itemCount: number;
  searchQuery: string;
  onClearSearch: () => void;
  selectedGenderFilter: 'all' | 'women' | 'men';
  onSelectGenderFilter: (gender: 'all' | 'women' | 'men') => void;
  lang: 'ar' | 'en';
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  activeCategory,
  onSelectCategory,
  itemCount,
  searchQuery,
  onClearSearch,
  selectedGenderFilter,
  onSelectGenderFilter,
  lang,
}) => {
  const categories: { id: Category; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'جميع القطع', labelEn: 'All Pieces' },
    { id: 'winter-jackets', labelAr: 'جواكيت شتوية', labelEn: 'Winter Jackets' },
    { id: 'lingerie', labelAr: 'ملابس داخلية', labelEn: 'Lingerie & Underwear' },
    { id: 'women', labelAr: 'مجموعة النساء', labelEn: 'Women\'s' },
    { id: 'men', labelAr: 'مجموعة الرجال', labelEn: 'Men\'s' },
  ];

  return (
    <div id="catalog-section" className="border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md sticky top-20 z-30 py-3.5 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Main Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-1.5 text-xs tracking-wider uppercase whitespace-nowrap transition-all rounded ${
                  isActive
                    ? 'bg-neutral-950 dark:bg-white text-white dark:text-black font-semibold shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 font-normal'
                }`}
              >
                {lang === 'ar' ? cat.labelAr : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Secondary controls: Gender sub-toggle & Results Counter */}
        <div className="flex items-center justify-between md:justify-end gap-4 text-xs text-neutral-500">
          {/* Sub-Filter for Gender if viewing Winter Jackets or Lingerie */}
          {(activeCategory === 'winter-jackets' || activeCategory === 'lingerie') && (
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-0.5 rounded">
              <button
                onClick={() => onSelectGenderFilter('all')}
                className={`px-2.5 py-1 rounded text-[11px] uppercase transition-colors ${
                  selectedGenderFilter === 'all'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white font-medium shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black'
                }`}
              >
                {lang === 'ar' ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => onSelectGenderFilter('women')}
                className={`px-2.5 py-1 rounded text-[11px] uppercase transition-colors ${
                  selectedGenderFilter === 'women'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white font-medium shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black'
                }`}
              >
                {lang === 'ar' ? 'نسائي' : 'Women'}
              </button>
              <button
                onClick={() => onSelectGenderFilter('men')}
                className={`px-2.5 py-1 rounded text-[11px] uppercase transition-colors ${
                  selectedGenderFilter === 'men'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white font-medium shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black'
                }`}
              >
                {lang === 'ar' ? 'رجالي' : 'Men'}
              </button>
            </div>
          )}

          {/* Active Search indicator */}
          {searchQuery && (
            <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-2.5 py-1 rounded text-xs text-neutral-800 dark:text-neutral-200">
              <span>{lang === 'ar' ? `البحث: "${searchQuery}"` : `"${searchQuery}"`}</span>
              <button onClick={onClearSearch} className="hover:text-black dark:hover:text-white" aria-label="Clear search">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Clean Item Count Metadata */}
          <div className="font-mono text-xs text-neutral-500 whitespace-nowrap">
            {lang === 'ar'
              ? `${itemCount} قطع حصرية`
              : `${itemCount} pieces`}
          </div>
        </div>
      </div>
    </div>
  );
};
