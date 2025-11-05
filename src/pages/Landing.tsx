import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Shield, Zap, Search, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrencySelector } from '@/components/CurrencySelector';
import { HandlerHireDialog } from '@/components/HandlerHireDialog';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [hireDialogOpen, setHireDialogOpen] = useState(false);
  const [selectedHandlerType, setSelectedHandlerType] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/marketplace?search=${searchQuery}`);
  };

  const handleHireClick = (handlerType: string) => {
    setSelectedHandlerType(handlerType);
    setHireDialogOpen(true);
  };

  const categories = [
    { name: 'E-commerce', icon: '🛒', count: 245 },
    { name: 'SaaS', icon: '💼', count: 189 },
    { name: 'Blog', icon: '📝', count: 312 },
    { name: 'Portfolio', icon: '🎨', count: 156 },
    { name: 'News', icon: '📰', count: 98 },
    { name: 'Education', icon: '🎓', count: 134 },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'All transactions are protected with escrow services',
    },
    {
      icon: TrendingUp,
      title: 'Verified Metrics',
      description: 'Real revenue and traffic data verified by our team',
    },
    {
      icon: Zap,
      title: 'Quick Transfer',
      description: 'Complete website transfers in 24-48 hours',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">WebMarket</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate('/marketplace')} className="text-sm hover:text-primary transition-colors">
                Browse
              </button>
              <button className="text-sm hover:text-primary transition-colors">
                How It Works
              </button>
              <CurrencySelector />
              <Button onClick={() => navigate('/auth')}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Buy & Sell Websites
              <br />
              <span className="text-primary">With Confidence</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The trusted marketplace for buying and selling profitable websites, domains, and online businesses
            </p>
            
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search websites, domains, or categories..."
                    className="pl-10 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" size="lg" className="h-12">
                  Search
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span><strong>$2.5M+</strong> in transactions</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span><strong>10K+</strong> active users</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span><strong>500+</strong> websites sold</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground">Find the perfect website for your needs</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/marketplace?category=${category.name}`)}
                className="bg-card border rounded-lg p-6 text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} listings</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hire Website Handlers */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Need Help Managing Your Website?</h2>
            <p className="text-muted-foreground">Connect with verified professionals for website transfers, maintenance, and optimization</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: 'Website Transfer Specialists',
                description: 'Expert assistance with domain transfers, hosting migration, and ownership handoff',
                icon: '🔄',
                rate: 'From $50/hr',
                type: 'transfer'
              },
              {
                title: 'Maintenance & Support',
                description: 'Ongoing website maintenance, updates, security patches, and technical support',
                icon: '🛠️',
                rate: 'From $40/hr',
                type: 'maintenance'
              },
              {
                title: 'Optimization Experts',
                description: 'SEO optimization, performance tuning, and conversion rate improvements',
                icon: '📈',
                rate: 'From $60/hr',
                type: 'optimization'
              }
            ].map((handler, index) => (
              <motion.div
                key={handler.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="bg-card border rounded-lg p-6 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{handler.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{handler.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{handler.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">{handler.rate}</span>
                  <Button size="sm" variant="outline" onClick={() => handleHireClick(handler.type)}>
                    Hire Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" onClick={() => handleHireClick('')}>
              Browse All Handlers
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose WebMarket?</h2>
            <p className="text-muted-foreground">The safest and easiest way to buy and sell websites</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-card border rounded-lg p-8 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of buyers and sellers on the world's leading website marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/marketplace')}>
              Browse Listings
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')} className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Start Selling
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About Us</a></li>
                <li><a href="#" className="hover:text-foreground">How It Works</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">E-commerce</a></li>
                <li><a href="#" className="hover:text-foreground">SaaS</a></li>
                <li><a href="#" className="hover:text-foreground">Blogs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">FAQ</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-4">Get weekly updates on new listings</p>
              <div className="flex gap-2">
                <Input type="email" placeholder="Your email" className="h-9" />
                <Button size="sm">Subscribe</Button>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 WebMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <HandlerHireDialog
        open={hireDialogOpen}
        onOpenChange={setHireDialogOpen}
        handlerType={selectedHandlerType}
      />
    </div>
  );
}