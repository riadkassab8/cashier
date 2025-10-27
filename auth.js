// نظام المستخدمين
function getUsers() {
    const users = JSON.parse(localStorage.getItem('users'));
    if (!users || users.length === 0) {
        // المستخدمين الافتراضيين
        const defaultUsers = [
            { username: 'admin', password: 'admin123', role: 'admin', name: 'أحمد المدير' },
            { username: 'supervisor', password: 'super123', role: 'supervisor', name: 'محمد المشرف' },
            { username: 'cashier', password: 'cash123', role: 'cashier', name: 'علي الكاشير' },
            { username: 'yaseen', password: '123456', role: 'cashier', name: 'ياسين الكاشير' }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        return defaultUsers;
    }
    return users;
}

// التحقق من تسجيل الدخول
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const users = getUsers();
    const user = users.find(u =>
        u.username === username &&
        u.password === password &&
        u.role === role
    );

    if (user) {
        // حفظ بيانات المستخدم
        const userData = {
            username: user.username,
            name: user.name,
            role: user.role,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(userData));

        Swal.fire({
            icon: 'success',
            title: 'مرحباً!',
            text: `أهلاً ${user.name}`,
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            // توجيه حسب الصلاحية
            if (user.role === 'admin' || user.role === 'supervisor') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'pos.html';
            }
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'اسم المستخدم أو كلمة المرور أو الصلاحية غير صحيحة',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#ef4444'
        });
    }
}

// التحقق من تسجيل الدخول عند تحميل الصفحة
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
        window.location.href = 'login.html';
        return null;
    }

    return JSON.parse(currentUser);
}

// تسجيل الخروج
function performLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// التحقق من الصلاحيات
function hasPermission(requiredRole) {
    const user = checkAuth();
    if (!user) return false;

    const roleHierarchy = {
        'admin': 3,
        'supervisor': 2,
        'cashier': 1
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}
