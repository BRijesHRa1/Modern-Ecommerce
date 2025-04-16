import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProducts } from '../../lib/products';
import { ShoppingCart, ChevronLeft, Star } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Generate static params for all product slugs
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    return notFound();
  }
  
  // Generate a placeholder color based on the product title
  const getPlaceholderColor = () => {
    const colors = [
      'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 
      'bg-red-200', 'bg-purple-200', 'bg-indigo-200', 
      'bg-pink-200', 'bg-teal-200'
    ];
    const index = product.title.length % colors.length;
    return colors[index];
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <Link href="/products" className="text-indigo-600 hover:text-indigo-500 flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to products
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className={`relative aspect-square overflow-hidden rounded-lg ${getPlaceholderColor()} flex items-center justify-center`}>
              <span className="absolute inset-0 text-4xl font-bold text-gray-700 flex items-center justify-center z-10">
                {product.title.charAt(0)}
              </span>
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover object-center z-20"
                priority
              />
            </div>
            
            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-5 w-5" 
                      fill={i < Math.round(product.rating.rate) ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">{product.rating.count} reviews</span>
              </div>
              
              <p className="text-2xl font-bold text-gray-900 mb-6">${product.price.toFixed(2)}</p>
              
              <div className="prose prose-sm text-gray-600 mb-8">
                <p>{product.description}</p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Category:</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {product.category}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="quantity" className="sr-only">Quantity</label>
                  <select
                    id="quantity"
                    name="quantity"
                    className="block w-full rounded-md border-gray-300 py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500 text-base"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to cart
                </button>
              </div>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-16 border-t border-gray-200 pt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><span className="font-medium">ID:</span> {product.id}</li>
                  <li><span className="font-medium">Category:</span> {product.category}</li>
                  <li><span className="font-medium">Rating:</span> {product.rating.rate}/5</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping</h3>
                <p className="text-sm text-gray-600">
                  Free shipping on orders over $50. Standard shipping takes 3-5 business days.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Returns</h3>
                <p className="text-sm text-gray-600">
                  Easy 30-day returns. See our <Link href="/returns" className="text-indigo-600 hover:text-indigo-500">return policy</Link> for more details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 