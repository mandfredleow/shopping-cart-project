import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Product } from '../types/Product';
import { TextField, MenuItem, InputLabel, Select, FormControl } from '@mui/material';
import { Loader } from 'lucide-react';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('none');
  const navigate = useNavigate(); // Use navigate to programmatically route users

  // Fetch products from FakeStore API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Initially, show all products
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle filtering products by category
  const handleFilter = (category: string) => {
    setCategory(category);
    const updatedProducts = category === 'All' ? products : products.filter((product) => product.category === category);
    setFilteredProducts(updatedProducts);
    handleSort(sortOption, updatedProducts); // Re-sort the filtered products
  };

  // Handle sorting products
  const handleSort = (option: string, productList: Product[] = filteredProducts) => {
    setSortOption(option);
    let sortedProducts = [...productList];

    switch (option) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating-asc':
        sortedProducts.sort((a, b) => a.rating.rate - b.rating.rate);
        break;
      case 'rating-desc':
        sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'none':
      default:
        sortedProducts = productList; // No sorting, return as is
        break;
    }

    setFilteredProducts(sortedProducts);
  };

  // Handle product search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSortOption('none'); // Reset sort option to none after search
    const updatedProducts = products.filter(
      (product) =>
        product.title.toLowerCase().includes(term.toLowerCase()) &&
        (category === 'All' || product.category === category)
    );
    handleSort('none', updatedProducts); // Apply no sorting initially after search
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader className="w-12 h-12 text-black animate-spin mb-4" />
        <p className="text-lg text-gray-600">Loading products...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div id="root" className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">All Products</h1>
          <div className="flex flex-col gap-4 mb-6">
            {/* Search Bar */}
            <TextField
              label="Search Products"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Filter Button */}
              <FormControl variant="outlined" size="small" className="w-full sm:w-1/2">
                <InputLabel id="filter-label">Category</InputLabel>
                <Select
                  labelId="filter-label"
                  value={category}
                  onChange={(e) => handleFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="All">All</MenuItem>
                  {Array.from(new Set(products.map((product) => product.category))).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Sort Button */}
              <FormControl variant="outlined" size="small" className="w-full sm:w-1/2">
                <InputLabel id="sort-label">Sort by</InputLabel>
                <Select
                  labelId="sort-label"
                  value={sortOption}
                  onChange={(e) => handleSort(e.target.value)}
                  label="Sort by"
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="price-asc">Price: Ascending</MenuItem>
                  <MenuItem value="price-desc">Price: Descending</MenuItem>
                  <MenuItem value="rating-asc">Rating: Ascending</MenuItem>
                  <MenuItem value="rating-desc">Rating: Descending</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
                
          {/* Product Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/products/${product.id}`)}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;