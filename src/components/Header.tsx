import React from 'react';
import { ShoppingCart, Store } from 'lucide-react';
import { Button, Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-1">
            <a href="/" className="flex items-center space-x-3 text-gray-800 transition-colors duration-300">
              <Store className="h-8 w-8" />
              <span className="text-2xl font-bold">StyleStore</span>
            </a>
          </div>
          <div className="flex items-center" onClick={() => navigate('/cart')}>
            <Button variant="contained" className="relative" aria-label={`Shopping cart with ${cartCount} items`}>
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <Badge badgeContent={cartCount} color="error" className="absolute -top-2 -right-2">
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;