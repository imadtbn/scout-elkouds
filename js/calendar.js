// calendar.js
document.addEventListener('DOMContentLoaded', function () {
        // بيانات الأنشطة
        const activitiesData = {
            '2025-10': {
                31: {
                    title: 'ذكرى إندلاع ثورة التحرير',
                    time: '11:30 ليلا - 00:00 -',
                    location: 'مقبرة الشهداء - سيدي داود',
                    participants: 'جميع المراحل',
                    leader: 'القائد محمد',
                    description: 'رفع العلم الوطني تخليدا لذكرى إندلاع ثورة التحرير المجيدة 01 نوفمبر 1954.',
                    type: 'خرجة'
                },
            },
            '2025-11': {
                1: {
                    title: 'إحياء ذكرى 01 نوفمبر',
                    time: '08:00 صباحا - 10:30',
                    location: 'مقبرة الشهداء + الشباب - سيدي داود',
                    participants: 'القيادة والأشبال',
                    leader: 'القائد سعيد شعباني',
                    description: 'وضع إكليل من الزهور على أرواح الشعداء + عرض وثائقي وتلاوة النشيد الوطني تكريما لشهداء الثورة.',
                    type: 'نشاط وطني'
                },
                28: {
                    title: 'إستئناف حصص الكشفية',
                    time: '15:00زوالا',
                    location: 'مقر الفوج المكتبة المركزية - سيدي داود',
                    participants: 'القيادة الفتية',
                    leader: 'القائد سعيد + محمد',
                    description: 'إستئناف حصص الكشفية، الإلتحاق بمقر الفوج بالمكتبة المركزية بسيدي داود على ساعة 15:00 مساء.',
                    type: 'اللقاء الأول'
                },
            }
        };


        // بيانات الأنشطة القادمة

        const upcomingEvents = [
            {
                date: '2025-10-31',
                title: 'رفع العلم الوطني',
                type: 'ذكرى إنداع ثورة التحرير المجيدة',
                time: '11:30 ليلا',
                location: 'مقبرة الشهداء',
                leader: 'القائد محمد'
            },

            {
                date: '2025-11-01',
                title: 'وضع إكيل من الزهور',
                type: 'ذكرى إنداع ثورة التحرير المجيدة',
                time: '08:00 صباحا',
                location: 'مقبرة الشهداء',
                leader: 'القائد محمد'
            },
        ];


    let currentDate = new Date();

    // تهيئة التقويم
    function initCalendar() {
        if (!document.getElementById('calendar-days')) return;
        
        updateCalendar();
        renderUpcomingEvents();
    }

    // تحديث التقويم
    function updateCalendar() {
        const monthYear = document.getElementById('current-month-year');
        const calendarDays = document.getElementById('calendar-days');
        
        if (!monthYear || !calendarDays) return;

        const monthNames = [
            'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان',
            'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];

        monthYear.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        calendarDays.innerHTML = '';

        // إضافة أيام الأسبوع
        const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            calendarDays.appendChild(dayElement);
        });

        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const startingDay = firstDay.getDay();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

        // إضافة أيام فارغة قبل أول يوم من الشهر
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-date empty';
            calendarDays.appendChild(emptyDay);
        }

        // إضافة أيام الشهر
        const today = new Date();
        const currentMonthKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;

        for (let day = 1; day <= daysInMonth; day++) {
            const dateElement = document.createElement('div');
            dateElement.className = 'calendar-date';

            if (currentDate.getFullYear() === today.getFullYear() &&
                currentDate.getMonth() === today.getMonth() &&
                day === today.getDate()) {
                dateElement.classList.add('current-day');
            }

            if (activitiesData[currentMonthKey] && activitiesData[currentMonthKey][day]) {
                dateElement.classList.add('event');
                const event = activitiesData[currentMonthKey][day];

                dateElement.innerHTML = `
                    ${day}
                    <div class="event-dot"></div>
                    <div class="event-title">${event.title}</div>
                    <div class="event-time">${event.time.split(' - ')[0]}</div>
                `;

                dateElement.addEventListener('click', () => openEventModal(event, day));
            } else {
                dateElement.textContent = day;
            }

            calendarDays.appendChild(dateElement);
        }
    }

    // عرض الأنشطة القادمة
    function renderUpcomingEvents() {
        const eventsList = document.getElementById('upcoming-events-list');
        if (!eventsList) return;
        
        eventsList.innerHTML = '';

        upcomingEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';

            eventCard.innerHTML = `
                <div class="event-card-header">
                    <div class="event-date">${formatDate(event.date)}</div>
                    <div class="event-type">${event.type}</div>
                </div>
                <h4>${event.title}</h4>
                <p>نشاط كشفي ${event.type} يقام في ${event.location}</p>
                <div class="event-details">
                    <div class="event-detail">
                        <i class="fas fa-clock"></i>
                        <span>${event.time}</span>
                    </div>
                    <div class="event-detail">
                        <i class="fas fa-user-tie"></i>
                        <span>${event.leader}</span>
                    </div>
                </div>
                <button class="event-button">التفاصيل والتسجيل</button>
            `;

            eventsList.appendChild(eventCard);
        });
    }

    // فتح نافذة تفاصيل النشاط
    function openEventModal(event, day) {
        const modal = document.getElementById('event-modal');
        if (!modal) return;
        
        const monthNames = [
            'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان',
            'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];

        document.getElementById('modal-event-title').textContent = event.title;
        document.getElementById('modal-event-date').textContent =
            `${getDayName(currentDate.getDay())} ${day} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        document.getElementById('modal-event-time').textContent = event.time;
        document.getElementById('modal-event-location').textContent = event.location;
        document.getElementById('modal-event-participants').textContent = event.participants;
        document.getElementById('modal-event-leader').textContent = event.leader;
        document.getElementById('modal-event-description').textContent = event.description;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // وظائف مساعدة
    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getDate()} ${getMonthName(date.getMonth())}`;
    }

    function getMonthName(month) {
        const months = [
            'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان',
            'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];
        return months[month];
    }

    function getDayName(day) {
        const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        return days[day];
    }

    // أحداث الأزرار
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendar();
        });
    }

    // إغلاق النافذة المنبثقة
    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            const modal = document.getElementById('event-modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // إغلاق النافذة بالضغط خارجها
    const eventModal = document.getElementById('event-modal');
    if (eventModal) {
        eventModal.addEventListener('click', (e) => {
            if (e.target === eventModal) {
                eventModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // إغلاق النافذة بالضغط على Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('event-modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });

    // تهيئة التقويم إذا كان موجودًا في الصفحة
    if (document.getElementById('calendar-days')) {
        initCalendar();
    }
});