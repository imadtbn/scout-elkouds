// modals.js
document.addEventListener('DOMContentLoaded', function () {
    // فتح النوافذ المنبثقة
    document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // فتح النوافذ من أزرار البطاقات
    document.querySelectorAll('.card-button').forEach(button => {
        button.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal') + '-modal';
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // إغلاق النوافذ
    document.querySelectorAll('.modal .close-button').forEach(btn => {
        btn.addEventListener('click', function () {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    // إغلاق النوافذ بالضغط خارجها
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    // إغلاق النوافذ بالضغط على Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        }
    });

    // زر ملف الانخراط
    const learnMoreBtn = document.getElementById("learnMoreBtn");
    const membershipModal = document.getElementById("membershipModal");
    const closeMembership = document.getElementById("closeMembership");

    if (learnMoreBtn && membershipModal) {
        learnMoreBtn.addEventListener("click", () => {
            membershipModal.style.display = "block";
        });
    }

    if (closeMembership && membershipModal) {
        closeMembership.addEventListener("click", () => {
            membershipModal.style.display = "none";
        });
    }

    if (membershipModal) {
        window.addEventListener("click", (e) => {
            if (e.target === membershipModal) {
                membershipModal.style.display = "none";
            }
        });
    }
});