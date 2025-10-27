// دالة تحميل PDF بسيطة وفعالة
function downloadSimplePDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        let yPos = 20;

        // العنوان
        doc.setFontSize(20);
        doc.text('Sales Report', 105, yPos, { align: 'center' });
        yPos += 15;

        // الإحصائيات
        doc.setFontSize(12);
        doc.text(`Today Sales: ${document.getElementById('todaySales').textContent}`, 20, yPos);
        yPos += 10;
        doc.text(`Week Sales: ${document.getElementById('weekSales').textContent}`, 20, yPos);
        yPos += 10;
        doc.text(`Month Sales: ${document.getElementById('monthSales').textContent}`, 20, yPos);
        yPos += 10;
        doc.text(`Orders: ${document.getElementById('todayOrders').textContent}`, 20, yPos);
        yPos += 15;

        // جدول المبيعات
        const salesTableBody = [];
        const rows = document.querySelectorAll('#salesTableBody tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0 && !row.querySelector('.empty-state')) {
                salesTableBody.push([
                    cells[0]?.textContent || '',
                    cells[1]?.textContent || '',
                    cells[2]?.textContent || '',
                    cells[3]?.textContent || '',
                    cells[4]?.textContent || '',
                    cells[5]?.textContent || '',
                    cells[6]?.textContent || ''
                ]);
            }
        });

        if (salesTableBody.length > 0) {
            doc.autoTable({
                startY: yPos,
                head: [['Order', 'Cashier', 'Table', 'Total', 'Payment', 'Date', 'Time']],
                body: salesTableBody,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [139, 69, 19] }
            });
        }

        // حفظ الملف
        doc.save('report.pdf');

        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'PDF downloaded successfully',
            confirmButtonColor: '#10b981'
        });

    } catch (error) {
        console.error('PDF Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error creating PDF: ' + error.message,
            confirmButtonColor: '#ef4444'
        });
    }
}
