(function() {
    // تحقق مما إذا كان المستخدم قد أدخل كلمة السر سابقاً في هذه الجلسة
    if (sessionStorage.getItem('sys_unlocked') === 'true') {
        return; // إذا تم فتح القفل سابقاً، اترك الواجهة تعمل بشكل طبيعي
    }

    // إنشاء طبقة العطل الوهمية (Overlay) فوق الواجهة الأصلية بالكامل
    const overlay = document.createElement('div');
    overlay.id = 'fake-maintenance-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: #0f172a;
        color: #f8fafc;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        direction: ltr;
        text-align: center;
        padding: 20px;
        box-sizing: border-box;
    `;

    // تصميم محتوى واجهة العطل الوهمية
    overlay.innerHTML = `
        <div style="max-width: 500px; background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.1); padding: 40px; border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
            <div id="secret-trigger" style="cursor: pointer; user-select: none; display: inline-block; margin-bottom: 20px;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            </div>
            <h1 style="font-size: 22px; font-weight: 700; color: #f43f5e; margin: 0 0 10px 0;">503 - Service Unavailable</h1>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px;">
                Failed to establish a stable connection with Matleek Cloud Database.<br>
                <span style="font-family: monospace; color: #cbd5e1;">Error Code: ERR_CONNECTION_REFUSED_DB_HOST</span>
            </p>
            <button onclick="location.reload()" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 10px 24px; border-radius: 99px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s;">
                Retry Connection 🔄
            </button>
        </div>
    `;

    document.body.appendChild(overlay);

    // --- آلية إظهار القفل المخفي ---
    let clickCount = 0;
    let clickTimer = null;

    // 1. الخيار الأول: النقر 3 مرات متتالية على أيقونة التحذير الحمراء
    const triggerBtn = document.getElementById('secret-trigger');
    triggerBtn.addEventListener('click', function() {
        clickCount++;
        clearTimeout(clickTimer);
        
        if (clickCount === 3) {
            promptPassword();
            clickCount = 0;
        } else {
            clickTimer = setTimeout(() => { clickCount = 0; }, 1000);
        }
    });

    // 2. الخيار الثاني: اختصار الكيبورد (Ctrl + Shift + M)
    window.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
            e.preventDefault();
            promptPassword();
        }
    });

    // دالة التحقق من كلمة السر
    function promptPassword() {
        const pass = prompt("System Administrator Override Passcode:");
        if (pass === "111998") {
            sessionStorage.setItem('sys_unlocked', 'true');
            overlay.remove();
            alert("تم فتح الواجهة بنجاح!");
        } else if (pass !== null) {
            alert("خطأ: كلمة المرور غير صحيحة");
        }
    }
})();
