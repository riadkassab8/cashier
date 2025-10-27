// التحقق من تسجيل الدخول والصلاحيات
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
    window.location.href = 'login.html';
}

// التحقق من الصلاحيات
if (currentUser.role === 'cashier') {
    Swal.fire({
        icon: 'error',
        title: 'غير مصرح',
        text: 'ليس لديك صلاحية الوصول إلى التقارير',
        confirmButtonColor: '#ef4444'
    }).then(() => {
        window.location.href = 'pos.html';
    });
}

// عرض معلومات المستخدم
document.getElementById('userName').textContent = currentUser.name;
const roleNames = {
    'admin': 'مدير',
    'supervisor': 'مشرف',
    'cashier': 'كاشير'
};
document.getElementById('userRole').textContent = roleNames[currentUser.role];

// إظهار الأزرار حسب الصلاحيات
if (currentUser.role === 'admin') {
    document.getElementById('closeShiftBtn').style.display = 'inline-flex';
    document.getElementById('downloadPdfBtn').style.display = 'inline-flex';
    document.getElementById('profitSection').style.display = 'block';
}

// تحميل البيانات
let allSales = JSON.parse(localStorage.getItem('salesData')) || [];
let filteredSales = [...allSales];

// عرض البيانات في الكونسول للتشخيص
console.log('📊 Total sales loaded:', allSales.length);
console.log('📊 Sample sale:', allSales[0]);
if (allSales.length > 0) {
    console.log('📊 Sale structure:', {
        hasDate: !!allSales[0].date,
        hasCompletedAt: !!allSales[0].completedAt,
        hasItems: !!allSales[0].items,
        itemsCount: allSales[0].items?.length
    });
}

// تهيئة التواريخ
const today = new Date();
document.getElementById('dateTo').valueAsDate = today;
const weekAgo = new Date(today);
weekAgo.setDate(weekAgo.getDate() - 7);
document.getElementById('dateFrom').valueAsDate = weekAgo;

// تحميل قائمة الكاشيرز
function loadCashiersList() {
    const cashiers = [...new Set(allSales.map(s => s.cashier))];
    const select = document.getElementById('cashierFilter');
    cashiers.forEach(cashier => {
        const option = document.createElement('option');
        option.value = cashier;
        option.textContent = cashier;
        select.appendChild(option);
    });
}

// حساب الإحصائيات
function calculateStats() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    console.log('📅 Calculating stats for:', {
        today: todayStart,
        weekStart: weekStart,
        monthStart: monthStart
    });

    // مبيعات اليوم
    const todaySales = allSales.filter(s => {
        const saleDate = new Date(s.completedAt || s.date || s.createdAt);
        return !isNaN(saleDate.getTime()) && saleDate >= todayStart;
    });
    const todayTotal = todaySales.reduce((sum, s) => sum + (s.total || 0), 0);
    document.getElementById('todaySales').textContent = todayTotal.toFixed(2) + ' ج.م';
    document.getElementById('todayOrders').textContent = todaySales.length;

    console.log('📊 Today sales:', todaySales.length, 'Total:', todayTotal);

    // مبيعات الأسبوع
    const weekSales = allSales.filter(s => {
        const saleDate = new Date(s.completedAt || s.date || s.createdAt);
        return !isNaN(saleDate.getTime()) && saleDate >= weekStart;
    });
    const weekTotal = weekSales.reduce((sum, s) => sum + (s.total || 0), 0);
    document.getElementById('weekSales').textContent = weekTotal.toFixed(2) + ' ج.م';

    // مبيعات الشهر
    const monthSales = allSales.filter(s => {
        const saleDate = new Date(s.completedAt || s.date || s.createdAt);
        return !isNaN(saleDate.getTime()) && saleDate >= monthStart;
    });
    const monthTotal = monthSales.reduce((sum, s) => sum + (s.total || 0), 0);
    document.getElementById('monthSales').textContent = monthTotal.toFixed(2) + ' ج.م';

    console.log('📊 Month sales:', monthSales.length, 'Total:', monthTotal);

    // تقرير الأرباح (للمدير فقط)
    if (currentUser.role === 'admin') {
        const revenue = monthTotal;
        const estimatedCosts = revenue * 0.35; // 35% تكاليف تقديرية
        const profit = revenue - estimatedCosts;

        document.getElementById('totalRevenue').textContent = revenue.toFixed(2) + ' ج.م';
        document.getElementById('totalCosts').textContent = estimatedCosts.toFixed(2) + ' ج.م';
        document.getElementById('netProfit').textContent = profit.toFixed(2) + ' ج.م';
        document.getElementById('netProfit').style.color = profit >= 0 ? '#10b981' : '#ef4444';
    }
}

// تطبيق الفلاتر
function applyFilters() {
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const cashier = document.getElementById('cashierFilter').value;
    const payment = document.getElementById('paymentFilter').value;

    console.log('🔍 Applying filters:', { dateFrom, dateTo, cashier, payment });

    filteredSales = allSales.filter(sale => {
        const saleDate = new Date(sale.completedAt || sale.date || sale.createdAt);

        // تخطي المبيعات بتاريخ غير صحيح
        if (isNaN(saleDate.getTime())) {
            console.warn('Invalid date for sale:', sale);
            return false;
        }

        const fromDate = dateFrom ? new Date(dateFrom) : null;
        const toDate = dateTo ? new Date(dateTo) : null;

        if (fromDate && saleDate < fromDate) return false;
        if (toDate) {
            toDate.setHours(23, 59, 59);
            if (saleDate > toDate) return false;
        }
        if (cashier !== 'all' && sale.cashier !== cashier) return false;
        if (payment !== 'all' && sale.paymentMethod !== payment) return false;

        return true;
    });

    console.log('✅ Filtered sales:', filteredSales.length);

    loadSalesTable();
    loadCashierPerformance();
    loadTopProductsChart();
    loadPaymentMethodsChart();
}

// تحميل جدول المبيعات
function loadSalesTable() {
    const tbody = document.getElementById('salesTableBody');

    if (filteredSales.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>لا توجد مبيعات في الفترة المحددة</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredSales.map(sale => {
        const paymentBadge = {
            'cash': '<span class="badge cash">نقدي</span>',
            'card': '<span class="badge card">بطاقة</span>',
            'wallet': '<span class="badge wallet">محفظة</span>'
        };

        // التعامل مع التاريخ بشكل صحيح
        let dateStr = '-';
        let timeStr = '-';

        try {
            const date = new Date(sale.completedAt || sale.date || sale.createdAt);
            if (!isNaN(date.getTime())) {
                dateStr = date.toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
                timeStr = date.toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
            }
        } catch (e) {
            console.error('Error parsing date:', e);
        }

        return `
            <tr>
                <td>#${sale.orderNumber || sale.id}</td>
                <td>${sale.cashier}</td>
                <td>${sale.tableName || '-'}</td>
                <td><strong>${sale.total.toFixed(2)} ج.م</strong></td>
                <td>${paymentBadge[sale.paymentMethod] || sale.paymentMethod}</td>
                <td>${dateStr}</td>
                <td>${timeStr}</td>
            </tr>
        `;
    }).join('');
}

// تحميل أداء الكاشيرز
function loadCashierPerformance() {
    const cashierStats = {};

    filteredSales.forEach(sale => {
        if (!cashierStats[sale.cashier]) {
            cashierStats[sale.cashier] = {
                orders: 0,
                total: 0
            };
        }
        cashierStats[sale.cashier].orders++;
        cashierStats[sale.cashier].total += sale.total;
    });

    const tbody = document.getElementById('cashierPerformanceBody');

    if (Object.keys(cashierStats).length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>لا توجد بيانات</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = Object.entries(cashierStats)
        .sort((a, b) => b[1].total - a[1].total)
        .map(([cashier, stats]) => {
            const average = stats.total / stats.orders;
            return `
                <tr>
                    <td><strong>${cashier}</strong></td>
                    <td>${stats.orders}</td>
                    <td><strong>${stats.total.toFixed(2)} ج.م</strong></td>
                    <td>${average.toFixed(2)} ج.م</td>
                </tr>
            `;
        }).join('');
}

// رسم المنتجات الأكثر مبيعاً
let topProductsChart = null;
function loadTopProductsChart() {
    const productStats = {};

    filteredSales.forEach(sale => {
        if (sale.items && Array.isArray(sale.items)) {
            sale.items.forEach(item => {
                if (!productStats[item.name]) {
                    productStats[item.name] = 0;
                }
                productStats[item.name] += item.quantity;
            });
        }
    });

    const sortedProducts = Object.entries(productStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const ctx = document.getElementById('topProductsChart');

    if (!ctx) {
        console.error('Canvas element not found');
        return;
    }

    if (topProductsChart) {
        topProductsChart.destroy();
    }

    // إذا لم توجد بيانات، عرض رسالة
    if (sortedProducts.length === 0) {
        ctx.parentElement.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-bar"></i>
                <p>لا توجد بيانات لعرضها</p>
            </div>
        `;
        return;
    }

    topProductsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedProducts.map(p => p[0]),
            datasets: [{
                label: 'الكمية المباعة',
                data: sortedProducts.map(p => p[1]),
                backgroundColor: [
                    'rgba(139, 69, 19, 0.8)',
                    'rgba(210, 105, 30, 0.8)',
                    'rgba(160, 82, 45, 0.8)',
                    'rgba(205, 133, 63, 0.8)',
                    'rgba(222, 184, 135, 0.8)'
                ],
                borderColor: [
                    'rgba(139, 69, 19, 1)',
                    'rgba(210, 105, 30, 1)',
                    'rgba(160, 82, 45, 1)',
                    'rgba(205, 133, 63, 1)',
                    'rgba(222, 184, 135, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// رسم طرق الدفع
let paymentMethodsChart = null;
function loadPaymentMethodsChart() {
    const paymentStats = {
        'cash': 0,
        'card': 0,
        'wallet': 0
    };

    filteredSales.forEach(sale => {
        if (paymentStats[sale.paymentMethod] !== undefined) {
            paymentStats[sale.paymentMethod] += sale.total;
        }
    });

    const ctx = document.getElementById('paymentMethodsChart');

    if (!ctx) {
        console.error('Canvas element not found');
        return;
    }

    if (paymentMethodsChart) {
        paymentMethodsChart.destroy();
    }

    // التحقق من وجود بيانات
    const totalPayments = paymentStats.cash + paymentStats.card + paymentStats.wallet;
    if (totalPayments === 0) {
        ctx.parentElement.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-credit-card"></i>
                <p>لا توجد بيانات لعرضها</p>
            </div>
        `;
        return;
    }

    paymentMethodsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['نقدي', 'بطاقة', 'محفظة إلكترونية'],
            datasets: [{
                data: [paymentStats.cash, paymentStats.card, paymentStats.wallet],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)'
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(245, 158, 11, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// قفل الشيفت
async function closeShift() {
    if (currentUser.role !== 'admin') {
        Swal.fire({
            icon: 'error',
            title: 'غير مصرح',
            text: 'فقط المدير يمكنه قفل الشيفت',
            confirmButtonColor: '#ef4444'
        });
        return;
    }

    const result = await Swal.fire({
        title: 'قفل الشيفت',
        html: `
            <div style="text-align: right;">
                <p style="margin-bottom: 1rem;">هل أنت متأكد من قفل الشيفت؟</p>
                <div style="background: #f1f5f9; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <p style="margin: 0.5rem 0;"><strong>إجمالي المبيعات اليوم:</strong> ${document.getElementById('todaySales').textContent}</p>
                    <p style="margin: 0.5rem 0;"><strong>عدد الطلبات:</strong> ${document.getElementById('todayOrders').textContent}</p>
                </div>
                <p style="color: #ef4444; font-size: 0.9rem;">⚠️ بعد القفل، لن يتمكن أي كاشير من تنفيذ طلبات جديدة حتى فتح شيفت جديد</p>
            </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'نعم، قفل الشيفت',
        cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed) {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todaySales = allSales.filter(s => new Date(s.date) >= todayStart);
        const totalSales = todaySales.reduce((sum, s) => sum + s.total, 0);

        const closedShift = {
            date: now.toISOString(),
            dateStr: now.toLocaleDateString('ar-SA'),
            timeStr: now.toLocaleTimeString('ar-SA'),
            totalSales: totalSales,
            totalOrders: todaySales.length,
            closedBy: currentUser.name,
            sales: todaySales
        };

        // حفظ الشيفت المقفل
        const closedShifts = JSON.parse(localStorage.getItem('closedShifts')) || [];
        closedShifts.push(closedShift);
        localStorage.setItem('closedShifts', JSON.stringify(closedShifts));

        // تعيين حالة الشيفت كمقفل
        localStorage.setItem('shiftClosed', 'true');
        localStorage.setItem('lastShiftClose', now.toISOString());

        Swal.fire({
            icon: 'success',
            title: 'تم قفل الشيفت',
            html: `
                <div style="text-align: center;">
                    <p>تم قفل الشيفت بنجاح</p>
                    <div style="background: #f1f5f9; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                        <p style="margin: 0.5rem 0;"><strong>إجمالي المبيعات:</strong> ${totalSales.toFixed(2)} ج.م</p>
                        <p style="margin: 0.5rem 0;"><strong>عدد الطلبات:</strong> ${todaySales.length}</p>
                    </div>
                </div>
            `,
            confirmButtonColor: '#10b981'
        });
    }
}

// تحميل PDF
function downloadPDF() {
    if (currentUser.role !== 'admin') {
        Swal.fire({
            icon: 'error',
            title: 'غير مصرح',
            text: 'فقط المدير يمكنه تحميل التقارير',
            confirmButtonColor: '#ef4444'
        });
        return;
    }

    Swal.fire({
        title: 'جاري إنشاء PDF...',
        html: 'يرجى الانتظار...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // إنشاء محتوى PDF كامل
    const reportDate = new Date().toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const pdfContent = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    direction: rtl;
                    text-align: right;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    background: linear-gradient(135deg, #8b4513 0%, #d2691e 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    margin-bottom: 30px;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 15px;
                    margin-bottom: 30px;
                }
                .stat-card {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    border: 2px solid #e2e8f0;
                }
                .stat-card h3 {
                    color: #64748b;
                    font-size: 12px;
                    margin: 0 0 10px 0;
                }
                .stat-card .value {
                    font-size: 20px;
                    font-weight: bold;
                    color: #1e293b;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                }
                th {
                    background: #f1f5f9;
                    padding: 10px;
                    text-align: right;
                    font-weight: 600;
                    border-bottom: 2px solid #e2e8f0;
                }
                td {
                    padding: 10px;
                    border-bottom: 1px solid #e2e8f0;
                }
                .section-title {
                    color: #8b4513;
                    margin: 30px 0 15px 0;
                    font-size: 18px;
                    border-bottom: 2px solid #8b4513;
                    padding-bottom: 10px;
                }
                .badge {
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                }
                .badge.cash { background: #dcfce7; color: #166534; }
                .badge.card { background: #dbeafe; color: #1e40af; }
                .badge.wallet { background: #fef3c7; color: #92400e; }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #e2e8f0;
                    color: #64748b;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>تقرير المبيعات الشامل</h1>
                <p>نظام كاشير المقهى</p>
                <p>${reportDate}</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <h3>مبيعات اليوم</h3>
                    <div class="value">${document.getElementById('todaySales').textContent}</div>
                </div>
                <div class="stat-card">
                    <h3>مبيعات الأسبوع</h3>
                    <div class="value">${document.getElementById('weekSales').textContent}</div>
                </div>
                <div class="stat-card">
                    <h3>مبيعات الشهر</h3>
                    <div class="value">${document.getElementById('monthSales').textContent}</div>
                </div>
                <div class="stat-card">
                    <h3>عدد الطلبات</h3>
                    <div class="value">${document.getElementById('todayOrders').textContent}</div>
                </div>
            </div>

            <h2 class="section-title">📋 جدول المبيعات اليومية</h2>
            ${document.querySelector('#reportContent table').outerHTML}

            <h2 class="section-title">👥 أداء الكاشيرز</h2>
            ${document.querySelectorAll('.report-section')[1].querySelector('table').outerHTML}

            ${currentUser.role === 'admin' && document.getElementById('profitSection').style.display !== 'none' ? `
                <h2 class="section-title">💰 تقرير الأرباح</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>إجمالي الإيرادات</h3>
                        <div class="value">${document.getElementById('totalRevenue').textContent}</div>
                    </div>
                    <div class="stat-card">
                        <h3>التكاليف المقدرة</h3>
                        <div class="value">${document.getElementById('totalCosts').textContent}</div>
                    </div>
                    <div class="stat-card">
                        <h3>صافي الربح</h3>
                        <div class="value">${document.getElementById('netProfit').textContent}</div>
                    </div>
                </div>
            ` : ''}

            <div class="footer">
                <p>تم إنشاء هذا التقرير بواسطة: ${currentUser.name}</p>
                <p>التاريخ والوقت: ${new Date().toLocaleString('ar-SA')}</p>
                <p>نظام كاشير المقهى - جميع الحقوق محفوظة</p>
            </div>
        </body>
        </html>
    `;

    // إنشاء عنصر مؤقت
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = pdfContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    const opt = {
        margin: [10, 10, 10, 10],
        filename: `تقرير_شامل_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
            compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(tempDiv).save().then(() => {
        document.body.removeChild(tempDiv);
        Swal.fire({
            icon: 'success',
            title: 'تم التحميل',
            text: 'تم تحميل التقرير الشامل بنجاح',
            confirmButtonColor: '#10b981'
        });
    }).catch(error => {
        document.body.removeChild(tempDiv);
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'حدث خطأ أثناء إنشاء PDF',
            confirmButtonColor: '#ef4444'
        });
        console.error('PDF Error:', error);
    });
}

// التهيئة
loadCashiersList();
calculateStats();
applyFilters();
