// التحقق من تسجيل الدخول
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'login.html';
}

// عرض اسم الكاشير
document.getElementById('cashierName').textContent = currentUser.name;

// إظهار الأزرار حسب الصلاحيات
if (currentUser.role === 'admin' || currentUser.role === 'supervisor') {
    document.getElementById('dashboardBtn').style.display = 'flex';
}

// إخفاء زر الخصم للكاشير
if (currentUser.role === 'cashier') {
    document.getElementById('discountBtn').style.display = 'none';
}

// التحقق من حالة الشيفت (للكاشيرات فقط)
if (currentUser.role === 'cashier' || currentUser.role === 'supervisor') {
    const shifts = JSON.parse(localStorage.getItem('userShifts')) || {};
    const userShift = shifts[currentUser.username];

    if (!userShift || !userShift.active) {
        Swal.fire({
            icon: 'warning',
            title: 'الشيفت غير نشط',
            html: `
                <div style="text-align: center;">
                    <p>شيفتك غير نشط حالياً</p>
                    <p style="color: #64748b; font-size: 0.9rem; margin-top: 1rem;">
                        يرجى التواصل مع المدير لبدء شيفت جديد
                    </p>
                </div>
            `,
            confirmButtonColor: '#f59e0b',
            confirmButtonText: 'حسناً',
            allowOutsideClick: false
        }).then(() => {
            window.location.href = 'login.html';
        });
    } else {
        // عرض معلومات الشيفت
        const shiftStart = new Date(userShift.startTime);
        const shiftDuration = Math.floor((new Date() - shiftStart) / 1000 / 60); // بالدقائق
        console.log(`✓ Shift active for ${currentUser.name} - Duration: ${shiftDuration} minutes`);
    }
}

// نظام إدارة المنتجات مع Version Control
const PRODUCTS_VERSION = '3.4'; // غير هذا الرقم عند تحديث المنتجات

function getDefaultProducts() {
    return [
        // مشروبات ساخنة
        { id: 1, name: 'شاي', price: 10.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200&h=200&fit=crop', stock: 100 },
        { id: 2, name: 'شاي اخضر', price: 10.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&h=200&fit=crop', stock: 100 },
        { id: 3, name: 'شاي نكهات', price: 12.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=200&fit=crop', stock: 100 },
        { id: 4, name: 'ينسون', price: 10.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop', stock: 100 },
        { id: 5, name: 'قهوة بندق', price: 15.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop', stock: 100 },
        { id: 6, name: 'قهوة شوكولاتة', price: 15.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=200&h=200&fit=crop', stock: 100 },
        { id: 7, name: 'قهوة سادة', price: 12.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=200&fit=crop', stock: 100 },
        { id: 8, name: 'قهوة تركي', price: 12.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=200&h=200&fit=crop', stock: 100 },
        { id: 9, name: 'موكا', price: 17.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1607260550778-aa9d29444ce1?w=200&h=200&fit=crop', stock: 100 },
        { id: 10, name: 'اسبريسو', price: 14.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=200&h=200&fit=crop', stock: 100 },
        { id: 11, name: 'سحلب فواكه', price: 15.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop', stock: 100 },
        { id: 12, name: 'قهوة تركي دوبل', price: 18.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop', stock: 100 },
        { id: 13, name: 'هوت شوكليت', price: 15.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1542990253-a781e04c0082?w=200&h=200&fit=crop', stock: 100 },
        { id: 14, name: 'كابتشينو نكهات', price: 16.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=200&h=200&fit=crop', stock: 100 },
        { id: 15, name: 'حلبة', price: 12.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1733075610745-df8df93a78fe?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8JUQ4JUFEJUQ5JTg0JUQ4JUE4JUQ4JUE5JTIwJUQ5JTg1JUQ4JUI0JUQ4JUIxJUQ5JTg4JUQ4JUE4fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500', stock: 100 },
        { id: 16, name: 'كابتشينو', price: 14.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&h=200&fit=crop', stock: 100 },
        { id: 17, name: 'نسكافيه', price: 12.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=200&h=200&fit=crop', stock: 100 },
        { id: 18, name: 'ميكاتو', price: 13.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=200&h=200&fit=crop', stock: 100 },
        { id: 19, name: 'كركديه', price: 10.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1587080266227-677cc2a4e76e?w=200&h=200&fit=crop', stock: 100 },
        { id: 20, name: 'نعناع', price: 10.00, category: 'hot-drinks', image: 'https://media.istockphoto.com/id/452969417/photo/herbal-liquor.webp?a=1&b=1&s=612x612&w=0&k=20&c=PEIrN7eIy1MI5pH-s7AsDO3jPa6ocbmb0jbiTurRSzc=', stock: 100 },
        { id: 21, name: 'ينسون بالعسل', price: 12.00, category: 'hot-drinks', image: 'https://media.istockphoto.com/id/1372721287/photo/collagen-powder-is-add-to-glass-of-water-with-a-spoon.webp?a=1&b=1&s=612x612&w=0&k=20&c=i1N0YxUYHCNN6H2GTcBc0Jqwe_fAgNHWVtifIwD6XZA=', stock: 100 },
        { id: 22, name: 'ليمون سخن', price: 10.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1582610116397-edb318620f90?w=200&h=200&fit=crop', stock: 100 },
        { id: 23, name: 'ورقة', price: 10.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=200&h=200&fit=crop', stock: 100 },
        { id: 24, name: 'قهوة فرنساوي', price: 14.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop', stock: 100 },
        { id: 25, name: 'فرنساوي دبل', price: 18.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop', stock: 100 },
        { id: 26, name: 'ينسون ليمون', price: 12.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=200&h=200&fit=crop', stock: 100 },
        { id: 27, name: 'بندق دبل', price: 18.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200&h=200&fit=crop', stock: 100 },
        { id: 28, name: 'جنزبيل ليمون', price: 12.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=200&h=200&fit=crop', stock: 100 },
        { id: 29, name: 'قرفة حليب', price: 12.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=200&h=200&fit=crop', stock: 100 },
        { id: 30, name: 'حمص الشام', price: 12.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200&h=200&fit=crop', stock: 100 },
        { id: 31, name: 'هوت بوريو', price: 15.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=200&h=200&fit=crop', stock: 100 },
        { id: 32, name: 'امريكان كوفي', price: 13.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=200&h=200&fit=crop', stock: 100 },
        { id: 33, name: 'نسكافيه بلاك', price: 13.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop', stock: 100 },
        { id: 34, name: 'شاي حليب', price: 12.00, category: 'hot-drinks', image: 'https://media.istockphoto.com/id/2175010932/photo/aromatic-milk-tea-with-sugar-bowl.webp?a=1&b=1&s=612x612&w=0&k=20&c=zWTus7bw2Diw2aZxsDci-n5s2jL_mHttQLw-Yk47a7c=', stock: 100 },
        { id: 35, name: 'سحلب', price: 12.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=200&h=200&fit=crop', stock: 100 },
        { id: 36, name: 'اسبريسو حليب', price: 16.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=200&h=200&fit=crop', stock: 100 },
        { id: 37, name: 'لاتيه', price: 16.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=200&h=200&fit=crop', stock: 100 },
        { id: 38, name: 'عسل ليمون', price: 12.00, category: 'hot-drinks', image: 'https://media.istockphoto.com/id/467780658/photo/ginger-tea-with-mint-and-honey.webp?a=1&b=1&s=612x612&w=0&k=20&c=OJ_7oeYEwHC2o-yjElSOrARcKuUxcH-RgZsRosrbnPk=', stock: 100 },
        { id: 39, name: 'سحلب شوكليت', price: 14.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=200&h=200&fit=crop', stock: 100 },
        { id: 40, name: 'سحلب مكسرات', price: 14.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop', stock: 100 },
        { id: 41, name: 'سحلب لوتس', price: 15.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=200&h=200&fit=crop', stock: 100 },
        { id: 42, name: 'سحلب سنيكرز', price: 15.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1542990253-a781e04c0082?w=200&h=200&fit=crop', stock: 100 },
        { id: 43, name: 'سحلب اوريو', price: 15.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=200&h=200&fit=crop', stock: 100 },
        { id: 44, name: 'كاكاو', price: 13.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1542990253-a781e04c0082?w=200&h=200&fit=crop', stock: 100 },
        { id: 45, name: 'شاي براد', price: 10.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=200&fit=crop', stock: 100 },
        { id: 46, name: 'كوكتيل اعشاب', price: 12.00, category: 'hot-drinks', image: 'https://media.istockphoto.com/id/1349162504/photo/infused-water-detox-drink-in-bottle-on-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=pP9gl876yDEbP_tghJ-wfxk4siR41yeTjncQiIYKynA=', stock: 100 },
        { id: 47, name: 'اسبريسو حليب دبل', price: 20.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=200&h=200&fit=crop', stock: 100 },
        { id: 100, name: 'هوت شوكليت', price: 15.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1542990253-a781e04c0082?w=200&h=200&fit=crop', stock: 100 },
        { id: 101, name: 'قهوة تركي دبل', price: 18.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop', stock: 100 },
        { id: 102, name: 'قرفة', price: 10.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=200&h=200&fit=crop', stock: 100 },
        { id: 103, name: 'اسبريسو دبل', price: 18.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=200&h=200&fit=crop', stock: 100 },
        { id: 104, name: 'هوت سيدر', price: 12.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop', stock: 100 },
        { id: 105, name: 'سحلب بستاشيو', price: 16.00, category: 'hot-drinks', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop', stock: 100 },

        // عصائر
        { id: 48, name: 'برتقال', price: 15.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 49, name: 'كانز', price: 15.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 50, name: 'بلح', price: 15.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 51, name: 'عناب', price: 15.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 52, name: 'مانجو', price: 18.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 53, name: 'موز', price: 15.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 54, name: 'فراولة', price: 18.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 55, name: 'ليمون', price: 12.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 56, name: 'بطيخ', price: 15.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 57, name: 'خوخ', price: 16.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 58, name: 'مياه معدنية', price: 5.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 59, name: 'بريل', price: 6.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 60, name: 'جوافة', price: 15.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 61, name: 'اسموزي', price: 20.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=200&h=200&fit=crop', stock: 100 },
        { id: 62, name: 'ليمون نعناع', price: 14.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 63, name: 'امست', price: 12.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 64, name: 'لعدس', price: 12.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 65, name: 'فيروز', price: 6.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 66, name: 'ايس بوريو', price: 18.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 67, name: 'سوداني', price: 15.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 68, name: 'كيس بوريو', price: 18.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 69, name: 'توست كانز', price: 18.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 70, name: 'موهيتو', price: 20.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 71, name: 'حوافه حليب', price: 18.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },
        { id: 72, name: 'فراولة حليب', price: 18.00, category: 'cold-drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop', stock: 100 },

        // كوكتيل
        { id: 73, name: 'زبادي سادة', price: 12.00, category: 'pastries', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop', stock: 100 },
        { id: 74, name: 'زبادي عسل', price: 14.00, category: 'pastries', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop', stock: 100 },
        { id: 75, name: 'زبادي فواكه', price: 16.00, category: 'pastries', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop', stock: 100 },
        { id: 76, name: 'كوكتيل سيزر', price: 25.00, category: 'pastries', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&h=200&fit=crop', stock: 100 },
        { id: 77, name: 'صن شاين', price: 22.00, category: 'pastries', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&h=200&fit=crop', stock: 100 },
        { id: 78, name: 'فيجا', price: 20.00, category: 'pastries', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&h=200&fit=crop', stock: 100 },
        { id: 79, name: 'فلوريدا', price: 22.00, category: 'pastries', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&h=200&fit=crop', stock: 100 },
        { id: 80, name: 'فروت سلاط', price: 20.00, category: 'pastries', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop', stock: 100 },
        { id: 81, name: 'سوبر فيجا', price: 24.00, category: 'pastries', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&h=200&fit=crop', stock: 100 },
        { id: 82, name: 'ايس موكا', price: 20.00, category: 'pastries', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop', stock: 100 },
        { id: 83, name: 'اسبيشيال', price: 25.00, category: 'pastries', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&h=200&fit=crop', stock: 100 },
        { id: 84, name: 'فروت سلاط ايس', price: 22.00, category: 'pastries', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop', stock: 100 },
        { id: 85, name: 'ميلك شيك', price: 18.00, category: 'pastries', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&h=200&fit=crop', stock: 100 },
        { id: 86, name: 'ايس كوفي', price: 16.00, category: 'pastries', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop', stock: 100 },
        { id: 87, name: 'ايس كريم 2 بولا', price: 15.00, category: 'pastries', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&h=200&fit=crop', stock: 100 },
        { id: 88, name: 'ايس كريم 3 بولا', price: 20.00, category: 'pastries', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&h=200&fit=crop', stock: 100 },
        { id: 89, name: 'ايس لاتيه', price: 18.00, category: 'pastries', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop', stock: 100 },

        // شيشة
        { id: 90, name: 'لاي طبي', price: 50.00, category: 'shisha', image: 'https://images.unsplash.com/photo-1574238752695-675b86d49267?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170', stock: 30 },
        { id: 91, name: 'معسل دبل', price: 55.00, category: 'shisha', image: 'https://images.unsplash.com/photo-1662468527222-e4edb1cda938?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNoaXNoYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500', stock: 30 },
        { id: 92, name: 'معسل', price: 45.00, category: 'shisha', image: 'https://images.unsplash.com/photo-1685345729575-7f059204c0cd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNoaXNoYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500', stock: 30 },
        { id: 93, name: 'زغلول', price: 40.00, category: 'shisha', image: 'https://images.unsplash.com/photo-1702889369889-2b467b5d1aaf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', stock: 30 },
        { id: 94, name: 'أسليز ليمون', price: 48.00, category: 'shisha', image: 'https://images.unsplash.com/photo-1587740851725-3d3e64e9f19e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHNoaXNoYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500', stock: 30 },
        { id: 95, name: 'منت نعناع', price: 45.00, category: 'shisha', image: 'https://images.unsplash.com/photo-1689579634260-08dc3c65efdd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', stock: 30 },
        { id: 96, name: 'تلج شيشة', price: 50.00, category: 'shisha', image: 'https://images.unsplash.com/photo-1562581146-d7000f1318d4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=797', stock: 30 },
        { id: 97, name: 'فواكه خاص', price: 55.00, category: 'shisha', image: 'https://images.unsplash.com/photo-1681219577911-1fcb5a4e353e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzN8fHNoaXNoYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500', stock: 30 },
        { id: 98, name: 'لاي فاخر', price: 60.00, category: 'shisha', image: 'https://images.unsplash.com/photo-1697018636636-2687e6c441a2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', stock: 30 },
        { id: 99, name: 'فاخر مزايا', price: 65.00, category: 'shisha', image: 'https://images.unsplash.com/photo-1695890391045-2d77184c940d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', stock: 30 }
    ];
}

// تحميل المنتجات مع التحقق من الإصدار
let products;
const savedVersion = localStorage.getItem('productsVersion');
const savedProducts = JSON.parse(localStorage.getItem('products'));

if (savedVersion !== PRODUCTS_VERSION || !savedProducts || savedProducts.length === 0) {
    // تحديث المنتجات إذا كان الإصدار مختلف أو لا توجد منتجات
    console.log('تحديث المنتجات إلى الإصدار:', PRODUCTS_VERSION);
    products = getDefaultProducts();

    // الحفاظ على المخزون من المنتجات القديمة إذا كانت موجودة
    if (savedProducts && savedProducts.length > 0) {
        products = products.map(newProduct => {
            const oldProduct = savedProducts.find(p => p.id === newProduct.id);
            if (oldProduct) {
                return { ...newProduct, stock: oldProduct.stock };
            }
            return newProduct;
        });
    }

    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('productsVersion', PRODUCTS_VERSION);
} else {
    // استخدام المنتجات المحفوظة
    products = savedProducts;
}

// الطاولات
let tables = JSON.parse(localStorage.getItem('tables')) || initializeTables();

// إضافة الطاولات المميزة إذا لم تكن موجودة
if (!tables.find(t => t.id === 101)) {
    tables.unshift({
        id: 101,
        name: 'النيابة',
        status: 'available',
        orderId: null,
        capacity: 8,
        isSpecial: true,
        specialType: 'vip'
    });
}
if (!tables.find(t => t.id === 102)) {
    tables.splice(1, 0, {
        id: 102,
        name: 'الدكاترة',
        status: 'available',
        orderId: null,
        capacity: 8,
        isSpecial: true,
        specialType: 'vip'
    });
}
localStorage.setItem('tables', JSON.stringify(tables));

// الطلبات المفتوحة
let openOrders = JSON.parse(localStorage.getItem('openOrders')) || [];

// الطلب الحالي
// التحقق من وجود طاولة مختارة من صفحة الطاولات
const selectedTableId = localStorage.getItem('selectedTableId');
const tableAction = localStorage.getItem('tableAction');

// تحميل الطلب الحالي من localStorage
let savedOrder = JSON.parse(localStorage.getItem('currentOrder'));

// استخدام الطاولة من الطلب المحفوظ أو الافتراضية
let initialTableId = savedOrder?.tableId || 1;
let initialTableName = savedOrder?.tableName || 'طاولة 1';

if (selectedTableId) {
    const selectedTable = tables.find(t => t.id === parseInt(selectedTableId));
    if (selectedTable) {
        if (tableAction === 'transfer' && savedOrder && savedOrder.items.length > 0) {
            // نقل الطلب الحالي للطاولة الجديدة
            console.log('🔄 Transferring order from table', savedOrder.tableId, 'to', selectedTable.id);

            const oldTable = tables.find(t => t.id === savedOrder.tableId);
            const oldTableId = savedOrder.tableId;

            if (oldTable) {
                oldTable.status = 'available';
                oldTable.orderId = null;
                console.log('✓ Old table freed:', oldTable.name);
            }

            savedOrder.tableId = selectedTable.id;
            savedOrder.tableName = selectedTable.name;

            selectedTable.status = 'occupied';
            selectedTable.orderId = savedOrder.id;
            console.log('✓ New table occupied:', selectedTable.name);

            // تحديث جميع الطلبات المحفوظة في openOrders للطاولة القديمة
            let openOrdersTemp = JSON.parse(localStorage.getItem('openOrders')) || [];

            // تحديث جميع الطلبات المرتبطة بالطاولة القديمة
            openOrdersTemp = openOrdersTemp.map(order => {
                if (order.tableId === oldTableId) {
                    console.log(`📝 Updating order ${order.id} from table ${oldTableId} to ${selectedTable.id}`);
                    return {
                        ...order,
                        tableId: selectedTable.id,
                        tableName: selectedTable.name
                    };
                }
                return order;
            });

            localStorage.setItem('openOrders', JSON.stringify(openOrdersTemp));

            // تحديث المتغير العام openOrders
            openOrders = openOrdersTemp;

            console.log('✓ Updated all orders from old table to new table');
            console.log('✓ Orders in new table:', openOrdersTemp.filter(o => o.tableId === selectedTable.id).length);

            localStorage.setItem('tables', JSON.stringify(tables));
            localStorage.setItem('currentOrder', JSON.stringify(savedOrder));

            initialTableId = selectedTable.id;
            initialTableName = selectedTable.name;

            // تحديث اسم الطاولة في الواجهة
            updateTableNameDisplay(selectedTable.name);
        } else if (tableAction === 'load') {
            // تحميل طلب موجود من طاولة مشغولة
            let openOrders = JSON.parse(localStorage.getItem('openOrders')) || [];
            const existingOrder = openOrders.find(o => o.tableId === selectedTable.id);
            if (existingOrder) {
                savedOrder = existingOrder;
                initialTableId = selectedTable.id;
                initialTableName = selectedTable.name;
                console.log('✓ Loading existing order from', selectedTable.name);
            } else {
                initialTableId = selectedTable.id;
                initialTableName = selectedTable.name;
            }
        } else if (tableAction === 'select') {
            // اختيار طاولة جديدة وبدء طلب جديد (حفظ الطلب السابق)
            initialTableId = selectedTable.id;
            initialTableName = selectedTable.name;

            // حجز الطاولة الجديدة
            selectedTable.status = 'occupied';
            selectedTable.orderId = Date.now();
            localStorage.setItem('tables', JSON.stringify(tables));
            console.log('✓ New order on', selectedTable.name);

            // مسح الطلب المحفوظ لبدء طلب جديد
            savedOrder = null;
        } else {
            // فتح طلب جديد
            initialTableId = selectedTable.id;
            initialTableName = selectedTable.name;

            // حجز الطاولة
            selectedTable.status = 'occupied';
            selectedTable.orderId = Date.now();
            localStorage.setItem('tables', JSON.stringify(tables));
            console.log('✓ New order on', selectedTable.name);
        }

        // مسح البيانات المؤقتة
        localStorage.removeItem('selectedTableId');
        localStorage.removeItem('tableAction');
    }
}

let currentOrder;
if (savedOrder && (tableAction === 'transfer' || tableAction === 'load')) {
    currentOrder = savedOrder;
    console.log('✓ Using saved order:', currentOrder.id, 'Items:', currentOrder.items.length);
} else {
    // إنشاء طلب جديد (سواء كان select أو طلب عادي)
    currentOrder = {
        id: Date.now(),
        tableId: initialTableId,
        tableName: initialTableName,
        items: [],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        status: 'open',
        createdAt: new Date().toISOString()
    };
    console.log('✓ New order created:', currentOrder.id);
}

let currentCategory = 'all';
let numpadValue = '';

// حفظ الطلب الحالي في localStorage
function saveCurrentOrder() {
    localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
}

// تحميل الطلب الحالي من localStorage
function loadCurrentOrder() {
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
        try {
            currentOrder = JSON.parse(savedOrder);
            updateCart();
        } catch (e) {
            console.error('Error loading current order:', e);
        }
    }
}

// توليد رقم طلب جديد
function generateOrderNumber() {
    const sales = JSON.parse(localStorage.getItem('salesData')) || [];
    const orderCount = sales.length + openOrders.length + 1;
    const orderNumber = String(orderCount).padStart(4, '0');
    document.getElementById('orderNumber').textContent = `#${orderNumber}`;
    return orderNumber;
}

// تهيئة الطاولات
function initializeTables() {
    const tables = [];

    // طاولات خاصة مميزة
    tables.push({
        id: 101,
        name: 'النيابة',
        status: 'available',
        orderId: null,
        capacity: 8,
        isSpecial: true,
        specialType: 'vip'
    });

    tables.push({
        id: 102,
        name: 'الدكاترة',
        status: 'available',
        orderId: null,
        capacity: 8,
        isSpecial: true,
        specialType: 'vip'
    });

    // الطاولات العادية
    for (let i = 1; i <= 100; i++) {
        tables.push({
            id: i,
            name: `طاولة ${i}`,
            status: 'available',
            orderId: null,
            capacity: i <= 30 ? 4 : i <= 70 ? 6 : 8
        });
    }
    localStorage.setItem('tables', JSON.stringify(tables));
    return tables;
}

// تحديث الوقت
function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const dateStr = now.toLocaleDateString('ar-SA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    document.getElementById('headerTime').textContent = timeStr;
    document.getElementById('statusDate').textContent = dateStr;
    document.getElementById('statusTime').textContent = timeStr;
}

updateTime();
setInterval(updateTime, 1000);

// تحميل المنتجات
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    const filtered = currentCategory === 'all'
        ? products
        : products.filter(p => p.category === currentCategory);

    console.log('Loading products:', filtered.length, 'Category:', currentCategory);
    console.log('Total products:', products.length);
    console.log('Shisha products:', products.filter(p => p.category === 'shisha'));

    grid.innerHTML = filtered.map(product => {
        // استخدام الصورة فقط
        const imageHtml = `<img src="${product.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop'}" alt="${product.name}">`;

        return `
            <div class="product-card ${product.stock === 0 ? 'out-of-stock' : ''}" 
                 onclick="addToCart(${product.id})">
                <div class="product-image">
                    ${imageHtml}
                </div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price.toFixed(2)} ج.م</div>
            </div>
        `;
    }).join('');
}

// تصفية المنتجات
function filterProducts(category) {
    currentCategory = category;
    document.querySelectorAll('.category-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    loadProducts();
}

// البحث عن المنتجات
function searchProducts() {
    const search = document.getElementById('productSearch').value.toLowerCase();
    const grid = document.getElementById('productsGrid');

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search) &&
        (currentCategory === 'all' || p.category === currentCategory)
    );

    grid.innerHTML = filtered.map(product => {
        // استخدام الصورة فقط
        const imageHtml = `<img src="${product.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop'}" alt="${product.name}">`;

        return `
            <div class="product-card ${product.stock === 0 ? 'out-of-stock' : ''}" 
                 onclick="addToCart(${product.id})">
                <div class="product-image">
                    ${imageHtml}
                </div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price.toFixed(2)} ج.م</div>
            </div>
        `;
    }).join('');
}

// Product Options System
let selectedProductForOptions = null;

const productOptions = {
    'شاي': {
        sugar: {
            title: 'السكر',
            type: 'radio',
            required: true,
            options: ['زيادة', 'وسط', 'خفيف', 'ساده', 'سكر برا']
        }
    },
    'قهوة': {
        sugar: {
            title: 'السكر',
            type: 'radio',
            required: true,
            options: ['زيادة', 'وسط', 'خفيف', 'ساده', 'سكر برا']
        }
    },
    'كابتشينو': {
        sugar: {
            title: 'السكر',
            type: 'radio',
            required: true,
            options: ['زيادة', 'وسط', 'خفيف', 'ساده', 'سكر برا']
        }
    },
    'لاتيه': {
        sugar: {
            title: 'السكر',
            type: 'radio',
            required: true,
            options: ['زيادة', 'وسط', 'خفيف', 'ساده', 'سكر برا']
        }
    },
    'شيشة': {
        coal: {
            title: 'نوع الفحم',
            type: 'radio',
            required: true,
            options: ['فحم عادي', 'فحم كوكو', 'فحم سريع']
        },
        flavor: {
            title: 'النكهة',
            type: 'radio',
            required: false,
            options: ['عادي', 'سلوم', 'نعناع', 'ليمون', 'توت', 'تفاحتين', 'عنب', 'فواكه مشكلة']
        },
        extras: {
            title: 'إضافات',
            type: 'checkbox',
            required: false,
            options: ['ثلج', 'ليمون', 'نعناع طازج']
        }
    }
};

function getProductOptions(productName, productCategory, productId) {
    // Products without options (by ID)
    const productsWithoutOptions = [47, 48]; // ثلج شيشه، لاي فاخر

    if (productsWithoutOptions.includes(productId)) {
        return null;
    }

    // Check by category first (for shisha)
    if (productCategory === 'shisha' && productOptions['شيشة']) {
        return productOptions['شيشة'];
    }

    // Check by name for other products
    for (let key in productOptions) {
        if (productName.includes(key)) {
            return productOptions[key];
        }
    }
    return null;
}

// تم إزالة نظام الخيارات

// إضافة إلى السلة
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) {
        return;
    }

    const existingItem = currentOrder.items.find(item => item.id === productId);

    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            return;
        }
    } else {
        currentOrder.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCart();
    saveCurrentOrder();
}

// تحديث السلة
function updateCart() {
    const cartItems = document.getElementById('cartItems');

    if (currentOrder.items.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>لا توجد منتجات</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = currentOrder.items.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price.toFixed(2)} ج.م</p>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="decreaseQtyByIndex(${index})">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="increaseQtyByIndex(${index})">+</button>
                    <span class="item-total">${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-btn" onclick="removeItemByIndex(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    calculateTotals();
}

// زيادة الكمية بالـ index
function increaseQtyByIndex(index) {
    const item = currentOrder.items[index];
    const product = products.find(p => p.id === item.id);

    if (item && item.quantity < product.stock) {
        item.quantity++;
        updateCart();
        saveCurrentOrder();
    }
}

// تقليل الكمية بالـ index
function decreaseQtyByIndex(index) {
    const item = currentOrder.items[index];

    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            removeItemByIndex(index);
            return;
        }
        updateCart();
        saveCurrentOrder();
    }
}

// حذف منتج بالـ index
function removeItemByIndex(index) {
    currentOrder.items.splice(index, 1);
    updateCart();
    saveCurrentOrder();
}

// زيادة الكمية (old function for compatibility)
function increaseQty(productId) {
    const item = currentOrder.items.find(i => i.id === productId);
    const product = products.find(p => p.id === productId);

    if (item && item.quantity < product.stock) {
        item.quantity++;
        updateCart();
    }
}

// تقليل الكمية (old function)
function decreaseQty(productId) {
    const item = currentOrder.items.find(i => i.id === productId);

    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            removeItem(productId);
            return;
        }
        updateCart();
    }
}

// حذف منتج (old function)
function removeItem(productId) {
    currentOrder.items = currentOrder.items.filter(i => i.id !== productId);
    updateCart();
}

// حساب الإجماليات
function calculateTotals() {
    // الحصول على نسبة الضريبة من الإعدادات
    const shopSettings = JSON.parse(localStorage.getItem('shopSettings')) || {};
    const taxRate = shopSettings.taxRate ? parseFloat(shopSettings.taxRate) / 100 : 0.10;

    currentOrder.subtotal = currentOrder.items.reduce((sum, item) =>
        sum + (item.price * item.quantity), 0);
    currentOrder.tax = currentOrder.subtotal * taxRate;
    const discountAmount = currentOrder.subtotal * (currentOrder.discount / 100);
    currentOrder.total = currentOrder.subtotal + currentOrder.tax - discountAmount;

    document.getElementById('subtotal').textContent = currentOrder.subtotal.toFixed(2);
    document.getElementById('tax').textContent = currentOrder.tax.toFixed(2);
    document.getElementById('discount').textContent = discountAmount.toFixed(2);
    document.getElementById('grandTotal').textContent = currentOrder.total.toFixed(2);

    // تحديث شريط الحالة
    const itemsCount = currentOrder.items.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('statusItems').textContent = itemsCount;
    document.getElementById('statusTotal').textContent = `${currentOrder.total.toFixed(2)} ج.م`;
}

// تطبيق خصم
async function applyDiscount() {
    const { value: discount } = await Swal.fire({
        title: 'تطبيق خصم',
        input: 'number',
        inputLabel: 'أدخل نسبة الخصم (0-100)',
        inputPlaceholder: '0',
        inputAttributes: {
            min: 0,
            max: 100
        },
        showCancelButton: true,
        confirmButtonText: 'تطبيق',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#f59e0b'
    });

    if (discount !== undefined && discount >= 0 && discount <= 100) {
        currentOrder.discount = parseFloat(discount);
        calculateTotals();
        Swal.fire({
            icon: 'success',
            title: 'تم',
            text: `تم تطبيق خصم ${discount}%`,
            timer: 1500,
            showConfirmButton: false
        });
    }
}

// مسح السلة
async function clearCart() {
    if (currentOrder.items.length === 0) return;

    // مسح السلة مباشرة بدون تأكيد
    currentOrder.items = [];
    currentOrder.discount = 0;
    updateCart();
    saveCurrentOrder();
}

// تعليق الطلب
async function holdOrder() {
    if (currentOrder.items.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'تنبيه',
            text: 'لا توجد منتجات لتعليقها',
            confirmButtonColor: '#f59e0b'
        });
        return;
    }

    // تأكيد التعليق (تيك أواي)
    const result = await Swal.fire({
        title: 'تعليق الطلب (تيك أواي)',
        html: `
            <div style="text-align: center;">
                <p style="font-size: 1.1rem; margin-bottom: 1rem;">
                    هل تريد تعليق الطلب كـ <strong style="color: #f59e0b;">تيك أواي</strong>؟
                </p>
                <p style="color: #64748b;">
                    سيتم تحرير الطاولة ويمكنك العودة للطلب لاحقاً
                </p>
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#f59e0b',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'نعم، علق',
        cancelButtonText: 'إلغاء'
    });

    if (!result.isConfirmed) return;

    currentOrder.status = 'hold';
    openOrders.push({ ...currentOrder });
    localStorage.setItem('openOrders', JSON.stringify(openOrders));

    // تحرير الطاولة (لأن الطلب المعلق تيك أواي)
    const table = tables.find(t => t.id === currentOrder.tableId);
    if (table) {
        table.status = 'available'; // تحرير الطاولة
        table.orderId = null;
        localStorage.setItem('tables', JSON.stringify(tables));
    }

    // طلب جديد على طاولة أخرى
    const availableTable = tables.find(t => t.status === 'available');
    if (availableTable) {
        currentOrder = {
            id: Date.now(),
            tableId: availableTable.id,
            tableName: availableTable.name,
            items: [],
            subtotal: 0,
            tax: 0,
            discount: 0,
            total: 0,
            status: 'open',
            createdAt: new Date().toISOString()
        };
        updateTableNameDisplay(availableTable.name);
    } else {
        // إذا لم توجد طاولة متاحة، إنشاء طلب بدون طاولة
        currentOrder = {
            id: Date.now(),
            tableId: null,
            tableName: 'بدون طاولة',
            items: [],
            subtotal: 0,
            tax: 0,
            discount: 0,
            total: 0,
            status: 'open',
            createdAt: new Date().toISOString()
        };
        updateTableNameDisplay('بدون طاولة');
    }

    generateOrderNumber();
    updateCart();
    loadOpenOrders();

    Swal.fire({
        icon: 'success',
        title: 'تم التعليق',
        html: `
            <div style="text-align: center;">
                <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">
                    تم تعليق الطلب <strong style="color: #f59e0b;">(تيك أواي)</strong>
                </p>
                <p style="color: #64748b; font-size: 0.9rem;">
                    ${table ? `${table.name} أصبحت متاحة الآن` : 'يمكنك العودة للطلب من القائمة الجانبية'}
                </p>
            </div>
        `,
        timer: 2000,
        showConfirmButton: false
    });
}

// حفظ الطلب (الطاولة تبقى مشغولة)
async function saveOrder() {
    if (currentOrder.items.length === 0) {
        return;
    }

    // حفظ الطلب في openOrders
    currentOrder.status = 'hold';
    const existingIndex = openOrders.findIndex(o => o.id === currentOrder.id);
    if (existingIndex === -1) {
        openOrders.push({ ...currentOrder });
    } else {
        openOrders[existingIndex] = { ...currentOrder };
    }
    localStorage.setItem('openOrders', JSON.stringify(openOrders));

    // الطاولة تبقى مشغولة
    const table = tables.find(t => t.id === currentOrder.tableId);
    if (table) {
        table.status = 'occupied';
        table.orderId = currentOrder.id;
        localStorage.setItem('tables', JSON.stringify(tables));
    }

    // إنشاء طلب جديد فاضي على نفس الطاولة
    const savedTableId = currentOrder.tableId;
    const savedTableName = currentOrder.tableName;

    currentOrder = {
        id: Date.now(),
        tableId: savedTableId,
        tableName: savedTableName,
        items: [],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        status: 'open',
        createdAt: new Date().toISOString()
    };

    generateOrderNumber();
    updateCart();
    loadOpenOrders();
    saveCurrentOrder();
}

// اختيار طاولة جديدة (حفظ الطلب الحالي واختيار طاولة)
function selectNewTable() {
    // حفظ الطلب الحالي إذا كان فيه منتجات
    if (currentOrder.items.length > 0) {
        saveCurrentOrder();

        // حفظ الطلب في openOrders إذا لم يكن محفوظاً
        const existingIndex = openOrders.findIndex(o => o.id === currentOrder.id);
        if (existingIndex === -1) {
            openOrders.push({ ...currentOrder });
            localStorage.setItem('openOrders', JSON.stringify(openOrders));
        }

        console.log('✓ Current order saved. Table:', currentOrder.tableName, 'Items:', currentOrder.items.length);
    }

    // تعيين علامة للاختيار (ليس نقل)
    localStorage.setItem('tableAction', 'select');

    // الانتقال لصفحة الطاولات
    window.location.href = 'tables.html';
}

// تبديل الطاولة (نقل الأوردر الحالي)
async function transferTable() {
    // حفظ الطلب الحالي أولاً
    saveCurrentOrder();

    // تحديث currentOrder من localStorage للتأكد من أحدث البيانات
    const savedCurrentOrder = localStorage.getItem('currentOrder');
    if (savedCurrentOrder) {
        try {
            const tempOrder = JSON.parse(savedCurrentOrder);
            console.log('📦 Transfer - Current order:', tempOrder.tableId, 'Items:', tempOrder.items?.length || 0);

            if (!tempOrder || !tempOrder.items || tempOrder.items.length === 0) {
                console.warn('⚠️ No items in order');
                return;
            }
        } catch (e) {
            console.error('Error loading current order:', e);
            return;
        }
    }

    // تعيين علامة للنقل
    localStorage.setItem('tableAction', 'transfer');

    // الانتقال لصفحة الطاولات
    window.location.href = 'tables.html';
}

// طلب جديد
function newOrder() {
    currentOrder = {
        id: Date.now(),
        tableId: currentOrder.tableId,
        tableName: currentOrder.tableName,
        items: [],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        status: 'open',
        createdAt: new Date().toISOString()
    };
    generateOrderNumber();
    updateCart();
}

// تحميل الطلبات المفتوحة
function loadOpenOrders() {
    const ordersList = document.getElementById('ordersList');

    if (openOrders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 1rem;">لا توجد طلبات معلقة</p>';
        return;
    }

    ordersList.innerHTML = openOrders.map((order, index) => `
        <div class="order-item">
            <div onclick="loadOrder(${index})" style="cursor: pointer; flex: 1;">
                <div class="order-item-header">
                    <span>${order.tableName}</span>
                    <span>${order.total.toFixed(2)} ج.م</span>
                </div>
                <div class="order-item-details">
                    ${order.items.length} منتج • ${new Date(order.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
            <button onclick="cancelOrder(${index}); event.stopPropagation();" 
                    style="background: #ef4444; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.75rem; margin-top: 0.5rem;">
                <i class="fas fa-times"></i> إلغاء
            </button>
        </div>
    `).join('');
}

// إلغاء طلب معلق
async function cancelOrder(index) {
    const order = openOrders[index];

    // حذف الطلب مباشرة بدون تأكيد
    openOrders.splice(index, 1);
    localStorage.setItem('openOrders', JSON.stringify(openOrders));

    // تحرير الطاولة
    const table = tables.find(t => t.id === order.tableId);
    if (table) {
        table.status = 'available';
        table.orderId = null;
        localStorage.setItem('tables', JSON.stringify(tables));
    }

    loadOpenOrders();
}

// تحميل طلب
function loadOrder(index) {
    // حفظ الطلب الحالي إذا كان فيه منتجات
    if (currentOrder.items.length > 0) {
        // التحقق من أن الطلب الحالي ليس نفس الطلب المراد تحميله
        const orderToLoad = openOrders[index];
        if (currentOrder.id !== orderToLoad.id) {
            // حفظ الطلب الحالي
            currentOrder.status = 'hold';

            // التحقق من عدم وجود نسخة مكررة
            const existingIndex = openOrders.findIndex(o => o.id === currentOrder.id);
            if (existingIndex === -1) {
                openOrders.push({ ...currentOrder });
            } else {
                openOrders[existingIndex] = { ...currentOrder };
            }

            // إبقاء الطاولة الحالية مشغولة
            const currentTable = tables.find(t => t.id === currentOrder.tableId);
            if (currentTable) {
                currentTable.status = 'occupied';
                currentTable.orderId = currentOrder.id;
            }
        }
    }

    // تحميل الطلب المطلوب (بدون حذفه من القائمة)
    currentOrder = { ...openOrders[index] };

    // تحديث اسم الطاولة في الواجهة
    updateTableNameDisplay(currentOrder.tableName);

    // تحديث رقم الطلب
    const orderNum = String(currentOrder.id).slice(-4);
    document.getElementById('orderNumber').textContent = `#${orderNum}`;

    // حفظ التحديثات
    localStorage.setItem('openOrders', JSON.stringify(openOrders));
    localStorage.setItem('tables', JSON.stringify(tables));

    updateCart();
    loadOpenOrders();
}

// Numpad
function numpadInput(value) {
    // منع إدخال أكثر من نقطة واحدة
    if (value === '.' && numpadValue.includes('.')) {
        return;
    }

    // منع إدخال أكثر من 10 أرقام
    if (numpadValue.length >= 10) {
        return;
    }

    numpadValue += value;
    document.getElementById('numpadDisplay').value = numpadValue;

    // تأثير بصري
    const display = document.getElementById('numpadDisplay');
    display.style.transform = 'scale(1.05)';
    setTimeout(() => {
        display.style.transform = 'scale(1)';
    }, 100);
}

function numpadClear() {
    numpadValue = '';
    document.getElementById('numpadDisplay').value = '';

    // تأثير بصري
    const display = document.getElementById('numpadDisplay');
    display.style.background = '#fee2e2';
    setTimeout(() => {
        display.style.background = '#fdf6e3';
    }, 200);
}

// التحقق من إدخال الكيبورد
function validateNumpadInput(event) {
    const char = String.fromCharCode(event.which);
    const currentValue = event.target.value;

    // السماح فقط بالأرقام والنقطة
    if (!/[0-9.]/.test(char)) {
        event.preventDefault();
        return false;
    }

    // منع إدخال أكثر من نقطة واحدة
    if (char === '.' && currentValue.includes('.')) {
        event.preventDefault();
        return false;
    }

    // منع إدخال أكثر من 10 أحرف
    if (currentValue.length >= 10) {
        event.preventDefault();
        return false;
    }

    return true;
}

// معالجة إدخال الكيبورد
function handleNumpadKeyboard(event) {
    let value = event.target.value;

    // إزالة أي حرف غير رقم أو نقطة
    value = value.replace(/[^0-9.]/g, '');

    // التأكد من وجود نقطة واحدة فقط
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }

    // تحديد الطول الأقصى
    if (value.length > 10) {
        value = value.substring(0, 10);
    }

    // تحديث القيمة
    event.target.value = value;
    numpadValue = value;

    // تأثير بصري
    event.target.style.transform = 'scale(1.02)';
    setTimeout(() => {
        event.target.style.transform = 'scale(1)';
    }, 100);
}

// معالجة مفاتيح خاصة (Backspace, Delete, Enter, Escape)
function handleNumpadKeydown(event) {
    // Enter - تأكيد الدفع النقدي
    if (event.key === 'Enter') {
        event.preventDefault();
        if (currentOrder.items.length > 0 && numpadValue) {
            processPayment('cash');
        }
        return;
    }

    // Escape - مسح الحقل
    if (event.key === 'Escape') {
        event.preventDefault();
        numpadClear();
        return;
    }

    // السماح بمفاتيح التحكم
    const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
    if (controlKeys.includes(event.key)) {
        return true;
    }
}

// معالجة الدفع
async function processPayment(method) {
    if (currentOrder.items.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'تنبيه',
            text: 'لا توجد منتجات في السلة',
            confirmButtonColor: '#f59e0b'
        });
        return;
    }

    let received = 0;

    if (method === 'cash') {
        // استخدام القيمة من Numpad
        if (numpadValue && numpadValue !== '') {
            received = parseFloat(numpadValue);

            // التحقق من أن المبلغ كافي
            if (received < currentOrder.total) {
                const shortage = currentOrder.total - received;
                Swal.fire({
                    icon: 'error',
                    title: 'المبلغ غير كافٍ',
                    html: `
                        <div style="text-align: center; padding: 1rem;">
                            <div style="background: #fee2e2; padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                                <p style="color: #991b1b; font-size: 1.1rem; margin-bottom: 0.5rem;">
                                    <strong>المطلوب:</strong> ${currentOrder.total.toFixed(2)} ج.م
                                </p>
                                <p style="color: #991b1b; font-size: 1.1rem; margin-bottom: 0.5rem;">
                                    <strong>المستلم:</strong> ${received.toFixed(2)} ج.م
                                </p>
                                <hr style="margin: 1rem 0; border-color: #fca5a5;">
                                <p style="color: #7f1d1d; font-size: 1.3rem; font-weight: bold;">
                                    <strong>الناقص:</strong> ${shortage.toFixed(2)} ج.م
                                </p>
                            </div>
                        </div>
                    `,
                    confirmButtonColor: '#ef4444',
                    confirmButtonText: 'حسناً'
                });
                return;
            }

            // عرض الباقي للتأكيد
            const change = received - currentOrder.total;
            const result = await Swal.fire({
                title: 'تأكيد الدفع النقدي',
                html: `
                    <div style="text-align: center; padding: 1rem;">
                        <div style="background: #f0fdf4; padding: 1.5rem; border-radius: 0.5rem;">
                            <p style="color: #166534; font-size: 1.1rem; margin-bottom: 0.5rem;">
                                <strong>الإجمالي:</strong> ${currentOrder.total.toFixed(2)} ج.م
                            </p>
                            <p style="color: #166534; font-size: 1.1rem; margin-bottom: 0.5rem;">
                                <strong>المستلم:</strong> ${received.toFixed(2)} ج.م
                            </p>
                            <hr style="margin: 1rem 0; border-color: #86efac;">
                            <p style="color: #15803d; font-size: 1.5rem; font-weight: bold;">
                                <strong>الباقي:</strong> ${change.toFixed(2)} ج.م
                            </p>
                        </div>
                    </div>
                `,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#64748b',
                confirmButtonText: '✓ تأكيد الدفع',
                cancelButtonText: '✗ إلغاء'
            });

            if (!result.isConfirmed) return;

        } else {
            // إذا لم يتم إدخال مبلغ في Numpad، اطلبه
            const { value } = await Swal.fire({
                title: 'المبلغ المستلم',
                html: `
                    <p style="font-size: 1.2rem; margin-bottom: 1rem;">
                        الإجمالي المطلوب: <strong style="color: #10b981;">${currentOrder.total.toFixed(2)} ج.م</strong>
                    </p>
                `,
                input: 'number',
                inputPlaceholder: 'أدخل المبلغ المستلم',
                inputAttributes: {
                    min: 0,
                    step: 0.01
                },
                showCancelButton: true,
                confirmButtonText: 'تأكيد',
                cancelButtonText: 'إلغاء',
                confirmButtonColor: '#10b981',
                inputValidator: (value) => {
                    if (!value) {
                        return 'الرجاء إدخال المبلغ!';
                    }
                    if (parseFloat(value) < currentOrder.total) {
                        return `المبلغ غير كافٍ! الناقص: ${(currentOrder.total - parseFloat(value)).toFixed(2)} ج.م`;
                    }
                }
            });

            if (!value) return;
            received = parseFloat(value);
        }
    } else {
        // للبطاقة والمحفظة، استخدام Numpad أو طلب المبلغ
        const methodName = method === 'card' ? 'البطاقة' : 'المحفظة الإلكترونية';

        if (numpadValue && numpadValue !== '') {
            received = parseFloat(numpadValue);
        } else {
            // طلب المبلغ المستلم
            const { value } = await Swal.fire({
                title: `المبلغ المستلم - ${methodName}`,
                html: `
                    <p style="font-size: 1.2rem; margin-bottom: 1rem;">
                        الإجمالي المطلوب: <strong style="color: #2563eb;">${currentOrder.total.toFixed(2)} ج.م</strong>
                    </p>
                `,
                input: 'number',
                inputValue: currentOrder.total.toFixed(2),
                inputPlaceholder: 'أدخل المبلغ المستلم',
                inputAttributes: {
                    min: 0,
                    step: 0.01
                },
                showCancelButton: true,
                confirmButtonText: 'تأكيد',
                cancelButtonText: 'إلغاء',
                confirmButtonColor: '#2563eb',
                inputValidator: (value) => {
                    if (!value) {
                        return 'الرجاء إدخال المبلغ!';
                    }
                    const amount = parseFloat(value);
                    if (amount < currentOrder.total) {
                        return `المبلغ غير كافٍ! الناقص: ${(currentOrder.total - amount).toFixed(2)} ج.م`;
                    }
                }
            });

            if (!value) return;
            received = parseFloat(value);
        }

        // التحقق من أن المبلغ كافي
        if (received < currentOrder.total) {
            const shortage = currentOrder.total - received;
            Swal.fire({
                icon: 'error',
                title: 'المبلغ غير كافٍ',
                html: `
                    <div style="text-align: center; padding: 1rem;">
                        <div style="background: #fee2e2; padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                            <p style="color: #991b1b; font-size: 1.1rem; margin-bottom: 0.5rem;">
                                <strong>المطلوب:</strong> ${currentOrder.total.toFixed(2)} ج.م
                            </p>
                            <p style="color: #991b1b; font-size: 1.1rem; margin-bottom: 0.5rem;">
                                <strong>المستلم:</strong> ${received.toFixed(2)} ج.م
                            </p>
                            <hr style="margin: 1rem 0; border-color: #fca5a5;">
                            <p style="color: #7f1d1d; font-size: 1.3rem; font-weight: bold;">
                                <strong>الناقص:</strong> ${shortage.toFixed(2)} ج.م
                            </p>
                        </div>
                        <p style="color: #64748b; font-size: 0.9rem;">
                            الرجاء التأكد من المبلغ المدفوع بـ${methodName}
                        </p>
                    </div>
                `,
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'حسناً'
            });
            return;
        }

        // تأكيد الدفع
        const result = await Swal.fire({
            title: `تأكيد الدفع بـ${methodName}`,
            html: `
                <div style="text-align: center; padding: 1rem;">
                    <div style="background: #eff6ff; padding: 1.5rem; border-radius: 0.5rem;">
                        <p style="color: #1e40af; font-size: 1.1rem; margin-bottom: 0.5rem;">
                            <strong>الإجمالي:</strong> ${currentOrder.total.toFixed(2)} ج.م
                        </p>
                        <p style="color: #1e40af; font-size: 1.1rem; margin-bottom: 0.5rem;">
                            <strong>المبلغ المستلم:</strong> ${received.toFixed(2)} ج.م
                        </p>
                        ${received > currentOrder.total ? `
                        <p style="color: #10b981; font-size: 1rem; margin-top: 0.5rem;">
                            <strong>الباقي:</strong> ${(received - currentOrder.total).toFixed(2)} ج.م
                        </p>
                        ` : ''}
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#64748b',
            confirmButtonText: '✓ تأكيد',
            cancelButtonText: '✗ إلغاء'
        });

        if (!result.isConfirmed) return;
    }

    // معالجة الدفع
    Swal.fire({
        title: 'جاري معالجة الدفع...',
        html: '<div style="padding: 2rem;"><i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #10b981;"></i></div>',
        allowOutsideClick: false,
        showConfirmButton: false
    });

    setTimeout(() => {
        completePayment(method, received);
    }, 1000);
}

// إتمام الدفع
function completePayment(method, received) {
    // تحديث المخزون
    currentOrder.items.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            product.stock -= item.quantity;
        }
    });
    localStorage.setItem('products', JSON.stringify(products));

    // حفظ البيع
    const sale = {
        ...currentOrder,
        paymentMethod: method,
        cashReceived: received,
        change: method === 'cash' ? received - currentOrder.total : 0,
        cashier: currentUser.name,
        completedAt: new Date().toISOString()
    };

    const sales = JSON.parse(localStorage.getItem('salesData')) || [];
    sales.push(sale);
    localStorage.setItem('salesData', JSON.stringify(sales));

    // حذف الطلب من القائمة المعلقة إذا كان موجوداً
    const orderIndex = openOrders.findIndex(o => o.id === currentOrder.id);
    if (orderIndex !== -1) {
        openOrders.splice(orderIndex, 1);
        localStorage.setItem('openOrders', JSON.stringify(openOrders));
    }

    // تحرير الطاولة
    const table = tables.find(t => t.id === currentOrder.tableId);
    if (table) {
        table.status = 'available';
        table.orderId = null;
        localStorage.setItem('tables', JSON.stringify(tables));
    }

    Swal.close();

    // عرض الفاتورة
    showReceipt(sale);

    // إنشاء طلب جديد نظيف تماماً
    currentOrder = {
        id: Date.now(),
        tableId: 1,
        tableName: 'طاولة 1',
        items: [],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        status: 'open',
        createdAt: new Date().toISOString()
    };

    // مسح الطلب الحالي من localStorage
    localStorage.removeItem('currentOrder');

    // تحديث الواجهة
    updateTableNameDisplay('طاولة 1');

    // توليد رقم طلب جديد
    generateOrderNumber();

    numpadClear();
    updateCart();
    loadProducts();
    loadOpenOrders(); // تحديث قائمة الطلبات المعلقة
}

// عرض الفاتورة
function showReceipt(sale) {
    const itemsHTML = sale.items.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>${item.name} × ${item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)} ج.م</span>
        </div>
    `).join('');

    const paymentMethodAr = {
        'cash': 'نقدي',
        'card': 'بطاقة',
        'mobile': 'محفظة إلكترونية'
    };

    Swal.fire({
        title: 'فاتورة البيع',
        html: `
            <div style="text-align: right; padding: 1rem;">
                <div style="text-align: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 2px dashed #e2e8f0;">
                    <h3>مقهى القهوة الطازجة</h3>
                    <p style="font-size: 0.9rem; color: #64748b;">شارع الملك فهد، الرياض</p>
                    <p style="font-size: 0.9rem; color: #64748b;">هاتف: 0112345678</p>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <p><strong>رقم الفاتورة:</strong> ${sale.id}</p>
                    <p><strong>التاريخ:</strong> ${new Date(sale.completedAt).toLocaleString('ar-SA')}</p>
                    <p><strong>الطاولة:</strong> ${sale.tableName}</p>
                    <p><strong>الكاشير:</strong> ${sale.cashier}</p>
                    <p><strong>طريقة الدفع:</strong> ${paymentMethodAr[sale.paymentMethod]}</p>
                </div>
                
                <div style="margin-bottom: 1rem; padding: 1rem; background: #f8fafc; border-radius: 0.5rem;">
                    ${itemsHTML}
                </div>
                
                <div style="border-top: 2px solid #e2e8f0; padding-top: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>المجموع الفرعي:</span>
                        <span>${sale.subtotal.toFixed(2)} ج.م</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>الضريبة:</span>
                        <span>${sale.tax.toFixed(2)} ج.م</span>
                    </div>
                    ${sale.discount > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #ef4444;">
                        <span>الخصم:</span>
                        <span>-${(sale.subtotal * sale.discount / 100).toFixed(2)} ج.م</span>
                    </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; font-size: 1.3rem; font-weight: bold; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 2px solid #1e293b;">
                        <span>الإجمالي:</span>
                        <span style="color: #10b981;">${sale.total.toFixed(2)} ج.م</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
                        <span>المبلغ المستلم:</span>
                        <span>${sale.cashReceived.toFixed(2)} ج.م</span>
                    </div>
                    ${sale.paymentMethod === 'cash' && sale.change > 0 ? `
                    <div style="display: flex; justify-content: space-between;">
                        <span>الباقي:</span>
                        <span style="color: #10b981; font-weight: bold;">${sale.change.toFixed(2)} ج.م</span>
                    </div>
                    ` : ''}
                </div>
                
                <div style="text-align: center; margin-top: 1rem; padding-top: 1rem; border-top: 2px dashed #e2e8f0; color: #64748b;">
                    <p>شكراً لزيارتكم</p>
                    <p>نتمنى رؤيتكم مرة أخرى</p>
                </div>
            </div>
        `,
        width: 500,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-print"></i> طباعة',
        cancelButtonText: 'إغلاق',
        confirmButtonColor: '#2563eb'
    }).then((result) => {
        if (result.isConfirmed) {
            printReceipt(sale);
        }
    });
}

// عرض الطاولات
function showTables() {
    document.getElementById('tablesModal').style.display = 'block';
    loadTablesGrid();
}

function closeTablesModal() {
    document.getElementById('tablesModal').style.display = 'none';
}

function loadTablesGrid() {
    const grid = document.getElementById('tablesGrid');

    grid.innerHTML = tables.map(table => {
        const statusText = {
            'available': 'متاحة',
            'occupied': 'مشغولة',
            'reserved': 'محجوزة'
        };

        return `
            <div class="table-card ${table.status}" onclick="selectTable(${table.id})">
                <i class="fas fa-chair"></i>
                <div class="table-name">${table.name}</div>
                <div class="table-status">${statusText[table.status]}</div>
                <div class="table-info">${table.capacity} أشخاص</div>
            </div>
        `;
    }).join('');
}

// اختيار طاولة
async function selectTable(tableId) {
    const table = tables.find(t => t.id === tableId);

    // إذا كانت الطاولة مشغولة، اسأل المستخدم
    if (table.status === 'occupied') {
        const result = await Swal.fire({
            title: `${table.name} مشغولة`,
            html: `
                <div style="text-align: center; padding: 1rem;">
                    <p style="font-size: 1.1rem; margin-bottom: 1rem;">
                        هذه الطاولة عليها طلب حالياً
                    </p>
                    <p style="color: #64748b;">
                        هل تريد فتح الطلب الموجود؟
                    </p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonColor: '#10b981',
            denyButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: '✓ فتح الطلب',
            denyButtonText: '✗ إلغاء الطلب',
            cancelButtonText: 'رجوع'
        });

        if (result.isConfirmed) {
            // فتح الطلب الموجود
            loadTableOrder(tableId);
            closeTablesModal();
            return;
        } else if (result.isDenied) {
            // إلغاء الطلب وتحرير الطاولة
            const confirmCancel = await Swal.fire({
                title: 'تأكيد الإلغاء',
                text: 'هل أنت متأكد من إلغاء الطلب على هذه الطاولة؟',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#64748b',
                confirmButtonText: 'نعم، ألغي',
                cancelButtonText: 'لا'
            });

            if (confirmCancel.isConfirmed) {
                table.status = 'available';
                table.orderId = null;
                localStorage.setItem('tables', JSON.stringify(tables));
                loadTablesGrid();

                Swal.fire({
                    icon: 'success',
                    title: 'تم الإلغاء',
                    text: `تم إلغاء الطلب وتحرير ${table.name}`,
                    timer: 1500,
                    showConfirmButton: false
                });
            }
            return;
        } else {
            return;
        }
    }

    // إذا كانت الطاولة متاحة
    // حفظ الطلب الحالي إذا كان فيه منتجات
    if (currentOrder.items.length > 0) {
        const saveResult = await Swal.fire({
            title: 'حفظ الطلب الحالي؟',
            html: `
                <div style="text-align: center;">
                    <p style="font-size: 1.1rem; margin-bottom: 1rem;">
                        لديك طلب حالي على <strong>${currentOrder.tableName}</strong>
                    </p>
                    <p style="color: #64748b;">
                        هل تريد حفظه قبل الانتقال؟
                    </p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonColor: '#10b981',
            denyButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'نعم، احفظ',
            denyButtonText: 'لا، امسح',
            cancelButtonText: 'إلغاء'
        });

        if (saveResult.isConfirmed) {
            // حفظ الطلب الحالي وإبقاء الطاولة مشغولة
            currentOrder.status = 'hold';

            // التحقق من عدم وجود نسخة مكررة
            const existingIndex = openOrders.findIndex(o => o.id === currentOrder.id);
            if (existingIndex === -1) {
                openOrders.push({ ...currentOrder });
            } else {
                openOrders[existingIndex] = { ...currentOrder };
            }

            localStorage.setItem('openOrders', JSON.stringify(openOrders));

            // إبقاء الطاولة القديمة مشغولة
            const oldTable = tables.find(t => t.id === currentOrder.tableId);
            if (oldTable) {
                oldTable.status = 'occupied';
                oldTable.orderId = currentOrder.id;
                localStorage.setItem('tables', JSON.stringify(tables));
            }

            loadOpenOrders();
        } else if (saveResult.isDenied) {
            // مسح الطلب الحالي وتحرير الطاولة القديمة
            const oldTable = tables.find(t => t.id === currentOrder.tableId);
            if (oldTable) {
                oldTable.status = 'available';
                oldTable.orderId = null;
                localStorage.setItem('tables', JSON.stringify(tables));
            }
        } else {
            return;
        }
    } else if (currentOrder.items.length === 0) {
        // تحرير الطاولة القديمة إذا كان الطلب فارغاً
        const oldTable = tables.find(t => t.id === currentOrder.tableId);
        if (oldTable && oldTable.id !== tableId) {
            oldTable.status = 'available';
            oldTable.orderId = null;
            localStorage.setItem('tables', JSON.stringify(tables));
        }
    }

    // إنشاء طلب جديد للطاولة الجديدة
    currentOrder = {
        id: Date.now(),
        tableId: table.id,
        tableName: table.name,
        items: [],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        status: 'open',
        createdAt: new Date().toISOString()
    };

    table.status = 'occupied';
    table.orderId = currentOrder.id;

    localStorage.setItem('tables', JSON.stringify(tables));

    updateTableNameDisplay(table.name);

    // توليد رقم طلب جديد
    generateOrderNumber();

    updateCart();
    closeTablesModal();

    Swal.fire({
        icon: 'success',
        title: 'تم الاختيار',
        text: `تم اختيار ${table.name}`,
        timer: 1500,
        showConfirmButton: false
    });
}

// تحميل طلب من طاولة مشغولة
function loadTableOrder(tableId) {
    const table = tables.find(t => t.id === tableId);

    // البحث عن الطلب في الطلبات المفتوحة
    const orderIndex = openOrders.findIndex(order => order.tableId === tableId);

    if (orderIndex !== -1) {
        // حفظ الطلب الحالي إذا كان فيه منتجات
        if (currentOrder.items.length > 0 && currentOrder.id !== openOrders[orderIndex].id) {
            currentOrder.status = 'hold';
            const existingIndex = openOrders.findIndex(o => o.id === currentOrder.id);
            if (existingIndex === -1) {
                openOrders.push({ ...currentOrder });
            } else {
                openOrders[existingIndex] = { ...currentOrder };
            }

            // إبقاء الطاولة الحالية مشغولة
            const currentTable = tables.find(t => t.id === currentOrder.tableId);
            if (currentTable) {
                currentTable.status = 'occupied';
                currentTable.orderId = currentOrder.id;
            }
        }

        // تحميل الطلب من الطلبات المفتوحة (بدون حذفه)
        currentOrder = { ...openOrders[orderIndex] };

        localStorage.setItem('openOrders', JSON.stringify(openOrders));
        localStorage.setItem('tables', JSON.stringify(tables));
        loadOpenOrders();
    } else {
        // إنشاء طلب جديد لهذه الطاولة
        currentOrder = {
            id: Date.now(),
            tableId: table.id,
            tableName: table.name,
            items: [],
            subtotal: 0,
            tax: 0,
            discount: 0,
            total: 0,
            status: 'open',
            createdAt: new Date().toISOString()
        };
    }

    updateTableNameDisplay(table.name);

    updateCart();

    Swal.fire({
        icon: 'success',
        title: 'تم فتح الطلب',
        text: `تم فتح طلب ${table.name}`,
        timer: 1500,
        showConfirmButton: false
    });
}

// تغيير الطاولة
function changeTable() {
    if (currentOrder.items.length === 0) {
        showTables();
        return;
    }

    document.getElementById('changeTableModal').style.display = 'block';
    loadChangeTableGrid();
}

function closeChangeTableModal() {
    document.getElementById('changeTableModal').style.display = 'none';
}

function loadChangeTableGrid() {
    const grid = document.getElementById('changeTableGrid');

    if (!grid) {
        console.error('changeTableGrid element not found!');
        return;
    }

    // عرض الطاولات المتاحة فقط (بدون الطاولة الحالية)
    const availableTables = tables.filter(t => t.status === 'available' && t.id !== currentOrder.tableId);

    console.log('Current table ID:', currentOrder.tableId);
    console.log('Available tables:', availableTables.length);
    console.log('Tables:', availableTables.map(t => `${t.name} (${t.status})`));

    if (availableTables.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #64748b; padding: 2rem;">لا توجد طاولات متاحة للنقل</p>';
        return;
    }

    grid.innerHTML = availableTables.map(table => `
        <div class="table-card available" onclick="moveToTable(${table.id})">
            <i class="fas fa-chair"></i>
            <div class="table-name">${table.name}</div>
        </div>
    `).join('');
}

// نقل إلى طاولة
async function moveToTable(newTableId) {
    const oldTable = tables.find(t => t.id === currentOrder.tableId);
    const newTable = tables.find(t => t.id === newTableId);

    if (!oldTable || !newTable) {
        console.error('Table not found:', { oldTable, newTable });
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'لم يتم العثور على الطاولة',
            confirmButtonColor: '#ef4444'
        });
        return;
    }

    // إذا كانت نفس الطاولة، لا تفعل شيء
    if (oldTable.id === newTable.id) {
        closeChangeTableModal();
        return;
    }

    // تأكيد النقل
    const result = await Swal.fire({
        title: 'تأكيد النقل',
        html: `
            <div style="text-align: center; padding: 1rem;">
                <p style="font-size: 1.1rem; margin-bottom: 1rem;">
                    هل تريد نقل الطلب من <strong style="color: #ef4444;">${oldTable.name}</strong> 
                    إلى <strong style="color: #10b981;">${newTable.name}</strong>؟
                </p>
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'نعم، انقل',
        cancelButtonText: 'إلغاء'
    });

    if (!result.isConfirmed) return;

    // تحرير الطاولة القديمة
    oldTable.status = 'available';
    oldTable.orderId = null;

    // حجز الطاولة الجديدة
    currentOrder.tableId = newTable.id;
    currentOrder.tableName = newTable.name;
    newTable.status = 'occupied';
    newTable.orderId = currentOrder.id;

    // تحديث الطلب في القائمة المفتوحة إذا كان موجوداً
    const orderIndex = openOrders.findIndex(o => o.id === currentOrder.id);
    if (orderIndex !== -1) {
        openOrders[orderIndex].tableId = newTable.id;
        openOrders[orderIndex].tableName = newTable.name;
        localStorage.setItem('openOrders', JSON.stringify(openOrders));
        console.log('✓ Updated saved order table:', newTable.name);
    }

    localStorage.setItem('tables', JSON.stringify(tables));
    loadOpenOrders(); // تحديث قائمة الطلبات المعلقة

    updateTableNameDisplay(newTable.name);

    closeChangeTableModal();

    Swal.fire({
        icon: 'success',
        title: 'تم النقل بنجاح',
        html: `
            <div style="text-align: center;">
                <p style="font-size: 1.1rem;">
                    تم نقل الطلب إلى <strong style="color: #10b981;">${newTable.name}</strong>
                </p>
                <p style="color: #64748b; margin-top: 0.5rem;">
                    ${oldTable.name} أصبحت متاحة الآن
                </p>
            </div>
        `,
        timer: 2000,
        showConfirmButton: false
    });
}

// إغلاق الشيفت
async function closeShift() {
    // الحصول على بيانات المستخدم الحالي
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // الحصول على وقت بداية الشيفت
    const shiftStartTime = new Date(currentUser.loginTime);
    const shiftEndTime = new Date();
    const shiftDuration = Math.floor((shiftEndTime - shiftStartTime) / 1000 / 60); // بالدقائق

    // الحصول على مبيعات الكاشير في هذا الشيفت
    const allSales = JSON.parse(localStorage.getItem('salesData')) || [];
    const shiftSales = allSales.filter(sale =>
        sale.cashier === currentUser.name &&
        new Date(sale.completedAt) >= shiftStartTime
    );

    // حساب الإحصائيات
    const totalSales = shiftSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalInvoices = shiftSales.length;
    const totalItems = shiftSales.reduce((sum, sale) =>
        sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    // حساب المبيعات حسب طريقة الدفع
    const paymentMethods = {
        cash: { count: 0, total: 0 },
        card: { count: 0, total: 0 },
        mobile: { count: 0, total: 0 }
    };

    shiftSales.forEach(sale => {
        if (paymentMethods[sale.paymentMethod]) {
            paymentMethods[sale.paymentMethod].count++;
            paymentMethods[sale.paymentMethod].total += sale.total;
        }
    });

    // عرض تقرير الشيفت
    const result = await Swal.fire({
        title: 'تقرير إغلاق الشيفت',
        html: `
            <div style="text-align: right; padding: 1rem; max-height: 70vh; overflow-y: auto;">
                <div style="background: #f0f9ff; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 2px solid #0ea5e9;">
                    <h3 style="color: #0369a1; margin-bottom: 0.5rem;">معلومات الشيفت</h3>
                    <p style="margin: 0.25rem 0;"><strong>الكاشير:</strong> ${currentUser.name}</p>
                    <p style="margin: 0.25rem 0;"><strong>بداية الشيفت:</strong> ${shiftStartTime.toLocaleString('ar-SA')}</p>
                    <p style="margin: 0.25rem 0;"><strong>نهاية الشيفت:</strong> ${shiftEndTime.toLocaleString('ar-SA')}</p>
                    <p style="margin: 0.25rem 0;"><strong>مدة الشيفت:</strong> ${Math.floor(shiftDuration / 60)} ساعة و ${shiftDuration % 60} دقيقة</p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1rem;">
                    <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem; text-align: center; border: 2px solid #10b981;">
                        <p style="color: #15803d; font-size: 0.85rem; margin-bottom: 0.5rem;">إجمالي المبيعات</p>
                        <p style="color: #166534; font-size: 1.5rem; font-weight: bold; margin: 0;">${totalSales.toFixed(2)} ج.م</p>
                    </div>
                    <div style="background: #eff6ff; padding: 1rem; border-radius: 0.5rem; text-align: center; border: 2px solid #3b82f6;">
                        <p style="color: #1e40af; font-size: 0.85rem; margin-bottom: 0.5rem;">عدد الفواتير</p>
                        <p style="color: #1e3a8a; font-size: 1.5rem; font-weight: bold; margin: 0;">${totalInvoices}</p>
                    </div>
                    <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; text-align: center; border: 2px solid #f59e0b;">
                        <p style="color: #92400e; font-size: 0.85rem; margin-bottom: 0.5rem;">المنتجات المباعة</p>
                        <p style="color: #78350f; font-size: 1.5rem; font-weight: bold; margin: 0;">${totalItems}</p>
                    </div>
                </div>

                <div style="background: #fafafa; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <h4 style="color: #3e2723; margin-bottom: 0.75rem; border-bottom: 2px solid #d7ccc8; padding-bottom: 0.5rem;">
                        <i class="fas fa-credit-card"></i> المبيعات حسب طريقة الدفع
                    </h4>
                    <div style="display: grid; gap: 0.5rem;">
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: white; border-radius: 0.25rem;">
                            <span><i class="fas fa-money-bill-wave" style="color: #10b981;"></i> نقدي (${paymentMethods.cash.count} فاتورة)</span>
                            <span style="font-weight: bold; color: #10b981;">${paymentMethods.cash.total.toFixed(2)} ج.م</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: white; border-radius: 0.25rem;">
                            <span><i class="fas fa-credit-card" style="color: #3b82f6;"></i> بطاقة (${paymentMethods.card.count} فاتورة)</span>
                            <span style="font-weight: bold; color: #3b82f6;">${paymentMethods.card.total.toFixed(2)} ج.م</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: white; border-radius: 0.25rem;">
                            <span><i class="fas fa-mobile-alt" style="color: #8b5cf6;"></i> محفظة (${paymentMethods.mobile.count} فاتورة)</span>
                            <span style="font-weight: bold; color: #8b5cf6;">${paymentMethods.mobile.total.toFixed(2)} ج.م</span>
                        </div>
                    </div>
                </div>

                <div style="background: #fef2f2; padding: 1rem; border-radius: 0.5rem; border: 2px solid #fca5a5;">
                    <p style="color: #991b1b; text-align: center; margin: 0;">
                        <i class="fas fa-exclamation-triangle"></i> 
                        <strong>تحذير:</strong> سيتم تسجيل خروجك بعد إغلاق الشيفت
                    </p>
                </div>
            </div>
        `,
        width: 700,
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: '<i class="fas fa-print"></i> طباعة وإغلاق',
        denyButtonText: '<i class="fas fa-door-open"></i> إغلاق فقط',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#8b4513',
        denyButtonColor: '#f59e0b',
        cancelButtonColor: '#64748b'
    });

    if (result.isConfirmed) {
        // طباعة التقرير ثم تسجيل الخروج
        printShiftReport(currentUser, shiftStartTime, shiftEndTime, shiftDuration, shiftSales, totalSales, totalInvoices, totalItems, paymentMethods);
        setTimeout(() => {
            performLogout();
        }, 500);
    } else if (result.isDenied) {
        // تسجيل الخروج مباشرة
        performLogout();
    }
}

// طباعة تقرير الشيفت
function printShiftReport(user, startTime, endTime, duration, sales, totalSales, totalInvoices, totalItems, paymentMethods) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>تقرير إغلاق الشيفت - ${user.name}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', 'Cairo', Tahoma, sans-serif; padding: 20px; direction: rtl; }
                .header { text-align: center; border-bottom: 3px solid #8b4513; padding-bottom: 20px; margin-bottom: 30px; }
                .header h1 { color: #8b4513; font-size: 28px; margin-bottom: 10px; }
                .info-box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 2px solid #8b4513; }
                .info-box h3 { color: #8b4513; margin-bottom: 10px; }
                .info-box p { margin: 5px 0; }
                .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px; }
                .stat-box { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #8b4513; }
                .stat-box h4 { color: #666; font-size: 12px; margin-bottom: 8px; }
                .stat-box .value { color: #8b4513; font-size: 24px; font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th { background: #8b4513; color: white; padding: 10px; text-align: right; border: 1px solid #6d3410; }
                td { padding: 8px; border: 1px solid #ddd; }
                tr:nth-child(even) { background: #f8f9fa; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px dashed #d7ccc8; color: #666; }
                @media print { body { padding: 0; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>مقهى القهوة الطازجة</h1>
                <p>تقرير إغلاق الشيفت</p>
            </div>
            
            <div class="info-box">
                <h3>معلومات الشيفت</h3>
                <p><strong>الكاشير:</strong> ${user.name}</p>
                <p><strong>بداية الشيفت:</strong> ${startTime.toLocaleString('ar-SA')}</p>
                <p><strong>نهاية الشيفت:</strong> ${endTime.toLocaleString('ar-SA')}</p>
                <p><strong>مدة الشيفت:</strong> ${Math.floor(duration / 60)} ساعة و ${duration % 60} دقيقة</p>
            </div>
            
            <div class="stats">
                <div class="stat-box">
                    <h4>إجمالي المبيعات</h4>
                    <div class="value">${totalSales.toFixed(2)} ج.م</div>
                </div>
                <div class="stat-box">
                    <h4>عدد الفواتير</h4>
                    <div class="value">${totalInvoices}</div>
                </div>
                <div class="stat-box">
                    <h4>المنتجات المباعة</h4>
                    <div class="value">${totalItems}</div>
                </div>
            </div>
            
            <h3 style="margin-bottom: 10px;">المبيعات حسب طريقة الدفع</h3>
            <table>
                <tr>
                    <th>طريقة الدفع</th>
                    <th style="text-align: center;">عدد الفواتير</th>
                    <th style="text-align: left;">المبلغ</th>
                </tr>
                <tr>
                    <td>نقدي</td>
                    <td style="text-align: center;">${paymentMethods.cash.count}</td>
                    <td style="text-align: left; font-weight: bold;">${paymentMethods.cash.total.toFixed(2)} ج.م</td>
                </tr>
                <tr>
                    <td>بطاقة</td>
                    <td style="text-align: center;">${paymentMethods.card.count}</td>
                    <td style="text-align: left; font-weight: bold;">${paymentMethods.card.total.toFixed(2)} ج.م</td>
                </tr>
                <tr>
                    <td>محفظة إلكترونية</td>
                    <td style="text-align: center;">${paymentMethods.mobile.count}</td>
                    <td style="text-align: left; font-weight: bold;">${paymentMethods.mobile.total.toFixed(2)} ج.م</td>
                </tr>
            </table>
            
            <div class="footer">
                <p>تم إنشاء هذا التقرير تلقائياً</p>
                <p style="margin-top: 5px; font-size: 12px;">تاريخ الطباعة: ${new Date().toLocaleString('ar-SA')}</p>
            </div>
            
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// دالة مساعدة لتسجيل الخروج
function performLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// تسجيل الخروج
async function logout() {
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
        performLogout();
    }
}

// طباعة الفاتورة - Dual Receipt Printing System
function printReceipt(sale) {
    // طباعة فاتورة الكاشير فقط
    console.log('🖨️ Printing cashier receipt for order:', sale.id);

    const itemsHTML = sale.items.map(item => `
        <tr>
            <td style="padding: 0.5rem; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
            <td style="padding: 0.5rem; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
            <td style="padding: 0.5rem; border-bottom: 1px solid #e2e8f0; text-align: left;">${item.price.toFixed(2)}</td>
            <td style="padding: 0.5rem; border-bottom: 1px solid #e2e8f0; text-align: left;">${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    const paymentMethodAr = {
        'cash': 'نقدي',
        'card': 'بطاقة',
        'mobile': 'محفظة إلكترونية'
    };

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>فاتورة #${sale.id}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Segoe UI', 'Cairo', Tahoma, sans-serif;
                    padding: 20px;
                    direction: rtl;
                }
                .receipt {
                    max-width: 800px;
                    margin: 0 auto;
                    border: 2px solid #333;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px dashed #333;
                    padding-bottom: 15px;
                    margin-bottom: 15px;
                }
                .header h1 { font-size: 24px; margin-bottom: 10px; }
                .header p { color: #666; font-size: 14px; }
                .info { margin-bottom: 20px; }
                .info p { margin-bottom: 5px; font-size: 14px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th { background: #f0f0f0; padding: 10px; text-align: right; border-bottom: 2px solid #333; }
                td { padding: 8px; }
                .totals { border-top: 2px solid #333; padding-top: 15px; }
                .totals div { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
                .total-row { font-size: 18px; font-weight: bold; margin-top: 10px; padding-top: 10px; border-top: 2px solid #333; }
                .footer { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 2px dashed #333; color: #666; }
                @media print {
                    body { padding: 0; }
                    .receipt { border: none; }
                }
            </style>
        </head>
        <body>
            <div class="receipt">
                <div class="header">
                    <h1>مقهى القهوة الطازجة</h1>
                    <p>شارع الملك فهد، الرياض</p>
                    <p>هاتف: 0112345678</p>
                </div>
                
                <div class="info">
                    <p><strong>رقم الفاتورة:</strong> ${sale.id}</p>
                    <p><strong>التاريخ:</strong> ${new Date(sale.completedAt).toLocaleString('ar-SA')}</p>
                    <p><strong>الطاولة:</strong> ${sale.tableName}</p>
                    <p><strong>الكاشير:</strong> ${sale.cashier}</p>
                    <p><strong>طريقة الدفع:</strong> ${paymentMethodAr[sale.paymentMethod]}</p>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>المنتج</th>
                            <th style="text-align: center;">الكمية</th>
                            <th style="text-align: left;">السعر</th>
                            <th style="text-align: left;">الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                </table>
                
                <div class="totals">
                    <div>
                        <span>المجموع الفرعي:</span>
                        <span>${sale.subtotal.toFixed(2)} ج.م</span>
                    </div>
                    <div>
                        <span>الضريبة:</span>
                        <span>${sale.tax.toFixed(2)} ج.م</span>
                    </div>
                    ${sale.discount > 0 ? `
                    <div style="color: #ef4444;">
                        <span>الخصم:</span>
                        <span>-${(sale.subtotal * sale.discount / 100).toFixed(2)} ج.م</span>
                    </div>
                    ` : ''}
                    <div class="total-row">
                        <span>الإجمالي:</span>
                        <span>${sale.total.toFixed(2)} ج.م</span>
                    </div>
                    <div>
                        <span>المبلغ المستلم:</span>
                        <span>${sale.cashReceived.toFixed(2)} ج.م</span>
                    </div>
                    ${sale.paymentMethod === 'cash' && sale.change > 0 ? `
                    <div style="color: #10b981; font-weight: bold;">
                        <span>الباقي:</span>
                        <span>${sale.change.toFixed(2)} ج.م</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="footer">
                    <p>شكراً لزيارتكم</p>
                    <p>نتمنى رؤيتكم مرة أخرى</p>
                </div>
            </div>
            
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(function() { window.close(); }, 100);
                }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Legacy print function (kept for reference - can be removed later)
function printReceiptOld(sale) {
    const itemsHTML = sale.items.map(item => `
        <tr>
            <td style="padding: 0.5rem; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
            <td style="padding: 0.5rem; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
            <td style="padding: 0.5rem; border-bottom: 1px solid #e2e8f0; text-align: left;">${item.price.toFixed(2)}</td>
            <td style="padding: 0.5rem; border-bottom: 1px solid #e2e8f0; text-align: left;">${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    const paymentMethodAr = {
        'cash': 'نقدي',
        'card': 'بطاقة',
        'mobile': 'محفظة إلكترونية'
    };

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>فاتورة #${sale.id}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Segoe UI', 'Cairo', Tahoma, sans-serif;
                    padding: 20px;
                    direction: rtl;
                }
                .receipt {
                    max-width: 800px;
                    margin: 0 auto;
                    border: 2px solid #333;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px dashed #333;
                    padding-bottom: 15px;
                    margin-bottom: 15px;
                }
                .header h1 { font-size: 24px; margin-bottom: 10px; }
                .header p { color: #666; font-size: 14px; }
                .info { margin-bottom: 20px; }
                .info p { margin-bottom: 5px; font-size: 14px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th { background: #f0f0f0; padding: 10px; text-align: right; border-bottom: 2px solid #333; }
                td { padding: 8px; }
                .totals { border-top: 2px solid #333; padding-top: 15px; }
                .totals div { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
                .total-row { font-size: 18px; font-weight: bold; margin-top: 10px; padding-top: 10px; border-top: 2px solid #333; }
                .footer { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 2px dashed #333; color: #666; }
                @media print {
                    body { padding: 0; }
                    .receipt { border: none; }
                }
            </style>
        </head>
        <body>
            <div class="receipt">
                <div class="header">
                    <h1>مقهى القهوة الطازجة</h1>
                    <p>شارع الملك فهد، الرياض</p>
                    <p>هاتف: 0112345678</p>
                </div>
                
                <div class="info">
                    <p><strong>رقم الفاتورة:</strong> ${sale.id}</p>
                    <p><strong>التاريخ:</strong> ${new Date(sale.completedAt).toLocaleString('ar-SA')}</p>
                    <p><strong>الطاولة:</strong> ${sale.tableName}</p>
                    <p><strong>الكاشير:</strong> ${sale.cashier}</p>
                    <p><strong>طريقة الدفع:</strong> ${paymentMethodAr[sale.paymentMethod]}</p>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>المنتج</th>
                            <th style="text-align: center;">الكمية</th>
                            <th style="text-align: left;">السعر</th>
                            <th style="text-align: left;">الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                </table>
                
                <div class="totals">
                    <div>
                        <span>المجموع الفرعي:</span>
                        <span>${sale.subtotal.toFixed(2)} ج.م</span>
                    </div>
                    <div>
                        <span>الضريبة (10%):</span>
                        <span>${sale.tax.toFixed(2)} ج.م</span>
                    </div>
                    ${sale.discount > 0 ? `
                    <div style="color: #ef4444;">
                        <span>الخصم (${sale.discount}%):</span>
                        <span>-${(sale.subtotal * sale.discount / 100).toFixed(2)} ج.م</span>
                    </div>
                    ` : ''}
                    <div class="total-row">
                        <span>الإجمالي:</span>
                        <span>${sale.total.toFixed(2)} ج.م</span>
                    </div>
                    <div style="margin-top: 10px;">
                        <span>المبلغ المستلم:</span>
                        <span>${sale.cashReceived.toFixed(2)} ج.م</span>
                    </div>
                    ${sale.paymentMethod === 'cash' && sale.change > 0 ? `
                    <div style="color: #10b981; font-weight: bold;">
                        <span>الباقي:</span>
                        <span>${sale.change.toFixed(2)} ج.م</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="footer">
                    <p>شكراً لزيارتكم</p>
                    <p>نتمنى رؤيتكم مرة أخرى</p>
                </div>
            </div>
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(function() { window.close(); }, 100);
                }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// تبديل عرض أزرار الدفع
function togglePaymentButtons() {
    const paymentButtons = document.getElementById('paymentButtons');
    const paymentHeader = document.querySelector('.payment-header');

    paymentButtons.classList.toggle('hide');
    paymentHeader.classList.toggle('active');
}

// إصلاح الأيقونات وإضافة منتجات الشيشة
function fixProductIcons() {
    let products = JSON.parse(localStorage.getItem('products'));
    if (products && products.length > 0) {
        let updated = false;

        // إصلاح أيقونة الكرواسون
        products.forEach(product => {
            if ((product.id === 21 || product.id === 22) && product.icon === 'fa-croissant') {
                product.icon = 'fa-bread-slice';
                updated = true;
            }
        });

        // إضافة منتجات الشيشة إذا لم تكن موجودة
        const hasShisha = products.some(p => p.category === 'shisha');
        if (!hasShisha) {
            const shishaProducts = [
                { id: 41, name: 'لاكي طبعي', price: 50.00, category: 'shisha', icon: 'fa-wind', stock: 30 },
                { id: 42, name: 'معسل', price: 45.00, category: 'shisha', icon: 'fa-wind', stock: 30 },
                { id: 43, name: 'معسل دبل', price: 55.00, category: 'shisha', icon: 'fa-wind', stock: 25 },
                { id: 44, name: 'زعلوك', price: 40.00, category: 'shisha', icon: 'fa-wind', stock: 30 },
                { id: 45, name: 'اسلملر ليمون', price: 48.00, category: 'shisha', icon: 'fa-wind', stock: 25 },
                { id: 46, name: 'ميت نعناع', price: 45.00, category: 'shisha', icon: 'fa-wind', stock: 30 },
                { id: 47, name: 'ثلج سيسة', price: 50.00, category: 'shisha', icon: 'fa-wind', stock: 20 },
                { id: 48, name: 'لاكي فاخر', price: 60.00, category: 'shisha', icon: 'fa-wind', stock: 20 },
                { id: 49, name: 'فاخر مزايا', price: 65.00, category: 'shisha', icon: 'fa-wind', stock: 15 },
                { id: 50, name: 'فواكه خاص', price: 55.00, category: 'shisha', icon: 'fa-wind', stock: 20 }
            ];
            products = products.concat(shishaProducts);
            updated = true;
            console.log('تم إضافة منتجات الشيشة:', shishaProducts.length);
        }

        if (updated) {
            localStorage.setItem('products', JSON.stringify(products));
            // تحديث المتغير العام
            window.products = products;
        }
    }
}

// دالة مساعدة لإعادة تحميل المنتجات (يمكن استدعاؤها من الكونسول)
window.reloadProducts = function () {
    localStorage.removeItem('productsVersion');
    location.reload();
};

// دالة لتحديث إصدار المنتجات يدوياً
window.forceUpdateProducts = function () {
    products = getDefaultProducts();
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('productsVersion', PRODUCTS_VERSION);
    loadProducts();
    console.log('✓ تم تحديث المنتجات بنجاح!');
};

// دالة تنظيف الطاولات المشغولة بدون طلبات
function cleanupOrphanedTables() {
    let tables = JSON.parse(localStorage.getItem('tables')) || [];
    let openOrders = JSON.parse(localStorage.getItem('openOrders')) || [];
    let currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
    let hasChanges = false;

    console.log('🔍 Checking tables for cleanup...');
    console.log('Open orders:', openOrders.length);
    console.log('Current order:', currentOrder ? `Table ${currentOrder.tableId}, Items: ${currentOrder.items?.length || 0}` : 'None');

    tables.forEach(table => {
        if (table.status === 'occupied') {
            // التحقق من وجود طلب على هذه الطاولة
            const hasOpenOrder = openOrders.some(o => o.tableId === table.id);
            const isCurrentTable = currentOrder && currentOrder.tableId === table.id && currentOrder.items && currentOrder.items.length > 0;

            console.log(`Table ${table.id} (${table.name}): hasOpenOrder=${hasOpenOrder}, isCurrentTable=${isCurrentTable}`);

            if (!hasOpenOrder && !isCurrentTable) {
                // طاولة مشغولة بدون طلب - تحريرها
                console.log('🧹 Cleaning orphaned table:', table.name);
                table.status = 'available';
                table.orderId = null;
                hasChanges = true;
            }
        }
    });

    if (hasChanges) {
        localStorage.setItem('tables', JSON.stringify(tables));
        console.log('✓ Orphaned tables cleaned');
    } else {
        console.log('✓ No orphaned tables found');
    }
}

// إضافة دالة للتنظيف اليدوي
window.cleanupTables = cleanupOrphanedTables;

// التهيئة
fixProductIcons();
cleanupOrphanedTables(); // تنظيف الطاولات عند فتح الصفحة
generateOrderNumber();
loadProducts();
loadOpenOrders();
updateCart();

// دالة لتحديث اسم الطاولة في كل الأماكن
function updateTableNameDisplay(tableName) {
    const elements = ['currentTableName', 'statusTableName', 'sidebarTableName'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = tableName;
        }
    });
}

// تحديث اسم الطاولة في الواجهة
updateTableNameDisplay(currentOrder.tableName);

