// التحقق من تسجيل الدخول
const currentUser = checkAuth();
if (!currentUser) {
    window.location.href = 'login.html';
}

// منع الكاشير من الوصول للوحة التحكم
if (currentUser.role === 'cashier') {
    Swal.fire({
        icon: 'error',
        title: 'غير مصرح',
        text: 'ليس لديك صلاحية للوصول إلى لوحة التحكم',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#ef4444'
    }).then(() => {
        window.location.href = 'index.html';
    });
}

// عرض اسم المستخدم
document.getElementById('userName').textContent = `${currentUser.name} (${getRoleNameArabic(currentUser.role)})`;

// إظهار رابط الإعدادات للمدير فقط
if (currentUser.role === 'admin') {
    const settingsLink = document.getElementById('settingsLink');
    if (settingsLink) {
        settingsLink.style.display = 'inline-block';
    }
}

// تحديث التاريخ والوقت
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('dateTime').textContent = now.toLocaleDateString('ar-SA', options);
}

updateDateTime();
setInterval(updateDateTime, 1000);

// الحصول على اسم الصلاحية بالعربي
function getRoleNameArabic(role) {
    const roles = {
        'admin': 'مدير',
        'supervisor': 'مشرف',
        'cashier': 'كاشير'
    };
    return roles[role] || role;
}

// تحميل البيانات من localStorage
function loadSalesData() {
    const sales = JSON.parse(localStorage.getItem('salesData')) || [];
    return sales;
}

// حساب الإحصائيات
function calculateStats() {
    const sales = loadSalesData();
    const today = new Date().toDateString();

    const todaySales = sales.filter(sale => {
        const saleDate = sale.completedAt || sale.date;
        return new Date(saleDate).toDateString() === today;
    });

    const totalSales = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const totalInvoices = todaySales.length;
    const totalProducts = todaySales.reduce((sum, sale) =>
        sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    // حساب عدد الكاشيرات النشطة
    const shifts = JSON.parse(localStorage.getItem('userShifts')) || {};
    const activeCashiers = Object.values(shifts).filter(shift => shift.active === true).length;

    // تحديث الإحصائيات
    document.getElementById('todaySales').textContent = `${totalSales.toFixed(2)} ج.م`;
    document.getElementById('todayInvoices').textContent = totalInvoices;
    document.getElementById('productsSold').textContent = totalProducts;
    document.getElementById('activeUsers').textContent = activeCashiers;

    // حساب المنتجات الأكثر مبيعاً
    const productSales = {};
    todaySales.forEach(sale => {
        sale.items.forEach(item => {
            if (!productSales[item.name]) {
                productSales[item.name] = 0;
            }
            productSales[item.name] += item.quantity;
        });
    });

    const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    displayTopProducts(topProducts);
    displayRecentInvoices(todaySales.slice(-10).reverse());
}

// عرض المنتجات الأكثر مبيعاً
function displayTopProducts(products) {
    const container = document.getElementById('topProducts');

    if (products.length === 0) {
        container.innerHTML = '<p style="color: #795548; text-align: center;">لا توجد مبيعات اليوم</p>';
        return;
    }

    const maxSales = products[0][1];

    container.innerHTML = products.map(([name, quantity]) => {
        const percentage = (quantity / maxSales) * 100;
        return `
            <div class="chart-bar">
                <div class="chart-label">${name}</div>
                <div class="chart-bar-fill" style="width: ${percentage}%">
                    ${quantity} قطعة
                </div>
            </div>
        `;
    }).join('');
}

// عرض آخر الفواتير
function displayRecentInvoices(invoices) {
    const tbody = document.getElementById('invoicesBody');

    if (invoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #795548;">لا توجد فواتير</td></tr>';
        return;
    }

    tbody.innerHTML = invoices.map(invoice => {
        const paymentMethodArabic = {
            'cash': 'نقدي',
            'card': 'بطاقة',
            'mobile': 'محفظة إلكترونية'
        };

        const invoiceDate = invoice.completedAt || invoice.date;
        const invoiceNum = invoice.id || invoice.invoiceNumber || 'N/A';

        return `
            <tr>
                <td>#${invoiceNum}</td>
                <td>${new Date(invoiceDate).toLocaleString('ar-SA')}</td>
                <td>${invoice.cashier}</td>
                <td>${invoice.total.toFixed(2)} ج.م</td>
                <td>${paymentMethodArabic[invoice.paymentMethod]}</td>
                <td><span class="badge success">مكتملة</span></td>
            </tr>
        `;
    }).join('');
}

// التحقق من المخزون المنخفض
function checkLowStock() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10);
    const outOfStockProducts = products.filter(p => p.stock === 0);

    const alertsContainer = document.getElementById('lowStockAlerts');

    if (lowStockProducts.length === 0 && outOfStockProducts.length === 0) {
        alertsContainer.innerHTML = '';
        return;
    }

    let alertsHTML = '';

    if (outOfStockProducts.length > 0) {
        alertsHTML += `
            <div class="low-stock-alert" style="border-right-color: #ef4444; background: #fee2e2;">
                <h4 style="color: #991b1b;"><i class="fas fa-exclamation-triangle"></i> منتجات نفذت من المخزون (${outOfStockProducts.length})</h4>
                <p style="color: #991b1b;">${outOfStockProducts.map(p => p.name).join(' • ')}</p>
            </div>
        `;
    }

    if (lowStockProducts.length > 0) {
        alertsHTML += `
            <div class="low-stock-alert">
                <h4><i class="fas fa-exclamation-circle"></i> منتجات قاربت على النفاذ (${lowStockProducts.length})</h4>
                <p style="color: #92400e;">${lowStockProducts.map(p => `${p.name} (${p.stock})`).join(' • ')}</p>
            </div>
        `;
    }

    alertsContainer.innerHTML = alertsHTML;
}

// طباعة التقرير اليومي
function printDailyReport() {
    const sales = loadSalesData();
    const today = new Date();
    const todayStr = today.toDateString();

    const todaySales = sales.filter(sale => {
        const saleDate = sale.completedAt || sale.date;
        return new Date(saleDate).toDateString() === todayStr;
    });

    // حساب الإحصائيات
    const totalSales = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const totalInvoices = todaySales.length;
    const totalProducts = todaySales.reduce((sum, sale) =>
        sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    // حساب المبيعات حسب طريقة الدفع
    const paymentMethods = {
        cash: { count: 0, total: 0 },
        card: { count: 0, total: 0 },
        mobile: { count: 0, total: 0 }
    };

    todaySales.forEach(sale => {
        if (paymentMethods[sale.paymentMethod]) {
            paymentMethods[sale.paymentMethod].count++;
            paymentMethods[sale.paymentMethod].total += sale.total;
        }
    });

    // حساب المبيعات حسب الكاشير (الشيفتات)
    const cashierShifts = {};
    todaySales.forEach(sale => {
        const cashierName = sale.cashier || 'غير محدد';
        if (!cashierShifts[cashierName]) {
            cashierShifts[cashierName] = {
                invoices: 0,
                total: 0,
                cash: 0,
                card: 0,
                mobile: 0
            };
        }
        cashierShifts[cashierName].invoices++;
        cashierShifts[cashierName].total += sale.total;
        cashierShifts[cashierName][sale.paymentMethod] += sale.total;
    });

    // حساب المنتجات الأكثر مبيعاً
    const productSales = {};
    todaySales.forEach(sale => {
        sale.items.forEach(item => {
            if (!productSales[item.name]) {
                productSales[item.name] = { quantity: 0, total: 0 };
            }
            productSales[item.name].quantity += item.quantity;
            productSales[item.name].total += item.price * item.quantity;
        });
    });

    const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1].quantity - a[1].quantity)
        .slice(0, 10);

    // إنشاء جدول الفواتير
    const invoicesHTML = todaySales.map((invoice, index) => {
        const paymentMethodArabic = {
            'cash': 'نقدي',
            'card': 'بطاقة',
            'mobile': 'محفظة إلكترونية'
        };
        const invoiceDate = invoice.completedAt || invoice.date;
        const invoiceNum = invoice.id || invoice.invoiceNumber || 'N/A';

        return `
            <tr>
                <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: center;">${index + 1}</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">#${invoiceNum}</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">${new Date(invoiceDate).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">${invoice.cashier}</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: left;">${invoice.total.toFixed(2)} ج.م</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">${paymentMethodArabic[invoice.paymentMethod]}</td>
            </tr>
        `;
    }).join('');

    // إنشاء جدول المنتجات الأكثر مبيعاً
    const productsHTML = topProducts.map((item, index) => `
        <tr>
            <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: center;">${index + 1}</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd;">${item[0]}</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: center;">${item[1].quantity}</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: left;">${item[1].total.toFixed(2)} ج.م</td>
        </tr>
    `).join('');

    // إنشاء جدول الشيفتات (مبيعات الكاشيرات)
    const shiftsHTML = Object.entries(cashierShifts).map(([cashier, data]) => `
        <tr>
            <td style="padding: 0.5rem; border: 1px solid #ddd;">${cashier}</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: center;">${data.invoices}</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: left; font-weight: bold;">${data.total.toFixed(2)} ج.م</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: left;">${data.cash.toFixed(2)} ج.م</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: left;">${data.card.toFixed(2)} ج.م</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: left;">${data.mobile.toFixed(2)} ج.م</td>
        </tr>
    `).join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>التقرير اليومي - ${today.toLocaleDateString('ar-SA')}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Segoe UI', 'Cairo', Tahoma, sans-serif;
                    padding: 20px;
                    direction: rtl;
                }
                .report-header {
                    text-align: center;
                    border-bottom: 3px solid #8b4513;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .report-header h1 {
                    color: #8b4513;
                    font-size: 28px;
                    margin-bottom: 10px;
                }
                .report-header p {
                    color: #666;
                    font-size: 16px;
                }
                .stats-section {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .stat-box {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    border-right: 4px solid #8b4513;
                    text-align: center;
                }
                .stat-box h3 {
                    color: #666;
                    font-size: 14px;
                    margin-bottom: 10px;
                }
                .stat-box .value {
                    color: #8b4513;
                    font-size: 24px;
                    font-weight: bold;
                }
                .section {
                    margin-bottom: 30px;
                }
                .section h2 {
                    color: #3e2723;
                    font-size: 20px;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #d7ccc8;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th {
                    background: #8b4513;
                    color: white;
                    padding: 12px;
                    text-align: right;
                    border: 1px solid #6d3410;
                }
                td {
                    padding: 8px;
                    border: 1px solid #ddd;
                }
                tr:nth-child(even) {
                    background: #f8f9fa;
                }
                .payment-methods {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .payment-box {
                    background: #f0f9ff;
                    padding: 15px;
                    border-radius: 8px;
                    border: 2px solid #3b82f6;
                }
                .payment-box h4 {
                    color: #1e40af;
                    font-size: 14px;
                    margin-bottom: 8px;
                }
                .payment-box .count {
                    color: #666;
                    font-size: 12px;
                }
                .payment-box .amount {
                    color: #1e40af;
                    font-size: 20px;
                    font-weight: bold;
                    margin-top: 5px;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px dashed #d7ccc8;
                    color: #666;
                }
                @media print {
                    body { padding: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="report-header">
                <h1>مقهى القهوة الطازجة</h1>
                <p>التقرير اليومي</p>
                <p>${today.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="margin-top: 10px; font-size: 14px;">تاريخ الطباعة: ${new Date().toLocaleString('ar-SA')}</p>
            </div>

            <div class="stats-section">
                <div class="stat-box">
                    <h3>إجمالي المبيعات</h3>
                    <div class="value">${totalSales.toFixed(2)} ج.م</div>
                </div>
                <div class="stat-box">
                    <h3>عدد الفواتير</h3>
                    <div class="value">${totalInvoices}</div>
                </div>
                <div class="stat-box">
                    <h3>المنتجات المباعة</h3>
                    <div class="value">${totalProducts}</div>
                </div>
            </div>

            <div class="section">
                <h2>المبيعات حسب طريقة الدفع</h2>
                <div class="payment-methods">
                    <div class="payment-box">
                        <h4>نقدي</h4>
                        <div class="count">${paymentMethods.cash.count} فاتورة</div>
                        <div class="amount">${paymentMethods.cash.total.toFixed(2)} ج.م</div>
                    </div>
                    <div class="payment-box">
                        <h4>بطاقة</h4>
                        <div class="count">${paymentMethods.card.count} فاتورة</div>
                        <div class="amount">${paymentMethods.card.total.toFixed(2)} ج.م</div>
                    </div>
                    <div class="payment-box">
                        <h4>محفظة إلكترونية</h4>
                        <div class="count">${paymentMethods.mobile.count} فاتورة</div>
                        <div class="amount">${paymentMethods.mobile.total.toFixed(2)} ج.م</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>شيفتات الكاشيرات - مبيعات اليوم</h2>
                <table>
                    <thead>
                        <tr>
                            <th>اسم الكاشير</th>
                            <th style="text-align: center; width: 100px;">عدد الفواتير</th>
                            <th style="text-align: left; width: 120px;">إجمالي المبيعات</th>
                            <th style="text-align: left; width: 100px;">نقدي</th>
                            <th style="text-align: left; width: 100px;">بطاقة</th>
                            <th style="text-align: left; width: 100px;">محفظة</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${shiftsHTML || '<tr><td colspan="6" style="text-align: center; color: #999;">لا توجد مبيعات</td></tr>'}
                    </tbody>
                </table>
            </div>

            <div class="section">
                <h2>المنتجات الأكثر مبيعاً</h2>
                <table>
                    <thead>
                        <tr>
                            <th style="text-align: center; width: 50px;">#</th>
                            <th>اسم المنتج</th>
                            <th style="text-align: center; width: 100px;">الكمية</th>
                            <th style="text-align: left; width: 120px;">الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productsHTML || '<tr><td colspan="4" style="text-align: center; color: #999;">لا توجد مبيعات</td></tr>'}
                    </tbody>
                </table>
            </div>

            <div class="section">
                <h2>تفاصيل الفواتير (${totalInvoices} فاتورة)</h2>
                <table>
                    <thead>
                        <tr>
                            <th style="text-align: center; width: 50px;">#</th>
                            <th style="width: 100px;">رقم الفاتورة</th>
                            <th style="width: 100px;">الوقت</th>
                            <th>الكاشير</th>
                            <th style="text-align: left; width: 120px;">المبلغ</th>
                            <th style="width: 120px;">طريقة الدفع</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoicesHTML || '<tr><td colspan="6" style="text-align: center; color: #999;">لا توجد فواتير</td></tr>'}
                    </tbody>
                </table>
            </div>

            <div class="footer">
                <p>تم إنشاء هذا التقرير تلقائياً بواسطة نظام كاشير المقهى</p>
                <p style="margin-top: 5px; font-size: 12px;">جميع الحقوق محفوظة © ${today.getFullYear()}</p>
            </div>

            <script>
                window.onload = function() {
                    window.print();
                }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// تحميل البيانات عند بدء الصفحة
calculateStats();
checkLowStock();

// تحديث البيانات كل 30 ثانية
setInterval(() => {
    calculateStats();
    checkLowStock();
}, 30000);

// عرض التقارير
function showReports() {
    const sales = loadSalesData();
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklySales = sales.filter(sale => {
        const saleDate = sale.completedAt || sale.date;
        return new Date(saleDate) >= weekAgo;
    });

    const totalWeeklySales = weeklySales.reduce((sum, sale) => sum + sale.total, 0);
    const totalWeeklyInvoices = weeklySales.length;

    // حساب الخصومات بشكل صحيح
    const totalDiscount = weeklySales.reduce((sum, sale) => {
        if (sale.discount && sale.discount > 0) {
            return sum + (sale.subtotal * sale.discount / 100);
        }
        return sum;
    }, 0);

    const avgInvoiceValue = totalWeeklySales / (totalWeeklyInvoices || 1);

    // حساب المبيعات حسب طريقة الدفع
    const paymentMethods = {
        cash: 0,
        card: 0,
        mobile: 0
    };

    weeklySales.forEach(sale => {
        if (paymentMethods[sale.paymentMethod] !== undefined) {
            paymentMethods[sale.paymentMethod] += sale.total;
        }
    });

    // حساب المبيعات اليومية للأسبوع
    const dailySales = {};
    for (let i = 0; i < 7; i++) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toLocaleDateString('ar-SA', { weekday: 'short', day: 'numeric', month: 'short' });
        dailySales[dateStr] = 0;
    }

    weeklySales.forEach(sale => {
        const saleDate = new Date(sale.completedAt || sale.date);
        const dateStr = saleDate.toLocaleDateString('ar-SA', { weekday: 'short', day: 'numeric', month: 'short' });
        if (dailySales[dateStr] !== undefined) {
            dailySales[dateStr] += sale.total;
        }
    });

    // إنشاء HTML للمبيعات اليومية
    const dailySalesHTML = Object.entries(dailySales).reverse().map(([date, amount]) => `
        <div style="display: flex; justify-content: space-between; padding: 0.5rem; border-bottom: 1px solid #e5e7eb;">
            <span style="color: #64748b;">${date}</span>
            <span style="font-weight: bold; color: #8b4513;">${amount.toFixed(2)} ج.م</span>
        </div>
    `).join('');

    Swal.fire({
        title: 'تقرير المبيعات الأسبوعي',
        html: `
            <div style="text-align: right; padding: 1rem; max-height: 70vh; overflow-y: auto;">
                <p style="text-align: center; color: #64748b; margin-bottom: 1.5rem;">
                    من ${weekAgo.toLocaleDateString('ar-SA')} إلى ${today.toLocaleDateString('ar-SA')}
                </p>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="padding: 1rem; background: #f0f9ff; border-radius: 0.5rem; border: 2px solid #0ea5e9;">
                        <h3 style="color: #0369a1; margin-bottom: 0.5rem; font-size: 0.9rem;">إجمالي المبيعات</h3>
                        <p style="font-size: 1.5rem; font-weight: bold; color: #0c4a6e;">${totalWeeklySales.toFixed(2)} ج.م</p>
                    </div>
                    <div style="padding: 1rem; background: #f0fdf4; border-radius: 0.5rem; border: 2px solid #10b981;">
                        <h3 style="color: #15803d; margin-bottom: 0.5rem; font-size: 0.9rem;">عدد الفواتير</h3>
                        <p style="font-size: 1.5rem; font-weight: bold; color: #166534;">${totalWeeklyInvoices}</p>
                    </div>
                    <div style="padding: 1rem; background: #fef3c7; border-radius: 0.5rem; border: 2px solid #f59e0b;">
                        <h3 style="color: #92400e; margin-bottom: 0.5rem; font-size: 0.9rem;">متوسط الفاتورة</h3>
                        <p style="font-size: 1.5rem; font-weight: bold; color: #78350f;">${avgInvoiceValue.toFixed(2)} ج.م</p>
                    </div>
                    <div style="padding: 1rem; background: #fee2e2; border-radius: 0.5rem; border: 2px solid #ef4444;">
                        <h3 style="color: #991b1b; margin-bottom: 0.5rem; font-size: 0.9rem;">الخصومات</h3>
                        <p style="font-size: 1.5rem; font-weight: bold; color: #7f1d1d;">${totalDiscount.toFixed(2)} ج.م</p>
                    </div>
                </div>
                
                <div style="margin-bottom: 1.5rem; padding: 1rem; background: #fafafa; border-radius: 0.5rem;">
                    <h3 style="color: #3e2723; margin-bottom: 1rem; font-size: 1rem; border-bottom: 2px solid #d7ccc8; padding-bottom: 0.5rem;">
                        <i class="fas fa-credit-card"></i> المبيعات حسب طريقة الدفع
                    </h3>
                    <div style="display: grid; gap: 0.5rem;">
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: white; border-radius: 0.25rem;">
                            <span><i class="fas fa-money-bill-wave" style="color: #10b981;"></i> نقدي</span>
                            <span style="font-weight: bold; color: #10b981;">${paymentMethods.cash.toFixed(2)} ج.م</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: white; border-radius: 0.25rem;">
                            <span><i class="fas fa-credit-card" style="color: #3b82f6;"></i> بطاقة</span>
                            <span style="font-weight: bold; color: #3b82f6;">${paymentMethods.card.toFixed(2)} ج.م</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: white; border-radius: 0.25rem;">
                            <span><i class="fas fa-mobile-alt" style="color: #8b5cf6;"></i> محفظة إلكترونية</span>
                            <span style="font-weight: bold; color: #8b5cf6;">${paymentMethods.mobile.toFixed(2)} ج.م</span>
                        </div>
                    </div>
                </div>
                
                <div style="padding: 1rem; background: #fafafa; border-radius: 0.5rem;">
                    <h3 style="color: #3e2723; margin-bottom: 1rem; font-size: 1rem; border-bottom: 2px solid #d7ccc8; padding-bottom: 0.5rem;">
                        <i class="fas fa-chart-line"></i> المبيعات اليومية
                    </h3>
                    ${dailySalesHTML}
                </div>
            </div>
        `,
        width: 700,
        confirmButtonText: '<i class="fas fa-print"></i> طباعة التقرير',
        showCancelButton: true,
        cancelButtonText: 'إغلاق',
        confirmButtonColor: '#8b4513',
        cancelButtonColor: '#64748b'
    }).then((result) => {
        if (result.isConfirmed) {
            printWeeklyReport(weeklySales, totalWeeklySales, totalWeeklyInvoices, avgInvoiceValue, totalDiscount, paymentMethods, dailySales, weekAgo, today);
        }
    });
}

// طباعة التقرير الأسبوعي
function printWeeklyReport(sales, totalSales, totalInvoices, avgInvoice, totalDiscount, paymentMethods, dailySales, startDate, endDate) {
    const dailySalesHTML = Object.entries(dailySales).reverse().map(([date, amount]) => `
        <tr>
            <td style="padding: 0.5rem; border: 1px solid #ddd;">${date}</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd; text-align: left; font-weight: bold;">${amount.toFixed(2)} ج.م</td>
        </tr>
    `).join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>التقرير الأسبوعي</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', 'Cairo', Tahoma, sans-serif; padding: 20px; direction: rtl; }
                .header { text-align: center; border-bottom: 3px solid #8b4513; padding-bottom: 20px; margin-bottom: 30px; }
                .header h1 { color: #8b4513; font-size: 28px; margin-bottom: 10px; }
                .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
                .stat-box { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #8b4513; }
                .stat-box h3 { color: #666; font-size: 12px; margin-bottom: 8px; }
                .stat-box .value { color: #8b4513; font-size: 20px; font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th { background: #8b4513; color: white; padding: 10px; text-align: right; border: 1px solid #6d3410; }
                td { padding: 8px; border: 1px solid #ddd; }
                tr:nth-child(even) { background: #f8f9fa; }
                h2 { color: #3e2723; margin: 20px 0 10px; padding-bottom: 10px; border-bottom: 2px solid #d7ccc8; }
                @media print { body { padding: 0; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>مقهى القهوة الطازجة</h1>
                <p>التقرير الأسبوعي</p>
                <p>من ${startDate.toLocaleDateString('ar-SA')} إلى ${endDate.toLocaleDateString('ar-SA')}</p>
            </div>
            
            <div class="stats">
                <div class="stat-box">
                    <h3>إجمالي المبيعات</h3>
                    <div class="value">${totalSales.toFixed(2)} ج.م</div>
                </div>
                <div class="stat-box">
                    <h3>عدد الفواتير</h3>
                    <div class="value">${totalInvoices}</div>
                </div>
                <div class="stat-box">
                    <h3>متوسط الفاتورة</h3>
                    <div class="value">${avgInvoice.toFixed(2)} ج.م</div>
                </div>
                <div class="stat-box">
                    <h3>الخصومات</h3>
                    <div class="value">${totalDiscount.toFixed(2)} ج.م</div>
                </div>
            </div>
            
            <h2>المبيعات حسب طريقة الدفع</h2>
            <table>
                <tr>
                    <th>طريقة الدفع</th>
                    <th style="text-align: left;">المبلغ</th>
                </tr>
                <tr>
                    <td>نقدي</td>
                    <td style="text-align: left; font-weight: bold;">${paymentMethods.cash.toFixed(2)} ج.م</td>
                </tr>
                <tr>
                    <td>بطاقة</td>
                    <td style="text-align: left; font-weight: bold;">${paymentMethods.card.toFixed(2)} ج.م</td>
                </tr>
                <tr>
                    <td>محفظة إلكترونية</td>
                    <td style="text-align: left; font-weight: bold;">${paymentMethods.mobile.toFixed(2)} ج.م</td>
                </tr>
            </table>
            
            <h2>المبيعات اليومية</h2>
            <table>
                <tr>
                    <th>التاريخ</th>
                    <th style="text-align: left;">المبيعات</th>
                </tr>
                ${dailySalesHTML}
            </table>
            
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// عرض المخزون
function showInventory() {
    const products = JSON.parse(localStorage.getItem('products')) || [];

    const inventoryHTML = products.map(p => {
        let statusColor = '#10b981';
        let statusText = 'متوفر';

        if (p.stock === 0) {
            statusColor = '#ef4444';
            statusText = 'نفذ';
        } else if (p.stock <= 10) {
            statusColor = '#f59e0b';
            statusText = 'منخفض';
        }

        return `
            <tr>
                <td>${p.name}</td>
                <td>${p.stock}</td>
                <td><span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></td>
            </tr>
        `;
    }).join('');

    Swal.fire({
        title: 'تقرير المخزون',
        html: `
            <div style="max-height: 400px; overflow-y: auto;">
                <table style="width: 100%; text-align: right;">
                    <thead>
                        <tr style="background: #8b4513; color: white;">
                            <th style="padding: 0.75rem;">المنتج</th>
                            <th style="padding: 0.75rem;">الكمية</th>
                            <th style="padding: 0.75rem;">الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${inventoryHTML}
                    </tbody>
                </table>
            </div>
        `,
        width: 600,
        confirmButtonText: 'إغلاق',
        confirmButtonColor: '#8b4513'
    });
}

// تسجيل الخروج
function logout() {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'هل تريد تسجيل الخروج؟',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#8b4513',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'نعم',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            performLogout();
        }
    });
}
