'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Filter, SlidersHorizontal } from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Product } from '../lib/products';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
        
        // Get unique categories - ensure type safety
        const uniqueCategories = Array.from(
          new Set(data.map((p: Product) => p.category))
        ) as string[];
        setCategories(uniqueCategories);
        
        // Find max price for range
        const maxPrice = Math.ceil(Math.max(...data.map((p: Product) => p.price)));
        setPriceRange([0, maxPrice]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Filter products based on selected category and price range
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });
  
  // Format the category name for display
  const formatCategoryName = (category: string) => {
    return category
      .split("'")[0] // Remove apostrophes and what follows
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <div className="bg-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filter sidebar - Mobile toggle */}
            <div className="md:hidden mb-4">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center gap-2 bg-white p-3 border border-gray-300 rounded-md text-gray-700"
              >
                <SlidersHorizontal className="h-5 w-5" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
            
            {/* Filters - Desktop always visible, mobile toggleable */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                </div>
                
                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Category</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="category-all"
                        name="category"
                        type="radio"
                        checked={selectedCategory === null}
                        onChange={() => setSelectedCategory(null)}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="category-all" className="ml-3 text-sm text-gray-700">
                        All Categories
                      </label>
                    </div>
                    
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          id={`category-${category}`}
                          name="category"
                          type="radio"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor={`category-${category}`} className="ml-3 text-sm text-gray-700 capitalize">
                          {formatCategoryName(category)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Price Range</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="price-range" className="sr-only">Price range</label>
                      <input
                        id="price-range"
                        type="range"
                        min="0"
                        max={priceRange[1]}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">$0</p>
                      <p className="text-sm font-medium text-gray-900">
                        Up to ${priceRange[1]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Image
                    src="https://illustrations.popsy.co/gray/box-opening.svg"
                    alt="No products found"
                    width={300}
                    height={300}
                    className="mx-auto mb-6"
                  />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your filters to find what you&apos;re looking for.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
                  {filteredProducts.map((product) => (
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
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 