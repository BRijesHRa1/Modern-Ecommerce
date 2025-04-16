'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  id: number;
  title: string;
  image: string;
  price: number;
  slug: string;
  description: string;
  category?: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export default function ProductCard({ id, title, image, price, slug, description, category = '', rating }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();
  
  // Generate a placeholder color based on the product name
  const getPlaceholderColor = () => {
    const colors = [
      'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 
      'bg-red-200', 'bg-purple-200', 'bg-indigo-200', 
      'bg-pink-200', 'bg-teal-200'
    ];
    const index = title.length % colors.length;
    return colors[index];
  };

  const handleAddToCart = () => {
    const product = {
      id,
      title,
      price,
      description,
      category,
      image,
      rating: rating || { rate: 0, count: 0 },
      slug
    };
    
    addToCart(product);
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200 group-hover:opacity-75">
        {imgError ? (
          <div className={`h-full w-full flex items-center justify-center ${getPlaceholderColor()}`}>
            <span className="text-lg font-medium text-gray-700">{title.charAt(0)}</span>
          </div>
        ) : (
          <Image
            src={image}
            alt={title}
            width={400}
            height={400}
            className="h-full w-full object-cover object-center"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          <Link href={`/products/${slug}`} className="hover:underline">
            {title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
        
        {/* Rating */}
        {rating && (
          <div className="flex items-center mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="h-4 w-4" 
                  fill={i < Math.round(rating.rate) ? "currentColor" : "none"} 
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-500">({rating.count})</span>
          </div>
        )}
        
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">${price.toFixed(2)}</p>
          <button 
            className="flex items-center justify-center rounded-full bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Add to cart</span>
          </button>
        </div>
      </div>
    </div>
  );
} 