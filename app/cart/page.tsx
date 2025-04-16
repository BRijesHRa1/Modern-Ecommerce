'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const [imgError, setImgError] = useState<Record<string, boolean>>({});
  
  // Generate a placeholder color based on the product name
  const getPlaceholderColor = (title: string) => {
    const colors = [
      'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 
      'bg-red-200', 'bg-purple-200', 'bg-indigo-200', 
      'bg-pink-200', 'bg-teal-200'
    ];
    const index = title.length % colors.length;
    return colors[index];
  };
  
  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = 5.99;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Header */}
        <div className="bg-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h2 className="text-xl font-medium text-gray-900">Items in your cart ({items.length})</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.product.id} className="py-6 flex flex-col sm:flex-row">
                      <div className="flex-shrink-0 relative w-24 h-24 rounded-md overflow-hidden">
                        {imgError[item.product.id] ? (
                          <div className={`h-full w-full flex items-center justify-center ${getPlaceholderColor(item.product.title)}`}>
                            <span className="text-lg font-medium text-gray-700">{item.product.title.charAt(0)}</span>
                          </div>
                        ) : (
                          <Image
                            src={item.product.image}
                            alt={item.product.title}
                            fill
                            className="object-cover object-center"
                            onError={() => setImgError(prev => ({ ...prev, [item.product.id]: true }))}
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 sm:ml-6 mt-4 sm:mt-0">
                        <div className="flex justify-between">
                          <h3 className="text-base font-medium text-gray-900">
                            <Link href={`/products/${item.product.slug}`} className="hover:text-indigo-600">
                              {item.product.title}
                            </Link>
                          </h3>
                          <p className="ml-4 text-base font-medium text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                        
                        <p className="mt-1 text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-2 text-gray-600 hover:text-indigo-600"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="mx-2 text-gray-700">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-2 text-gray-600 hover:text-indigo-600"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-700 flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="text-sm">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-10">
                  <Link 
                    href="/products" 
                    className="flex items-center text-indigo-600 hover:text-indigo-500"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600">Shipping</p>
                      <p className="text-sm font-medium text-gray-900">${shipping.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600">Tax (7%)</p>
                      <p className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                      <p className="text-base font-medium text-gray-900">Total</p>
                      <p className="text-base font-medium text-gray-900">${total.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    className="mt-6 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Checkout
                  </button>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                      We offer free shipping on orders over $50
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingBag className="h-12 w-12 mx-auto text-gray-400" />
              <h2 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h2>
              <p className="mt-2 text-sm text-gray-500">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 