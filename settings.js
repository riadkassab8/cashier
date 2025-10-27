// التحقق من تسجيل الدخول
const currentUser = checkAuth();
if (!currentUser) {
    window.location.href = 'login.html';
}

// السماح للمدير فقط بالوصول للإعدادات
if (currentUser.role !== 'admin') {
    Swal.fire({
        icon: 'error',
        title: 'غير مصرح',
        text: 'فقط المدير يمكنه الوصول إلى الإعدادات',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#ef4444'
    }).then(() => {
        window.location.href = currentUser.role === 'supervisor' ? 'dashboard.html' : 'index.html';
    });
}

// عرض اسم المستخدم
document.getElementById('userName').textContent = `${currentUser.name} (مدير)`;

// تحميل المستخدمين
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [
        { username: 'admin', password: 'admin123', name: 'أحمد المدير', role: 'admin' },
        { username: 'supervisor', password: 'super123', name: 'محمد المشرف', role: 'supervisor' },
        { username: 'cashier', password: 'cash123', name: 'علي الكاشير', role: 'cashier' }
    ];

    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = users.map(user => {
        const roleArabic = {
            'admin': 'مدير',
            'supervisor': 'مشرف',
            'cashier': 'كاشير'
        };

        return `
            <tr>
                <td>${user.name}</td>
                <td>${user.username}</td>
                <td><span class="badge ${user.role === 'admin' ? 'danger' : user.role === 'supervisor' ? 'warning' : 'success'}">${roleArabic[user.role]}</span></td>
                <td>
                    <button class="btn-action btn-edit" onclick="editUser('${user.username}')">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    ${user.role !== 'admin' ? `
                    <button class="btn-action btn-delete" onclick="deleteUser('${user.username}')">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

// تحميل المنتجات
function loadProductsSettings() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const grid = document.getElementById('productsGrid');

    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #795548; padding: 2rem;">لا توجد منتجات. اضغط على "إضافة منتج جديد" لإضافة منتج.</p>';
        return;
    }

    grid.innerHTML = products.map(product => `
        <div class="product-item">
            <i class="fas ${product.icon}" style="font-size: 2rem; color: #8b4513; margin-bottom: 0.5rem;"></i>
            <h4>${product.name}</h4>
            <div class="price">${product.price.toFixed(2)} ج.م</div>
            <p style="color: #795548; font-size: 0.9rem;">المخزون: ${product.stock}</p>
            <p style="color: #64748b; font-size: 0.85rem; margin-top: 0.25rem;">
                ${getCategoryNameArabic(product.category)}
            </p>
            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                <button class="btn-action btn-edit" onclick="editProduct(${product.id})" style="flex: 1;">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn-action btn-delete" onclick="deleteProduct(${product.id})" style="flex: 1;">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        </div>
    `).join('');
}

// الحصول على اسم الفئة بالعربي
function getCategoryNameArabic(category) {
    const categories = {
        'hot-drinks': 'مشروبات ساخنة',
        'cold-drinks': 'مشروبات باردة',
        'pastries': 'معجنات',
        'snacks': 'وجبات خفيفة',
        'shisha': 'شيشة'
    };
    return categories[category] || category;
}

// حفظ إعدادات المقهى
function saveShopSettings() {
    const settings = {
        shopName: document.getElementById('shopName').value,
        shopAddress: document.getElementById('shopAddress').value,
        shopPhone: document.getElementById('shopPhone').value,
        taxRate: document.getElementById('taxRate').value,
        currency: document.getElementById('currency').value
    };

    localStorage.setItem('shopSettings', JSON.stringify(settings));

    Swal.fire({
        icon: 'success',
        title: 'تم الحفظ',
        text: 'تم حفظ إعدادات المقهى بنجاح',
        timer: 1500,
        showConfirmButton: false
    });
}

// إضافة مستخدم جديد
async function addNewUser() {
    const { value: formValues } = await Swal.fire({
        title: 'إضافة مستخدم جديد',
        html: `
            <div style="text-align: right;">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">الاسم الكامل</label>
                    <input id="newUserName" class="swal2-input" placeholder="أدخل الاسم">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">اسم المستخدم</label>
                    <input id="newUsername" class="swal2-input" placeholder="أدخل اسم المستخدم">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">كلمة المرور</label>
                    <input id="newPassword" type="password" class="swal2-input" placeholder="أدخل كلمة المرور">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">الصلاحية</label>
                    <select id="newRole" class="swal2-input">
                        <option value="cashier">كاشير</option>
                        <option value="supervisor">مشرف</option>
                        <option value="admin">مدير</option>
                    </select>
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'إضافة',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#8b4513',
        preConfirm: () => {
            return {
                name: document.getElementById('newUserName').value,
                username: document.getElementById('newUsername').value,
                password: document.getElementById('newPassword').value,
                role: document.getElementById('newRole').value
            };
        }
    });

    if (formValues) {
        // التحقق من صحة البيانات
        if (!formValues.name || !formValues.username || !formValues.password) {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'الرجاء ملء جميع الحقول',
                confirmButtonColor: '#ef4444'
            });
            return;
        }

        // الحصول على المستخدمين الحاليين
        const users = JSON.parse(localStorage.getItem('users')) || [
            { username: 'admin', password: 'admin123', name: 'أحمد المدير', role: 'admin' },
            { username: 'supervisor', password: 'super123', name: 'محمد المشرف', role: 'supervisor' },
            { username: 'cashier', password: 'cash123', name: 'علي الكاشير', role: 'cashier' }
        ];

        // التحقق من عدم تكرار اسم المستخدم
        if (users.some(u => u.username === formValues.username)) {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'اسم المستخدم موجود بالفعل',
                confirmButtonColor: '#ef4444'
            });
            return;
        }

        // إضافة المستخدم الجديد
        users.push({
            username: formValues.username,
            password: formValues.password,
            name: formValues.name,
            role: formValues.role
        });

        // حفظ في localStorage
        localStorage.setItem('users', JSON.stringify(users));

        Swal.fire({
            icon: 'success',
            title: 'تم الإضافة',
            text: `تم إضافة المستخدم ${formValues.name} بنجاح`,
            timer: 1500,
            showConfirmButton: false
        });
        loadUsers();
    }
}

// تعديل مستخدم
async function editUser(username) {
    // الحصول على بيانات المستخدم الحالية
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);

    if (!user) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'المستخدم غير موجود',
            confirmButtonColor: '#ef4444'
        });
        return;
    }

    const { value: formValues } = await Swal.fire({
        title: 'تعديل المستخدم',
        html: `
            <div style="text-align: right;">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">الاسم الكامل</label>
                    <input id="editUserName" class="swal2-input" value="${user.name}">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">كلمة المرور الجديدة (اتركها فارغة للإبقاء على القديمة)</label>
                    <input id="editPassword" type="password" class="swal2-input" placeholder="كلمة مرور جديدة">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">الصلاحية</label>
                    <select id="editRole" class="swal2-input">
                        <option value="cashier" ${user.role === 'cashier' ? 'selected' : ''}>كاشير</option>
                        <option value="supervisor" ${user.role === 'supervisor' ? 'selected' : ''}>مشرف</option>
                        ${user.role === 'admin' ? '<option value="admin" selected>مدير</option>' : ''}
                    </select>
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'حفظ',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#8b4513',
        preConfirm: () => {
            return {
                name: document.getElementById('editUserName').value,
                password: document.getElementById('editPassword').value,
                role: document.getElementById('editRole').value
            };
        }
    });

    if (formValues) {
        // التحقق من صحة البيانات
        if (!formValues.name) {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'الرجاء إدخال الاسم',
                confirmButtonColor: '#ef4444'
            });
            return;
        }

        // تحديث بيانات المستخدم
        user.name = formValues.name;
        user.role = formValues.role;

        // تحديث كلمة المرور إذا تم إدخالها
        if (formValues.password && formValues.password.trim() !== '') {
            user.password = formValues.password;
        }

        // حفظ التحديثات
        localStorage.setItem('users', JSON.stringify(users));

        Swal.fire({
            icon: 'success',
            title: 'تم التعديل',
            text: 'تم تعديل بيانات المستخدم بنجاح',
            timer: 1500,
            showConfirmButton: false
        });

        loadUsers();
    }
}

// حذف مستخدم
async function deleteUser(username) {
    const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'سيتم حذف هذا المستخدم نهائياً',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed) {
        // الحصول على المستخدمين
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // حذف المستخدم
        users = users.filter(u => u.username !== username);

        // حفظ التحديث
        localStorage.setItem('users', JSON.stringify(users));

        Swal.fire({
            icon: 'success',
            title: 'تم الحذف',
            text: 'تم حذف المستخدم بنجاح',
            timer: 1500,
            showConfirmButton: false
        });
        loadUsers();
    }
}

// إضافة منتج جديد
async function addNewProduct() {
    const { value: formValues } = await Swal.fire({
        title: 'إضافة منتج جديد',
        html: `
            <div style="text-align: right;">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">اسم المنتج</label>
                    <input id="productName" class="swal2-input" placeholder="أدخل اسم المنتج">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">السعر</label>
                    <input id="productPrice" type="number" class="swal2-input" placeholder="0.00" step="0.01">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">المخزون</label>
                    <input id="productStock" type="number" class="swal2-input" placeholder="0">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">الفئة</label>
                    <select id="productCategory" class="swal2-input">
                        <option value="hot-drinks">مشروبات ساخنة</option>
                        <option value="cold-drinks">مشروبات باردة</option>
                        <option value="pastries">معجنات</option>
                        <option value="snacks">وجبات خفيفة</option>
                        <option value="shisha">شيشة</option>
                    </select>
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">الأيقونة</label>
                    <select id="productIcon" class="swal2-input">
                        <option value="fa-mug-hot">كوب ساخن</option>
                        <option value="fa-mug-saucer">كوب بصحن</option>
                        <option value="fa-glass-water">كوب ماء</option>
                        <option value="fa-blender">خلاط</option>
                        <option value="fa-lemon">ليمون</option>
                        <option value="fa-bread-slice">خبز</option>
                        <option value="fa-cake-candles">كيك</option>
                        <option value="fa-cookie">كوكيز</option>
                        <option value="fa-burger">برجر</option>
                        <option value="fa-bowl-food">سلطة</option>
                        <option value="fa-ice-cream">آيس كريم</option>
                        <option value="fa-apple-whole">تفاحة</option>
                        <option value="fa-wind">شيشة</option>
                        <option value="fa-smoking">دخان</option>
                    </select>
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'إضافة',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#8b4513',
        preConfirm: () => {
            const name = document.getElementById('productName').value;
            const price = document.getElementById('productPrice').value;
            const stock = document.getElementById('productStock').value;
            const category = document.getElementById('productCategory').value;
            const icon = document.getElementById('productIcon').value;

            if (!name || !price || !stock) {
                Swal.showValidationMessage('الرجاء ملء جميع الحقول');
                return false;
            }

            return {
                name: name,
                price: parseFloat(price),
                stock: parseInt(stock),
                category: category,
                icon: icon
            };
        }
    });

    if (formValues) {
        // تحميل المنتجات الحالية
        const products = JSON.parse(localStorage.getItem('products')) || [];

        // إنشاء معرف جديد
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

        // إضافة المنتج الجديد
        const newProduct = {
            id: newId,
            name: formValues.name,
            price: formValues.price,
            stock: formValues.stock,
            category: formValues.category,
            icon: formValues.icon
        };

        products.push(newProduct);

        // حفظ في localStorage
        localStorage.setItem('products', JSON.stringify(products));

        Swal.fire({
            icon: 'success',
            title: 'تم الإضافة',
            text: 'تم إضافة المنتج بنجاح',
            timer: 1500,
            showConfirmButton: false
        });

        loadProductsSettings();
    }
}

// تعديل منتج
async function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const { value: formValues } = await Swal.fire({
        title: 'تعديل المنتج',
        html: `
            <div style="text-align: right;">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">اسم المنتج</label>
                    <input id="editProductName" class="swal2-input" value="${product.name}">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">السعر</label>
                    <input id="editProductPrice" type="number" class="swal2-input" value="${product.price}" step="0.01">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">المخزون</label>
                    <input id="editProductStock" type="number" class="swal2-input" value="${product.stock}">
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'حفظ',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#8b4513',
        preConfirm: () => {
            return {
                name: document.getElementById('editProductName').value,
                price: parseFloat(document.getElementById('editProductPrice').value),
                stock: parseInt(document.getElementById('editProductStock').value)
            };
        }
    });

    if (formValues) {
        product.name = formValues.name;
        product.price = formValues.price;
        product.stock = formValues.stock;

        localStorage.setItem('products', JSON.stringify(products));

        Swal.fire({
            icon: 'success',
            title: 'تم التعديل',
            text: 'تم تعديل المنتج بنجاح',
            timer: 1500,
            showConfirmButton: false
        });
        loadProductsSettings();
    }
}

// حذف منتج
async function deleteProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);

    if (!product) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'المنتج غير موجود',
            confirmButtonColor: '#ef4444'
        });
        return;
    }

    const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        html: `
            <div style="text-align: center; padding: 1rem;">
                <p style="font-size: 1.1rem; margin-bottom: 1rem;">
                    سيتم حذف المنتج: <strong style="color: #ef4444;">${product.name}</strong>
                </p>
                <p style="color: #64748b; font-size: 0.9rem;">
                    هذا الإجراء لا يمكن التراجع عنه
                </p>
            </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed) {
        // حذف المنتج من المصفوفة
        const updatedProducts = products.filter(p => p.id !== productId);

        // حفظ التحديث
        localStorage.setItem('products', JSON.stringify(updatedProducts));

        Swal.fire({
            icon: 'success',
            title: 'تم الحذف',
            text: `تم حذف المنتج "${product.name}" بنجاح`,
            timer: 1500,
            showConfirmButton: false
        });

        loadProductsSettings();
    }
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

// تحميل البيانات عند بدء الصفحة
loadUsers();
loadProductsSettings();

// تحميل الإعدادات المحفوظة
const savedSettings = localStorage.getItem('shopSettings');
if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    document.getElementById('shopName').value = settings.shopName || '';
    document.getElementById('shopAddress').value = settings.shopAddress || '';
    document.getElementById('shopPhone').value = settings.shopPhone || '';
    document.getElementById('taxRate').value = settings.taxRate || 10;
    document.getElementById('currency').value = settings.currency || 'ج.م';
}
