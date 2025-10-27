# Implementation Plan - Dual Receipt Printing (Demo Version)

## Overview

نسخة Demo مبسطة لعرض الطباعة المزدوجة (فاتورة الكاشير + طلب البار) باستخدام `window.print()` بدون الحاجة لـ QZ Tray. مناسبة للعرض على العميل وسهلة التطوير لاحقاً.

---

## Demo Tasks

- [x] 1. إنشاء قالب فاتورة الكاشير



  - إنشاء ملف `cashier-receipt.html` في المجلد الرئيسي
  - إضافة شعار الكافيه في الأعلى
  - إضافة معلومات الطلب (رقم الطلب، التاريخ، الوقت)
  - إضافة جدول المنتجات (الاسم، الكمية، السعر، الإجمالي)
  - إضافة الإجماليات (Subtotal, Tax, Discount, Total)
  - إضافة طريقة الدفع
  - إضافة اسم الكاشير في الأسفل (مثال: "تم بواسطة ندى")
  - إضافة رسالة شكر
  - تصميم CSS للطباعة الحرارية (80mm width)
  - _Requirements: 3.1-3.13_

- [x] 2. إنشاء قالب طلب البار



  - إنشاء ملف `bar-receipt.html` في المجلد الرئيسي
  - إضافة شعار الكافيه في الأعلى
  - إضافة عنوان "نسخة البار" أسفل الشعار
  - إضافة رقم الطلب بخط كبير
  - إضافة رقم الطاولة بخط كبير
  - إضافة قائمة المنتجات (الاسم والكمية فقط - بدون أسعار)
  - إضافة الملاحظات لكل منتج إن وُجدت
  - إضافة اسم الكاشير والتاريخ والوقت
  - تصميم CSS للطباعة الحرارية (80mm width)



  - _Requirements: 4.1-4.10_

- [ ] 3. إنشاء ملف JavaScript للطباعة
  - إنشاء ملف `js/print-receipts.js`
  - كتابة دالة `printReceipts(orderData)` الرئيسية
  - كتابة دالة `printCashierReceipt(orderData)` لطباعة فاتورة الكاشير
  - كتابة دالة `printBarReceipt(orderData)` لطباعة طلب البار
  - كتابة دالة `populateReceiptData(orderData, type)` لملء البيانات في القالب



  - كتابة دالة `openReceiptWindow(html, title)` لفتح نافذة الطباعة
  - إضافة تأخير زمني (2 ثانية) بين الطباعتين
  - عرض رسائل تأكيد للمستخدم
  - _Requirements: 5.1-5.3_

- [x] 4. دمج الطباعة في نظام الكاشير



  - فتح ملف `pos.html`
  - إضافة سكريبت `print-receipts.js` في الصفحة
  - البحث عن زر "طباعة الفاتورة" الموجود
  - ربط الزر بدالة `printReceipts()`
  - تمرير بيانات الطلب الحالي للدالة
  - التأكد من وجود جميع البيانات المطلوبة
  - _Requirements: 5.1_




- [ ] 5. تصميم CSS للطباعة الحرارية
  - إنشاء ملف `css/print-receipt.css`
  - كتابة CSS للطباعة على ورق 80mm
  - تحديد `@page` size و margins
  - تنسيق الخطوط (Courier New, Monospace)
  - تنسيق الجداول والصفوف
  - إضافة خطوط فاصلة (dashed borders)



  - تحسين المسافات والمحاذاة
  - التأكد من وضوح النص عند الطباعة
  - _Requirements: 8.1-8.8_

- [ ] 6. اختبار الطباعة
  - اختبار طباعة فاتورة الكاشير
  - اختبار طباعة طلب البار
  - اختبار الطباعة المزدوجة مع التأخير الزمني
  - اختبار على متصفحات مختلفة (Chrome, Edge)
  - اختبار معاينة الطباعة (Print Preview)
  - التأكد من ظهور جميع البيانات بشكل صحيح
  - التأكد من التنسيق والمحاذاة
  - _Requirements: جميع المتطلبات_

- [ ] 7. إضافة تعليقات للتطوير المستقبلي
  - إضافة تعليقات في الكود توضح نقاط التطوير
  - توثيق كيفية إضافة QZ Tray لاحقاً
  - توثيق كيفية تحديد طابعات منفصلة
  - إضافة TODO comments للميزات المستقبلية
  - _Requirements: Documentation_

---

## Implementation Details

### 1. Cashier Receipt Structure

```html
<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>فاتورة الكاشير</title>
    <link rel="stylesheet" href="css/print-receipt.css">
</head>
<body class="cashier-receipt">
    <div class="receipt-container">
        <!-- Logo -->
        <div class="logo">
            <img src="assets/logo.png" alt="Logo">
        </div>
        
        <!-- Shop Name -->
        <div class="shop-name">مقهى الأصالة</div>
        
        <!-- Divider -->
        <div class="divider"></div>
        
        <!-- Order Info -->
        <div class="order-info">
            <div class="info-row">
                <span>رقم الطلب:</span>
                <span id="orderNumber"></span>
            </div>
            <div class="info-row">
                <span>الطاولة:</span>
                <span id="tableName"></span>
            </div>
            <div class="info-row">
                <span>التاريخ:</span>
                <span id="orderDate"></span>
            </div>
            <div class="info-row">
                <span>الوقت:</span>
                <span id="orderTime"></span>
            </div>
        </div>
        
        <div class="divider"></div>
        
        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th>الصنف</th>
                    <th>الكمية</th>
                    <th>السعر</th>
                </tr>
            </thead>
            <tbody id="itemsBody">
                <!-- Items will be inserted here -->
            </tbody>
        </table>
        
        <div class="divider"></div>
        
        <!-- Totals -->
        <div class="totals">
            <div class="total-row">
                <span>الإجمالي الفرعي:</span>
                <span id="subtotal"></span>
            </div>
            <div class="total-row">
                <span>الضريبة:</span>
                <span id="tax"></span>
            </div>
            <div class="total-row grand-total">
                <span>الإجمالي:</span>
                <span id="total"></span>
            </div>
        </div>
        
        <div class="divider"></div>
        
        <!-- Payment Method -->
        <div class="payment-method">
            <span>طريقة الدفع:</span>
            <span id="paymentMethod"></span>
        </div>
        
        <div class="divider"></div>
        
        <!-- Cashier Name -->
        <div class="cashier-name">
            تم بواسطة: <span id="cashierName"></span>
        </div>
        
        <!-- Thank You -->
        <div class="thank-you">
            شكراً لزيارتكم
            <br>
            Thank you for your visit
        </div>
    </div>
</body>
</html>
```

### 2. Bar Receipt Structure

```html
<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>طلب البار</title>
    <link rel="stylesheet" href="css/print-receipt.css">
</head>
<body class="bar-receipt">
    <div class="receipt-container">
        <!-- Logo -->
        <div class="logo">
            <img src="assets/logo.png" alt="Logo">
        </div>
        
        <!-- Bar Label -->
        <div class="bar-label">نسخة البار</div>
        
        <div class="divider"></div>
        
        <!-- Order Number -->
        <div class="order-number-large">
            طلب #<span id="orderNumber"></span>
        </div>
        
        <!-- Table Number -->
        <div class="table-number-large">
            طاولة <span id="tableName"></span>
        </div>
        
        <div class="divider"></div>
        
        <!-- Items List -->
        <div class="items-list" id="itemsList">
            <!-- Items will be inserted here -->
        </div>
        
        <div class="divider"></div>
        
        <!-- Footer -->
        <div class="bar-footer">
            <div>الكاشير: <span id="cashierName"></span></div>
            <div><span id="orderTime"></span> - <span id="orderDate"></span></div>
        </div>
    </div>
</body>
</html>
```

### 3. Print Function

```javascript
// js/print-receipts.js

/**
 * Print both receipts (Cashier + Bar) with 2 seconds delay
 * @param {Object} orderData - Current order data
 */
async function printReceipts(orderData) {
    try {
        // Show loading message
        Swal.fire({
            title: 'جاري الطباعة...',
            html: 'يتم طباعة الفواتير',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        
        // Print Cashier Receipt
        await printCashierReceipt(orderData);
        
        // Wait 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Print Bar Receipt
        await printBarReceipt(orderData);
        
        // Close loading and show success
        Swal.close();
        Swal.fire({
            icon: 'success',
            title: 'تمت الطباعة بنجاح',
            text: 'تم طباعة فاتورة الكاشير وطلب البار',
            timer: 2000,
            showConfirmButton: false
        });
        
    } catch (error) {
        console.error('Print error:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطأ في الطباعة',
            text: error.message,
            confirmButtonColor: '#ef4444'
        });
    }
}

/**
 * Print Cashier Receipt
 */
async function printCashierReceipt(orderData) {
    return new Promise((resolve) => {
        // Open receipt in new window
        const printWindow = window.open('cashier-receipt.html', '_blank');
        
        printWindow.onload = function() {
            // Populate data
            populateReceiptData(printWindow.document, orderData, 'cashier');
            
            // Wait for images to load
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
                resolve();
            }, 500);
        };
    });
}

/**
 * Print Bar Receipt
 */
async function printBarReceipt(orderData) {
    return new Promise((resolve) => {
        // Open receipt in new window
        const printWindow = window.open('bar-receipt.html', '_blank');
        
        printWindow.onload = function() {
            // Populate data
            populateReceiptData(printWindow.document, orderData, 'bar');
            
            // Wait for images to load
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
                resolve();
            }, 500);
        };
    });
}

/**
 * Populate receipt with order data
 */
function populateReceiptData(doc, orderData, type) {
    // Common data
    doc.getElementById('orderNumber').textContent = orderData.orderNumber;
    doc.getElementById('cashierName').textContent = orderData.cashier;
    doc.getElementById('orderDate').textContent = new Date().toLocaleDateString('ar-EG');
    doc.getElementById('orderTime').textContent = new Date().toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    if (type === 'cashier') {
        // Cashier receipt specific data
        doc.getElementById('tableName').textContent = orderData.tableName;
        doc.getElementById('paymentMethod').textContent = orderData.paymentMethod;
        doc.getElementById('subtotal').textContent = orderData.subtotal.toFixed(2) + ' ج.م';
        doc.getElementById('tax').textContent = orderData.tax.toFixed(2) + ' ج.م';
        doc.getElementById('total').textContent = orderData.total.toFixed(2) + ' ج.م';
        
        // Populate items
        const itemsBody = doc.getElementById('itemsBody');
        orderData.items.forEach(item => {
            const row = doc.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price.toFixed(2)} ج.م</td>
            `;
            itemsBody.appendChild(row);
        });
        
    } else if (type === 'bar') {
        // Bar receipt specific data
        doc.getElementById('tableName').textContent = orderData.tableName;
        
        // Populate items (no prices)
        const itemsList = doc.getElementById('itemsList');
        orderData.items.forEach(item => {
            const itemDiv = doc.createElement('div');
            itemDiv.className = 'bar-item';
            itemDiv.innerHTML = `
                <div class="item-qty">× ${item.quantity}</div>
                <div class="item-name">${item.name}</div>
                ${item.options ? `<div class="item-notes">📝 ${item.options}</div>` : ''}
            `;
            itemsList.appendChild(itemDiv);
        });
    }
}

// TODO: Future enhancement - Add QZ Tray support
// TODO: Future enhancement - Add printer selection
// TODO: Future enhancement - Add print settings
```

---

## Testing Checklist

- [ ] فاتورة الكاشير تظهر بشكل صحيح
- [ ] طلب البار يظهر بشكل صحيح
- [ ] الطباعة المزدوجة تعمل مع التأخير
- [ ] جميع البيانات تظهر بشكل صحيح
- [ ] التنسيق مناسب للطباعة الحرارية
- [ ] الشعار يظهر بوضوح
- [ ] رسائل التأكيد تعمل

---

## Estimated Time

- Task 1-2: 2-3 ساعات (HTML Templates)
- Task 3: 1-2 ساعة (JavaScript)
- Task 4: 30 دقيقة (Integration)
- Task 5: 1-2 ساعة (CSS)
- Task 6: 1 ساعة (Testing)
- Task 7: 30 دقيقة (Documentation)

**Total: 6-9 ساعات (يوم عمل واحد)**

---

## Notes

- ✅ نسخة Demo بسيطة وسريعة
- ✅ لا تحتاج QZ Tray
- ✅ تستخدم `window.print()` القياسي
- ✅ سهلة التطوير لاحقاً
- ✅ مناسبة للعرض على العميل
