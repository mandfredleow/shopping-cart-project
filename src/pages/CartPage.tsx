import { useState, useEffect } from 'react';
import { Minus, Plus, X, ArrowLeft, Loader } from 'lucide-react';
import { Button } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

// Cart Item interface
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size?: string;
    category: string;
}

// Cart Page Props
interface CartPageProps {
    cartItems: { [key: string]: { quantity: number; size?: string } };
    setCartItems: React.Dispatch<React.SetStateAction<{ [key: string]: { quantity: number; size?: string } }>>;
}

export default function CartPage({ cartItems, setCartItems }: CartPageProps) {
    const [products, setProducts] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch product details
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const productDetails = await Promise.all(
                    Object.entries(cartItems).map(async ([key, { quantity, size }]) => {
                        const [id] = key.split('-');
                        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
                        const data = await response.json();
                        return {
                            id: data.id,
                            name: data.title,
                            price: data.price,
                            image: data.image,
                            quantity,
                            size,
                            category: data.category,
                        };
                    })
                );
                setProducts(productDetails);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [cartItems]);

    // Update quantity of item in cart
    const updateQuantity = (id: number, size: string | undefined, newQuantity: number) => {
        const key = size ? `${id}-${size}` : `${id}`;
        setCartItems((prevItems) => {
            const updatedItems = { ...prevItems };
            if (newQuantity > 0) {
                updatedItems[key] = { quantity: newQuantity, size };
            } else {
                delete updatedItems[key];
            }
            return updatedItems;
        });
    };

    const removeItem = (id: number, size: string | undefined) => {
        const key = size ? `${id}-${size}` : `${id}`;
        setCartItems((prevItems) => {
            const updatedItems = { ...prevItems };
            delete updatedItems[key];
            return updatedItems;
        });
    };

    const subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 10; // Flat rate shipping
    const tax = subtotal * 0.1; // 10% tax rate
    const total = subtotal + shipping + tax;

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Loader className="w-12 h-12 text-black animate-spin mb-4" />
                <p className="text-lg text-gray-600">Loading cart...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
            {products.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl mb-4">Your cart is empty</p>
                    <Button onClick={() => navigate('/')} variant="outlined">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continue Shopping
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="md:col-span-2">
                        {products.map((item) => (
                            <div key={`${item.id}-${item.size || ''}`} className="flex items-center border-b py-4">
                                <Link to={`/products/${item.id}`} className="flex items-start flex-grow">
                                    <img src={item.image} alt={item.name} className="w-24 h-24 object-contain rounded-md" />
                                    <div className="ml-4 flex-grow">
                                        <h2 className="font-semibold">{item.name}</h2>
                                        <p className="text-gray-600 mb-1">${item.price.toFixed(2)}</p>
                                        {(item.category === "men's clothing" || item.category === "women's clothing" || item.category === 'jewelery') && item.size && (
                                            <p className="text-sm text-gray-500 mb-2">Size: {item.size.toUpperCase()}</p>
                                        )}
                                        <div className="flex items-center">
                                            <label htmlFor={`quantity-${item.id}`} className="sr-only">
                                                Quantity
                                            </label>
                                            <div className="flex items-center border rounded-md">
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        updateQuantity(item.id, item.size, item.quantity - 1);
                                                    }}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <input
                                                    id={`quantity-${item.id}`}
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        const newQuantity = parseInt(e.target.value) || 1;
                                                        updateQuantity(item.id, item.size, newQuantity);
                                                    }}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                    className="w-12 text-center"
                                                />
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        updateQuantity(item.id, item.size, item.quantity + 1);
                                                    }}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <div className="flex items-center ml-4">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => removeItem(item.id, item.size)}
                                        className="bg-red-500 hover:bg-red-600 text-white"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Order Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-2 flex-grow overflow-y-auto">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2"> {/* Added space-y-6 */}
                                <Button
                                    variant="contained"
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                    Proceed to Checkout
                                </Button>
                                <Button 
                                    onClick={() => navigate('/')}  
                                    className="w-full"
                                    variant="text"
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Continue Shopping
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
