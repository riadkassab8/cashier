# Design Document - Dual Receipt Printing System

## Overview

نظام طباعة مزدوج متكامل يسمح بطباعة فاتورتين مختلفتين تلقائياً (فاتورة الكاشير وطلب البار) على طابعات منفصلة. النظام مصمم كـ Web Application يعمل على Windows مع دعم الطباعة المباشرة عبر QZ Tray.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Web App)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Settings   │  │   POS Page   │  │   Reports    │      │
│  │   (Printers) │  │  (Checkout)  │  │  (Reprint)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Print Service Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Receipt Generator                                    │   │
│  │  - Cashier Template Builder                          │   │
│  │  - Bar Template Builder                              │   │
│  │  - Logo Handler                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Print Manager                                        │   │
│  │  - QZ Tray Integration                               │   │
│  │  - Printer Detection                                 │   │
│  │  - Print Queue Handler                               │   │
│  │  - Error Handler                                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      QZ Tray Service                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Cashier    │  │     Bar      │  │   Network    │      │
│  │   Printer    │  │   Printer    │  │   Printers   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Storage Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  localStorage                                         │   │
│  │  - printerSettings                                   │   │
│  │  - shopLogo (Base64)                                 │   │
│  │  - printOptions                                      │   │
│  │  - printHistory                                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend Framework | Vanilla JavaScript | البساطة والتوافق مع الكود الحالي |
| Print Library | QZ Tray | الطباعة المباشرة من المتصفح |
| Template Engine | HTML/CSS | تصميم قوالب الفواتير |
| Storage | localStorage | حفظ الإعدادات والبيانات |
| UI Components | SweetAlert2 | النوافذ المنبثقة والتنبيهات |
| Styling | CSS3 + Custom | تصميم الفواتير والواجهات |

## Components and Interfaces

### 1. Printer Settings UI

#### Location
صفحة الإعدادات الموجودة (`settings.html` أو إنشاء صفحة جديدة)

#### UI Components

```html
<div class="printer-settings-section">
    <h2>🖨️ إعدادات الطباعة</h2>
    
    <!-- Cashier Printer -->
    <div class="setting-group">
        <label>طابعة الكاشير (Cashier Printer)</label>
        <select id="cashierPrinter">
            <option value="">-- اختر الطابعة --</option>
            <!-- Dynamic printer list -->
        </select>
        <div class="printer-type">
            <label>
                <input type="radio" name="cashierType" value="thermal" checked>
                حرارية (80mm)
            </label>
            <label>
                <input type="radio" name="cashierType" value="a4">
                عادية (A4)
            </label>
        </div>
    </div>
    
    <!-- Bar Printer -->
    <div class="setting-group">
        <label>طابعة البار (Bar Printer)</label>
        <select id="barPrinter">
            <option value="">-- اختر الطابعة --</option>
            <!-- Dynamic printer list -->
        </select>
        <div class="printer-type">
            <label>
                <input type="radio" name="barType" value="thermal" checked>
                حرارية (58mm)
            </label>
            <label>
                <input type="radio" name="barType" value="a4">
                عادية (A4)
            </label>
        </div>
    </div>
    
    <!-- Logo Upload -->
    <div class="setting-group">
        <label>شعار المقهى (Logo)</label>
        <input type="file" id="logoUpload" accept="image/*">
        <div id="logoPreview"></div>
        <button id="removeLogo">إزالة الشعار</button>
    </div>
    
    <!-- Print Options -->
    <div class="setting-group">
        <h3>خيارات الطباعة</h3>
        <label>
            <input type="checkbox" id="autoPrint" checked>
            طباعة تلقائية بعد كل طلب
        </label>
        <label>
            <input type="checkbox" id="printPreview">
            إظهار معاينة قبل الطباعة
        </label>
        <div class="print-mode">
            <label>
                <input type="radio" name="printMode" value="both" checked>
                طباعة الفاتورتين معاً
            </label>
            <label>
                <input type="radio" name="printMode" value="cashier">
                فاتورة الكاشير فقط
            </label>
            <label>
                <input type="radio" name="printMode" value="bar">
                طلب البار فقط
            </label>
        </div>
    </div>
    
    <!-- Test Print -->
    <div class="setting-group">
        <button id="testCashierPrint" class="btn btn-secondary">
            <i class="fas fa-print"></i> طباعة تجريبية - كاشير
        </button>
        <button id="testBarPrint" class="btn btn-secondary">
            <i class="fas fa-print"></i> طباعة تجريبية - بار
        </button>
    </div>
    
    <!-- Save Button -->
    <button id="savePrinterSettings" class="btn btn-primary">
        <i class="fas fa-save"></i> حفظ الإعدادات
    </button>
</div>
```

#### Settings Data Structure

```javascript
const printerSettings = {
    cashier: {
        name: "HP LaserJet Pro",
        type: "thermal", // or "a4"
        width: 80 // mm
    },
    bar: {
        name: "Epson TM-T20",
        type: "thermal",
        width: 58 // mm
    },
    logo: {
        enabled: true,
        data: "data:image/png;base64,..." // Base64 string
    },
    options: {
        autoPrint: true,
        printPreview: false,
        printMode: "both" // "both", "cashier", "bar"
    }
};
```

### 2. Receipt Templates

#### Cashier Receipt Template (80mm Thermal)

```html
<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: 80mm auto;
            margin: 0;
        }
        body {
            font-family: 'Courier New', monospace;
            width: 80mm;
            margin: 0;
            padding: 5mm;
            font-size: 12px;
            direction: rtl;
        }
        .logo {
            text-align: center;
            margin-bottom: 10px;
        }
        .logo img {
            max-width: 60mm;
            height: auto;
        }
        .header {
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 10px;
        }
        .divider {
            border-top: 1px dashed #000;
            margin: 5px 0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
        }
        .items-table {
            width: 100%;
            margin: 10px 0;
        }
        .item-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
        }
        .item-name {
            flex: 2;
        }
        .item-qty {
            flex: 1;
            text-align: center;
        }
        .item-price {
            flex: 1;
            text-align: left;
        }
        .totals {
            margin-top: 10px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
        }
        .grand-total {
            font-weight: bold;
            font-size: 14px;
            margin-top: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 15px;
            font-size: 11px;
        }
        .thank-you {
            text-align: center;
            margin-top: 10px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <!-- Logo -->
    <div class="logo">
        <img src="{{LOGO}}" alt="Logo">
    </div>
    
    <!-- Shop Name -->
    <div class="header">{{SHOP_NAME}}</div>
    
    <div class="divider"></div>
    
    <!-- Order Info -->
    <div class="info-row">
        <span>رقم الطلب:</span>
        <span><strong>{{ORDER_NUMBER}}</strong></span>
    </div>
    <div class="info-row">
        <span>الطاولة:</span>
        <span>{{TABLE_NUMBER}}</span>
    </div>
    <div class="info-row">
        <span>الكاشير:</span>
        <span>{{CASHIER_NAME}}</span>
    </div>
    <div class="info-row">
        <span>التاريخ:</span>
        <span>{{DATE}}</span>
    </div>
    <div class="info-row">
        <span>الوقت:</span>
        <span>{{TIME}}</span>
    </div>
    
    <div class="divider"></div>
    
    <!-- Items -->
    <div class="items-table">
        <div class="item-row" style="font-weight: bold;">
            <div class="item-name">الصنف</div>
            <div class="item-qty">الكمية</div>
            <div class="item-price">السعر</div>
        </div>
        {{#ITEMS}}
        <div class="item-row">
            <div class="item-name">{{NAME}}</div>
            <div class="item-qty">{{QTY}}</div>
            <div class="item-price">{{PRICE}} ج.م</div>
        </div>
        {{#OPTIONS}}
        <div style="font-size: 10px; color: #666; margin-right: 10px;">
            {{OPTIONS_TEXT}}
        </div>
        {{/OPTIONS}}
        {{/ITEMS}}
    </div>
    
    <div class="divider"></div>
    
    <!-- Totals -->
    <div class="totals">
        <div class="total-row">
            <span>الإجمالي الفرعي:</span>
            <span>{{SUBTOTAL}} ج.م</span>
        </div>
        <div class="total-row">
            <span>الضريبة ({{TAX_RATE}}%):</span>
            <span>{{TAX}} ج.م</span>
        </div>
        {{#DISCOUNT}}
        <div class="total-row">
            <span>الخصم:</span>
            <span>-{{DISCOUNT}} ج.م</span>
        </div>
        {{/DISCOUNT}}
        <div class="divider"></div>
        <div class="total-row grand-total">
            <span>الإجمالي النهائي:</span>
            <span>{{TOTAL}} ج.م</span>
        </div>
    </div>
    
    <div class="divider"></div>
    
    <!-- Payment Method -->
    <div class="info-row">
        <span>طريقة الدفع:</span>
        <span><strong>{{PAYMENT_METHOD}}</strong></span>
    </div>
    
    <div class="divider"></div>
    
    <!-- Footer -->
    <div class="thank-you">
        شكراً لزيارتكم
        <br>
        Thank you for your visit
    </div>
    
    <div class="footer">
        {{SHOP_ADDRESS}}
        <br>
        {{SHOP_PHONE}}
    </div>
    
    <!-- Spacing for cutting -->
    <div style="height: 20mm;"></div>
</body>
</html>
```

#### Bar Receipt Template (58mm Thermal)

```html
<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: 58mm auto;
            margin: 0;
        }
        body {
            font-family: 'Courier New', monospace;
            width: 58mm;
            margin: 0;
            padding: 3mm;
            font-size: 14px;
            direction: rtl;
        }
        .header {
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 10px;
            border: 2px solid #000;
            padding: 5px;
        }
        .order-info {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin: 10px 0;
        }
        .divider {
            border-top: 2px dashed #000;
            margin: 8px 0;
        }
        .item {
            margin: 8px 0;
            font-size: 16px;
        }
        .item-name {
            font-weight: bold;
        }
        .item-qty {
            font-size: 18px;
            margin-right: 10px;
        }
        .item-notes {
            font-size: 12px;
            color: #333;
            margin-right: 15px;
            font-style: italic;
        }
        .footer {
            text-align: center;
            margin-top: 15px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        طلب البار
        <br>
        BAR ORDER
    </div>
    
    <!-- Order Number -->
    <div class="order-info">
        طلب #{{ORDER_NUMBER}}
    </div>
    
    <!-- Table Number -->
    <div class="order-info" style="font-size: 24px;">
        طاولة {{TABLE_NUMBER}}
    </div>
    
    <div class="divider"></div>
    
    <!-- Items -->
    {{#ITEMS}}
    <div class="item">
        <span class="item-qty">× {{QTY}}</span>
        <span class="item-name">{{NAME}}</span>
        {{#OPTIONS}}
        <div class="item-notes">
            📝 {{OPTIONS_TEXT}}
        </div>
        {{/OPTIONS}}
    </div>
    {{/ITEMS}}
    
    <div class="divider"></div>
    
    <!-- Footer Info -->
    <div class="footer">
        <div>الكاشير: {{CASHIER_NAME}}</div>
        <div>{{TIME}} - {{DATE}}</div>
    </div>
    
    <!-- Spacing for cutting -->
    <div style="height: 15mm;"></div>
</body>
</html>
```

### 3. Print Service Module

#### File Structure
```
js/
├── print/
│   ├── print-service.js       # Main print service
│   ├── qz-tray-handler.js     # QZ Tray integration
│   ├── receipt-generator.js   # Template generator
│   ├── printer-manager.js     # Printer detection & management
│   └── templates/
│       ├── cashier-receipt.html
│       └── bar-receipt.html
```

#### print-service.js Interface

```javascript
class PrintService {
    constructor() {
        this.qzHandler = new QZTrayHandler();
        this.receiptGenerator = new ReceiptGenerator();
        this.printerManager = new PrinterManager();
    }
    
    /**
     * Initialize print service and connect to QZ Tray
     * @returns {Promise<boolean>}
     */
    async initialize() {}
    
    /**
     * Print both receipts (cashier + bar)
     * @param {Object} orderData - Order information
     * @returns {Promise<{cashier: boolean, bar: boolean}>}
     */
    async printBothReceipts(orderData) {}
    
    /**
     * Print cashier receipt only
     * @param {Object} orderData - Order information
     * @returns {Promise<boolean>}
     */
    async printCashierReceipt(orderData) {}
    
    /**
     * Print bar receipt only
     * @param {Object} orderData - Order information
     * @returns {Promise<boolean>}
     */
    async printBarReceipt(orderData) {}
    
    /**
     * Get list of available printers
     * @returns {Promise<Array<string>>}
     */
    async getAvailablePrinters() {}
    
    /**
     * Test print on specific printer
     * @param {string} printerName
     * @param {string} type - 'cashier' or 'bar'
     * @returns {Promise<boolean>}
     */
    async testPrint(printerName, type) {}
    
    /**
     * Validate printer settings
     * @returns {Object} - {valid: boolean, errors: Array}
     */
    validateSettings() {}
}
```

## Data Models

### Order Data Structure

```javascript
const orderData = {
    orderNumber: "0001",
    tableNumber: "5",
    tableName: "طاولة 5",
    cashier: "أحمد محمد",
    date: "2024-01-15",
    time: "14:30",
    items: [
        {
            id: 1,
            name: "كابتشينو",
            quantity: 2,
            price: 14.00,
            total: 28.00,
            options: "سكر وسط"
        },
        {
            id: 2,
            name: "كرواسون",
            quantity: 1,
            price: 12.00,
            total: 12.00,
            options: null
        }
    ],
    subtotal: 40.00,
    tax: 4.00,
    taxRate: 10,
    discount: 0,
    total: 44.00,
    paymentMethod: "نقدي",
    completedAt: "2024-01-15T14:30:00"
};
```

### Printer Settings Storage

```javascript
// localStorage key: 'printerSettings'
{
    version: "1.0",
    lastUpdated: "2024-01-15T14:30:00",
    cashier: {
        name: "HP LaserJet Pro",
        type: "thermal",
        width: 80,
        enabled: true
    },
    bar: {
        name: "Epson TM-T20",
        type: "thermal",
        width: 58,
        enabled: true
    },
    logo: {
        enabled: true,
        data: "data:image/png;base64,...",
        width: 60,
        height: 30
    },
    shop: {
        name: "مقهى الأصالة",
        address: "شارع الجامعة، القاهرة",
        phone: "01234567890"
    },
    options: {
        autoPrint: true,
        printPreview: false,
        printMode: "both",
        printOnComplete: true
    }
}
```

## Error Handling

### Error Types and Messages

```javascript
const PrintErrors = {
    QZ_NOT_INSTALLED: {
        code: 'QZ_001',
        message: 'QZ Tray غير مثبت. يرجى تحميله وتثبيته من qz.io',
        action: 'INSTALL_QZ'
    },
    QZ_NOT_RUNNING: {
        code: 'QZ_002',
        message: 'QZ Tray غير مشغل. يرجى تشغيل البرنامج',
        action: 'START_QZ'
    },
    PRINTER_NOT_FOUND: {
        code: 'PRINT_001',
        message: 'الطابعة غير موجودة أو غير متصلة',
        action: 'CHECK_PRINTER'
    },
    PRINTER_NOT_CONFIGURED: {
        code: 'PRINT_002',
        message: 'لم يتم تحديد الطابعات. يرجى الذهاب للإعدادات',
        action: 'GO_TO_SETTINGS'
    },
    PRINT_FAILED: {
        code: 'PRINT_003',
        message: 'فشلت عملية الطباعة',
        action: 'RETRY'
    },
    OUT_OF_PAPER: {
        code: 'PRINT_004',
        message: 'الطابعة خارج الورق',
        action: 'ADD_PAPER'
    }
};
```

### Error Handling Flow

```javascript
async function handlePrintError(error, printerType) {
    console.error(`Print error on ${printerType}:`, error);
    
    // Log to print history
    logPrintAttempt({
        success: false,
        printerType,
        error: error.message,
        timestamp: new Date().toISOString()
    });
    
    // Show user-friendly error
    const errorInfo = identifyError(error);
    
    await Swal.fire({
        icon: 'error',
        title: `خطأ في طباعة ${printerType === 'cashier' ? 'فاتورة الكاشير' : 'طلب البار'}`,
        html: `
            <p>${errorInfo.message}</p>
            ${errorInfo.action === 'RETRY' ? '<p>هل تريد إعادة المحاولة؟</p>' : ''}
        `,
        showCancelButton: errorInfo.action === 'RETRY',
        confirmButtonText: getActionButtonText(errorInfo.action),
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            executeErrorAction(errorInfo.action);
        }
    });
}
```

## Testing Strategy

### Unit Tests
- Receipt template generation
- Data formatting functions
- Settings validation
- Error handling logic

### Integration Tests
- QZ Tray connection
- Printer detection
- Print job submission
- Settings save/load

### Manual Testing Checklist
- [ ] تثبيت QZ Tray
- [ ] اكتشاف الطابعات
- [ ] حفظ إعدادات الطابعات
- [ ] رفع وعرض الشعار
- [ ] طباعة تجريبية - كاشير
- [ ] طباعة تجريبية - بار
- [ ] طباعة مزدوجة تلقائية
- [ ] معالجة الأخطاء
- [ ] إعادة الطباعة من التقارير
- [ ] الطباعة على طابعات حرارية
- [ ] الطباعة على طابعات A4

## Performance Considerations

1. **Template Caching**: حفظ القوالب في الذاكرة لتجنب إعادة التحميل
2. **Logo Optimization**: ضغط الشعار قبل الحفظ في localStorage
3. **Async Printing**: طباعة الفاتورتين بشكل متزامن (Promise.all)
4. **Print Queue**: إدارة قائمة انتظار للطباعة في حالة الطلبات المتعددة
5. **Error Recovery**: إعادة المحاولة التلقائية في حالة الفشل المؤقت

## Security Considerations

1. **QZ Tray Certificate**: استخدام شهادة موقعة للاتصال الآمن
2. **Logo Validation**: التحقق من نوع وحجم الصورة قبل الحفظ
3. **Settings Validation**: التحقق من صحة الإعدادات قبل الحفظ
4. **XSS Prevention**: تنظيف البيانات قبل إدراجها في القوالب
5. **Print History**: عدم حفظ معلومات حساسة في سجل الطباعة
