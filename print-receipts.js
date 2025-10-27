/**
 * Dual Receipt Printing System
 * Prints both Cashier Receipt and Bar Order automatically
 * 
 * @version 1.0.0 (Demo)
 * @author Kiro AI
 * 
 * TODO: Future enhancements
 * - Add QZ Tray integration for direct printer selection
 * - Add printer settings configuration
 * - Add print queue management
 * - Add print history logging
 */

// Global variable to store current receipt data
window.currentReceiptData = null;

/**
 * Main function to print both receipts
 * Prints Cashier Receipt first, then Bar Receipt after 2 seconds
 * 
 * @param {Object} orderData - Order information
 * @returns {Promise<void>}
 */
async function printReceipts(orderData) {
    try {
        // Validate order data
        if (!orderData || !orderData.items || orderData.items.length === 0) {
            throw new Error('لا توجد بيانات طلب للطباعة');
        }

        // Show loading message
        Swal.fire({
            title: 'جاري الطباعة...',
            html: `
                <div style="text-align: center;">
                    <p style="margin: 10px 0;">يتم طباعة الفواتير</p>
                    <div style="margin: 20px 0;">
                        <i class="fas fa-print fa-3x" style="color: #8b4513; animation: pulse 1.5s infinite;"></i>
                    </div>
                    <p style="font-size: 14px; color: #666;">
                        <span id="printStatus">جاري طباعة فاتورة الكاشير...</span>
                    </p>
                </div>
                <style>
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.1); opacity: 0.8; }
                    }
                </style>
            `,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Prepare receipt data
        const receiptData = prepareReceiptData(orderData);

        // Store data globally for receipt windows to access
        window.currentReceiptData = receiptData;

        // Print Cashier Receipt
        console.log('📄 Printing Cashier Receipt...');
        await printCashierReceipt(receiptData);

        // Update status
        const statusEl = document.getElementById('printStatus');
        if (statusEl) {
            statusEl.textContent = 'تم طباعة فاتورة الكاشير ✓';
        }

        // Wait 2 seconds before printing bar receipt
        console.log('⏳ Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Update status
        if (statusEl) {
            statusEl.textContent = 'جاري طباعة طلب البار...';
        }

        // Print Bar Receipt
        console.log('🍹 Printing Bar Receipt...');
        await printBarReceipt(receiptData);

        // Close loading and show success
        Swal.close();

        await Swal.fire({
            icon: 'success',
            title: 'تمت الطباعة بنجاح! ✓',
            html: `
                <div style="text-align: center;">
                    <p style="margin: 10px 0;">تم طباعة الفواتير بنجاح</p>
                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <p style="margin: 5px 0;">✓ فاتورة الكاشير</p>
                        <p style="margin: 5px 0;">✓ طلب البار</p>
                    </div>
                </div>
            `,
            timer: 2500,
            showConfirmButton: false
        });

        console.log('✅ Both receipts printed successfully');

    } catch (error) {
        console.error('❌ Print error:', error);

        Swal.close();

        await Swal.fire({
            icon: 'error',
            title: 'خطأ في الطباعة',
            html: `
                <div style="text-align: center;">
                    <p>${error.message}</p>
                    <p style="font-size: 12px; color: #666; margin-top: 10px;">
                        يرجى التأكد من إعدادات الطباعة والمحاولة مرة أخرى
                    </p>
                </div>
            `,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'حسناً'
        });
    }
}

/**
 * Print Cashier Receipt
 * Opens cashier-receipt.html in new window and triggers print
 * 
 * @param {Object} receiptData - Prepared receipt data
 * @returns {Promise<void>}
 */
async function printCashierReceipt(receiptData) {
    return new Promise((resolve, reject) => {
        try {
            // Open receipt in new window
            const printWindow = window.open(
                'cashier-receipt.html',
                'CashierReceipt',
                'width=800,height=600'
            );

            if (!printWindow) {
                throw new Error('فشل فتح نافذة الطباعة. يرجى السماح بالنوافذ المنبثقة');
            }

            // Wait for window to load
            printWindow.onload = function () {
                try {
                    // Give time for content to render
                    setTimeout(() => {
                        // Trigger print dialog
                        printWindow.print();

                        // Close window after print dialog closes
                        setTimeout(() => {
                            printWindow.close();
                            resolve();
                        }, 500);
                    }, 800);
                } catch (err) {
                    printWindow.close();
                    reject(err);
                }
            };

            // Handle window close without printing
            printWindow.onbeforeunload = function () {
                resolve(); // Resolve anyway to continue with bar receipt
            };

        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Print Bar Receipt
 * Opens bar-receipt.html in new window and triggers print
 * 
 * @param {Object} receiptData - Prepared receipt data
 * @returns {Promise<void>}
 */
async function printBarReceipt(receiptData) {
    return new Promise((resolve, reject) => {
        try {
            // Open receipt in new window
            const printWindow = window.open(
                'bar-receipt.html',
                'BarReceipt',
                'width=800,height=600'
            );

            if (!printWindow) {
                throw new Error('فشل فتح نافذة الطباعة. يرجى السماح بالنوافذ المنبثقة');
            }

            // Wait for window to load
            printWindow.onload = function () {
                try {
                    // Give time for content to render
                    setTimeout(() => {
                        // Trigger print dialog
                        printWindow.print();

                        // Close window after print dialog closes
                        setTimeout(() => {
                            printWindow.close();
                            resolve();
                        }, 500);
                    }, 800);
                } catch (err) {
                    printWindow.close();
                    reject(err);
                }
            };

            // Handle window close without printing
            printWindow.onbeforeunload = function () {
                resolve();
            };

        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Prepare receipt data from order data
 * Formats and structures data for receipt templates
 * 
 * @param {Object} orderData - Raw order data
 * @returns {Object} Formatted receipt data
 */
function prepareReceiptData(orderData) {
    const now = new Date();

    return {
        // Order Info
        orderNumber: orderData.orderNumber || orderData.id || generateOrderNumber(),
        tableName: orderData.tableName || orderData.table || 'طاولة 1',
        date: formatDate(orderData.completedAt || orderData.date || now),
        time: formatTime(orderData.completedAt || orderData.date || now),

        // Cashier
        cashier: orderData.cashier || currentUser?.name || 'الكاشير',

        // Items
        items: orderData.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price || 0,
            total: item.total || (item.price * item.quantity),
            options: item.options || item.notes || null
        })),

        // Totals
        subtotal: orderData.subtotal || calculateSubtotal(orderData.items),
        tax: orderData.tax || 0,
        discount: orderData.discount || 0,
        total: orderData.total || calculateTotal(orderData),

        // Payment
        paymentMethod: formatPaymentMethod(orderData.paymentMethod)
    };
}

/**
 * Calculate subtotal from items
 */
function calculateSubtotal(items) {
    return items.reduce((sum, item) => {
        const itemTotal = item.total || (item.price * item.quantity);
        return sum + itemTotal;
    }, 0);
}

/**
 * Calculate total with tax and discount
 */
function calculateTotal(orderData) {
    const subtotal = orderData.subtotal || calculateSubtotal(orderData.items);
    const tax = orderData.tax || 0;
    const discount = orderData.discount || 0;
    return subtotal + tax - discount;
}

/**
 * Format date for display
 */
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

/**
 * Format time for display
 */
function formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

/**
 * Format payment method for display
 */
function formatPaymentMethod(method) {
    const methods = {
        'cash': 'نقدي',
        'card': 'بطاقة',
        'wallet': 'محفظة إلكترونية',
        'visa': 'فيزا',
        'mastercard': 'ماستركارد',
        'vodafone': 'فودافون كاش'
    };

    return methods[method?.toLowerCase()] || method || 'نقدي';
}

/**
 * Generate order number if not provided
 */
function generateOrderNumber() {
    const timestamp = Date.now().toString().slice(-6);
    return timestamp;
}

/**
 * Test function to print sample receipts
 * Useful for testing without actual order data
 */
function testPrintReceipts() {
    const sampleOrder = {
        orderNumber: '0001',
        tableName: 'طاولة 5',
        cashier: 'ندى',
        items: [
            {
                name: 'كابتشينو',
                quantity: 2,
                price: 14.00,
                total: 28.00,
                options: 'سكر وسط'
            },
            {
                name: 'كرواسون',
                quantity: 1,
                price: 12.00,
                total: 12.00,
                options: null
            },
            {
                name: 'عصير برتقال',
                quantity: 1,
                price: 15.00,
                total: 15.00,
                options: 'بدون سكر - طازج'
            }
        ],
        subtotal: 55.00,
        tax: 7.70,
        discount: 0,
        total: 62.70,
        paymentMethod: 'cash'
    };

    printReceipts(sampleOrder);
}

// Log initialization
console.log('✅ Print Receipts System Loaded');
console.log('📝 Use printReceipts(orderData) to print both receipts');
console.log('🧪 Use testPrintReceipts() to test with sample data');

// TODO: Future enhancements
// - Add QZ Tray integration for direct printer selection
// - Add configuration for printer names (cashier printer, bar printer)
// - Add print queue for multiple orders
// - Add print history and logging
// - Add retry mechanism for failed prints
// - Add print preview option
// - Add option to print only cashier or only bar receipt
