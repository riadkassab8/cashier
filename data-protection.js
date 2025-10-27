// نظام حماية البيانات من المسح العرضي
(function () {
    'use strict';

    // حماية البيانات الحساسة
    const protectedKeys = [
        'salesData',
        'products',
        'users',
        'closedShifts',
        'openOrders',
        'tables'
    ];

    // نسخ احتياطي تلقائي كل 5 دقائق
    function autoBackup() {
        const backup = {};
        const timestamp = new Date().toISOString();

        protectedKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                backup[key] = data;
            }
        });

        if (Object.keys(backup).length > 0) {
            localStorage.setItem('lastBackup', JSON.stringify({
                timestamp: timestamp,
                data: backup
            }));
            console.log('✅ Auto backup created:', timestamp);
        }
    }

    // استعادة من النسخة الاحتياطية
    window.restoreFromBackup = function () {
        const backup = localStorage.getItem('lastBackup');
        if (!backup) {
            Swal.fire({
                icon: 'error',
                title: 'No Backup Found',
                text: 'No backup available to restore',
                confirmButtonColor: '#ef4444'
            });
            return;
        }

        const backupData = JSON.parse(backup);

        Swal.fire({
            title: 'Restore Backup?',
            html: `
                <p>Restore data from backup?</p>
                <p style="color: #64748b; font-size: 0.9rem;">
                    Backup Date: ${new Date(backupData.timestamp).toLocaleString('ar-SA')}
                </p>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Restore',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                Object.entries(backupData.data).forEach(([key, value]) => {
                    localStorage.setItem(key, value);
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Restored!',
                    text: 'Data restored successfully',
                    confirmButtonColor: '#10b981'
                }).then(() => {
                    location.reload();
                });
            }
        });
    };

    // تصدير البيانات
    window.exportData = function () {
        const exportData = {};
        protectedKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                exportData[key] = JSON.parse(data);
            }
        });

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pos_data_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        Swal.fire({
            icon: 'success',
            title: 'Exported!',
            text: 'Data exported successfully',
            confirmButtonColor: '#10b981'
        });
    };

    // استيراد البيانات
    window.importData = function () {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = function (e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (event) {
                try {
                    const importedData = JSON.parse(event.target.result);

                    Swal.fire({
                        title: 'Import Data?',
                        text: 'This will replace current data. Continue?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#f59e0b',
                        cancelButtonColor: '#64748b',
                        confirmButtonText: 'Yes, Import',
                        cancelButtonText: 'Cancel'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Object.entries(importedData).forEach(([key, value]) => {
                                localStorage.setItem(key, JSON.stringify(value));
                            });

                            Swal.fire({
                                icon: 'success',
                                title: 'Imported!',
                                text: 'Data imported successfully',
                                confirmButtonColor: '#10b981'
                            }).then(() => {
                                location.reload();
                            });
                        }
                    });
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Invalid file format',
                        confirmButtonColor: '#ef4444'
                    });
                }
            };
            reader.readAsText(file);
        };

        input.click();
    };

    // عرض معلومات البيانات
    window.showDataInfo = function () {
        const info = [];
        protectedKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                try {
                    const parsed = JSON.parse(data);
                    const count = Array.isArray(parsed) ? parsed.length : 'N/A';
                    info.push(`<tr><td style="text-align: right; padding: 0.5rem;">${key}</td><td style="text-align: center; padding: 0.5rem;">${count}</td></tr>`);
                } catch (e) {
                    info.push(`<tr><td style="text-align: right; padding: 0.5rem;">${key}</td><td style="text-align: center; padding: 0.5rem;">Error</td></tr>`);
                }
            }
        });

        const backup = localStorage.getItem('lastBackup');
        const backupInfo = backup ? JSON.parse(backup) : null;

        Swal.fire({
            title: 'Data Information',
            html: `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f1f5f9;">
                            <th style="text-align: right; padding: 0.5rem;">Data Type</th>
                            <th style="text-align: center; padding: 0.5rem;">Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${info.join('')}
                    </tbody>
                </table>
                ${backupInfo ? `
                    <p style="margin-top: 1rem; color: #64748b; font-size: 0.9rem;">
                        Last Backup: ${new Date(backupInfo.timestamp).toLocaleString('ar-SA')}
                    </p>
                ` : ''}
            `,
            width: 600,
            confirmButtonColor: '#8b4513'
        });
    };

    // بدء النسخ الاحتياطي التلقائي
    autoBackup(); // نسخة فورية
    setInterval(autoBackup, 5 * 60 * 1000); // كل 5 دقائق

    console.log('🛡️ Data Protection System Active');
    console.log('📊 Available commands:');
    console.log('  - restoreFromBackup()');
    console.log('  - exportData()');
    console.log('  - importData()');
    console.log('  - showDataInfo()');
})();
