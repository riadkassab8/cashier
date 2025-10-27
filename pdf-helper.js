// Print Helper using Print.js with Arabic Support
// Better support for RTL and Arabic fonts

async function printReport() {
    try {
        Swal.fire({
            title: 'جاري تحضير التقرير...',
            html: 'الرجاء الانتظار',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        // Convert charts to images
        const chartsImages = await captureCharts();

        // Prepare print content with charts
        const printContent = generatePrintHTML(chartsImages);

        // Close loading
        Swal.close();

        // Print using Print.js
        printJS({
            printable: printContent,
            type: 'raw-html',
            style: getPrintStyles(),
            scanStyles: false,
            documentTitle: `تقرير_المبيعات_${new Date().toLocaleDateString('ar-EG')}`,
            onPrintDialogClose: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'تم!',
                    text: 'تم فتح نافذة الطباعة',
                    timer: 2000,
                    showConfirmButton: false
                });
            },
            onError: (error) => {
                console.error('Print Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: 'فشل في الطباعة: ' + error.message,
                    confirmButtonColor: '#ef4444'
                });
            }
        });

    } catch (error) {
        console.error('Print Error:', error);
        Swal.close();

        setTimeout(() => {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'فشل في تحضير التقرير: ' + error.message,
                confirmButtonColor: '#ef4444'
            });
        }, 300);
    }
}

async function captureCharts() {
    const charts = {};

    try {
        // Wait a bit to ensure charts are fully rendered
        await new Promise(resolve => setTimeout(resolve, 300));

        // Capture Top Products Chart
        const topProductsCanvas = document.getElementById('topProductsChart');
        if (topProductsCanvas && topProductsCanvas.getContext) {
            try {
                charts.topProducts = topProductsCanvas.toDataURL('image/png', 1.0);
                console.log('✓ Top Products chart captured');
            } catch (e) {
                console.warn('Could not capture top products chart:', e);
            }
        }

        // Capture Payment Methods Chart
        const paymentMethodsCanvas = document.getElementById('paymentMethodsChart');
        if (paymentMethodsCanvas && paymentMethodsCanvas.getContext) {
            try {
                charts.paymentMethods = paymentMethodsCanvas.toDataURL('image/png', 1.0);
                console.log('✓ Payment Methods chart captured');
            } catch (e) {
                console.warn('Could not capture payment methods chart:', e);
            }
        }

        // Create Sales Trend Chart (hourly distribution)
        const salesTrendChart = await createSalesTrendChart();
        if (salesTrendChart) {
            charts.salesTrend = salesTrendChart;
            console.log('✓ Sales Trend chart created');
        }

        // Create Cashier Performance Chart
        const cashierChart = await createCashierPerformanceChart();
        if (cashierChart) {
            charts.cashierPerformance = cashierChart;
            console.log('✓ Cashier Performance chart created');
        }

    } catch (error) {
        console.error('Error capturing charts:', error);
    }

    return charts;
}

async function createSalesTrendChart() {
    try {
        const rows = document.querySelectorAll('#salesTableBody tr');
        const salesByHour = {};

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0 && !row.querySelector('.empty-state')) {
                const time = cells[6]?.textContent.trim() || '';
                const total = parseFloat(normalizeArabicNumerals(cells[3]?.textContent.trim() || '0').replace(/[^\d.]/g, '')) || 0;

                const hour = time.split(':')[0];
                if (hour && total > 0) {
                    salesByHour[hour] = (salesByHour[hour] || 0) + total;
                }
            }
        });

        if (Object.keys(salesByHour).length > 0) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 900;
            tempCanvas.height = 450;
            document.body.appendChild(tempCanvas);

            const hours = Object.keys(salesByHour).sort();
            const values = hours.map(h => salesByHour[h]);

            const tempChart = new Chart(tempCanvas, {
                type: 'line',
                data: {
                    labels: hours.map(h => `${h}:00`),
                    datasets: [{
                        label: 'المبيعات (ج.م)',
                        data: values,
                        borderColor: '#8b4513',
                        backgroundColor: 'rgba(139, 69, 19, 0.2)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: '#8b4513',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                font: { size: 16, family: 'Arial', weight: 'bold' },
                                padding: 15
                            }
                        },
                        title: {
                            display: true,
                            text: 'توزيع المبيعات حسب الساعة',
                            font: { size: 20, family: 'Arial', weight: 'bold' },
                            padding: 20
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: { size: 14 },
                                callback: function (value) {
                                    return value.toFixed(0) + ' ج.م';
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                font: { size: 14 }
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });

            await new Promise(resolve => setTimeout(resolve, 500));
            const imageData = tempCanvas.toDataURL('image/png', 1.0);

            tempChart.destroy();
            document.body.removeChild(tempCanvas);

            return imageData;
        }
    } catch (error) {
        console.error('Error creating sales trend chart:', error);
    }

    return null;
}

async function createCashierPerformanceChart() {
    try {
        const rows = document.querySelectorAll('#cashierPerformanceBody tr');
        const cashiers = [];
        const sales = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0 && !row.querySelector('.empty-state')) {
                const name = cells[0]?.textContent.trim() || '';
                const total = parseFloat(normalizeArabicNumerals(cells[2]?.textContent.trim() || '0').replace(/[^\d.]/g, '')) || 0;

                if (name && total > 0) {
                    cashiers.push(name);
                    sales.push(total);
                }
            }
        });

        if (cashiers.length > 0) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 900;
            tempCanvas.height = 450;
            document.body.appendChild(tempCanvas);

            const colors = [
                'rgba(139, 69, 19, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(139, 92, 246, 0.8)',
                'rgba(236, 72, 153, 0.8)'
            ];

            const tempChart = new Chart(tempCanvas, {
                type: 'bar',
                data: {
                    labels: cashiers,
                    datasets: [{
                        label: 'إجمالي المبيعات (ج.م)',
                        data: sales,
                        backgroundColor: colors.slice(0, cashiers.length),
                        borderColor: colors.slice(0, cashiers.length).map(c => c.replace('0.8', '1')),
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                font: { size: 16, family: 'Arial', weight: 'bold' },
                                padding: 15
                            }
                        },
                        title: {
                            display: true,
                            text: 'مقارنة أداء الكاشيرات',
                            font: { size: 20, family: 'Arial', weight: 'bold' },
                            padding: 20
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: { size: 14 },
                                callback: function (value) {
                                    return value.toFixed(0) + ' ج.م';
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                font: { size: 14 }
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });

            await new Promise(resolve => setTimeout(resolve, 500));
            const imageData = tempCanvas.toDataURL('image/png', 1.0);

            tempChart.destroy();
            document.body.removeChild(tempCanvas);

            return imageData;
        }
    } catch (error) {
        console.error('Error creating cashier performance chart:', error);
    }

    return null;
}

function generatePrintHTML(chartsImages = {}) {
    const currentDate = new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const currentTime = new Date().toLocaleTimeString('ar-EG');

    // Get statistics
    const todaySales = document.getElementById('todaySales')?.textContent || '0.00 ج.م';
    const weekSales = document.getElementById('weekSales')?.textContent || '0.00 ج.م';
    const monthSales = document.getElementById('monthSales')?.textContent || '0.00 ج.م';
    const todayOrders = document.getElementById('todayOrders')?.textContent || '0';

    // Get sales table data
    let salesTableHTML = '';
    let totalSales = 0;
    const rows = document.querySelectorAll('#salesTableBody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0 && !row.querySelector('.empty-state')) {
            const total = cells[3]?.textContent.trim() || '0';
            salesTableHTML += `
                <tr>
                    <td>${cells[0]?.textContent.trim() || ''}</td>
                    <td>${cells[1]?.textContent.trim() || ''}</td>
                    <td>${cells[2]?.textContent.trim() || ''}</td>
                    <td>${total}</td>
                    <td>${cells[4]?.textContent.replace(/<[^>]*>/g, '').trim() || ''}</td>
                    <td>${cells[5]?.textContent.trim() || ''}</td>
                    <td>${cells[6]?.textContent.trim() || ''}</td>
                </tr>
            `;

            const totalValue = parseFloat(normalizeArabicNumerals(total).replace(/[^\d.]/g, ''));
            if (!isNaN(totalValue)) totalSales += totalValue;
        }
    });

    // Get cashier performance data
    let cashierTableHTML = '';
    document.querySelectorAll('#cashierPerformanceBody tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0 && !row.querySelector('.empty-state')) {
            cashierTableHTML += `
                <tr>
                    <td>${cells[0]?.textContent.trim() || ''}</td>
                    <td>${cells[1]?.textContent.trim() || ''}</td>
                    <td>${cells[2]?.textContent.trim() || ''}</td>
                    <td>${cells[3]?.textContent.trim() || ''}</td>
                </tr>
            `;
        }
    });

    // Calculate payment distribution
    const paymentStats = { cash: 0, card: 0, wallet: 0 };
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0 && !row.querySelector('.empty-state')) {
            const payment = cells[4]?.textContent.toLowerCase() || '';
            const total = parseFloat(normalizeArabicNumerals(cells[3]?.textContent.trim() || '0').replace(/[^\d.]/g, '')) || 0;
            if (payment.includes('cash') || payment.includes('نقد')) paymentStats.cash += total;
            else if (payment.includes('card') || payment.includes('بطاق')) paymentStats.card += total;
            else if (payment.includes('wallet') || payment.includes('محفظ')) paymentStats.wallet += total;
        }
    });

    const totalPayments = paymentStats.cash + paymentStats.card + paymentStats.wallet;
    let paymentHTML = '';

    if (totalPayments > 0) {
        const payments = [
            { name: 'نقدي', value: paymentStats.cash, color: '#10b981' },
            { name: 'بطاقة', value: paymentStats.card, color: '#3b82f6' },
            { name: 'محفظة إلكترونية', value: paymentStats.wallet, color: '#f59e0b' }
        ];

        payments.forEach(payment => {
            const percentage = ((payment.value / totalPayments) * 100).toFixed(1);
            const width = ((payment.value / totalPayments) * 100).toFixed(1);
            paymentHTML += `
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span style="font-weight: bold;">${payment.name}</span>
                        <span>${percentage}% (${payment.value.toFixed(2)} ج.م)</span>
                    </div>
                    <div style="background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden;">
                        <div style="background: ${payment.color}; height: 100%; width: ${width}%;"></div>
                    </div>
                </div>
            `;
        });
    }

    return `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>تقرير المبيعات - ${currentDate}</title>
        </head>
        <body>
            <!-- Header -->
            <div class="print-header">
                <h1>تقرير المبيعات</h1>
                <h2>نظام نقاط البيع - المقهى</h2>
                <p>${currentDate} - ${currentTime}</p>
            </div>

            <!-- Statistics -->
            <div class="stats-section">
                <h3>ملخص الإحصائيات</h3>
                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-label">مبيعات اليوم</div>
                        <div class="stat-value">${todaySales}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">مبيعات الأسبوع</div>
                        <div class="stat-value">${weekSales}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">مبيعات الشهر</div>
                        <div class="stat-value">${monthSales}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">عدد الطلبات</div>
                        <div class="stat-value">${todayOrders}</div>
                    </div>
                </div>
            </div>

            <!-- Sales Table -->
            ${salesTableHTML ? `
            <div class="table-section">
                <h3>تفاصيل المبيعات</h3>
                <table>
                    <thead>
                        <tr>
                            <th>رقم الطلب</th>
                            <th>الكاشير</th>
                            <th>الطاولة</th>
                            <th>المجموع</th>
                            <th>طريقة الدفع</th>
                            <th>التاريخ</th>
                            <th>الوقت</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${salesTableHTML}
                    </tbody>
                </table>
                <div class="total-row">
                    <strong>إجمالي المبيعات: ${totalSales.toFixed(2)} جنيه</strong>
                </div>
            </div>
            ` : ''}

            <!-- Cashier Performance -->
            ${cashierTableHTML ? `
            <div class="table-section page-break">
                <h3>أداء الكاشيرات</h3>
                <table>
                    <thead>
                        <tr>
                            <th>الكاشير</th>
                            <th>عدد الطلبات</th>
                            <th>إجمالي المبيعات</th>
                            <th>المتوسط</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cashierTableHTML}
                    </tbody>
                </table>
            </div>
            ` : ''}

            <!-- Payment Distribution -->
            ${paymentHTML ? `
            <div class="payment-section">
                <h3>توزيع طرق الدفع</h3>
                ${paymentHTML}
            </div>
            ` : ''}

            <!-- Charts Section -->
            ${(chartsImages.topProducts || chartsImages.paymentMethods || chartsImages.salesTrend || chartsImages.cashierPerformance) ? `
            <div class="charts-section page-break">
                <h3>📊 التحليلات البيانية</h3>
                
                ${chartsImages.salesTrend ? `
                <div class="chart-container">
                    <img src="${chartsImages.salesTrend}" alt="Sales Trend Chart" class="chart-image">
                </div>
                ` : ''}

                ${chartsImages.cashierPerformance ? `
                <div class="chart-container">
                    <img src="${chartsImages.cashierPerformance}" alt="Cashier Performance Chart" class="chart-image">
                </div>
                ` : ''}

                ${chartsImages.topProducts ? `
                <div class="chart-container">
                    <img src="${chartsImages.topProducts}" alt="Top Products Chart" class="chart-image">
                </div>
                ` : ''}

                ${chartsImages.paymentMethods ? `
                <div class="chart-container">
                    <img src="${chartsImages.paymentMethods}" alt="Payment Methods Chart" class="chart-image">
                </div>
                ` : ''}
            </div>
            ` : ''}

            <!-- Footer -->
            <div class="print-footer">
                <p>تم الإنشاء بواسطة: ${currentUser.name} | ${currentDate} ${currentTime}</p>
            </div>
        </body>
        </html>
    `;
}

function getPrintStyles() {
    return `
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Amiri', 'Arial', sans-serif;
            direction: rtl;
            text-align: right;
            padding: 20px;
            color: #1e293b;
            line-height: 1.6;
        }

        .print-header {
            text-align: center;
            background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
        }

        .print-header h1 {
            font-size: 32px;
            margin-bottom: 10px;
            font-weight: 700;
        }

        .print-header h2 {
            font-size: 18px;
            margin-bottom: 10px;
            opacity: 0.9;
        }

        .print-header p {
            font-size: 14px;
            opacity: 0.8;
        }

        .stats-section {
            margin-bottom: 30px;
        }

        .stats-section h3 {
            font-size: 22px;
            margin-bottom: 15px;
            color: #8b4513;
            border-bottom: 2px solid #8b4513;
            padding-bottom: 10px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }

        .stat-box {
            background: #f8f9fa;
            border: 2px solid #8b4513;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
        }

        .stat-label {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 8px;
        }

        .stat-value {
            font-size: 18px;
            font-weight: bold;
            color: #1e293b;
        }

        .table-section {
            margin-bottom: 30px;
        }

        .table-section h3 {
            font-size: 22px;
            margin-bottom: 15px;
            color: #8b4513;
            border-bottom: 2px solid #8b4513;
            padding-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            background: white;
        }

        thead {
            background: #8b4513;
            color: white;
        }

        th, td {
            padding: 12px;
            text-align: center;
            border: 1px solid #ddd;
            font-size: 14px;
        }

        th {
            font-weight: bold;
        }

        tbody tr:nth-child(even) {
            background: #f8f9fa;
        }

        tbody tr:hover {
            background: #e5e7eb;
        }

        .total-row {
            background: #8b4513;
            color: white;
            padding: 15px;
            text-align: center;
            border-radius: 5px;
            font-size: 18px;
            margin-top: 10px;
        }

        .payment-section {
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }

        .payment-section h3 {
            font-size: 22px;
            margin-bottom: 20px;
            color: #8b4513;
        }

        .charts-section {
            margin-bottom: 30px;
        }

        .charts-section h3 {
            font-size: 22px;
            margin-bottom: 20px;
            color: #8b4513;
            border-bottom: 2px solid #8b4513;
            padding-bottom: 10px;
        }

        .chart-container {
            margin-bottom: 30px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .chart-image {
            width: 100%;
            max-width: 900px;
            height: auto;
            display: block;
            margin: 0 auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .print-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #64748b;
            font-size: 12px;
        }

        .page-break {
            page-break-before: always;
        }

        @media print {
            body {
                padding: 0;
            }

            .print-header {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .stat-box {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            thead {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .total-row {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .chart-container {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                page-break-inside: avoid;
            }

            .chart-image {
                max-height: 400px;
                object-fit: contain;
            }
        }
    `;
}

function normalizeArabicNumerals(str) {
    return str.replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x0030));
}
