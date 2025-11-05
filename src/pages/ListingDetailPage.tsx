import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Heart, Share2, ExternalLink, TrendingUp, Users, Calendar, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useListingStore } from '@/store/listingStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { useFavoriteStore } from '@/store/favoriteStore';
import { formatCurrency, formatNumber, formatDate } from '@/utils/formatters';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { CurrencySelector } from '@/components/CurrencySelector';

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentListing, loading, fetchListingById, incrementViews } = useListingStore();
  const { selectedCurrency, currencies, convertPrice } = useCurrencyStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchListingById(id);
      incrementViews(id);
    }
  }, [id, fetchListingById, incrementViews]);

  const handleFavoriteToggle = () => {
    if (!currentListing) return;
    
    if (isFavorite(currentListing.id)) {
      removeFavorite(currentListing.id);
      toast.success('Removed from favorites');
    } else {
      addFavorite(currentListing.id);
      toast.success('Added to favorites');
    }
  };

  const handleShare = async () => {
    if (!currentListing) return;
    
    try {
      await navigator.share({
        title: currentListing.title,
        text: currentListing.description,
        url: window.location.href,
      });
      toast.success('Shared successfully');
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleContactSeller = () => {
    if (!currentListing) return;
    toast.info('Contact seller feature coming soon!');
  };

  const handleMakeOffer = () => {
    if (!currentListing) return;
    toast.info('Make offer feature coming soon!');
  };

  const currency = currencies.find((c) => c.code === selectedCurrency);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!currentListing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
        <Button onClick={() => navigate('/marketplace')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Button>
      </div>
    );
  }

  const convertedPrice = convertPrice(currentListing.price, currentListing.currency, selectedCurrency);
  const convertedRevenue = currentListing.monthlyRevenue 
    ? convertPrice(currentListing.monthlyRevenue, currentListing.currency, selectedCurrency)
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/marketplace')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
                <span className="text-xl font-bold">WebMarket</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CurrencySelector />
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <img
                src={currentListing.images[imageIndex] || currentListing.featuredImage}
                alt={currentListing.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              {currentListing.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {currentListing.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${currentListing.title} ${idx + 1}`}
                      className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                        imageIndex === idx ? 'border-primary' : 'border-transparent'
                      }`}
                      onClick={() => setImageIndex(idx)}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold tracking-tight">{currentListing.title}</h1>
                    {currentListing.featured && (
                      <Badge className="bg-primary">FEATURED</Badge>
                    )}
                  </div>
                  <a
                    href={`https://${currentListing.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {currentListing.domain}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFavoriteToggle}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isFavorite(currentListing.id) ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground text-lg mb-6">
                {currentListing.description}
              </p>

              <Separator className="my-6" />

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {convertedRevenue && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Monthly Revenue
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(convertedRevenue, selectedCurrency, currency?.symbol || '$')}
                      </div>
                    </CardContent>
                  </Card>
                )}
                {currentListing.monthlyTraffic && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Monthly Traffic
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatNumber(currentListing.monthlyTraffic)}
                      </div>
                    </CardContent>
                  </Card>
                )}
                {currentListing.domainAge && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Domain Age
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {currentListing.domainAge} years
                      </div>
                    </CardContent>
                  </Card>
                )}
                {currentListing.domainAuthority && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Domain Authority
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {currentListing.domainAuthority}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Technologies */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {currentListing.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Listed {formatDate(currentListing.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{formatNumber(currentListing.views)} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Status: {currentListing.status}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">
                  {formatCurrency(convertedPrice, selectedCurrency, currency?.symbol || '$')}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {currentListing.listingType === 'sale' ? 'One-time purchase' : 'Monthly rental'}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="lg" onClick={handleMakeOffer}>
                  Make an Offer
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={handleContactSeller}
                >
                  Contact Seller
                </Button>
                
                <Separator className="my-4" />
                
                {currentListing.user && (
                  <div className="flex items-center gap-3">
                    <img
                      src={currentListing.user.avatar}
                      alt={currentListing.user.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{currentListing.user.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {currentListing.user.role}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Secure escrow protection</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>Verified metrics</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}