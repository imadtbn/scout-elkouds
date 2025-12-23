// gallery.js
document.addEventListener('DOMContentLoaded', function () {
        const galleryImages = [
            {
                id: 1,
                src: "images/mokhayam.jpg",
                category: "camping",
                title: "المخيم الكشفي السنوي",
                description: "المخيم الكشفي السنوي في غابة بوعلام بمشاركة 120 كشافاً",
                date: "11 جويلية 2024"
            },
            {
                id: 2,
                src: "images/montagne.jpg",
                category: "hiking",
                title: "خرجة جبلية استكشافية",
                description: "خرجة استكشافية إلى جبال الأطلس لتعلم مهارات التوجيه",
                date: "26 أفريل 2025"
            },
            {
                id: 3,
                src: "images/isaafat.jpg",
                category: "training",
                title: "دورة الإسعافات الأولية",
                description: "دورة متخصصة في الإسعافات الأولية بالتعاون مع الهلال الأحمر",
                date: "10 جانفي 2025"
            },
            {
                id: 4,
                src: "images/1nouvembre.jpg",
                category: "events",
                title: "احتفال عيد الثورة",
                description: "احتفال بمناسبة عيد الثورة المجيدة بحضور 50 كشاف",
                date: "01 نوفمبر 2024"
            },
            {
                id: 5,
                src: "images/tachdjir.jpg",
                category: "community",
                title: "حملة تشجير بيئية",
                description: "مشاركة الكشافة في حملة التشجير الوطنية بزراعة 01 مليون شجرة",
                date: "25 أكتوبر 2025"
            },
            {
                id: 6,
                src: "images/wikend.jpg",
                category: "camping",
                title: "معسكر نهاية الأسبوع",
                description: "معسكر تدريبي مكثف لمدة 3 أيام في منطقة زموري",
                date: "11 جويلية 2025"
            },
            {
                id: 7,
                src: "images/acte.jpg",
                category: "training",
                title: "ورشة العقد والحبال",
                description: "ورشة عملية لتعلم فنون العقد الكشفية واستخدامات الحبال",
                date: "25 جويلية 2024"
            },
            {
                id: 8,
                src: "images/plage.jpg",
                category: "hiking",
                title: "رحلة شاطئية",
                description: "رحلة إلى الشاطئ لأنشطة السباحة والألعاب المائية - السوانين، سيدي داود",
                date: "01 جانفي 2025"
            },
            {
                id: 9,
                src: "images/badge.jpg",
                category: "events",
                title: "حفل توزيع الشارات",
                description: "حفل تكريمي لتوزيع الشارات والجوائز على المتميزين",
                date: "26 فيفري 2025"
            },
            {
                id: 10,
                src: "images/nettoyage.jpg",
                category: "community",
                title: "حملة تنظيف الشوارع",
                description: "حملة تنظيف الشوارع بسيدي داود ضمن أنشطة خدمة المجتمع",
                date: "13 سبتمبر 2025"
            },
            {
                id: 11,
                src: "images/hiver.jpg",
                category: "camping",
                title: "معسكر الشتاء",
                description: "معسكر شتوي لتعلم مهارات البقاء في الظروف الصعبة",
                date: "01 فيفري 2024"
            },
            {
                id: 12,
                src: "images/commandement.jpg",
                category: "training",
                title: "دورة القيادة",
                description: "دورة تأهيل القادة الجدد بمشاركة 35 متقدماً",
                date: "01 ديسمبر 2024"
            },
            {
                id: 13,
                src: "images/quran2.jpg",
                category: "community",
                title: "دورة تحفيظ القرآن",
                description: "دورة تحفيظ القرآن تحت إشراف القائد: شلال جابر",
                date: "14 نوفمبر 2025"
            },
            {
                id: 14,
                src: "images/Réunions.jpg",
                category: "meeting",
                title: "اللقاء الأول لمحافظي الأفواج",
                description: "لقاء محافظي الأفواج بمقر فوج الشهيد أحمد زبانة زعاترة بلدية زموري",
                date: "14 نوفمبر 2025"
            },
            {
                id: 15,
                src: "images/27052023.jpg",
                category: "gallery",
                title: "إحياء ذكرى تأسيس الكشافةالجزائرية",
                description: "إحياء ذكرى  تأسيس الكشافةالجزائرية بدار الشباب",
                date: "27 ماي 2023"
            },
            {
                id: 16,
                src: "images/volunteer.jpg",
                category: "events",
                title: "اليوم العالمي للتطوع",
                description: "مناسبة نُجدّد فيها قيم العطاء، خدمة المجتمع، وروح المبادرة",
                date: "05 ديسمبر 2025"
            },
            {
                id: 17,
                src: "images/volunteer1.jpg",
                category: "events",
                title: "اليوم العالمي للتطوع",
                description: "مناسبة نُجدّد فيها قيم العطاء، خدمة المجتمع، وروح المبادرة",
                date: "05 ديسمبر 2025"
            },
            {
                id: 18,
                src: "images/volunteer2.jpg",
                category: "events",
                title: "اليوم العالمي للتطوع",
                description: "مناسبة نُجدّد فيها قيم العطاء، خدمة المجتمع، وروح المبادرة",
                date: "05 ديسمبر 2025"
            },
            {
                id: 19,
                src: "images/wad-hilal.jpg",
                category: "events",
                title: "الذكرى 71 لمعركة واد هلال",
                description: "مشاركة فوج القدس في إحياء الذكرى 71 لمعركة واد هلال بقرية شرابة – بلدية بغلية",
                date: "22 ديسمبر 2025"
            },
          
            {
                id: 19,
                src: "images/wad-hilal2.jpg",
                category: "events",
                title: "الذكرى 71 لمعركة واد هلال",
                description: "مشاركة فوج القدس في إحياء الذكرى 71 لمعركة واد هلال بقرية شرابة – بلدية بغلية",
                date: "22 ديسمبر 2025"
            },
                {
                id: 19,
                src: "images/wad-hilal3.jpg",
                category: "events",
                title: "الذكرى 71 لمعركة واد هلال",
                description: "مشاركة فوج القدس في إحياء الذكرى 71 لمعركة واد هلال بقرية شرابة – بلدية بغلية",
                date: "22 ديسمبر 2025"
            },
                {
                id: 19,
                src: "images/wad-hilal4.jpg",
                category: "events",
                title: "الذكرى 71 لمعركة واد هلال",
                description: "مشاركة فوج القدس في إحياء الذكرى 71 لمعركة واد هلال بقرية شرابة – بلدية بغلية",
                date: "22 ديسمبر 2025"
            },
                            {
                id: 19,
                src: "images/wad-hilal5.jpg",
                category: "events",
                title: "الذكرى 71 لمعركة واد هلال",
                description: "مشاركة فوج القدس في إحياء الذكرى 71 لمعركة واد هلال بقرية شرابة – بلدية بغلية",
                date: "22 ديسمبر 2025"
            },
        ];


    let currentFilter = 'all';
    let displayedImages = 8;
    let currentImageIndex = 0;

    // تهيئة المعرض
    function initGallery() {
        renderGallery();
        setupEventListeners();
    }

    // عرض الصور
    function renderGallery() {
        const galleryContainer = document.getElementById('gallery-container');
        if (!galleryContainer) return;
        
        galleryContainer.innerHTML = '';

        const filteredImages = currentFilter === 'all'
            ? galleryImages
            : galleryImages.filter(img => img.category === currentFilter);

        const imagesToShow = filteredImages.slice(0, displayedImages);

        imagesToShow.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = `gallery-item ${image.category}`;
            galleryItem.setAttribute('data-index', index);

            galleryItem.innerHTML = `
                <img src="${image.src}" alt="${image.title}" loading="lazy">
                <div class="gallery-overlay">
                    <div class="gallery-category">${getCategoryName(image.category)}</div>
                    <div class="gallery-title">${image.title}</div>
                    <div class="gallery-date">
                        <i class="fas fa-calendar"></i> ${image.date}
                    </div>
                </div>
            `;

            galleryItem.addEventListener('click', () => openLightbox(index, filteredImages));
            galleryContainer.appendChild(galleryItem);
        });

        // إظهار أو إخفاء زر "عرض المزيد"
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            if (displayedImages >= filteredImages.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-flex';
            }
        }
    }

    // فتح معرض الضوء
    function openLightbox(index, images) {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;
        
        const image = images[index];
        currentImageIndex = index;

        document.getElementById('lightbox-img').src = image.src;
        document.getElementById('lightbox-title').textContent = image.title;
        document.getElementById('lightbox-description').textContent = image.description;
        document.getElementById('lightbox-date').textContent = image.date;
        document.getElementById('lightbox-category').textContent = getCategoryName(image.category);

        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // إغلاق معرض الضوء
    function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // التنقل بين الصور
    function navigateLightbox(direction) {
        const filteredImages = currentFilter === 'all'
            ? galleryImages
            : galleryImages.filter(img => img.category === currentFilter);

        if (direction === 'next') {
            currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
        } else {
            currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
        }

        openLightbox(currentImageIndex, filteredImages);
    }

    // الحصول على اسم التصنيف
    function getCategoryName(category) {
        const categories = {
            'all': 'الكل',
            'camping': 'المخيمات',
            'hiking': 'الخرجات',
            'training': 'التدريبات',
            'events': 'المناسبات',
            'community': 'خدمة المجتمع',
            'gallery': 'معرض'
        };
        return categories[category] || category;
    }

    // إعداد مستمعي الأحداث
    function setupEventListeners() {
        // فلاتر التصنيف
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter');
                displayedImages = 8;
                renderGallery();
            });
        });

        // زر عرض المزيد
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                displayedImages += 4;
                renderGallery();
            });
        }

        // معرض الضوء
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
        if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox('next'));

        // إغلاق معرض الضوء بالضغط خارج الصورة
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }

        // إغلاق معرض الضوء بالضغط على Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
            if (e.key === 'ArrowRight') {
                navigateLightbox('next');
            }
            if (e.key === 'ArrowLeft') {
                navigateLightbox('prev');
            }
        });
    }

    // تحويل التواريخ من نص إلى كائن Date للفرز
    function parseDate(dateStr) {
        const months = {
            "جانفي": 0, "فيفري": 1, "مارس": 2, "أفريل": 3, "ماي": 4,
            "جوان": 5, "جويلية": 6, "أوت": 7, "سبتمبر": 8, "أكتوبر": 9,
            "نوفمبر": 10, "ديسمبر": 11
        };

        const parts = dateStr.trim().split(" ");
        if (parts.length !== 3) return new Date();
        const day = parseInt(parts[0]);
        const month = months[parts[1]] ?? 0;
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
    }

    // ترتيب المصفوفة من الأحدث إلى الأقدم
    const sortedGallery = galleryImages.sort((a, b) => parseDate(b.date) - parseDate(a.date));

    // إنشاء معرض الصور ديناميكيًا
    const galleryContainer = document.querySelector(".gallery-grid");
    if (galleryContainer) {
        galleryContainer.innerHTML = "";
        sortedGallery.forEach(img => {
            const card = document.createElement("div");
            card.classList.add("gallery-item");
            card.innerHTML = `
                <img src="${img.src}" alt="${img.title}" loading="lazy">
                <div class="gallery-overlay">
                    <span class="gallery-category">${img.category}</span>
                    <h4 class="gallery-title">${img.title}</h4>
                    <span class="gallery-date"><i class="fas fa-calendar"></i> ${img.date}</span>
                    <p>${img.description}</p>
                </div>
            `;
            galleryContainer.appendChild(card);
        });
    }

    // تهيئة المعرض إذا كانت الصفحة تحتوي على معرض
    if (document.getElementById('gallery-container') || document.querySelector('.gallery-grid')) {
        initGallery();
    }
});