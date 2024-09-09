import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, ShoppingCart, ArrowBack, Add, Remove } from '@mui/icons-material';
import { Button, FormControlLabel, Radio, RadioGroup, Tab, Tabs, Box, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Product } from '../types/Product';
import { Loader } from 'lucide-react';

interface ProductDetailProps {
    cartItems: { [key: string]: { quantity: number; size?: string } };
    addToCart: (productId: number, quantity: number, size?: string) => void;
}

const LargeBlueSnackbar = styled(Snackbar)(({ theme }) => ({
  '& .MuiSnackbarContent-root': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: '1.1rem',
    padding: '16px 24px',
    minWidth: '300px',
  },
}));

export default function ProductDetail({ cartItems, addToCart }: ProductDetailProps) {
    const [selectedClothingSize, setSelectedClothingSize] = useState('m');
    const [selectedJewelrySize, setSelectedJewelrySize] = useState('medium');
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [tabValue, setTabValue] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch product details and related products
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://fakestoreapi.com/products/${id}`);
                const data: Product = await response.json();
                setProduct(data);
                fetchRelatedProducts(data.category); // Fetch related products once we know the category
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        const fetchRelatedProducts = async (category: string) => {
            try {
                const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
                const data: Product[] = await response.json();
                setRelatedProducts(data.filter((p) => p.id !== parseInt(id!)));
            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        };

        fetchProduct();
    }, [id]);

    // If the product data isn't loaded yet
    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Loader className="w-12 h-12 text-black animate-spin mb-4" />
                <p className="text-lg text-gray-600">Loading product...</p>
            </div>
        );
    }

    // Determine if the product is clothing, jewelry, or electronics
    const isClothing = product.category === "men's clothing" || product.category === "women's clothing";
    const isJewelry = product.category === 'jewelery';
    const isElectronics = product.category === 'electronics';

    // Add the product to the cart
    const handleAddToCart = () => {
        if (isClothing) {
            addToCart(product.id, quantity, selectedClothingSize);
        } else if (isJewelry) {
            addToCart(product.id, quantity, selectedJewelrySize);
        } else {
            addToCart(product.id, quantity);
        }
        setSnackbarOpen(true);
    };

    // Close the snackbar
    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    // Product Details and Specifications based on category
    const getProductDetails = () => {
        if (isClothing) {
            return (
                <>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>100% premium cotton</li>
                        <li>Pre-shrunk fabric</li>
                        <li>Seamless collar for comfort</li>
                        <li>Double-needle stitching for durability</li>
                    </ul>
                </>
            );
        } else if (isJewelry) {
            return (
                <>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Material: 14k Gold Plated</li>
                        <li>Gemstones: Sapphire and Diamond</li>
                        <li>Adjustable size</li>
                        <li>Weight: 0.25oz</li>
                    </ul>
                </>
            );
        } else if (isElectronics) {
            return (
                <>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Screen Size: 6.5 inches</li>
                        <li>Processor: Quad-core 2.5 GHz</li>
                        <li>Battery: 4000mAh</li>
                        <li>Camera: 48MP rear, 16MP front</li>
                        <li>Storage: 128GB internal</li>
                    </ul>
                </>
            );
        } else {
            return null;
        }
    };

    // Product Specifications based on category
    const getProductSpecifications = () => {
        if (isClothing) {
            return (
                <>
                    <dl className="divide-y divide-gray-200">
                        <div className="py-3 flex justify-between">
                            <dt className="font-medium text-gray-500">Material</dt>
                            <dd className="text-gray-900">100% Cotton</dd>
                        </div>
                        <div className="py-3 flex justify-between">
                            <dt className="font-medium text-gray-500">Fit</dt>
                            <dd className="text-gray-900">Regular Fit</dd>
                        </div>
                        <div className="py-3 flex justify-between">
                            <dt className="font-medium text-gray-500">Care</dt>
                            <dd className="text-gray-900">Machine Wash Cold</dd>
                        </div>
                    </dl>
                </>
            );
        } else if (isJewelry) {
            return (
                <>
                    <dl className="divide-y divide-gray-200">
                        <div className="py-3 flex justify-between">
                            <dt className="font-medium text-gray-500">Material</dt>
                            <dd className="text-gray-900">14k Gold Plated</dd>
                        </div>
                        <div className="py-3 flex justify-between">
                            <dt className="font-medium text-gray-500">Gemstones</dt>
                            <dd className="text-gray-900">Sapphire, Diamond</dd>
                        </div>
                        <div className="py-3 flex justify-between">
                            <dt className="font-medium text-gray-500">Weight</dt>
                            <dd className="text-gray-900">0.25oz</dd>
                        </div>
                    </dl>
                </>
            );
        } else if (isElectronics) {
            return (
                <>
                    <dl className="divide-y divide-gray-200">
                        <div className="py-3 flex justify-between">
                            <dt className="font-medium text-gray-500">Screen Size</dt>
                            <dd className="text-gray-900">6.5 inches</dd>
                        </div>
                        <div className="py-3 flex justify-between">
                            <dt className="font-medium text-gray-500">Processor</dt>
                            <dd className="text-gray-900">Quad-core 2.5 GHz</dd>
                        </div>
                        <div className="py-3 flex justify-between">
                            <dt className="font-medium text-gray-500">Battery</dt>
                            <dd className="text-gray-900">4000mAh</dd>
                        </div>
                        <div className="py-3 flex justify-between">
                            <dt className="font-medium text-gray-500">Storage</dt>
                            <dd className="text-gray-900">128GB</dd>
                        </div>
                    </dl>
                </>
            );
        } else {
            return null;
        }
    };

    // Handle quantity change
    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(Math.max(1, newQuantity));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back button */}
            <Button
                startIcon={<ArrowBack />}
                variant="text"
                size="small"
                onClick={() => navigate('/')}
            >
                Home
            </Button>
            {/* Product Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-96 object-contain rounded-lg"
                    />
                </div>

                <div className="space-y-4"> 
                    <div>
                        <h1 className="text-3xl font-bold">{product.title}</h1>
                        <p className="text-lg text-gray-600 -mt-1">{product.category}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={i < Math.round(product.rating.rate) ? 'text-yellow-500' : 'text-gray-400'} />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500">({product.rating.count} reviews)</span>
                    </div>
                    <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                    <p className="text-gray-600">{product.description}</p>

                    {/* Size selection for clothing */}
                    {isClothing && (
                        <div>
                            <label htmlFor="size" className="text-sm font-medium">
                                Size
                            </label>
                            <RadioGroup
                                row
                                id="size"
                                value={selectedClothingSize}
                                onChange={(e) => setSelectedClothingSize(e.target.value)}
                            >
                                {['xs', 's', 'm', 'l', 'xl'].map((size) => (
                                    <FormControlLabel
                                        key={size}
                                        value={size}
                                        control={<Radio />}
                                        label={size.toUpperCase()}
                                    />
                                ))}
                            </RadioGroup>
                        </div>
                    )}

                    {/* Jewelry size selection */}
                    {isJewelry && (
                        <div>
                            <label htmlFor="jewelry-size" className="text-sm font-medium">
                                Jewelry Size
                            </label>
                            <RadioGroup
                                row
                                id="jewelry-size"
                                value={selectedJewelrySize}
                                onChange={(e) => setSelectedJewelrySize(e.target.value)}
                            >
                                {['Small', 'Medium', 'Large'].map((size) => (
                                    <FormControlLabel
                                        key={size}
                                        value={size.toLowerCase()}
                                        control={<Radio />}
                                        label={size}
                                    />
                                ))}
                            </RadioGroup>
                        </div>
                    )}

                    {/* Quantity selector */}
                    <div className="flex items-center space-x-2">
                        <label htmlFor="quantity" className="text-sm font-medium">
                            Quantity
                        </label>
                        <div className="flex items-center border rounded-md">
                            <Button
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={quantity <= 1}
                            >
                                <Remove />
                            </Button>
                            <input
                                type="number"
                                id="quantity"
                                min="1"
                                value={quantity}
                                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                className="w-12 text-center"
                            />
                            <Button onClick={() => handleQuantityChange(quantity + 1)}>
                                <Add />
                            </Button>
                        </div>
                    </div>

                    {/* Add to cart */}
                    <div className="flex space-x-4">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<ShoppingCart />}
                            className="flex-1"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tabs for Product Details and Specifications */}
            <div className="mt-16">
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                    <Tab label="Product Details" />
                    <Tab label="Specifications" />
                </Tabs>
                <Box hidden={tabValue !== 0} className="mt-4">
                    {getProductDetails()}
                </Box>
                <Box hidden={tabValue !== 1} className="mt-4">
                    {getProductSpecifications()}
                </Box>
            </div>

            {/* Related Products */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {relatedProducts.map((related) => (
                        <div key={related.id} className="border rounded-lg overflow-hidden flex flex-col h-full min-h-[380px]">
                            <img src={related.image} alt={related.title} className="w-full h-48 object-contain" />
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="font-semibold">{related.title}</h3>
                                <p className="text-gray-600">${related.price.toFixed(2)}</p>
                                <div className="mt-auto">
                                    <Button
                                        variant="outlined"
                                        className="w-full"
                                        onClick={() => navigate(`/products/${related.id}`)}
                                    >
                                        View Product
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Snackbar for adding to cart */}
            <LargeBlueSnackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                message="Item added to cart!"
            />
        </div>
    );
}