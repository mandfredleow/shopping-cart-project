import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';

function App() {
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<{ [key: string]: { quantity: number; size?: string } }>({}); 
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Function to update cart count
  const updateCartCount = useCallback(() => {
    const totalCount = Object.values(cartItems).reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalCount);
  }, [cartItems]);

  // Load cart data from localStorage on initial load
  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      try {
        const parsedCartItems: { [key: string]: { quantity: number; size?: string } } = JSON.parse(savedCartItems);
        setCartItems(parsedCartItems);
        setIsCartLoaded(true);

        // Calculate total count after loading items from localStorage
        const totalCount = Object.values(parsedCartItems).reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(totalCount);
      } catch (error) {
        console.error('Error parsing cart items from localStorage', error);
      }
    } else {
      setIsCartLoaded(true);
    }
  }, []);

  // Update localStorage and cart count when cartItems change
  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      updateCartCount();
    }
  }, [cartItems, isCartLoaded, updateCartCount]);

  // Function to add items to the cart
  const addToCart = (productId: number, quantity: number = 1, size?: string) => {
    setCartItems((prevItems) => {
      const key = size ? `${productId}-${size}` : `${productId}`; 
      const updatedItems = { 
        ...prevItems, 
        [key]: { 
          quantity: (prevItems[key]?.quantity || 0) + quantity,
          size 
        } 
      };
      return updatedItems;
    });
  };

  return (
    <Router>
      <div className="App">
        <Header cartCount={cartCount} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/products/:id"
            element={<ProductDetail cartItems={cartItems} addToCart={addToCart} />}
          />
          <Route
            path="/cart"
            element={<CartPage cartItems={cartItems} setCartItems={setCartItems} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
