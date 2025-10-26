# Coffee Shop POS System

A modern, professional point-of-sale (POS) system specifically designed for coffee shops, built with HTML, CSS, and JavaScript.

## Features

### Core Functionality
- **Product Management**: 40+ coffee shop items organized by category
  - Hot Drinks (Espresso, Cappuccino, Latte, Mocha, etc.)
  - Cold Drinks (Iced Coffee, Frappuccino, Smoothies, etc.)
  - Pastries (Croissants, Muffins, Donuts, etc.)
  - Snacks (Sandwiches, Salads, Cookies, etc.)
- **Shopping Cart**: Add, remove, and adjust quantities with real-time updates
- **Payment Processing**: Support for multiple payment methods (Cash, Card, Mobile Pay)
- **Receipt Generation**: Professional coffee shop branded receipts
- **Tax Calculation**: Automatic 10% tax calculation
- **Discount System**: Apply percentage-based discounts to orders

### User Interface
- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Live date/time display and instant cart updates
- **Category Filtering**: Quick product filtering by category
- **Search Function**: Fast product search capability
- **Stock Management**: Display available stock for each product

### Payment Features
- **Multiple Payment Methods**: Cash, Card, and Mobile Payment options
- **Cash Change Calculator**: Automatic change calculation for cash payments
- **Payment Validation**: Ensures sufficient payment before completing transaction
- **Receipt Printing**: Print-ready receipt format

### Additional Features
- **Keyboard Shortcuts**:
  - F1: Process Payment
  - F2: Clear Cart
  - F3: Apply Discount
  - ESC: Close Modals
- **User Session**: Display cashier name and current date/time
- **Logout Functionality**: Secure logout with cart warning
- **Empty Cart Protection**: Prevents accidental operations on empty cart

## How to Use

1. **Open the Application**: Open `index.html` in a web browser
2. **Browse Products**: Click on category buttons or use search to find products
3. **Add to Cart**: Click on any product card to add it to the cart
4. **Adjust Quantities**: Use +/- buttons to change item quantities
5. **Apply Discount** (Optional): Click "Discount" button to apply percentage discount
6. **Process Payment**: Click "Process Payment" button
7. **Select Payment Method**: Choose Cash, Card, or Mobile Pay
8. **Complete Transaction**: For cash, enter amount received; then click "Complete Payment"
9. **View Receipt**: Receipt is automatically generated and can be printed

## File Structure

```
cashier-system/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── script.js           # All functionality and business logic
└── README.md          # Documentation
```

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with flexbox and grid
- **JavaScript (ES6+)**: Interactive functionality
- **Font Awesome**: Professional icons

## Customization

### Adding Products
Edit the `products` array in `script.js`:
```javascript
{ id: 13, name: 'Product Name', price: 9.99, category: 'food', icon: 'fa-icon-name', stock: 50 }
```

### Changing Tax Rate
Modify the tax calculation in the `updateTotals()` function:
```javascript
const tax = subtotal * 0.10; // Change 0.10 to your tax rate
```

### Styling
All colors and styles are defined in CSS variables at the top of `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --success-color: #10b981;
    /* ... more variables */
}
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## Future Enhancements

- Backend integration for inventory management
- User authentication system
- Sales reports and analytics
- Barcode scanner support
- Customer loyalty program
- Multiple currency support
- Database integration
- Cloud synchronization

## License

Free to use for personal and commercial projects.

## Support

For issues or questions, please refer to the code comments or modify as needed for your specific requirements.
