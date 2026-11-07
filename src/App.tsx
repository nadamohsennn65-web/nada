import React, { useState, useEffect, useMemo } from 'react';
import { Category, Product, ProductColor, CartItem, Order, OrderStatus } from './types';
import { PRODUCTS, INITIAL_ORDERS } from './data/products';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminOrderTrackerModal } from './components/AdminOrderTrackerModal';
import { Footer } from './components/Footer';

export default function App() {
  // Language & Direction state (Arabic default as requested)
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  // Grid view: 'editorial' (2 large columns like Zara editorial) or 'catalog' (4 columns)
  const [gridView, setGridView] = useState<'editorial' | 'catalog'>('catalog');

  // Category and sub-filter state
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<'all' | 'women' | 'men'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart state persisted in localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nada_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders state persisted in localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('nada_orders');
      if (saved) {
        return JSON.parse(saved);
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nada_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nada_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Sync HTML dir & lang attributes
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    selectedSize: string,
    selectedColor: ProductColor,
    quantity = 1
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor.nameEn === selectedColor.nameEn
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [...prev, { product, selectedSize, selectedColor, quantity }];
      }
    });
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCartItems((prev) => {
      const next = [...prev];
      next[index].quantity = newQty;
      return next;
    });
  };

  const handleUpdateSize = (index: number, newSize: string) => {
    setCartItems((prev) => {
      const next = [...prev];
      next[index].selectedSize = newSize;
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Order placement from Checkout
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]); // Clear cart upon successful order
  };

  // Order status update from Admin Tracker
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  // Filtered and searched product catalog
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Dynamic category filtering
      let matchesCategory = true;
      if (activeCategory === 'winter-jackets') {
        matchesCategory = product.category === 'winter-jackets';
      } else if (activeCategory === 'lingerie') {
        matchesCategory = product.category === 'lingerie';
      } else if (activeCategory === 'women') {
        matchesCategory = product.gender === 'women' || product.gender === 'unisex';
      } else if (activeCategory === 'men') {
        matchesCategory = product.gender === 'men' || product.gender === 'unisex';
      }

      // 2. Sub-filter by gender when in winter-jackets or lingerie
      let matchesGender = true;
      if (selectedGenderFilter !== 'all') {
        matchesGender =
          product.gender === selectedGenderFilter || product.gender === 'unisex';
      }

      // 3. Real-time search query matching
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const searchPool = [
          product.nameAr,
          product.nameEn,
          product.subtitleAr,
          product.subtitleEn,
          product.descriptionAr,
          product.descriptionEn,
          product.materialAr,
          product.materialEn,
          product.sku,
          product.tagAr || '',
          product.tagEn || '',
        ]
          .join(' ')
          .toLowerCase();

        matchesSearch = searchPool.includes(query);
      }

      return matchesCategory && matchesGender && matchesSearch;
    });
  }, [activeCategory, selectedGenderFilter, searchQuery]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0d] text-neutral-900 dark:text-[#f4f4f5] flex flex-col font-cairo transition-colors duration-200">
      {/* 1. Header (Top Bar Contract: Brand, Nav Links, Actions, Grid Switcher) */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSelectedGenderFilter('all');
        }}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        ordersCount={orders.length}
        lang={lang}
        onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        gridView={gridView}
        onToggleGridView={() => setGridView(gridView === 'editorial' ? 'catalog' : 'editorial')}
      />

      {/* 2. Hero Campaign Showcase */}
      <Hero
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSelectedGenderFilter('all');
        }}
        lang={lang}
      />

      {/* 3. Category Filter & Search Bar */}
      <CategoryFilterBar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSelectedGenderFilter('all');
        }}
        itemCount={filteredProducts.length}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery('')}
        selectedGenderFilter={selectedGenderFilter}
        onSelectGenderFilter={setSelectedGenderFilter}
        lang={lang}
      />

      {/* 4. Product Catalog Grid (Toggleable 2-column editorial or 4-column catalog) */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <p className="text-lg font-medium text-neutral-800 dark:text-neutral-300">
              {lang === 'ar' ? 'لم يتم العثور على قطع مطابقة' : 'No matching pieces found'}
            </p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {lang === 'ar'
                ? 'جرب البحث بكلمة أخرى أو تصفح تشكيلة الجواكيت والملابس الداخلية.'
                : 'Try adjusting your search query or reset category filters.'}
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedGenderFilter('all');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-neutral-950 dark:bg-white text-white dark:text-black text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              {lang === 'ar' ? 'عرض كل القطع' : 'View All Pieces'}
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-6 sm:gap-8 transition-all ${
              gridView === 'editorial'
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onOpenQuickView={setQuickViewProduct}
                lang={lang}
              />
            ))}
          </div>
        )}
      </main>

      {/* 5. Minimalist Footer */}
      <Footer lang={lang} />

      {/* 6. Product Detail View Modal (PDP) */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        lang={lang}
      />

      {/* 7. Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onUpdateSize={handleUpdateSize}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        lang={lang}
      />

      {/* 8. Full Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderPlaced={handleOrderPlaced}
        onOpenOrderTracker={() => setIsAdminOpen(true)}
        lang={lang}
      />

      {/* 9. Admin Order Tracker Modal */}
      <AdminOrderTrackerModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        lang={lang}
      />
    </div>
  );
}
