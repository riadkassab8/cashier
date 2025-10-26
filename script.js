// قاعدة بيانات منتجات المقهى
const products = [
    // مشروبات ساخنة
    { id: 1, name: 'إسبريسو', price: 9.00, category: 'hot-drinks', icon: 'fa-mug-hot', stock: 100 },
    { id: 2, name: 'أمريكانو', price: 11.00, category: 'hot-drinks', icon: 'fa-mug-hot', stock: 100 },
    { id: 3, name: 'كابتشينو', price: 14.00, category: 'hot-drinks', icon: 'fa-mug-saucer', stock: 100 },
    { id: 4, name: 'لاتيه', price: 16.00, category: 'hot-drinks', icon: 'fa-mug-saucer', stock: 100 },
    { id: 5, name: 'موكا', price: 17.00, category: 'hot-drinks', icon: 'fa-mug-hot', stock: 100 },
    { id: 6, name: 'فلات وايت', price: 15.00, category: 'hot-drinks', icon: 'fa-mug-saucer', stock: 100 },
    { id: 7, name: 'ماكياتو', price: 13.00, category: 'hot-drinks', icon: 'fa-mug-hot', stock: 100 },
    { id: 8, name: 'شوكولاتة ساخنة', price: 12.00, category: 'hot-drinks', icon: 'fa-mug-hot', stock: 80 },
    { id: 9, name: 'شاي', price: 8.00, category: 'hot-drinks', icon: 'fa-mug-hot', stock: 100 },
    { id: 10, name: 'شاي لاتيه', price: 15.00, category: 'hot-drinks', icon: 'fa-mug-saucer', stock: 80 },

    // مشروبات باردة
    { id: 11, name: 'قهوة مثلجة', price: 13.00, category: 'cold-drinks', icon: 'fa-glass-water', stock: 100 },
    { id: 12, name: 'لاتيه مثلج', price: 17.00, category: 'cold-drinks', icon: 'fa-glass-water', stock: 100 },
    { id: 13, name: 'موكا مثلج', price: 18.00, category: 'cold-drinks', icon: 'fa-glass-water', stock: 100 },
    { id: 14, name: 'أمريكانو مثلج', price: 12.00, category: 'cold-drinks', icon: 'fa-glass-water', stock: 100 },
    { id: 15, name: 'كولد برو', price: 15.00, category: 'cold-drinks', icon: 'fa-glass-water', stock: 80 },
    { id: 16, name: 'فرابتشينو', price: 20.00, category: 'cold-drinks', icon: 'fa-blender', stock: 80 },
    { id: 17, name: 'سموذي', price: 21.00, category: 'cold-drinks', icon: 'fa-blender', stock: 60 },
    { id: 18, name: 'عصير طازج', price: 16.00, category: 'cold-drinks', icon: 'fa-glass-water', stock: 50 },
    { id: 19, name: 'شاي مثلج', price: 10.00, category: 'cold-drinks', icon: 'fa-glass-water', stock: 80 },
    { id: 20, name: 'ليموناضة', price: 11.00, category: 'cold-drinks', icon: 'fa-lemon', stock: 70 },

    // معجنات
    { id: 21, name: 'كرواسون', price: 12.00, category: 'pastries', icon: 'fa-croissant', stock: 40 },
    { id: 22, name: 'كرواسون بالشوكولاتة', price: 14.00, category: 'pastries', icon: 'fa-croissant', stock: 35 },
    { id: 23, name: 'مافن بالتوت', price: 11.00, category: 'pastries', icon: 'fa-cake-candles', stock: 30 },
    { id: 24, name: 'مافن بالشوكولاتة', price: 11.00, category: 'pastries', icon: 'fa-cake-candles', stock: 30 },
    { id: 25, name: 'سينابون', price: 15.00, category: 'pastries', icon: 'fa-cookie', stock: 25 },
    { id: 26, name: 'دونات', price: 9.00, category: 'pastries', icon: 'fa-cookie', stock: 40 },
    { id: 27, name: 'بيجل', price: 8.00, category: 'pastries', icon: 'fa-bread-slice', stock: 35 },
    { id: 28, name: 'سكون', price: 10.00, category: 'pastries', icon: 'fa-cookie', stock: 30 },
    { id: 29, name: 'معجنات دنماركية', price: 13.00, category: 'pastries', icon: 'fa-cookie', stock: 25 },
    { id: 30, name: 'براوني', price: 12.00, category: 'pastries', icon: 'fa-cookie', stock: 30 },

    // وجبات خفيفة
    { id: 31, name: 'ساندويتش', price: 23.00, category: 'snacks', icon: 'fa-burger', stock: 25 },
    { id: 32, name: 'بانيني', price: 25.00, category: 'snacks', icon: 'fa-burger', stock: 20 },
    { id: 33, name: 'سلطة', price: 27.00, category: 'snacks', icon: 'fa-bowl-food', stock: 20 },
    { id: 34, name: 'زبادي بالفواكه', price: 17.00, category: 'snacks', icon: 'fa-ice-cream', stock: 25 },
    { id: 35, name: 'كوب فواكه', price: 14.00, category: 'snacks', icon: 'fa-apple-whole', stock: 30 },
    { id: 36, name: 'شيبس', price: 7.00, category: 'snacks', icon: 'fa-cookie', stock: 50 },
    { id: 37, name: 'جرانولا بار', price: 9.00, category: 'snacks', icon: 'fa-cookie', stock: 40 },
    { id: 38, name: 'كوكيز', price: 8.00, category: 'snacks', icon: 'fa-cookie', stock: 45 },
    { id: 39, name: 'بسكوتي', price: 10.00, category: 'snacks', icon: 'fa-cookie', stock: 35 },
    { id: 40, name: 'بروتين بار', price: 12.00, category: 'snacks', icon: 'fa-cookie', stock: 30 }
];

// حالة السلة
let cart = [];
let currentCategory = 'all';
let discountPercent = 0;
let selectedPaymentMethod = null;

// التهيئة
document.addEventListener('DOMContentLoaded', function () {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    loadProducts();
});

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

// تحميل المنتجات
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    const filteredProducts = currentCategory === 'all'
        ? products
        : products.filter(p => p.category === currentCategory);

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.onclick = () => addToCart(product);

        productCard.innerHTML = `
            <i class="fas ${product.icon}"></i>
            <h3>${product.name}</h3>
            <div class="price">${product.price.toFixed(2)} ج.م</div>
            <div class="stock">المخزون: ${product.stock}</div>
        `;

        productsGrid.appendChild(productCard);
    });
}

// تصفية حسب الفئة
function filterCategory(category) {
    currentCategory = category;

    // تحديث الزر النشط
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    loadProducts();
}

// البحث عن المنتجات
function searchProducts() {
    const searchTerm = document.getElementById('searchProduct').value.toLowerCase();
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm) &&
        (currentCategory === 'all' || p.category === currentCategory)
    );

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.onclick = () => addToCart(product);

        productCard.innerHTML = `
            <i class="fas ${product.icon}"></i>
            <h3>${product.name}</h3>
            <div class="price">${product.price.toFixed(2)} ج.م</div>
            <div class="stock">المخزون: ${product.stock}</div>
        `;

        productsGrid.appendChild(productCard);
    });
}

// إضافة إلى السلة
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'تنبيه',
                text: 'المخزون غير كافٍ!',
                confirmButtonText: 'حسناً',
                confirmButtonColor: '#8b4513'
            });
            return;
        }
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}

// تحديث عرض السلة
function updateCart() {
    const cartItems = document.getElementById('cartItems');

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>لا توجد منتجات في السلة</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            const itemTotal = item.price * item.quantity;

            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price.toFixed(2)} ج.م للقطعة</p>
                </div>
                <div class="cart-item-controls">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="decreaseQuantity(${item.id})">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="increaseQuantity(${item.id})">+</button>
                    </div>
                    <span class="item-total">${itemTotal.toFixed(2)} ج.م</span>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            cartItems.appendChild(cartItem);
        });
    }

    updateTotals();
}

// زيادة الكمية
function increaseQuantity(productId) {
    const item = cart.find(i => i.id === productId);
    const product = products.find(p => p.id === productId);

    if (item && item.quantity < product.stock) {
        item.quantity++;
        updateCart();
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'تنبيه',
            text: 'المخزون غير كافٍ!',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#8b4513'
        });
    }
}

// تقليل الكمية
function decreaseQuantity(productId) {
    const item = cart.find(i => i.id === productId);

    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            removeFromCart(productId);
            return;
        }
        updateCart();
    }
}

// حذف من السلة
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// تحديث الإجماليات
function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10;
    const discountAmount = subtotal * (discountPercent / 100);
    const total = subtotal + tax - discountAmount;

    document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)} ج.م`;
    document.getElementById('tax').textContent = `${tax.toFixed(2)} ج.م`;
    document.getElementById('discount').textContent = `-${discountAmount.toFixed(2)} ج.م`;
    document.getElementById('grandTotal').textContent = `${total.toFixed(2)} ج.م`;
}

// تطبيق الخصم
async function applyDiscount() {
    const { value: discount } = await Swal.fire({
        title: 'تطبيق خصم',
        input: 'number',
        inputLabel: 'أدخل نسبة الخصم (0-100)',
        inputPlaceholder: '0',
        inputAttributes: {
            min: 0,
            max: 100,
            step: 1
        },
        showCancelButton: true,
        confirmButtonText: 'تطبيق',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#8b4513',
        cancelButtonColor: '#64748b',
        inputValidator: (value) => {
            if (!value) {
                return 'الرجاء إدخال نسبة الخصم!';
            }
            if (value < 0 || value > 100) {
                return 'الرجاء إدخال نسبة بين 0 و 100';
            }
        }
    });

    if (discount) {
        discountPercent = parseFloat(discount);
        updateTotals();
        Swal.fire({
            icon: 'success',
            title: 'تم!',
            text: `تم تطبيق خصم ${discount}%`,
            timer: 1500,
            showConfirmButton: false
        });
    }
}

// مسح السلة
async function clearCart() {
    if (cart.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'تنبيه',
            text: 'السلة فارغة بالفعل!',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#8b4513'
        });
        return;
    }

    const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'سيتم مسح جميع المنتجات من السلة',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'نعم، امسح السلة',
        cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed) {
        cart = [];
        discountPercent = 0;
        updateCart();
        Swal.fire({
            icon: 'success',
            title: 'تم المسح',
            text: 'تم مسح السلة بنجاح',
            timer: 1500,
            showConfirmButton: false
        });
    }
}

// معالجة الدفع
function processPayment() {
    if (cart.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'تنبيه',
            text: 'السلة فارغة! الرجاء إضافة منتجات أولاً.',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#8b4513'
        });
        return;
    }

    const total = parseFloat(document.getElementById('grandTotal').textContent.replace(' ج.م', ''));
    document.getElementById('paymentTotal').textContent = `${total.toFixed(2)} ج.م`;
    document.getElementById('paymentModal').style.display = 'block';
    selectedPaymentMethod = null;

    // إعادة تعيين تفاصيل الدفع
    document.getElementById('cashPayment').style.display = 'none';
    document.getElementById('cashReceived').value = '';
    document.getElementById('changeAmount').textContent = '0.00 ج.م';

    // إزالة الفئة المحددة من جميع أزرار الدفع
    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
}

// اختيار طريقة الدفع
function selectPaymentMethod(method) {
    selectedPaymentMethod = method;

    // تحديث حالة الأزرار
    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.closest('.payment-btn').classList.add('selected');

    // إظهار/إخفاء تفاصيل الدفع النقدي
    if (method === 'cash') {
        document.getElementById('cashPayment').style.display = 'block';
    } else {
        document.getElementById('cashPayment').style.display = 'none';
    }
}

// حساب الباقي
function calculateChange() {
    const total = parseFloat(document.getElementById('paymentTotal').textContent.replace(' ج.م', ''));
    const received = parseFloat(document.getElementById('cashReceived').value) || 0;
    const change = received - total;

    document.getElementById('changeAmount').textContent = `${Math.max(0, change).toFixed(2)} ج.م`;
}

// إتمام الدفع
async function completePayment() {
    if (!selectedPaymentMethod) {
        Swal.fire({
            icon: 'warning',
            title: 'تنبيه',
            text: 'الرجاء اختيار طريقة الدفع!',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#8b4513'
        });
        return;
    }

    const total = parseFloat(document.getElementById('paymentTotal').textContent.replace(' ج.م', ''));

    if (selectedPaymentMethod === 'cash') {
        const received = parseFloat(document.getElementById('cashReceived').value) || 0;

        if (received < total) {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'المبلغ المدفوع غير كافٍ!',
                confirmButtonText: 'حسناً',
                confirmButtonColor: '#ef4444'
            });
            return;
        }
    }

    // إظهار رسالة معالجة
    Swal.fire({
        title: 'جاري معالجة الدفع...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // محاكاة معالجة الدفع
    setTimeout(() => {
        Swal.close();

        // إنشاء الفاتورة
        generateReceipt();

        // إغلاق نافذة الدفع
        closePaymentModal();

        // إظهار نافذة الفاتورة
        document.getElementById('receiptModal').style.display = 'block';

        // مسح السلة
        cart = [];
        discountPercent = 0;
        updateCart();

        // رسالة نجاح
        Swal.fire({
            icon: 'success',
            title: 'تمت العملية بنجاح!',
            text: 'تم إتمام الدفع بنجاح',
            timer: 2000,
            showConfirmButton: false
        });
    }, 1000);
}

// إنشاء الفاتورة
function generateReceipt() {
    const receiptContent = document.getElementById('receiptContent');
    const now = new Date();
    const receiptNumber = 'INV' + Date.now();

    const subtotal = parseFloat(document.getElementById('subtotal').textContent.replace(' ج.م', ''));
    const tax = parseFloat(document.getElementById('tax').textContent.replace(' ج.م', ''));
    const discount = parseFloat(document.getElementById('discount').textContent.replace('-', '').replace(' ج.م', ''));
    const total = parseFloat(document.getElementById('grandTotal').textContent.replace(' ج.م', ''));

    let itemsHTML = '';
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        itemsHTML += `
            <div class="receipt-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>${itemTotal.toFixed(2)} ج.م</span>
            </div>
        `;
    });

    const paymentMethodArabic = {
        'cash': 'نقدي',
        'card': 'بطاقة',
        'mobile': 'محفظة إلكترونية'
    };

    receiptContent.innerHTML = `
        <div class="receipt-header">
            <h2><i class="fas fa-mug-hot"></i> مقهى القهوة الطازجة</h2>
            <p>قهوة طازجة، بداية جديدة</p>
            <p>شارع الملك فهد، الرياض</p>
            <p>المملكة العربية السعودية</p>
            <p>هاتف: 0112345678</p>
            <p>www.coffeeshop.com</p>
        </div>
        
        <div style="margin-bottom: 1rem;">
            <p><strong>رقم الفاتورة:</strong> ${receiptNumber}</p>
            <p><strong>التاريخ:</strong> ${now.toLocaleString('ar-SA')}</p>
            <p><strong>الكاشير:</strong> ${document.getElementById('cashierName').textContent}</p>
            <p><strong>طريقة الدفع:</strong> ${paymentMethodArabic[selectedPaymentMethod]}</p>
        </div>
        
        <div class="receipt-items">
            ${itemsHTML}
        </div>
        
        <div class="receipt-totals">
            <div class="receipt-total">
                <span>المجموع الفرعي:</span>
                <span>${subtotal.toFixed(2)} ج.م</span>
            </div>
            <div class="receipt-total">
                <span>الضريبة (10%):</span>
                <span>${tax.toFixed(2)} ج.م</span>
            </div>
            ${discount > 0 ? `
            <div class="receipt-total">
                <span>الخصم:</span>
                <span>-${discount.toFixed(2)} ج.م</span>
            </div>
            ` : ''}
            <div class="receipt-total grand">
                <span>الإجمالي:</span>
                <span>${total.toFixed(2)} ج.م</span>
            </div>
        </div>
        
        <div class="receipt-footer">
            <p>شكراً لزيارتكم!</p>
            <p>نتمنى رؤيتكم مرة أخرى</p>
        </div>
    `;
}

// طباعة الفاتورة
function printReceipt() {
    window.print();
}

// إغلاق نافذة الدفع
function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// إغلاق نافذة الفاتورة
function closeReceiptModal() {
    document.getElementById('receiptModal').style.display = 'none';
}

// تسجيل الخروج
async function logout() {
    if (cart.length > 0) {
        const result = await Swal.fire({
            title: 'تحذير!',
            text: 'لديك منتجات في السلة. هل أنت متأكد من تسجيل الخروج؟',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'نعم، تسجيل الخروج',
            cancelButtonText: 'إلغاء'
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: 'جاري تسجيل الخروج...',
                timer: 1000,
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            }).then(() => {
                window.location.reload();
            });
        }
    } else {
        const result = await Swal.fire({
            title: 'هل أنت متأكد؟',
            text: 'هل تريد تسجيل الخروج؟',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#8b4513',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'نعم',
            cancelButtonText: 'إلغاء'
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: 'جاري تسجيل الخروج...',
                timer: 1000,
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            }).then(() => {
                window.location.reload();
            });
        }
    }
}

// إغلاق النوافذ عند النقر خارجها
window.onclick = function (event) {
    const paymentModal = document.getElementById('paymentModal');
    const receiptModal = document.getElementById('receiptModal');

    if (event.target === paymentModal) {
        closePaymentModal();
    }
    if (event.target === receiptModal) {
        closeReceiptModal();
    }
}

// اختصارات لوحة المفاتيح
document.addEventListener('keydown', function (e) {
    // F1 - معالجة الدفع
    if (e.key === 'F1') {
        e.preventDefault();
        processPayment();
    }
    // F2 - مسح السلة
    if (e.key === 'F2') {
        e.preventDefault();
        clearCart();
    }
    // F3 - تطبيق الخصم
    if (e.key === 'F3') {
        e.preventDefault();
        applyDiscount();
    }
    // ESC - إغلاق النوافذ
    if (e.key === 'Escape') {
        closePaymentModal();
        closeReceiptModal();
    }
});
