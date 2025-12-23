// posts.js
document.addEventListener('DOMContentLoaded', function () {
    const postsSection = document.getElementById('posts');
    if (!postsSection) return;

    const cardsGrid = postsSection.querySelector('.cards-grid');
    const loadMoreBtn = postsSection.querySelector('.load-more-btn');
    
    if (!cardsGrid || !loadMoreBtn) return;
    
    const allCards = Array.from(cardsGrid.querySelectorAll('.card'));

    // عدد البطاقات المعروضة في البداية
    const initialCount = 4;
    // عدد البطاقات الإضافية عند الضغط على "المزيد"
    const step = 4;

    let visibleCount = initialCount;

    // دالة لتحديث عرض البطاقات
    function updateCardsVisibility() {
        allCards.forEach((card, index) => {
            if (index < visibleCount) {
                card.classList.remove('hidden');
                card.style.animation = `fadeIn 0.5s ease ${index * 0.1}s forwards`;
            } else {
                card.classList.add('hidden');
            }
        });

        // تحديث نص الزر
        if (visibleCount >= allCards.length) {
            loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> جميع المنشورات معروضة';
            loadMoreBtn.disabled = true;
            loadMoreBtn.classList.add('loading');
        } else {
            const remaining = allCards.length - visibleCount;
            loadMoreBtn.innerHTML = `عرض ${Math.min(step, remaining)} منشور${Math.min(step, remaining) > 1 ? 'ات' : ''} إضافية <i class="fas fa-chevron-down"></i>`;
            loadMoreBtn.disabled = false;
            loadMoreBtn.classList.remove('loading');
        }
    }

    // تأثير ظهور البطاقات
    const fadeInAnimation = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = fadeInAnimation;
    document.head.appendChild(styleSheet);

    // تهيئة البطاقات في البداية
    updateCardsVisibility();

    // حدث النقر على زر "المزيد من المنشورات"
    loadMoreBtn.addEventListener('click', function () {
        // تأثير النقر
        this.classList.add('loading');

        // زيادة عدد البطاقات المرئية
        visibleCount += step;

        // تأخير بسيط لمحاكاة التحميل
        setTimeout(() => {
            updateCardsVisibility();
            this.classList.remove('loading');

            // تمرير سلس إلى البطاقات الجديدة
            if (visibleCount <= allCards.length) {
                const firstNewCard = allCards[visibleCount - step];
                if (firstNewCard) {
                    firstNewCard.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            }
        }, 300);
    });

    // تحديث عند تغيير حجم النافذة
    window.addEventListener('resize', function () {
        // تعديل عدد البطاقات المعروضة بناءً على حجم الشاشة
        if (window.innerWidth < 768) {
            // في الهواتف، عرض بطاقتين فقط في البداية
            if (visibleCount > initialCount) {
                visibleCount = Math.max(initialCount, 2);
                updateCardsVisibility();
            }
        }
    });
});