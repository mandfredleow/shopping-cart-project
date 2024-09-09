import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CartPage from '../pages/CartPage';
import '@testing-library/jest-dom';

// Mock the fetch function
global.fetch = jest.fn();

const mockCartItems = {
    '1': { quantity: 2 },
    '2': { quantity: 1, size: 'M' },
};

const mockSetCartItems = jest.fn();

const renderCartPage = () => {
    render(
        <BrowserRouter>
            <CartPage cartItems={mockCartItems} setCartItems={mockSetCartItems} />
        </BrowserRouter>
    );
};

describe('CartPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockResolvedValue({
            json: () => Promise.resolve({
                id: 1,
                title: 'Test Product',
                price: 10.99,
                image: 'test.jpg',
                category: "men's clothing",
            }),
        });
    });

    // This test checks if the loading message is displayed when the component is first rendered
    test('renders loading state initially', () => {
        renderCartPage();
        expect(screen.getByText('Loading cart...')).toBeInTheDocument();
    });

    // This test verifies that cart items are displayed correctly after the loading is complete
    test('renders cart items after loading', async () => {
        renderCartPage();
        await waitFor(() => {
            expect(screen.getByText('Your Shopping Cart')).toBeInTheDocument();
            expect(screen.getAllByText('Test Product')).toHaveLength(2);
        });
    });

    // This test verifies that the quantity of an item in the cart can be updated by clicking the plus button
    test('updates quantity when plus button is clicked', async () => {
        renderCartPage();

        // Wait for the cart items to be rendered
        await waitFor(() => {
            expect(screen.getByText(/your shopping cart/i)).toBeInTheDocument();
            expect(screen.getAllByTestId('item-quantity')).not.toHaveLength(0);
        });

        // Get the first quantity input element
        const initialQuantityElement = screen.getAllByTestId('item-quantity')[0] as HTMLInputElement;
        // Parse the initial quantity value as an integer
        const initialQuantity = parseInt(initialQuantityElement.value, 10);

        // Find the first 'increase quantity' button
        const increaseButton = screen.getAllByRole('button', { name: /increase quantity/i })[0];
        // Simulate a click on the increase button
        fireEvent.click(increaseButton);

        // Verify that the mockSetCartItems function was called
        expect(mockSetCartItems).toHaveBeenCalled();

        // Get the function that was passed to mockSetCartItems
        const setCartItemsFunction = mockSetCartItems.mock.calls[0][0];

        // Call this function with the initial mockCartItems to get the updated state
        const updatedCartItems = setCartItemsFunction(mockCartItems);

        // Get the key of the first item in the mock cart
        const firstItemKey = Object.keys(mockCartItems)[0];

        // Check if the quantity of the first item has increased by 1
        expect(updatedCartItems[firstItemKey].quantity).toBe(initialQuantity + 1);
    });

    // This test verifies that an item is removed from the cart when the remove button is clicked
    test('removes item when remove button is clicked', async () => {
        // Render the component
        renderCartPage();

        // Wait for the cart items to be rendered
        await waitFor(() => {
            expect(screen.getByText(/your shopping cart/i)).toBeInTheDocument();
        });

        // Get the initial number of items
        const initialItems = screen.getAllByTestId('cart-item');
        const initialItemCount = initialItems.length;

        // Find and click the remove button for the first item
        const removeButtons = screen.getAllByRole('button', { name: /remove item/i });
        fireEvent.click(removeButtons[0]);

        // Check if mockSetCartItems was called
        expect(mockSetCartItems).toHaveBeenCalled();

        // Get the function passed to mockSetCartItems
        const setCartItemsFunction = mockSetCartItems.mock.calls[0][0];

        // Call the function with the initial mockCartItems to get the updated state
        const updatedCartItems = setCartItemsFunction(mockCartItems);

        // Check if the number of items has decreased
        expect(Object.keys(updatedCartItems).length).toBe(initialItemCount - 1);
    });

    // This test checks if the order summary is displayed correctly
    test('displays correct order summary', async () => {
        renderCartPage();
        await waitFor(() => {
            expect(screen.getByText('Order Summary')).toBeInTheDocument();
            expect(screen.getByText('$32.97')).toBeInTheDocument(); // Subtotal
            expect(screen.getByText('$10.00')).toBeInTheDocument(); // Shipping
            expect(screen.getByText('$3.30')).toBeInTheDocument(); // Tax
            expect(screen.getByText('$46.27')).toBeInTheDocument(); // Total
        });
    });

    // This test checks if the empty cart message is displayed when no items are in the cart
    test('displays empty cart message when no items', async () => {
        render(
            <BrowserRouter>
                <CartPage cartItems={{}} setCartItems={mockSetCartItems} />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
        });
    });
});