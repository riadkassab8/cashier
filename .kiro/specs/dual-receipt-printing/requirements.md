# Requirements Document - Dual Receipt Printing System

## Introduction

نظام طباعة مزدوج للفواتير (Receipts) يسمح بطباعة نسختين مختلفتين تلقائياً:
- **نسخة الكاشير**: فاتورة كاملة بكل التفاصيل المالية
- **نسخة البار**: طلب تحضير بدون أسعار

النظام يدعم اختيار طابعات مختلفة لكل قسم مع حفظ الإعدادات بشكل دائم.

## Glossary

- **Receipt**: الفاتورة أو الإيصال المطبوع
- **Cashier Printer**: الطابعة المخصصة لطباعة فواتير الكاشير
- **Bar Printer**: الطابعة المخصصة لطباعة طلبات البار
- **Print Settings**: إعدادات الطباعة المحفوظة في النظام
- **Dual Printing**: الطباعة المزدوجة التلقائية
- **QZ Tray**: مكتبة للطباعة المباشرة من المتصفح
- **POS System**: نظام نقاط البيع (Point of Sale)

## Requirements

### Requirement 1: إعداد الطابعات في الإعدادات

**User Story:** كمدير للنظام، أريد تحديد طابعة منفصلة لكل قسم (كاشير وبار)، حتى يتم توجيه كل فاتورة للطابعة الصحيحة تلقائياً

#### Acceptance Criteria

1. WHEN المستخدم يفتح صفحة الإعدادات، THE System SHALL عرض قسم "إعدادات الطابعات" (Printers Setup)
2. THE System SHALL عرض قائمة منسدلة لاختيار "طابعة الكاشير" تحتوي على جميع الطابعات المتاحة في النظام
3. THE System SHALL عرض قائمة منسدلة لاختيار "طابعة البار" تحتوي على جميع الطابعات المتاحة في النظام
4. WHEN المستخدم يختار طابعة ويضغط "حفظ"، THE System SHALL حفظ الاختيار في localStorage
5. WHEN المستخدم يعيد فتح الإعدادات، THE System SHALL عرض الطابعات المحفوظة مسبقاً كاختيار افتراضي

### Requirement 2: التحقق من إعدادات الطباعة

**User Story:** كمستخدم، أريد أن يتم تنبيهي إذا لم أقم بتحديد الطابعات، حتى لا تفشل عملية الطباعة

#### Acceptance Criteria

1. WHEN المستخدم يضغط على زر "طباعة الفاتورة" AND لم يتم تحديد طابعة الكاشير، THE System SHALL عرض رسالة تحذير "من فضلك حدد طابعة الكاشير من الإعدادات أولاً"
2. WHEN المستخدم يضغط على زر "طباعة الفاتورة" AND لم يتم تحديد طابعة البار، THE System SHALL عرض رسالة تحذير "من فضلك حدد طابعة البار من الإعدادات أولاً"
3. WHEN كلا الطابعتين غير محددتين، THE System SHALL عرض رسالة "من فضلك حدد طابعة الكاشير وطابعة البار من الإعدادات أولاً"
4. THE System SHALL توفير رابط سريع في رسالة التحذير للانتقال مباشرة لصفحة الإعدادات

### Requirement 3: طباعة فاتورة الكاشير

**User Story:** كمستخدم، أريد طباعة فاتورة كاملة للكاشير تحتوي على جميع التفاصيل المالية، حتى يكون لدي سجل كامل للمعاملة

#### Acceptance Criteria

1. THE Cashier Receipt SHALL تحتوي على شعار المقهى أو اسمه في الأعلى
2. THE Cashier Receipt SHALL تحتوي على رقم الطلب (Order Number)
3. THE Cashier Receipt SHALL تحتوي على رقم الطاولة (Table Number)
4. THE Cashier Receipt SHALL تحتوي على اسم الكاشير الذي أتم الطلب
5. THE Cashier Receipt SHALL تحتوي على قائمة كاملة بالمنتجات مع (اسم المنتج، الكمية، السعر الفردي، الإجمالي)
6. THE Cashier Receipt SHALL تحتوي على الإجمالي الفرعي (Subtotal) قبل الضريبة
7. THE Cashier Receipt SHALL تحتوي على قيمة الضريبة (Tax)
8. THE Cashier Receipt SHALL تحتوي على الخصم إن وُجد (Discount)
9. THE Cashier Receipt SHALL تحتوي على الإجمالي النهائي (Total)
10. THE Cashier Receipt SHALL تحتوي على طريقة الدفع (نقدي/بطاقة/محفظة إلكترونية)
11. THE Cashier Receipt SHALL تحتوي على التاريخ والوقت بصيغة واضحة
12. THE Cashier Receipt SHALL تحتوي على رسالة شكر في النهاية مثل "شكراً لزيارتكم - Thank you for your visit"
13. WHEN يتم الطباعة، THE System SHALL إرسال الفاتورة للطابعة المحددة للكاشير تلقائياً

### Requirement 4: طباعة طلب البار

**User Story:** كمستخدم، أريد طباعة طلب للبار يحتوي فقط على المنتجات المطلوبة بدون أسعار، حتى يتمكن فريق البار من تحضير الطلب بسهولة

#### Acceptance Criteria

1. THE Bar Receipt SHALL تحتوي على عنوان "طلب البار - BAR ORDER" في الأعلى
2. THE Bar Receipt SHALL تحتوي على رقم الطلب (Order Number) بخط كبير وواضح
3. THE Bar Receipt SHALL تحتوي على رقم الطاولة (Table Number) بخط كبير
4. THE Bar Receipt SHALL تحتوي على قائمة المنتجات المطلوبة (اسم المنتج والكمية فقط)
5. THE Bar Receipt SHALL تحتوي على الملاحظات الخاصة بكل منتج إن وُجدت (مثل: سكر زيادة، بدون ثلج)
6. THE Bar Receipt SHALL تحتوي على اسم الكاشير أو الويتر
7. THE Bar Receipt SHALL تحتوي على التاريخ والوقت
8. THE Bar Receipt SHALL NOT تحتوي على أي أسعار أو إجماليات مالية
9. THE Bar Receipt SHALL NOT تحتوي على معلومات الدفع
10. WHEN يتم الطباعة، THE System SHALL إرسال الطلب للطابعة المحددة للبار تلقائياً

### Requirement 5: الطباعة المزدوجة التلقائية

**User Story:** كمستخدم، أريد أن يتم طباعة كلا الفاتورتين تلقائياً بضغطة زر واحدة، حتى أوفر الوقت وأتجنب الأخطاء

#### Acceptance Criteria

1. WHEN المستخدم يضغط على زر "طباعة الفاتورة"، THE System SHALL طباعة فاتورة الكاشير على الطابعة المحددة للكاشير
2. WHEN المستخدم يضغط على زر "طباعة الفاتورة"، THE System SHALL طباعة طلب البار على الطابعة المحددة للبار
3. THE System SHALL تنفيذ الطباعتين بشكل متزامن بدون تدخل المستخدم
4. WHEN تنجح الطباعة، THE System SHALL عرض رسالة "تم طباعة الفاتورة بنجاح"
5. IF فشلت طباعة إحدى الفاتورتين، THE System SHALL عرض رسالة خطأ توضح أي طابعة فشلت
6. THE System SHALL الاحتفاظ بسجل لجميع عمليات الطباعة (ناجحة أو فاشلة)

### Requirement 6: خيارات الطباعة المتقدمة

**User Story:** كمدير، أريد التحكم في نوع الطباعة المطلوبة، حتى أتمكن من تخصيص سلوك النظام حسب احتياجات العمل

#### Acceptance Criteria

1. THE System SHALL توفير خيار في الإعدادات "طباعة تلقائية للفاتورتين" (Print both receipts automatically)
2. THE System SHALL توفير خيار في الإعدادات "طباعة فاتورة الكاشير فقط" (Print only cashier receipt)
3. THE System SHALL توفير خيار في الإعدادات "طباعة طلب البار فقط" (Print only bar receipt)
4. WHEN المستخدم يختار خيار معين، THE System SHALL حفظ الاختيار في localStorage
5. WHEN المستخدم يضغط على زر الطباعة، THE System SHALL تنفيذ الطباعة حسب الخيار المحدد في الإعدادات
6. THE System SHALL عرض الخيار الحالي بوضوح في واجهة الإعدادات

### Requirement 7: دعم الطباعة عبر QZ Tray

**User Story:** كمطور، أريد استخدام QZ Tray للطباعة المباشرة من المتصفح، حتى يعمل النظام كـ Web Application بدون الحاجة لتطبيق Desktop

#### Acceptance Criteria

1. THE System SHALL دمج مكتبة QZ Tray للطباعة المباشرة
2. WHEN يتم تحميل الصفحة، THE System SHALL التحقق من تثبيت QZ Tray على الجهاز
3. IF لم يكن QZ Tray مثبتاً، THE System SHALL عرض رسالة توجيهية لتحميله وتثبيته
4. THE System SHALL استخدام QZ Tray لجلب قائمة الطابعات المتاحة في النظام
5. THE System SHALL استخدام QZ Tray لإرسال أوامر الطباعة للطابعات المحددة
6. THE System SHALL التعامل مع أخطاء الاتصال بـ QZ Tray بشكل مناسب
7. THE System SHALL توفير خيار بديل للطباعة العادية (Print Dialog) في حالة عدم توفر QZ Tray

### Requirement 8: تصميم الفواتير للطباعة الحرارية

**User Story:** كمستخدم، أريد أن تكون الفواتير مصممة خصيصاً للطابعات الحرارية (Thermal Printers)، حتى تظهر بشكل واضح ومقروء

#### Acceptance Criteria

1. THE Receipts SHALL تكون بعرض 80mm (حجم الطابعات الحرارية القياسي)
2. THE Receipts SHALL استخدام خط واضح ومقروء (مثل Courier أو Monospace)
3. THE Receipts SHALL استخدام أحجام خطوط مناسبة (عناوين كبيرة، تفاصيل متوسطة)
4. THE Receipts SHALL استخدام خطوط فاصلة (Dashed lines) لتقسيم الأقسام
5. THE Receipts SHALL محاذاة النصوص بشكل صحيح (يمين/يسار/وسط)
6. THE Receipts SHALL تجنب استخدام الألوان (الطباعة الحرارية أبيض وأسود)
7. THE Receipts SHALL تحسين المسافات بين الأسطر للوضوح
8. THE Receipts SHALL إضافة مسافة فارغة في النهاية لسهولة القص

### Requirement 9: معالجة الأخطاء والاستثناءات

**User Story:** كمستخدم، أريد أن يتعامل النظام مع الأخطاء بشكل واضح، حتى أعرف ما المشكلة وكيف أحلها

#### Acceptance Criteria

1. IF فشل الاتصال بالطابعة، THE System SHALL عرض رسالة "فشل الاتصال بطابعة [اسم الطابعة]. تأكد من تشغيل الطابعة واتصالها"
2. IF كانت الطابعة خارج الورق، THE System SHALL عرض رسالة "الطابعة خارج الورق. أضف ورق جديد وحاول مرة أخرى"
3. IF فشلت الطباعة لسبب غير معروف، THE System SHALL عرض رسالة خطأ مع خيار "إعادة المحاولة"
4. THE System SHALL تسجيل جميع أخطاء الطباعة في console للمطورين
5. THE System SHALL توفير خيار "طباعة يدوية" كبديل في حالة فشل الطباعة التلقائية
6. WHEN تفشل الطباعة، THE System SHALL الاحتفاظ بالطلب في قائمة "طلبات معلقة" لإعادة الطباعة لاحقاً

### Requirement 10: إعادة طباعة الفواتير

**User Story:** كمستخدم، أريد إمكانية إعادة طباعة أي فاتورة سابقة، حتى أتمكن من تصحيح الأخطاء أو تلبية طلبات العملاء

#### Acceptance Criteria

1. THE System SHALL توفير زر "إعادة طباعة" في صفحة التقارير لكل طلب
2. WHEN المستخدم يضغط على "إعادة طباعة"، THE System SHALL عرض خيارات: "فاتورة الكاشير" أو "طلب البار" أو "كلاهما"
3. THE System SHALL طباعة الفاتورة المطلوبة بنفس التفاصيل الأصلية
4. THE System SHALL إضافة علامة "نسخة مكررة - DUPLICATE" على الفواتير المعاد طباعتها
5. THE System SHALL تسجيل عملية إعادة الطباعة في سجل النظام


### Requirement 11: دعم أنواع مختلفة من الطابعات

**User Story:** كمستخدم، أريد أن يدعم النظام الطابعات الحرارية والطابعات العادية، حتى أتمكن من استخدام أي نوع متاح لدي

#### Acceptance Criteria

1. THE System SHALL دعم الطباعة على الطابعات الحرارية (Thermal Printers) بعرض 80mm
2. THE System SHALL دعم الطباعة على الطابعات العادية (A4 Printers)
3. THE System SHALL توفير خيار في الإعدادات لتحديد نوع كل طابعة (حرارية/عادية)
4. WHEN الطابعة من نوع حراري، THE System SHALL استخدام تصميم بعرض 80mm
5. WHEN الطابعة من نوع عادي، THE System SHALL استخدام تصميم A4 مع تحسين المساحات
6. THE System SHALL حفظ نوع كل طابعة مع إعداداتها في localStorage
7. THE System SHALL تطبيق التصميم المناسب تلقائياً حسب نوع الطابعة المحددة

### Requirement 12: طباعة شعار المقهى

**User Story:** كمدير، أريد طباعة شعار المقهى على الفواتير، حتى تكون الفواتير احترافية وتعزز هوية العلامة التجارية

#### Acceptance Criteria

1. THE System SHALL توفير خيار في الإعدادات لرفع شعار المقهى (Logo)
2. THE System SHALL قبول صيغ الصور الشائعة (PNG, JPG, SVG)
3. THE System SHALL تحويل الشعار لصيغة مناسبة للطباعة (أبيض وأسود للطابعات الحرارية)
4. THE System SHALL عرض الشعار في أعلى فاتورة الكاشير
5. THE System SHALL عرض الشعار في أعلى طلب البار
6. THE System SHALL تحجيم الشعار تلقائياً ليناسب عرض الفاتورة
7. THE System SHALL حفظ الشعار في localStorage أو كـ Base64
8. WHEN لا يوجد شعار محمل، THE System SHALL عرض اسم المقهى كنص بدلاً من الشعار
9. THE System SHALL توفير خيار لإزالة أو تغيير الشعار في أي وقت

### Requirement 13: التوافق مع Windows

**User Story:** كمستخدم على نظام Windows، أريد أن يعمل النظام بشكل كامل على جهازي، حتى أتمكن من استخدام جميع الميزات بدون مشاكل

#### Acceptance Criteria

1. THE System SHALL العمل بشكل كامل على Windows 10 وما فوق
2. THE System SHALL التعرف على جميع الطابعات المثبتة على Windows
3. THE System SHALL استخدام Windows Print Spooler للطباعة
4. THE System SHALL دعم طابعات USB والطابعات الشبكية على Windows
5. THE System SHALL التعامل مع أسماء الطابعات بصيغة Windows (مثل: \\COMPUTER\PrinterName)
6. THE System SHALL حفظ إعدادات الطابعات بشكل يتوافق مع Windows Registry إن أمكن
7. THE System SHALL توفير تعليمات واضحة لتثبيت QZ Tray على Windows
