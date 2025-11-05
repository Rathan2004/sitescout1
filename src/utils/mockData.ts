import { User, Listing, Currency } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    role: 'seller',
    createdAt: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    role: 'seller',
    createdAt: '2023-02-20T10:00:00Z',
  },
  {
    id: '3',
    email: 'mike@example.com',
    name: 'Mike Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    role: 'user',
    createdAt: '2023-03-10T10:00:00Z',
  },
];

export const categories = [
  'E-commerce',
  'SaaS',
  'Blog',
  'Portfolio',
  'News',
  'Education',
  'Entertainment',
  'Business',
];

export const technologies = [
  'React',
  'Vue',
  'Angular',
  'WordPress',
  'Shopify',
  'Next.js',
  'Laravel',
  'Django',
  'Node.js',
  'PHP',
];

export const mockListings: Listing[] = [
  {
    id: '1',
    userId: '1',
    title: 'Premium E-commerce Store',
    description: 'Fully functional e-commerce platform with 10k+ monthly visitors. Built with React and Node.js. Includes payment integration, inventory management, and customer dashboard.',
    domain: 'shopnow.com',
    price: 50000,
    currency: 'USD',
    listingType: 'sale',
    category: 'E-commerce',
    monthlyRevenue: 15000,
    monthlyTraffic: 10000,
    domainAge: 3,
    domainAuthority: 45,
    technologies: ['React', 'Node.js', 'Shopify'],
    images: [
      'https://images.unsplash.com/photo-1557821552-17105176677c?w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800',
    status: 'active',
    featured: true,
    views: 1250,
    createdAt: '2024-01-15T10:00:00Z',
    user: mockUsers[0],
  },
  {
    id: '2',
    userId: '2',
    title: 'SaaS Analytics Platform',
    description: 'Advanced analytics dashboard for businesses. Real-time data visualization, custom reports, and API integrations.',
    domain: 'analyticspro.io',
    price: 75000,
    currency: 'USD',
    listingType: 'sale',
    category: 'SaaS',
    monthlyRevenue: 25000,
    monthlyTraffic: 5000,
    domainAge: 2,
    domainAuthority: 38,
    technologies: ['React', 'Next.js', 'Node.js'],
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    status: 'active',
    featured: true,
    views: 890,
    createdAt: '2024-01-20T10:00:00Z',
    user: mockUsers[1],
  },
  {
    id: '3',
    userId: '1',
    title: 'Tech Blog with 50k Readers',
    description: 'Established technology blog with loyal readership. SEO optimized, monetized through ads and affiliates.',
    domain: 'techinsights.blog',
    price: 30000,
    currency: 'USD',
    listingType: 'sale',
    category: 'Blog',
    monthlyRevenue: 8000,
    monthlyTraffic: 50000,
    domainAge: 5,
    domainAuthority: 52,
    technologies: ['WordPress', 'PHP'],
    images: [
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
    status: 'active',
    featured: false,
    views: 650,
    createdAt: '2024-02-01T10:00:00Z',
    user: mockUsers[0],
  },
];

export const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.12 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.53 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.50 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.88 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rate: 10.52 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.67 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.34 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.83 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', rate: 1320.50 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', rate: 17.15 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.02 },
];

export const mockApiCall = <T,>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};