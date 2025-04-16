import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductCategories, getProductsByCategory } from '../../lib/products';
import ProductCard from '../../components/ProductCard';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ChevronLeft } from 'lucide-react';

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = await getProductCategories();
  return categories.map((category) => ({
    category,
  }));
}

type CategoryPageProps = {
  params: {
    category: string;
  };
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;
  const products = await getProductsByCategory(category);
  
  if (!products || products.length === 0) {
    return notFound();
  }
  
  // Format the category name for display
  const formatCategoryName = (category: string) => {
    return category
      .split("'")[0] // Remove apostrophes and what follows
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const categoryDisplayName = formatCategoryName(category);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Category Header */}
        <div className="bg-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Link href="/products" className="text-indigo-600 hover:text-indigo-500 flex items-center">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{categoryDisplayName}</h1>
            </div>
            <p className="mt-2 text-gray-600">
              Showing {products.length} {products.length === 1 ? 'product' : 'products'} in {categoryDisplayName}
            </p>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  image={product.image}
                  price={product.price}
                  slug={product.slug || ''}
                  description={product.description}
                  category={product.category}
                  rating={product.rating}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found in this category.</p>
              <Link 
                href="/products" 
                className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500"
              >
                View all products
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 