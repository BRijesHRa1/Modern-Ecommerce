import Image from 'next/image';
import Link from 'next/link';
import { getProductCategories, getAllProducts } from '../lib/products';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default async function CategoriesPage() {
  const categories = await getProductCategories();
  const allProducts = await getAllProducts();
  
  // Find a representative product for each category
  const categoryProducts = categories.map(category => {
    return allProducts.find(product => product.category === category);
  }).filter(Boolean);
  
  // Format the category name for display
  const formatCategoryName = (category: string) => {
    return category
      .split("'")[0] // Remove apostrophes and what follows
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <div className="bg-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Shop by Category</h1>
            <p className="mt-2 text-gray-600">Browse our products by category</p>
          </div>
        </div>
        
        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryProducts.map((product) => {
              // Generate a placeholder color
              const colorClasses = [
                'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 
                'bg-red-200', 'bg-purple-200', 'bg-indigo-200'
              ];
              const colorIndex = (product?.title?.length || 0) % colorClasses.length;
              const placeholderColor = colorClasses[colorIndex];
              
              const displayName = product?.category ? formatCategoryName(product.category) : '';
              
              return (
                <Link 
                  key={product?.category} 
                  href={`/categories/${product?.category}`}
                  className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-h-3 aspect-w-4 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors z-10" />
                    <div className={`w-full h-full ${placeholderColor}`}>
                      <Image
                        src={product?.image || ''}
                        alt={product?.category || ''}
                        width={600}
                        height={400}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white uppercase tracking-wide">
                          {displayName}
                        </h3>
                        <p className="mt-2 text-sm text-white bg-black/20 px-3 py-1 rounded">
                          Explore products
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 