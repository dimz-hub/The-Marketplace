"use client"
import React from 'react';
import { useRouter } from 'next/navigation'; // or 'react-router-dom'
import { Utensils, Scissors, Wrench, Package, Truck } from 'lucide-react';

const categories = [
  { name: 'Restaurants', icon: Utensils, color: 'bg-orange-50', iconColor: 'text-orange-500', count: '120+ Outlets' },
  { name: 'Fashion', icon: Scissors, color: 'bg-purple-50', iconColor: 'text-purple-500', count: '85+ Boutiques' },
  { name: 'Home Services', icon: Wrench, color: 'bg-blue-50', iconColor: 'text-blue-500', count: '50+ Professionals' },
  { name: 'Dry Foods', icon: Package, color: 'bg-green-50', iconColor: 'text-green-500', count: '200+ Wholesalers' },
  { name: 'Logistics', icon: Truck, color: 'bg-red-50', iconColor: 'text-red-500', count: '40+ Companies' },
];

const CategorySection = () => {
  const router = useRouter();

  const handleCategoryClick = (categoryName: string) => {
    // We map 'Dry Foods' to 'Dry Food' if your backend expects the singular version
    const queryName = categoryName === 'Dry Foods' ? 'Dry Food' : categoryName;
    
    // Redirect to the search page with the find_desc parameter
    router.push(`/search?find_desc=${encodeURIComponent(queryName)}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Category</h2>
          <p className="text-gray-500">Discover top-rated businesses across Nigeria</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className={`group flex flex-col items-center justify-center p-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${cat.color} border border-transparent hover:border-white`}
            >
              <div className={`p-4 rounded-full bg-white mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300 ${cat.iconColor}`}>
                <cat.icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">{cat.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{cat.count}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;