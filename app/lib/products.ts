import fs from 'fs';
import path from 'path';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  slug?: string; // We'll generate this
  tags?: string[]; // Optional tags for products
}

export async function getAllProducts(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'data', 'items.json');
  const jsonData = await fs.promises.readFile(filePath, 'utf8');
  const data = JSON.parse(jsonData) as Product[];
  
  // Add slugs based on the title
  return data.map((product) => ({
    ...product,
    slug: product.slug || slugify(product.title),
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find(product => product.slug === slug) || null;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter(product => product.category === category);
}

export async function getProductsByTag(tag: string): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter(product => product.tags?.includes(tag));
}

export async function getProductCategories(): Promise<string[]> {
  const products = await getAllProducts();
  const categories = new Set(products.map(product => product.category));
  return Array.from(categories);
}

export async function getProductTags(): Promise<string[]> {
  const products = await getAllProducts();
  const tags = new Set<string>();
  products.forEach(product => {
    if (Array.isArray(product.tags)) {
      product.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getAllProducts();
  const lowerCaseQuery = query.toLowerCase();
  
  return products.filter(product => {
    return (
      product.title.toLowerCase().includes(lowerCaseQuery) ||
      product.description.toLowerCase().includes(lowerCaseQuery) ||
      product.category.toLowerCase().includes(lowerCaseQuery)
    );
  });
}

// Helper function to create slugs from titles
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
} 