import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Search, Grid3x3, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useListingStore } from '@/store/listingStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { useDebounce } from '@/hooks/useDebounce';
import { Listing } from '@/types';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { motion } from 'framer-motion';

export default function MarketplacePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const { listings, loading, fetchListings } = useListingStore();
  const { selectedCurrency, currencies, convertPrice } = useCurrencyStore();

  useEffect(() => {
    fetchListings({ search: debouncedSearch });
  }, [debouncedSearch, fetchListings]);

  const currency = currencies.find((c) => c.code === selectedCurrency);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">WebMarket</span>
            </div>
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search websites..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={() => navigate('/auth')}>Sign In</Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse Websites</h1>
            <p className="text-muted-foreground">{listings.length} listings found</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setView('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading listings...</p>
          </div>
        ) : (
          <div className={view === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {listings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/listing/${listing.id}`)}
                className="bg-card border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                {listing.featured && (
                  <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1">
                    FEATURED
                  </div>
                )}
                <img
                  src={listing.featuredImage}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground">{listing.domain}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    {listing.monthlyRevenue && (
                      <div>
                        <span className="font-semibold text-foreground">
                          {formatCurrency(
                            convertPrice(listing.monthlyRevenue, listing.currency, selectedCurrency),
                            selectedCurrency,
                            currency?.symbol || '$'
                          )}
                        </span>
                        /mo
                      </div>
                    )}
                    {listing.monthlyTraffic && (
                      <div>
                        <span className="font-semibold text-foreground">
                          {formatNumber(listing.monthlyTraffic)}
                        </span>{' '}
                        visitors
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(
                        convertPrice(listing.price, listing.currency, selectedCurrency),
                        selectedCurrency,
                        currency?.symbol || '$'
                      )}
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
