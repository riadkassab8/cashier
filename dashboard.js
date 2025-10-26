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

    const todaySales = sales.filter(sale =>
        new Date(sale.date).toDateString() === today
    );

    const totalSales = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const totalInvoices = todaySales.length;
    const totalProducts = todaySales.reduce((sum, sale) =>
        sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    // تحديث الإحصائيات
    document.getElementById('todaySales').textContent = `${totalSales.toFixed(2)} ج.م`;
    document.getElementById('todayInvoices').textContent = totalInvoices;
    document.getElementById('productsSold').textContent = totalProducts;

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

        return `
            <tr>
                <td>${invoice.invoiceNumber}</td>
                <td>${new Date(invoice.date).toLocaleString('ar-SA')}</td>
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

    const weeklySales = sales.filter(sale =>
        new Date(sale.date) >= weekAgo
    );

    const totalWeeklySales = weeklySales.reduce((sum, sale) => sum + sale.total, 0);
    const totalWeeklyInvoices = weeklySales.length;
    const totalDiscount = weeklySales.reduce((sum, sale) => sum + (sale.discount || 0), 0);
    const avgInvoiceValue = totalWeeklySales / (totalWeeklyInvoices || 1);

    Swal.fire({
        title: 'تقرير المبيعات الأسبوعي',
        html: `
            <div style="text-align: right; padding: 1rem;">
                <div style="margin-bottom: 1rem; padding: 1rem; background: #f0f9ff; border-radius: 0.5rem;">
                    <h3 style="color: #0369a1; margin-bottom: 0.5rem;">إجمالي المبيعات</h3>
                    <p style="font-size: 2rem; font-weight: bold; color: #0c4a6e;">${totalWeeklySales.toFixed(2)} ج.م</p>
                </div>
                <div style="margin-bottom: 1rem; padding: 1rem; background: #f0fdf4; border-radius: 0.5rem;">
                    <h3 style="color: #15803d; margin-bottom: 0.5rem;">عدد الفواتير</h3>
                    <p style="font-size: 2rem; font-weight: bold; color: #166534;">${totalWeeklyInvoices}</p>
                </div>
                <div style="margin-bottom: 1rem; padding: 1rem; background: #fef3c7; border-radius: 0.5rem;">
                    <h3 style="color: #92400e; margin-bottom: 0.5rem;">متوسط قيمة الفاتورة</h3>
                    <p style="font-size: 2rem; font-weight: bold; color: #78350f;">${avgInvoiceValue.toFixed(2)} ج.م</p>
                </div>
                <div style="padding: 1rem; background: #fee2e2; border-radius: 0.5rem;">
                    <h3 style="color: #991b1b; margin-bottom: 0.5rem;">إجمالي الخصومات</h3>
                    <p style="font-size: 2rem; font-weight: bold; color: #7f1d1d;">${totalDiscount.toFixed(2)} ج.م</p>
                </div>
            </div>
        `,
        width: 600,
        confirmButtonText: 'إغلاق',
        confirmButtonColor: '#8b4513'
    });
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
