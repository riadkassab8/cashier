# 🖨️ دليل نظام الطباعة المزدوجة

## نظرة عامة

نظام طباعة مزدوج يقوم بطباعة نسختين مختلفتين من الفاتورة تلقائياً:
- **فاتورة الكاشير**: فاتورة كاملة بجميع التفاصيل والأسعار
- **طلب البار**: طلب تحضير بدون أسعار (فقط الأصناف والملاحظات)

---

## 📁 الملفات المضافة

### 1. ملفات HTML
- `cashier-receipt.html` - قالب فاتورة الكاشير
- `bar-receipt.html` - قالب طلب البار
- `test-print.html` - صفحة اختبار النظام

### 2. ملفات JavaScript
- `print-receipts.js` - نظام الطباعة الرئيسي

### 3. ملفات CSS
- `print-receipt.css` - تصميم الطباعة الحرارية (80mm)

### 4. الملفات المعدلة
- `pos.html` - إضافة سكريبت print-receipts.js
- `pos.js` - تعديل دالة printReceipt() لاستخدام النظام الجديد

---

## 🚀 كيفية الاستخدام

### للمستخدم النهائي:

1. **في نظام الكاشير (pos.html):**
   - أكمل الطلب كالمعتاد
   - اضغط على زر "🖨️ طباعة"
   - سيتم طباعة فاتورة الكاشير أولاً
   - بعد 2 ثانية، سيتم طباعة طلب البار تلقائياً

2. **للاختبار:**
   - افتح `test-print.html` في المتصفح
   - اضغط على أي زر للاختبار
   - تحقق من الفواتير المطبوعة

### للمطور:

```javascript
// استخدام النظام في أي صفحة
printReceipts(orderData);

// طباعة فاتورة الكاشير فقط
printCashierReceipt(orderData);

// طباعة طلب البار فقط
printBarReceipt(orderData);

// اختبار بدون بيانات حقيقية
testPrintReceipts();
```

---

## 📊 هيكل البيانات المطلوب

```javascript
const orderData = {
    orderNumber: '0001',        // رقم الطلب
    tableName: 'طاولة 5',       // اسم الطاولة
    cashier: 'ندى',             // اسم الكاشير
    items: [                     // قائمة الأصناف
        {
            name: 'كابتشينو',
            quantity: 2,
            price: 14.00,
            total: 28.00,
            options: 'سكر وسط'  // اختياري
        }
    ],
    subtotal: 55.00,            // الإجمالي الفرعي
    tax: 7.70,                  // الضريبة
    discount: 0,                // الخصم (اختياري)
    total: 62.70,               // الإجمالي النهائي
    paymentMethod: 'cash',      // طريقة الدفع
    completedAt: '2024-01-15T14:30:00'  // تاريخ ووقت الطلب
};
```

---

## 🔧 التطوير المستقبلي

### المرحلة 1: دعم QZ Tray (أولوية عالية)

**الهدف:** إضافة دعم QZ Tray للطباعة المباشرة على طابعات محددة

**الخطوات:**

1. **تثبيت QZ Tray:**
   ```html
   <!-- إضافة في pos.html -->
   <script src="https://cdn.jsdelivr.net/npm/qz-tray@2.2.0/qz-tray.min.js"></script>
   ```

2. **إنشاء ملف qz-tray-handler.js:**
   ```javascript
   class QZTrayHandler {
       async connect() {
           // الاتصال بـ QZ Tray
       }
       
       async getPrinters() {
           // جلب قائمة الطابعات
       }
       
       async print(printerName, htmlContent) {
           // الطباعة على طابعة محددة
       }
   }
   ```

3. **تعديل print-receipts.js:**
   ```javascript
   // استبدال window.open() بـ QZ Tray
   if (qzTrayAvailable) {
       await qzHandler.print(cashierPrinter, htmlContent);
   } else {
       // Fallback to window.print()
   }
   ```

**الملفات المطلوبة:**
- `js/qz-tray-handler.js` - معالج QZ Tray
- `settings-printers.html` - صفحة إعدادات الطابعات

**الوقت المتوقع:** 2-3 أيام

---

### المرحلة 2: إعدادات الطابعات (أولوية عالية)

**الهدف:** السماح للمستخدم باختيار طابعة منفصلة لكل نوع

**الخطوات:**

1. **إضافة قسم في settings.html:**
   ```html
   <div class="printer-settings">
       <h2>🖨️ إعدادات الطابعات</h2>
       
       <label>طابعة الكاشير:</label>
       <select id="cashierPrinter">
           <!-- قائمة الطابعات -->
       </select>
       
       <label>طابعة البار:</label>
       <select id="barPrinter">
           <!-- قائمة الطابعات -->
       </select>
       
       <button onclick="savePrinterSettings()">حفظ</button>
   </div>
   ```

2. **حفظ الإعدادات في localStorage:**
   ```javascript
   const printerSettings = {
       cashier: 'HP LaserJet Pro',
       bar: 'Epson TM-T20',
       type: {
           cashier: 'thermal',  // or 'a4'
           bar: 'thermal'
       }
   };
   localStorage.setItem('printerSettings', JSON.stringify(printerSettings));
   ```

3. **استخدام الإعدادات في الطباعة:**
   ```javascript
   const settings = JSON.parse(localStorage.getItem('printerSettings'));
   await qzHandler.print(settings.cashier, cashierHTML);
   await qzHandler.print(settings.bar, barHTML);
   ```

**الملفات المطلوبة:**
- تعديل `settings.html`
- تعديل `settings.js`
- إنشاء `js/printer-settings.js`

**الوقت المتوقع:** 1-2 يوم

---

### المرحلة 3: خيارات الطباعة المتقدمة (أولوية متوسطة)

**الهدف:** إضافة خيارات تحكم في سلوك الطباعة

**الخيارات المقترحة:**

1. **وضع الطباعة:**
   - طباعة الفاتورتين معاً (افتراضي)
   - طباعة فاتورة الكاشير فقط
   - طباعة طلب البار فقط

2. **الطباعة التلقائية:**
   - تفعيل/تعطيل الطباعة التلقائية بعد إتمام الطلب
   - تأخير زمني قابل للتعديل (حالياً 2 ثانية)

3. **معاينة قبل الطباعة:**
   - إظهار معاينة الفاتورة قبل الطباعة

**التنفيذ:**
```javascript
const printOptions = {
    mode: 'both',           // 'both', 'cashier', 'bar'
    autoPrint: true,
    delay: 2000,            // milliseconds
    preview: false
};
```

**الوقت المتوقع:** 1 يوم

---

### المرحلة 4: رفع الشعار (أولوية متوسطة)

**الهدف:** السماح للمستخدم برفع شعار المقهى

**الخطوات:**

1. **إضافة في settings.html:**
   ```html
   <div class="logo-upload">
       <h3>شعار المقهى</h3>
       <input type="file" id="logoUpload" accept="image/*">
       <img id="logoPreview" src="" alt="Logo Preview">
       <button onclick="removeLogo()">إزالة الشعار</button>
   </div>
   ```

2. **معالجة الصورة:**
   ```javascript
   async function handleLogoUpload(file) {
       const reader = new FileReader();
       reader.onload = function(e) {
           const base64 = e.target.result;
           localStorage.setItem('shopLogo', base64);
       };
       reader.readAsDataURL(file);
   }
   ```

3. **استخدام الشعار في الفواتير:**
   ```javascript
   const logo = localStorage.getItem('shopLogo');
   if (logo) {
       document.querySelector('.logo img').src = logo;
   }
   ```

**الوقت المتوقع:** نصف يوم

---

### المرحلة 5: سجل الطباعة (أولوية منخفضة)

**الهدف:** حفظ سجل بجميع عمليات الطباعة

**الخطوات:**

1. **إنشاء print-logger.js:**
   ```javascript
   function logPrintAttempt(data) {
       const history = JSON.parse(localStorage.getItem('printHistory')) || [];
       history.push({
           timestamp: new Date().toISOString(),
           orderNumber: data.orderNumber,
           type: data.type,  // 'cashier' or 'bar'
           success: data.success,
           error: data.error || null
       });
       localStorage.setItem('printHistory', JSON.stringify(history));
   }
   ```

2. **عرض السجل في التقارير:**
   - إضافة قسم في reports.html
   - عرض آخر 50 عملية طباعة
   - إمكانية إعادة الطباعة من السجل

**الوقت المتوقع:** 1 يوم

---

### المرحلة 6: إعادة الطباعة (أولوية متوسطة)

**الهدف:** إمكانية إعادة طباعة أي فاتورة سابقة

**الخطوات:**

1. **إضافة زر في reports.html:**
   ```html
   <button onclick="reprintOrder(orderId)">
       <i class="fas fa-redo"></i> إعادة طباعة
   </button>
   ```

2. **دالة إعادة الطباعة:**
   ```javascript
   async function reprintOrder(orderId) {
       // جلب بيانات الطلب
       const order = getOrderById(orderId);
       
       // إضافة علامة "نسخة مكررة"
       order.isDuplicate = true;
       
       // طباعة
       await printReceipts(order);
   }
   ```

3. **تعديل القوالب:**
   - إضافة نص "نسخة مكررة - DUPLICATE" إذا كانت إعادة طباعة

**الوقت المتوقع:** نصف يوم

---

### المرحلة 7: دعم الطابعات العادية A4 (أولوية منخفضة)

**الهدف:** دعم الطباعة على طابعات A4 العادية

**الخطوات:**

1. **إضافة media query في print-receipt.css:**
   ```css
   @media print and (min-width: 210mm) {
       body {
           width: 210mm;
           padding: 10mm;
       }
       /* تكبير الخطوط والمسافات */
   }
   ```

2. **اختيار نوع الطابعة في الإعدادات:**
   ```javascript
   printerSettings.type = {
       cashier: 'a4',      // or 'thermal'
       bar: 'thermal'
   };
   ```

**الوقت المتوقع:** نصف يوم

---

## 🐛 معالجة الأخطاء الشائعة

### 1. النوافذ المنبثقة محظورة

**المشكلة:** المتصفح يمنع فتح النوافذ المنبثقة

**الحل:**
```javascript
if (!printWindow) {
    Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'يرجى السماح بالنوافذ المنبثقة لهذا الموقع',
        confirmButtonText: 'حسناً'
    });
}
```

### 2. QZ Tray غير مثبت

**المشكلة:** QZ Tray غير مثبت على الجهاز

**الحل:**
```javascript
if (!qzTrayAvailable) {
    Swal.fire({
        icon: 'info',
        title: 'QZ Tray غير متوفر',
        html: `
            <p>للطباعة المباشرة، يرجى تحميل وتثبيت QZ Tray</p>
            <a href="https://qz.io/download/" target="_blank">تحميل QZ Tray</a>
        `,
        showCancelButton: true,
        confirmButtonText: 'استخدام الطباعة العادية',
        cancelButtonText: 'إلغاء'
    });
}
```

### 3. الطابعة غير متصلة

**المشكلة:** الطابعة المحددة غير متصلة

**الحل:**
```javascript
try {
    await qzHandler.print(printerName, content);
} catch (error) {
    Swal.fire({
        icon: 'error',
        title: 'خطأ في الطباعة',
        text: 'الطابعة غير متصلة. يرجى التحقق من الاتصال',
        showCancelButton: true,
        confirmButtonText: 'إعادة المحاولة',
        cancelButtonText: 'إلغاء'
    });
}
```

---

## 📝 ملاحظات مهمة

### للمطورين:

1. **الكود الحالي:**
   - ✅ نسخة Demo تعمل بـ window.print()
   - ✅ جاهز للتطوير والتوسع
   - ✅ تعليقات TODO في الأماكن المهمة

2. **التوافق:**
   - ✅ يعمل على جميع المتصفحات الحديثة
   - ✅ متوافق مع Windows
   - ⚠️ يحتاج QZ Tray للطباعة المباشرة

3. **الأداء:**
   - ✅ سريع وخفيف
   - ✅ لا يؤثر على أداء النظام
   - ✅ يعمل بدون اتصال بالإنترنت

### للمستخدمين:

1. **المتطلبات:**
   - متصفح حديث (Chrome, Edge, Firefox)
   - السماح بالنوافذ المنبثقة
   - طابعة متصلة بالجهاز

2. **نصائح:**
   - اختبر الطباعة قبل الاستخدام الفعلي
   - تأكد من إعدادات الطابعة (حجم الورق)
   - احتفظ بنسخة احتياطية من الإعدادات

---

## 🔗 روابط مفيدة

- [QZ Tray Documentation](https://qz.io/docs/)
- [QZ Tray Download](https://qz.io/download/)
- [Print.js Documentation](https://printjs.crabbly.com/)
- [CSS Print Styles Guide](https://www.smashingmagazine.com/2018/05/print-stylesheets-in-2018/)

---

## 📞 الدعم

للمساعدة أو الاستفسارات:
- راجع ملف `test-print.html` للاختبار
- تحقق من console.log للأخطاء
- راجع التعليقات في الكود

---

## 📄 الترخيص

هذا النظام جزء من مشروع نظام كاشير المقهى.
جميع الحقوق محفوظة © 2024

---

**آخر تحديث:** 2024-01-15
**الإصدار:** 1.0.0 (Demo)
**المطور:** Kiro AI
