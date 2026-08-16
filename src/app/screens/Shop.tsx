import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import MobileContainer from '../components/MobileContainer';
import BottomNav from '../components/BottomNav';
import PetoButton from '../components/PetoButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Search, ShoppingCart, Star, ArrowLeft } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { addProductToCart, cartItemCount } from '../../lib/cartStore';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  rating?: number;
  image: string;
  description?: string;
};

export default function Shop() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sync = () => setCartCount(cartItemCount());
    sync();
    window.addEventListener('pashvik-cart', sync);
    let cancelled = false;
    (async () => {
      const res = await apiFetch('/shop/products');
      const data = await res.json();
      if (!cancelled && res.ok && Array.isArray(data.products)) setProducts(data.products);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
      window.removeEventListener('pashvik-cart', sync);
    };
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => cats.add(p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory && p.category !== 'All') {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
    });
  }, [products, selectedCategory, searchQuery]);

  const handleAddToCart = (p: Product) => {
    addProductToCart({ id: p.id, name: p.name, price: p.price });
    setCartCount(cartItemCount());
  };

  return (
    <MobileContainer>
      <div className="h-full bg-[#F8F7F3] overflow-y-auto pb-20">
        <div className="bg-gradient-to-r from-[#0B1220] to-[#059669] px-6 pt-12 relative pb-6 rounded-b-[30px]">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-white/80 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-white text-2xl" style={{ fontWeight: 700 }}>
              Pet Shop
            </h1>
            <button
              onClick={() => navigate('/cart')}
              className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[#C9A227] text-white text-xs rounded-full flex items-center justify-center"
                  style={{ fontWeight: 700 }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-[#059669] text-white'
                    : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
                }`}
                style={{ fontWeight: 600 }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          {loading ? (
            <p className="text-[#6B7280] text-sm">Loading products…</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map((product) => (
                <div key={product.id} className="bg-white rounded-[20px] overflow-hidden shadow-sm">
                  <div className="aspect-square bg-[#F3F4F6] relative">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#059669]/5 to-[#0B1220]/5 pointer-events-none"></div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-[#111827] text-sm mb-1 line-clamp-2" style={{ fontWeight: 600 }}>
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 text-[#C9A227]" fill="#C9A227" />
                      <span className="text-[#6B7280] text-xs">{product.rating ?? '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#111827] text-base" style={{ fontWeight: 700 }}>
                        ₹{product.price}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="px-3 py-1.5 bg-[#059669] text-white rounded-lg text-xs hover:bg-[#047857] transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
      <PetoButton />
    </MobileContainer>
  );
}
