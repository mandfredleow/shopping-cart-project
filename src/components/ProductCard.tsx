import { Star } from '@mui/icons-material';

// Product Card Props
interface ProductCardProps {
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
    category: string;
    rating: {
      rate: number;
      count: number;
    };
  };
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div
      className="relative border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 hover:scale-105 flex flex-col justify-between h-[450px]" 
      onClick={onClick}
    >
      {/* Product Image*/}
      <img src={product.image} alt={product.title} className="w-full h-64 object-contain" />

      {/* Product Information */}
      <div className="flex-grow p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-base">{product.title}</h3> 
          <p className="text-gray-600">${product.price.toFixed(2)}</p>
        </div>

        <div className="mt-auto pt-2">
          <p className="text-sm text-gray-500">Category: {product.category}</p>
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(product.rating.rate) ? 'text-yellow-500' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.rating.count})</span>
          </div>
        </div>
      </div>

      {/* Hovering overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white font-semibold rounded shadow-lg transition duration-300">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
