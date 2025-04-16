import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getAllProducts, getProductCategories } from "./lib/products";
import ProductCard from "./components/ProductCard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default async function Home() {
  // Get all products and limit to 8 for the featured section
  const allProducts = await getAllProducts();
  const featuredProducts = allProducts.slice(0, 8);
  
  // Get categories for the category section
  const categories = await getProductCategories();
  const uniqueCategories = categories.slice(0, 4); // Limit to 4 categories for display
  
  // Get a representative product for each category
  const categoryProducts = uniqueCategories.map(category => {
    return allProducts.find(product => product.category === category);
  }).filter(Boolean);
  
  return (
    <main>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-indigo-600/70 z-10" />
        <div className="relative h-[600px] w-full bg-indigo-800">
          <Image
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070"
            alt="Modern Shop Hero"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Modern Shopping Experience</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">Discover our curated collection of premium products for every lifestyle</p>
          <Link 
            href="/products" 
            className="bg-white text-indigo-700 py-3 px-8 rounded-md font-medium hover:bg-indigo-50 transition-colors duration-300"
          >
            Shop Now
          </Link>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured Products</h2>
          <Link 
            href="/products" 
            className="text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6">
          {featuredProducts.map((product) => (
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
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Shop by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => {
              // Generate a placeholder color
              const colorClasses = [
                'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 
                'bg-red-200', 'bg-purple-200', 'bg-indigo-200'
              ];
              const colorIndex = (product?.title?.length || 0) % colorClasses.length;
              const placeholderColor = colorClasses[colorIndex];
              
              return (
                <Link 
                  key={product?.category} 
                  href={`/categories/${product?.category}`}
                  className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors z-10" />
                    <div className={`w-full h-full ${placeholderColor}`}>
                      <Image
                        src={product?.image || ''}
                        alt={product?.category || ''}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                        {product?.category}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Modern Shop</h2>
            <p className="text-lg text-gray-600 mb-6">
              We curate the finest products from around the world, bringing you quality items that enhance your everyday life. Our team meticulously selects each piece in our collection to ensure exceptional quality and design.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              From home goods to fashion accessories, our diverse catalog has something for everyone, all with the promise of premium craftsmanship and sustainable practices.
            </p>
            <Link 
              href="/about" 
              className="bg-indigo-600 text-white py-3 px-6 rounded-md font-medium hover:bg-indigo-700 transition-colors inline-block"
            >
              Learn More
            </Link>
          </div>
          <div className="relative h-96 lg:h-auto rounded-lg overflow-hidden bg-gray-200">
            <Image
              src="https://images.unsplash.com/photo-1629085265826-a71e2124a658?q=80&w=1974"
              alt="About ModernShop"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
