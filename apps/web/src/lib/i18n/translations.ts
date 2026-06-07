export type LangCode = 'uz' | 'ru' | 'en' | 'ky' | 'tg' | 'kk' | 'hy' | 'az' | 'tr';

export const LANGUAGES: { code: LangCode; label: string; flag: string; nativeName: string }[] = [
  { code: 'uz', label: 'Uzbek',       flag: '🇺🇿', nativeName: "O'zbek"     },
  { code: 'ru', label: 'Russian',     flag: '🇷🇺', nativeName: 'Русский'    },
  { code: 'en', label: 'English',     flag: '🇬🇧', nativeName: 'English'    },
  { code: 'ky', label: 'Kyrgyz',      flag: '🇰🇬', nativeName: 'Кыргызча'  },
  { code: 'tg', label: 'Tajik',       flag: '🇹🇯', nativeName: 'Тоҷикӣ'    },
  { code: 'kk', label: 'Kazakh',      flag: '🇰🇿', nativeName: 'Қазақша'   },
  { code: 'hy', label: 'Armenian',    flag: '🇦🇲', nativeName: 'Հայերեն'   },
  { code: 'az', label: 'Azerbaijani', flag: '🇦🇿', nativeName: 'Azərbaycan' },
  { code: 'tr', label: 'Turkish',     flag: '🇹🇷', nativeName: 'Türkçe'    },
];

export type TranslationKeys = {
  // Common actions
  save: string; cancel: string; delete: string; edit: string; add: string;
  search: string; filter: string; export: string; loading: string; confirm: string;
  close: string; back: string; next: string; submit: string; yes: string; no: string;
  active: string; inactive: string; status: string; actions: string;
  name: string; email: string; phone: string; date: string; total: string;
  settings: string; refresh: string; view: string; create: string; update: string;
  success: string; error: string; warning: string; info: string;
  all: string; none: string; select: string; upload: string; download: string;
  // Navigation items
  nav_dashboard: string; nav_employees: string; nav_organization: string;
  nav_attendance: string; nav_leave: string; nav_payroll: string; nav_kpi: string;
  nav_recruitment: string; nav_onboarding: string; nav_tasks: string;
  nav_documents: string; nav_training: string; nav_social: string;
  nav_announcements: string; nav_helpdesk: string; nav_analytics: string;
  nav_ai: string; nav_automation: string; nav_integrations: string; nav_settings: string;
  // Nav groups
  group_main: string; group_hr_operations: string; group_talent_work: string;
  group_communication: string; group_analytics_ai: string; group_integrations: string;
  // Header
  notifications: string; profile: string; logout: string; language: string;
  no_notifications: string; mark_all_read: string;
  // Dashboard
  welcome_morning: string; welcome_afternoon: string; welcome_evening: string;
  total_employees: string; present_today: string; on_leave: string;
  new_this_month: string; attendance_rate: string; avg_performance: string;
  open_positions: string; pending_tasks: string; recent_hires: string;
  pending_leaves: string; quick_stats: string;
  // Attendance
  check_in: string; check_out: string; present: string; late: string; absent: string;
  work_hours: string; overtime: string; shift: string; location: string;
  // Leave
  leave_request: string; approved: string; rejected: string; pending: string;
  leave_type: string; leave_balance: string; annual_leave: string; sick_leave: string;
  // Payroll
  salary: string; bonus: string; deductions: string; net_salary: string;
  gross_salary: string; tax: string; payslip: string;
  // Employees
  department: string; position: string; employee_id: string; hire_date: string;
  full_name: string; gender: string; contract_type: string; branch: string;
  // Auth
  login: string; register: string; password: string; forgot_password: string;
  confirm_password: string; sign_in: string; sign_up: string;
  have_account: string; no_account: string;
  // Onboarding
  onboarding: string; offboarding: string; tasks_completed: string; workflow: string;
  template: string; assign: string; progress: string;
  // Automation
  automation: string; rule: string; trigger: string; action: string;
  notification: string; telegram: string; sms: string; channel: string;
  // KPI
  target: string; actual: string; score: string; performance: string; kpi: string;
  // Recruitment
  vacancy: string; candidate: string; interview: string; offer: string; hired: string;
  // Integrations
  integration: string; sync: string; connected: string; disconnected: string; test: string;
};

const uz: TranslationKeys = {
  // Common
  save: 'Saqlash', cancel: "Bekor qilish", delete: "O'chirish", edit: 'Tahrirlash',
  add: "Qo'shish", search: 'Qidirish', filter: 'Filtr', export: 'Eksport',
  loading: 'Yuklanmoqda...', confirm: 'Tasdiqlash', close: 'Yopish', back: 'Orqaga',
  next: 'Keyingisi', submit: 'Yuborish', yes: 'Ha', no: "Yo'q", active: 'Faol',
  inactive: 'Faol emas', status: 'Holat', actions: 'Amallar', name: 'Ism',
  email: 'Email', phone: 'Telefon', date: 'Sana', total: 'Jami', settings: 'Sozlamalar',
  refresh: 'Yangilash', view: "Ko'rish", create: 'Yaratish', update: 'Yangilash',
  success: 'Muvaffaqiyatli', error: 'Xato', warning: 'Ogohlantirish', info: "Ma'lumot",
  all: 'Barchasi', none: 'Hech biri', select: 'Tanlash', upload: 'Yuklash', download: "Yuklab olish",
  // Nav
  nav_dashboard: 'Bosh sahifa', nav_employees: 'Xodimlar', nav_organization: 'Tashkilot',
  nav_attendance: 'Davomat', nav_leave: "Ta'tillar", nav_payroll: 'Maosh',
  nav_kpi: 'KPI', nav_recruitment: 'Ishga qabul', nav_onboarding: 'Onboarding',
  nav_tasks: 'Vazifalar', nav_documents: 'Hujjatlar', nav_training: "Ta'lim",
  nav_social: 'Yangiliklar', nav_announcements: "E'lonlar", nav_helpdesk: 'Yordam',
  nav_analytics: 'Tahlil', nav_ai: 'AI Yordamchi', nav_automation: 'Avtomatika',
  nav_integrations: 'Integratsiyalar', nav_settings: 'Sozlamalar',
  // Groups
  group_main: 'Asosiy', group_hr_operations: 'HR Operatsiyalar',
  group_talent_work: 'Iste\'dod va Ish', group_communication: 'Muloqot',
  group_analytics_ai: 'Tahlil va AI', group_integrations: 'Integratsiyalar',
  // Header
  notifications: 'Bildirishnomalar', profile: 'Profil', logout: 'Chiqish',
  language: 'Til', no_notifications: "Bildirishnomalar yo'q", mark_all_read: 'Barchasini o\'qilgan deb belgilash',
  // Dashboard
  welcome_morning: 'Xayrli tong', welcome_afternoon: 'Xayrli kun', welcome_evening: 'Xayrli kech',
  total_employees: 'Jami xodimlar', present_today: 'Bugun keldi', on_leave: "Ta'tilda",
  new_this_month: 'Bu oy yangi', attendance_rate: 'Davomat foizi', avg_performance: "O'rtacha samaradorlik",
  open_positions: 'Ochiq vakansiyalar', pending_tasks: 'Kutilayotgan vazifalar',
  recent_hires: "So'nggi qabul qilinganlar", pending_leaves: "Kutilayotgan ta'tillar", quick_stats: 'Tezkor statistika',
  // Attendance
  check_in: 'Kelish', check_out: 'Ketish', present: 'Keldi', late: 'Kech keldi',
  absent: 'Kelmadi', work_hours: 'Ish soatlari', overtime: 'Qo\'shimcha vaqt',
  shift: 'Smena', location: 'Joylashuv',
  // Leave
  leave_request: "Ta'til so'rovi", approved: 'Tasdiqlangan', rejected: 'Rad etilgan',
  pending: 'Kutilmoqda', leave_type: "Ta'til turi", leave_balance: "Ta'til qoldig'i",
  annual_leave: 'Yillik ta\'til', sick_leave: 'Kasal ta\'til',
  // Payroll
  salary: 'Maosh', bonus: 'Mukofot', deductions: 'Ushlanmalar', net_salary: 'Toza maosh',
  gross_salary: 'Yalpi maosh', tax: 'Soliq', payslip: 'Maosh varaqasi',
  // Employees
  department: "Bo'lim", position: 'Lavozim', employee_id: 'Xodim ID', hire_date: 'Ishga kirgan sana',
  full_name: "To'liq ism", gender: 'Jins', contract_type: 'Shartnoma turi', branch: 'Filial',
  // Auth
  login: 'Kirish', register: "Ro'yxatdan o'tish", password: 'Parol',
  forgot_password: 'Parolni unutdingizmi?', confirm_password: 'Parolni tasdiqlang',
  sign_in: 'Kirish', sign_up: "Ro'yxatdan o'tish",
  have_account: 'Hisobingiz bormi?', no_account: "Hisobingiz yo'qmi?",
  // Onboarding
  onboarding: 'Onboarding', offboarding: 'Offboarding', tasks_completed: 'Bajarilgan vazifalar',
  workflow: 'Ish jarayoni', template: 'Shablon', assign: 'Tayinlash', progress: 'Jarayon',
  // Automation
  automation: 'Avtomatika', rule: 'Qoida', trigger: 'Ishga tushiruvchi', action: 'Harakat',
  notification: 'Bildirishnoma', telegram: 'Telegram', sms: 'SMS', channel: 'Kanal',
  // KPI
  target: 'Maqsad', actual: 'Haqiqiy', score: 'Ball', performance: 'Samaradorlik', kpi: 'KPI',
  // Recruitment
  vacancy: 'Vakansiya', candidate: 'Nomzod', interview: 'Suhbat', offer: 'Taklif', hired: 'Qabul qilindi',
  // Integrations
  integration: 'Integratsiya', sync: 'Sinxronlash', connected: "Ulangan", disconnected: "Ulanmagan", test: 'Test',
};

const ru: TranslationKeys = {
  save: 'Сохранить', cancel: 'Отмена', delete: 'Удалить', edit: 'Редактировать',
  add: 'Добавить', search: 'Поиск', filter: 'Фильтр', export: 'Экспорт',
  loading: 'Загрузка...', confirm: 'Подтвердить', close: 'Закрыть', back: 'Назад',
  next: 'Далее', submit: 'Отправить', yes: 'Да', no: 'Нет', active: 'Активный',
  inactive: 'Неактивный', status: 'Статус', actions: 'Действия', name: 'Имя',
  email: 'Email', phone: 'Телефон', date: 'Дата', total: 'Итого', settings: 'Настройки',
  refresh: 'Обновить', view: 'Просмотр', create: 'Создать', update: 'Обновить',
  success: 'Успешно', error: 'Ошибка', warning: 'Предупреждение', info: 'Информация',
  all: 'Все', none: 'Нет', select: 'Выбрать', upload: 'Загрузить', download: 'Скачать',
  nav_dashboard: 'Главная', nav_employees: 'Сотрудники', nav_organization: 'Организация',
  nav_attendance: 'Посещаемость', nav_leave: 'Отпуска', nav_payroll: 'Зарплата',
  nav_kpi: 'КПЭ', nav_recruitment: 'Рекрутинг', nav_onboarding: 'Адаптация',
  nav_tasks: 'Задачи', nav_documents: 'Документы', nav_training: 'Обучение',
  nav_social: 'Лента', nav_announcements: 'Объявления', nav_helpdesk: 'Хелпдеск',
  nav_analytics: 'Аналитика', nav_ai: 'ИИ помощник', nav_automation: 'Автоматизация',
  nav_integrations: 'Интеграции', nav_settings: 'Настройки',
  group_main: 'Главное', group_hr_operations: 'HR Операции',
  group_talent_work: 'Таланты и Работа', group_communication: 'Коммуникация',
  group_analytics_ai: 'Аналитика и ИИ', group_integrations: 'Интеграции',
  notifications: 'Уведомления', profile: 'Профиль', logout: 'Выйти',
  language: 'Язык', no_notifications: 'Нет уведомлений', mark_all_read: 'Отметить все прочитанными',
  welcome_morning: 'Доброе утро', welcome_afternoon: 'Добрый день', welcome_evening: 'Добрый вечер',
  total_employees: 'Всего сотрудников', present_today: 'Присутствуют сегодня', on_leave: 'В отпуске',
  new_this_month: 'Новые в этом месяце', attendance_rate: 'Посещаемость', avg_performance: 'Средняя эффективность',
  open_positions: 'Открытые вакансии', pending_tasks: 'Ожидающие задачи',
  recent_hires: 'Недавно принятые', pending_leaves: 'Ожидающие отпуска', quick_stats: 'Быстрая статистика',
  check_in: 'Приход', check_out: 'Уход', present: 'Присутствует', late: 'Опоздал', absent: 'Отсутствует',
  work_hours: 'Рабочие часы', overtime: 'Сверхурочные', shift: 'Смена', location: 'Местоположение',
  leave_request: 'Заявка на отпуск', approved: 'Одобрено', rejected: 'Отклонено',
  pending: 'Ожидает', leave_type: 'Тип отпуска', leave_balance: 'Остаток отпуска',
  annual_leave: 'Ежегодный отпуск', sick_leave: 'Больничный',
  salary: 'Зарплата', bonus: 'Премия', deductions: 'Вычеты', net_salary: 'Чистая зарплата',
  gross_salary: 'Валовая зарплата', tax: 'Налог', payslip: 'Расчётный лист',
  department: 'Отдел', position: 'Должность', employee_id: 'ID сотрудника', hire_date: 'Дата найма',
  full_name: 'Полное имя', gender: 'Пол', contract_type: 'Тип договора', branch: 'Филиал',
  login: 'Войти', register: 'Зарегистрироваться', password: 'Пароль',
  forgot_password: 'Забыли пароль?', confirm_password: 'Подтвердите пароль',
  sign_in: 'Войти', sign_up: 'Зарегистрироваться',
  have_account: 'Уже есть аккаунт?', no_account: 'Нет аккаунта?',
  onboarding: 'Адаптация', offboarding: 'Увольнение', tasks_completed: 'Выполненные задачи',
  workflow: 'Процесс', template: 'Шаблон', assign: 'Назначить', progress: 'Прогресс',
  automation: 'Автоматизация', rule: 'Правило', trigger: 'Триггер', action: 'Действие',
  notification: 'Уведомление', telegram: 'Telegram', sms: 'СМС', channel: 'Канал',
  target: 'Цель', actual: 'Фактически', score: 'Балл', performance: 'Эффективность', kpi: 'КПЭ',
  vacancy: 'Вакансия', candidate: 'Кандидат', interview: 'Интервью', offer: 'Оффер', hired: 'Принят',
  integration: 'Интеграция', sync: 'Синхронизация', connected: 'Подключено', disconnected: 'Отключено', test: 'Тест',
};

const en: TranslationKeys = {
  save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit',
  add: 'Add', search: 'Search', filter: 'Filter', export: 'Export',
  loading: 'Loading...', confirm: 'Confirm', close: 'Close', back: 'Back',
  next: 'Next', submit: 'Submit', yes: 'Yes', no: 'No', active: 'Active',
  inactive: 'Inactive', status: 'Status', actions: 'Actions', name: 'Name',
  email: 'Email', phone: 'Phone', date: 'Date', total: 'Total', settings: 'Settings',
  refresh: 'Refresh', view: 'View', create: 'Create', update: 'Update',
  success: 'Success', error: 'Error', warning: 'Warning', info: 'Info',
  all: 'All', none: 'None', select: 'Select', upload: 'Upload', download: 'Download',
  nav_dashboard: 'Dashboard', nav_employees: 'Employees', nav_organization: 'Organization',
  nav_attendance: 'Attendance', nav_leave: 'Leave', nav_payroll: 'Payroll',
  nav_kpi: 'KPI', nav_recruitment: 'Recruitment', nav_onboarding: 'Onboarding',
  nav_tasks: 'Tasks', nav_documents: 'Documents', nav_training: 'Training (LMS)',
  nav_social: 'Social Feed', nav_announcements: 'Announcements', nav_helpdesk: 'Help Desk',
  nav_analytics: 'Analytics', nav_ai: 'AI Assistant', nav_automation: 'Automation',
  nav_integrations: 'Integrations', nav_settings: 'Settings',
  group_main: 'Main', group_hr_operations: 'HR Operations',
  group_talent_work: 'Talent & Work', group_communication: 'Communication',
  group_analytics_ai: 'Analytics & AI', group_integrations: 'Integrations',
  notifications: 'Notifications', profile: 'Profile', logout: 'Sign out',
  language: 'Language', no_notifications: 'No notifications', mark_all_read: 'Mark all as read',
  welcome_morning: 'Good morning', welcome_afternoon: 'Good afternoon', welcome_evening: 'Good evening',
  total_employees: 'Total employees', present_today: 'Present today', on_leave: 'On leave',
  new_this_month: 'New this month', attendance_rate: 'Attendance rate', avg_performance: 'Avg. performance',
  open_positions: 'Open positions', pending_tasks: 'Pending tasks',
  recent_hires: 'Recent hires', pending_leaves: 'Pending leaves', quick_stats: 'Quick stats',
  check_in: 'Check in', check_out: 'Check out', present: 'Present', late: 'Late', absent: 'Absent',
  work_hours: 'Work hours', overtime: 'Overtime', shift: 'Shift', location: 'Location',
  leave_request: 'Leave request', approved: 'Approved', rejected: 'Rejected',
  pending: 'Pending', leave_type: 'Leave type', leave_balance: 'Leave balance',
  annual_leave: 'Annual leave', sick_leave: 'Sick leave',
  salary: 'Salary', bonus: 'Bonus', deductions: 'Deductions', net_salary: 'Net salary',
  gross_salary: 'Gross salary', tax: 'Tax', payslip: 'Payslip',
  department: 'Department', position: 'Position', employee_id: 'Employee ID', hire_date: 'Hire date',
  full_name: 'Full name', gender: 'Gender', contract_type: 'Contract type', branch: 'Branch',
  login: 'Sign in', register: 'Register', password: 'Password',
  forgot_password: 'Forgot password?', confirm_password: 'Confirm password',
  sign_in: 'Sign in', sign_up: 'Sign up',
  have_account: 'Already have an account?', no_account: "Don't have an account?",
  onboarding: 'Onboarding', offboarding: 'Offboarding', tasks_completed: 'Tasks completed',
  workflow: 'Workflow', template: 'Template', assign: 'Assign', progress: 'Progress',
  automation: 'Automation', rule: 'Rule', trigger: 'Trigger', action: 'Action',
  notification: 'Notification', telegram: 'Telegram', sms: 'SMS', channel: 'Channel',
  target: 'Target', actual: 'Actual', score: 'Score', performance: 'Performance', kpi: 'KPI',
  vacancy: 'Vacancy', candidate: 'Candidate', interview: 'Interview', offer: 'Offer', hired: 'Hired',
  integration: 'Integration', sync: 'Sync', connected: 'Connected', disconnected: 'Disconnected', test: 'Test',
};

const ky: TranslationKeys = {
  save: 'Сактоо', cancel: 'Жокко чыгаруу', delete: 'Жок кылуу', edit: 'Өзгөртүү',
  add: 'Кошуу', search: 'Издөө', filter: 'Чыпка', export: 'Экспорт',
  loading: 'Жүктөлүүдө...', confirm: 'Ырастоо', close: 'Жабуу', back: 'Артка',
  next: 'Кийинки', submit: 'Жөнөтүү', yes: 'Ооба', no: 'Жок', active: 'Жигердүү',
  inactive: 'Жигерсиз', status: 'Статус', actions: 'Аракеттер', name: 'Аты',
  email: 'Email', phone: 'Телефон', date: 'Дата', total: 'Жалпы', settings: 'Жөндөөлөр',
  refresh: 'Жаңылоо', view: 'Көрүү', create: 'Түзүү', update: 'Жаңылоо',
  success: 'Ийгиликтүү', error: 'Ката', warning: 'Эскертүү', info: 'Маалымат',
  all: 'Баары', none: 'Эч нерсе', select: 'Тандоо', upload: 'Жүктөө', download: 'Жүктөп алуу',
  nav_dashboard: 'Башкы бет', nav_employees: 'Кызматкерлер', nav_organization: 'Уюм',
  nav_attendance: 'Катышуу', nav_leave: 'Өргүү', nav_payroll: 'Маяна',
  nav_kpi: 'КПК', nav_recruitment: 'Иштке кабыл алуу', nav_onboarding: 'Адаптация',
  nav_tasks: 'Тапшырмалар', nav_documents: 'Документтер', nav_training: 'Окутуу',
  nav_social: 'Жаңылыктар', nav_announcements: 'Жарыялар', nav_helpdesk: 'Жардам',
  nav_analytics: 'Аналитика', nav_ai: 'AI Жардамчы', nav_automation: 'Автоматика',
  nav_integrations: 'Интеграциялар', nav_settings: 'Жөндөөлөр',
  group_main: 'Негизги', group_hr_operations: 'HR Операциялар',
  group_talent_work: 'Таланттар жана Иш', group_communication: 'Байланыш',
  group_analytics_ai: 'Аналитика жана AI', group_integrations: 'Интеграциялар',
  notifications: 'Билдирүүлөр', profile: 'Профиль', logout: 'Чыгуу',
  language: 'Тил', no_notifications: 'Билдирүүлөр жок', mark_all_read: 'Бардыгын окулду деп белгилөө',
  welcome_morning: 'Кутман таң', welcome_afternoon: 'Кутман күн', welcome_evening: 'Кутман кеч',
  total_employees: 'Жалпы кызматкерлер', present_today: 'Бүгүн келди', on_leave: 'Өргүүдө',
  new_this_month: 'Бул айда жаңы', attendance_rate: 'Катышуу пайызы', avg_performance: 'Орточо натыйжалуулук',
  open_positions: 'Бош орундар', pending_tasks: 'Күтүлгөн тапшырмалар',
  recent_hires: 'Жакында кабыл алынгандар', pending_leaves: 'Күтүлгөн өргүүлөр', quick_stats: 'Тез статистика',
  check_in: 'Келүү', check_out: 'Кетүү', present: 'Келди', late: 'Кечигип келди', absent: 'Кelmedi',
  work_hours: 'Жумуш сааттары', overtime: 'Кошумча убакыт', shift: 'Смена', location: 'Жайгашуу',
  leave_request: 'Өргүү өтүнүчү', approved: 'Бекитилди', rejected: 'Четке кагылды',
  pending: 'Күтүлүүдө', leave_type: 'Өргүү түрү', leave_balance: 'Өргүү калдыгы',
  annual_leave: 'Жылдык өргүү', sick_leave: 'Ооруп калуу өргүүсү',
  salary: 'Маяна', bonus: 'Сыйлык', deductions: 'Кармалуулар', net_salary: 'Таза маяна',
  gross_salary: 'Жалпы маяна', tax: 'Салык', payslip: 'Маяна баракчасы',
  department: 'Бөлүм', position: 'Кызмат', employee_id: 'Кызматкер ID', hire_date: 'Ишке кирген күн',
  full_name: 'Толук аты', gender: 'Жынысы', contract_type: 'Келишим түрү', branch: 'Филиал',
  login: 'Кирүү', register: 'Катталуу', password: 'Сыр сөз',
  forgot_password: 'Сыр сөздү унуттуңузбу?', confirm_password: 'Сыр сөздү ырастаңыз',
  sign_in: 'Кирүү', sign_up: 'Катталуу',
  have_account: 'Эсебиңиз барбы?', no_account: 'Эсебиңиз жокпу?',
  onboarding: 'Адаптация', offboarding: 'Кетүү процесси', tasks_completed: 'Аткарылган тапшырмалар',
  workflow: 'Иш процесси', template: 'Үлгү', assign: 'Дайындоо', progress: 'Прогресс',
  automation: 'Автоматика', rule: 'Эреже', trigger: 'Триггер', action: 'Аракет',
  notification: 'Билдирүү', telegram: 'Telegram', sms: 'SMS', channel: 'Канал',
  target: 'Максат', actual: 'Чындыгында', score: 'Балл', performance: 'Натыйжалуулук', kpi: 'КПК',
  vacancy: 'Бош орун', candidate: 'Талапкер', interview: 'Маектешүү', offer: 'Сунуш', hired: 'Кабыл алынды',
  integration: 'Интеграция', sync: 'Синхрондоо', connected: 'Туташкан', disconnected: 'Туташпаган', test: 'Текшерүү',
};

const tg: TranslationKeys = {
  save: 'Нигоҳ доштан', cancel: 'Бекор кардан', delete: 'Нест кардан', edit: 'Таҳрир кардан',
  add: 'Илова кардан', search: 'Ҷустуҷӯ', filter: 'Филтр', export: 'Содироти',
  loading: 'Бор шудан...', confirm: 'Тасдиқ кардан', close: 'Бастан', back: 'Бозгашт',
  next: 'Навбатӣ', submit: 'Фиристодан', yes: 'Бале', no: 'Не', active: 'Фаъол',
  inactive: 'Ғайрифаъол', status: 'Вазъият', actions: 'Амалҳо', name: 'Ном',
  email: 'Email', phone: 'Телефон', date: 'Сана', total: 'Ҷамъ', settings: 'Танзимот',
  refresh: 'Навсозӣ', view: 'Дидан', create: 'Сохтан', update: 'Навсозӣ',
  success: 'Муваффақиятона', error: 'Хато', warning: 'Огоҳӣ', info: 'Маълумот',
  all: 'Ҳама', none: 'Ҳеҷ', select: 'Интихоб', upload: 'Боргузорӣ', download: 'Зеробор',
  nav_dashboard: 'Саҳифаи асосӣ', nav_employees: 'Кормандон', nav_organization: 'Созмон',
  nav_attendance: 'Ҳузур', nav_leave: 'Рухсатӣ', nav_payroll: 'Музд',
  nav_kpi: 'КПИ', nav_recruitment: 'Қабули кор', nav_onboarding: 'Адаптатсия',
  nav_tasks: 'Вазифаҳо', nav_documents: 'Ҳуҷҷатҳо', nav_training: 'Омӯзиш',
  nav_social: 'Хабарҳо', nav_announcements: 'Эълонҳо', nav_helpdesk: 'Ёрдам',
  nav_analytics: 'Таҳлил', nav_ai: 'Ёрдамчии AI', nav_automation: 'Автоматикӣ',
  nav_integrations: 'Интегратсияҳо', nav_settings: 'Танзимот',
  group_main: 'Асосӣ', group_hr_operations: 'Амалиёти HR',
  group_talent_work: 'Истеъдод ва Кор', group_communication: 'Муошират',
  group_analytics_ai: 'Таҳлил ва AI', group_integrations: 'Интегратсияҳо',
  notifications: 'Огоҳномаҳо', profile: 'Профил', logout: 'Баромадан',
  language: 'Забон', no_notifications: 'Огоҳномаҳо нест', mark_all_read: 'Ҳама хондашуда нишон додан',
  welcome_morning: 'Субҳ ба хайр', welcome_afternoon: 'Рӯз ба хайр', welcome_evening: 'Шом ба хайр',
  total_employees: 'Ҷамъи кормандон', present_today: 'Имрӯз ҳозир', on_leave: 'Дар рухсатӣ',
  new_this_month: 'Ин моҳ нав', attendance_rate: 'Дарсади ҳузур', avg_performance: 'Самаранокии миёна',
  open_positions: 'Ваканcияҳои кушода', pending_tasks: 'Вазифаҳои интизор',
  recent_hires: 'Охирон қабулшудагон', pending_leaves: 'Рухсатиҳои интизор', quick_stats: 'Омори зуд',
  check_in: 'Омадан', check_out: 'Рафтан', present: 'Ҳозир', late: 'Дер омад', absent: 'Нест',
  work_hours: 'Соатҳои корӣ', overtime: 'Соатҳои изофа', shift: 'Смена', location: 'Ҷойгиршавӣ',
  leave_request: 'Дархости рухсатӣ', approved: 'Тасдиқ шуд', rejected: 'Рад шуд',
  pending: 'Интизор', leave_type: 'Навъи рухсатӣ', leave_balance: 'Мондаи рухсатӣ',
  annual_leave: 'Рухсатии солона', sick_leave: 'Рухсатии беморӣ',
  salary: 'Музд', bonus: 'Мукофот', deductions: 'Кисрҳо', net_salary: 'Музди холис',
  gross_salary: 'Музди умумӣ', tax: 'Андоз', payslip: 'Варақаи музд',
  department: 'Бахш', position: 'Вазифа', employee_id: 'ID корманд', hire_date: 'Санаи қабул',
  full_name: 'Номи пурра', gender: 'Ҷинс', contract_type: 'Навъи шартнома', branch: 'Филиал',
  login: 'Даромадан', register: 'Ба қайд гирифтан', password: 'Рамз',
  forgot_password: 'Рамзро фаромӯш кардед?', confirm_password: 'Рамзро тасдиқ кунед',
  sign_in: 'Даромадан', sign_up: 'Ба қайд гирифтан',
  have_account: 'Ҳисоб доред?', no_account: 'Ҳисоб надоред?',
  onboarding: 'Адаптатсия', offboarding: 'Аз кор рафтан', tasks_completed: 'Вазифаҳои иҷрошуда',
  workflow: 'Ҷараёни кор', template: 'Намуна', assign: 'Таъин кардан', progress: 'Пешрафт',
  automation: 'Автоматикӣ', rule: 'Қоида', trigger: 'Триггер', action: 'Амал',
  notification: 'Огоҳнома', telegram: 'Telegram', sms: 'SMS', channel: 'Канал',
  target: 'Ҳадаф', actual: 'Воқеӣ', score: 'Холҳо', performance: 'Самаранокӣ', kpi: 'КПИ',
  vacancy: 'Вакансия', candidate: 'Номзад', interview: 'Мусоҳиба', offer: 'Пешниҳод', hired: 'Қабул шуд',
  integration: 'Интегратсия', sync: 'Ҳамоҳангсозӣ', connected: 'Пайваст', disconnected: 'Ҷудо', test: 'Санҷиш',
};

const kk: TranslationKeys = {
  save: 'Сақтау', cancel: 'Болдырмау', delete: 'Жою', edit: 'Өңдеу',
  add: 'Қосу', search: 'Іздеу', filter: 'Сүзгі', export: 'Экспорт',
  loading: 'Жүктелуде...', confirm: 'Растау', close: 'Жабу', back: 'Артқа',
  next: 'Келесі', submit: 'Жіберу', yes: 'Иә', no: 'Жоқ', active: 'Белсенді',
  inactive: 'Белсенді емес', status: 'Мәртебе', actions: 'Әрекеттер', name: 'Аты',
  email: 'Email', phone: 'Телефон', date: 'Күн', total: 'Барлығы', settings: 'Параметрлер',
  refresh: 'Жаңарту', view: 'Қарау', create: 'Жасау', update: 'Жаңарту',
  success: 'Сәтті', error: 'Қате', warning: 'Ескерту', info: 'Ақпарат',
  all: 'Барлығы', none: 'Ешнәрсе', select: 'Таңдау', upload: 'Жүктеу', download: 'Жүктеп алу',
  nav_dashboard: 'Басты бет', nav_employees: 'Қызметкерлер', nav_organization: 'Ұйым',
  nav_attendance: 'Қатысу', nav_leave: 'Демалыс', nav_payroll: 'Жалақы',
  nav_kpi: 'ЖКК', nav_recruitment: 'Жалдау', nav_onboarding: 'Бейімдеу',
  nav_tasks: 'Тапсырмалар', nav_documents: 'Құжаттар', nav_training: 'Оқыту',
  nav_social: 'Жаңалықтар', nav_announcements: 'Хабарландырулар', nav_helpdesk: 'Көмек',
  nav_analytics: 'Аналитика', nav_ai: 'AI Көмекші', nav_automation: 'Автоматика',
  nav_integrations: 'Интеграциялар', nav_settings: 'Параметрлер',
  group_main: 'Негізгі', group_hr_operations: 'HR Операциялары',
  group_talent_work: 'Талант және Жұмыс', group_communication: 'Байланыс',
  group_analytics_ai: 'Аналитика және AI', group_integrations: 'Интеграциялар',
  notifications: 'Хабарландырулар', profile: 'Профиль', logout: 'Шығу',
  language: 'Тіл', no_notifications: 'Хабарландырулар жоқ', mark_all_read: 'Барлығын оқылды деп белгілеу',
  welcome_morning: 'Қайырлы таң', welcome_afternoon: 'Қайырлы күн', welcome_evening: 'Қайырлы кеш',
  total_employees: 'Барлық қызметкерлер', present_today: 'Бүгін келді', on_leave: 'Демалыста',
  new_this_month: 'Осы айда жаңа', attendance_rate: 'Қатысу пайызы', avg_performance: 'Орташа өнімділік',
  open_positions: 'Бос орындар', pending_tasks: 'Күтілетін тапсырмалар',
  recent_hires: 'Жақында қабылданғандар', pending_leaves: 'Күтілетін демалыстар', quick_stats: 'Жылдам статистика',
  check_in: 'Келу', check_out: 'Кету', present: 'Келді', late: 'Кеш келді', absent: 'Келмеді',
  work_hours: 'Жұмыс сағаттары', overtime: 'Қосымша уақыт', shift: 'Ауысым', location: 'Орналасу',
  leave_request: 'Демалыс өтінімі', approved: 'Бекітілді', rejected: 'Қабылданбады',
  pending: 'Күтілуде', leave_type: 'Демалыс түрі', leave_balance: 'Демалыс қалдығы',
  annual_leave: 'Жыл сайынғы демалыс', sick_leave: 'Науқастық демалыс',
  salary: 'Жалақы', bonus: 'Сыйақы', deductions: 'Ұстамалар', net_salary: 'Таза жалақы',
  gross_salary: 'Жалпы жалақы', tax: 'Салық', payslip: 'Жалақы парағы',
  department: 'Бөлім', position: 'Лауазым', employee_id: 'Қызметкер ID', hire_date: 'Жалдану күні',
  full_name: 'Толық аты', gender: 'Жынысы', contract_type: 'Шарт түрі', branch: 'Филиал',
  login: 'Кіру', register: 'Тіркелу', password: 'Құпия сөз',
  forgot_password: 'Құпия сөзді ұмыттыңыз ба?', confirm_password: 'Құпия сөзді растаңыз',
  sign_in: 'Кіру', sign_up: 'Тіркелу',
  have_account: 'Тіркелгіңіз бар ма?', no_account: 'Тіркелгіңіз жоқ па?',
  onboarding: 'Бейімдеу', offboarding: 'Жұмыстан шығу', tasks_completed: 'Орындалған тапсырмалар',
  workflow: 'Жұмыс процесі', template: 'Үлгі', assign: 'Тағайындау', progress: 'Прогресс',
  automation: 'Автоматика', rule: 'Ереже', trigger: 'Триггер', action: 'Әрекет',
  notification: 'Хабарландыру', telegram: 'Telegram', sms: 'SMS', channel: 'Арна',
  target: 'Мақсат', actual: 'Нақты', score: 'Балл', performance: 'Өнімділік', kpi: 'ЖКК',
  vacancy: 'Бос орын', candidate: 'Үміткер', interview: 'Сұхбат', offer: 'Ұсыныс', hired: 'Қабылданды',
  integration: 'Интеграция', sync: 'Синхрондау', connected: 'Қосылды', disconnected: 'Ажыратылды', test: 'Тест',
};

const hy: TranslationKeys = {
  save: 'Պահպանել', cancel: 'Չեղարկել', delete: 'Ջնջել', edit: 'Խմբագրել',
  add: 'Ավելացնել', search: 'Որոնել', filter: 'Զտիչ', export: 'Արտահանել',
  loading: 'Բեռնվում է...', confirm: 'Հաստատել', close: 'Փակել', back: 'Հետ',
  next: 'Հաջորդ', submit: 'Ուղարկել', yes: 'Այո', no: 'Ոչ', active: 'Ակտիվ',
  inactive: 'Ոչ ակտիվ', status: 'Կարգավիճակ', actions: 'Գործողություններ', name: 'Անուն',
  email: 'Էլ. փոստ', phone: 'Հեռախոս', date: 'Ամսաթիվ', total: 'Ընդամենը', settings: 'Կարգավորումներ',
  refresh: 'Թարմացնել', view: 'Դիտել', create: 'Ստեղծել', update: 'Թարմացնել',
  success: 'Հաջողություն', error: 'Սխալ', warning: 'Նախազգուշացում', info: 'Տեղեկություն',
  all: 'Բոլորը', none: 'Ոչ մեկը', select: 'Ընտրել', upload: 'Բեռնել', download: 'Ներբեռնել',
  nav_dashboard: 'Գլխավոր', nav_employees: 'Աշխատակիցներ', nav_organization: 'Կազմակերպություն',
  nav_attendance: 'Ներկայություն', nav_leave: 'Արձակուրդ', nav_payroll: 'Աշխատավարձ',
  nav_kpi: 'ԿԿՑ', nav_recruitment: 'Հավաքագրում', nav_onboarding: 'Ադապտացիա',
  nav_tasks: 'Առաջադրանքներ', nav_documents: 'Փաստաթղթեր', nav_training: 'Ուսուցում',
  nav_social: 'Նորություններ', nav_announcements: 'Հայտարարություններ', nav_helpdesk: 'Աջակցություն',
  nav_analytics: 'Վերլուծություն', nav_ai: 'AI Օգնական', nav_automation: 'Ավտոմատացում',
  nav_integrations: 'Ինտեգրացիաներ', nav_settings: 'Կարգավորումներ',
  group_main: 'Հիմնական', group_hr_operations: 'HR Գործողություններ',
  group_talent_work: 'Տաղանդ և Աշխատանք', group_communication: 'Հաղordenordination',
  group_analytics_ai: 'Վերլուծություն և AI', group_integrations: 'Ինտեգրացիաներ',
  notifications: 'Ծանուցումներ', profile: 'Պրոֆիль', logout: 'Դուրս գալ',
  language: 'Լեզու', no_notifications: 'Ծանուցումներ չկան', mark_all_read: 'Բոլորը ընթercewith_read',
  welcome_morning: 'Բարի՛ լույս', welcome_afternoon: 'Բարի՛ ցե', welcome_evening: 'Բարի՛ երեկո',
  total_employees: 'Ընդամենը աշխատակիցներ', present_today: 'Այսօր ներկա', on_leave: 'Արձակուրդում',
  new_this_month: 'Այս ամիս նոր', attendance_rate: 'Ներկայության տոկոս', avg_performance: 'Միջին արդյունավetentness',
  open_positions: 'Բաց թափուր տեղեր', pending_tasks: 'Ակնկalleralված առաջադրանքներ',
  recent_hires: 'Վերջին ընդgroupedals', pending_leaves: 'Ակնkalar արձakuarduner', quick_stats: 'Արագ վիճakeholder',
  check_in: 'Ժամanish', check_out: 'Հenan', present: 'Ner', late: 'Uste', absent: 'Bac',
  work_hours: 'Asx', overtime: 'Avoravel', shift: 'Shift', location: 'Vayreek',
  leave_request: 'Ardzakurdov arzhiv', approved: 'Hastatasvel', rejected: 'Metakhvel',
  pending: 'Aknek', leave_type: 'Ardzakurdi tip', leave_balance: 'Ardzakurdi matnakov',
  annual_leave: 'Taryakan ardzakurd', sick_leave: 'Hivand ardzakurd',
  salary: 'Ashkhatavardz', bonus: 'Premir', deductions: 'Neraval', net_salary: 'Mshakvats ashkhatavardz',
  gross_salary: 'Yalpi ashkhatavardz', tax: 'Hakarak', payslip: 'Ashkhatavardzi terkik',
  department: 'Bazhanov', position: 'Pashtonum', employee_id: 'Ashkhataki ID', hire_date: 'Tvar artmank',
  full_name: 'Ambox anune', gender: 'Spe', contract_type: 'Paymanagri tip', branch: 'Masnachyugh',
  login: 'Muten', register: 'Ganchagrvel', password: 'Gakhtnabazhar',
  forgot_password: 'Moreaces gakhtnabazhar?', confirm_password: 'Hastatacel gakhtnabazhar',
  sign_in: 'Muten', sign_up: 'Ganchagrvel',
  have_account: 'Hesabner unek?', no_account: 'Hesab chune?',
  onboarding: 'Adaptacia', offboarding: 'Ashkhatat arkel', tasks_completed: 'Keatarasvel ashkhatank',
  workflow: 'Ashkhatanki kargh', template: 'Kakhvatsker', assign: 'Nyunagrvel', progress: 'Arratumner',
  automation: 'Avtomatatzum', rule: 'Kanon', trigger: 'Trigger', action: 'Gortsoghutyun',
  notification: 'Tzanucum', telegram: 'Telegram', sms: 'SMS', channel: 'Efer',
  target: 'Npatak', actual: 'Irakanat', score: 'Miavayrav', performance: 'Ardziunakutyun', kpi: 'ԿԿՑ',
  vacancy: 'Tapuratekh', candidate: 'Tsmagnord', interview: 'Zaruyts', offer: 'Arajarkum', hired: 'Entunvel',
  integration: 'Integraciya', sync: 'Hampatkasum', connected: 'Kuptvel', disconnected: 'Andzvel', test: 'Zarutsum',
};

const az: TranslationKeys = {
  save: 'Saxla', cancel: 'Ləğv et', delete: 'Sil', edit: 'Redaktə et',
  add: 'Əlavə et', search: 'Axtar', filter: 'Filtr', export: 'İxrac',
  loading: 'Yüklənir...', confirm: 'Təsdiq et', close: 'Bağla', back: 'Geri',
  next: 'Növbəti', submit: 'Göndər', yes: 'Bəli', no: 'Xeyr', active: 'Aktiv',
  inactive: 'Qeyri-aktiv', status: 'Status', actions: 'Əməliyyatlar', name: 'Ad',
  email: 'Email', phone: 'Telefon', date: 'Tarix', total: 'Cəmi', settings: 'Parametrlər',
  refresh: 'Yenilə', view: 'Bax', create: 'Yarat', update: 'Yenilə',
  success: 'Uğurlu', error: 'Xəta', warning: 'Xəbərdarlıq', info: 'Məlumat',
  all: 'Hamısı', none: 'Heç biri', select: 'Seç', upload: 'Yüklə', download: 'Endirmə',
  nav_dashboard: 'Ana səhifə', nav_employees: 'İşçilər', nav_organization: 'Təşkilat',
  nav_attendance: 'Davamiyyət', nav_leave: 'Məzuniyyət', nav_payroll: 'Əmək haqqı',
  nav_kpi: 'KPI', nav_recruitment: 'İşə qəbul', nav_onboarding: 'Adaptasiya',
  nav_tasks: 'Tapşırıqlar', nav_documents: 'Sənədlər', nav_training: 'Təlim',
  nav_social: 'Xəbərlər', nav_announcements: 'Elanlar', nav_helpdesk: 'Yardım',
  nav_analytics: 'Analitika', nav_ai: 'AI Köməkçi', nav_automation: 'Avtomatika',
  nav_integrations: 'İnteqrasiyalar', nav_settings: 'Parametrlər',
  group_main: 'Əsas', group_hr_operations: 'HR Əməliyyatları',
  group_talent_work: 'İstedadlar və İş', group_communication: 'Ünsiyyət',
  group_analytics_ai: 'Analitika və AI', group_integrations: 'İnteqrasiyalar',
  notifications: 'Bildirişlər', profile: 'Profil', logout: 'Çıxış',
  language: 'Dil', no_notifications: 'Bildiriş yoxdur', mark_all_read: 'Hamısını oxunmuş kimi işarələ',
  welcome_morning: 'Sabahınız xeyir', welcome_afternoon: 'Günortanız xeyir', welcome_evening: 'Axşamınız xeyir',
  total_employees: 'Ümumi işçilər', present_today: 'Bu gün işdə', on_leave: 'Məzuniyyətdə',
  new_this_month: 'Bu ay yeni', attendance_rate: 'Davamiyyət faizi', avg_performance: 'Orta məhsuldarlıq',
  open_positions: 'Açıq vakansiyalar', pending_tasks: 'Gözləyən tapşırıqlar',
  recent_hires: 'Son işə qəbul edilənlər', pending_leaves: 'Gözləyən məzuniyyətlər', quick_stats: 'Sürətli statistika',
  check_in: 'Gəliş', check_out: 'Getmə', present: 'İşdə', late: 'Gecikdi', absent: 'Yox',
  work_hours: 'İş saatları', overtime: 'Əlavə vaxt', shift: 'Növbə', location: 'Yer',
  leave_request: 'Məzuniyyət sorğusu', approved: 'Təsdiqləndi', rejected: 'Rədd edildi',
  pending: 'Gözlənilir', leave_type: 'Məzuniyyət növü', leave_balance: 'Məzuniyyət qalığı',
  annual_leave: 'İllik məzuniyyət', sick_leave: 'Xəstəlik məzuniyyəti',
  salary: 'Əmək haqqı', bonus: 'Mükafat', deductions: 'Tutulmalar', net_salary: 'Xalis əmək haqqı',
  gross_salary: 'Ümumi əmək haqqı', tax: 'Vergi', payslip: 'Maaş vərəqəsi',
  department: 'Şöbə', position: 'Vəzifə', employee_id: 'İşçi ID', hire_date: 'İşə giriş tarixi',
  full_name: 'Tam ad', gender: 'Cins', contract_type: 'Müqavilə növü', branch: 'Filial',
  login: 'Daxil ol', register: 'Qeydiyyatdan keç', password: 'Şifrə',
  forgot_password: 'Şifrəni unutmusunuz?', confirm_password: 'Şifrəni təsdiq edin',
  sign_in: 'Daxil ol', sign_up: 'Qeydiyyatdan keç',
  have_account: 'Hesabınız var?', no_account: 'Hesabınız yoxdur?',
  onboarding: 'Adaptasiya', offboarding: 'İşdən ayrılma', tasks_completed: 'Tamamlanmış tapşırıqlar',
  workflow: 'İş axını', template: 'Şablon', assign: 'Təyin et', progress: 'İrəliləyiş',
  automation: 'Avtomatika', rule: 'Qayda', trigger: 'Tetikleyici', action: 'Əməliyyat',
  notification: 'Bildiriş', telegram: 'Telegram', sms: 'SMS', channel: 'Kanal',
  target: 'Hədəf', actual: 'Faktiki', score: 'Bal', performance: 'Məhsuldarlıq', kpi: 'KPI',
  vacancy: 'Vakansiya', candidate: 'Namizəd', interview: 'Müsahibə', offer: 'Təklif', hired: 'Qəbul edildi',
  integration: 'İnteqrasiya', sync: 'Sinxronizasiya', connected: 'Qoşulub', disconnected: 'Ayrılıb', test: 'Test',
};

const tr: TranslationKeys = {
  save: 'Kaydet', cancel: 'İptal', delete: 'Sil', edit: 'Düzenle',
  add: 'Ekle', search: 'Ara', filter: 'Filtre', export: 'Dışa aktar',
  loading: 'Yükleniyor...', confirm: 'Onayla', close: 'Kapat', back: 'Geri',
  next: 'İleri', submit: 'Gönder', yes: 'Evet', no: 'Hayır', active: 'Aktif',
  inactive: 'Pasif', status: 'Durum', actions: 'İşlemler', name: 'Ad',
  email: 'E-posta', phone: 'Telefon', date: 'Tarih', total: 'Toplam', settings: 'Ayarlar',
  refresh: 'Yenile', view: 'Görüntüle', create: 'Oluştur', update: 'Güncelle',
  success: 'Başarılı', error: 'Hata', warning: 'Uyarı', info: 'Bilgi',
  all: 'Tümü', none: 'Hiçbiri', select: 'Seç', upload: 'Yükle', download: 'İndir',
  nav_dashboard: 'Ana Sayfa', nav_employees: 'Çalışanlar', nav_organization: 'Kuruluş',
  nav_attendance: 'Devam', nav_leave: 'İzin', nav_payroll: 'Bordro',
  nav_kpi: 'KPI', nav_recruitment: 'İşe Alım', nav_onboarding: 'Oryantasyon',
  nav_tasks: 'Görevler', nav_documents: 'Belgeler', nav_training: 'Eğitim',
  nav_social: 'Sosyal Akış', nav_announcements: 'Duyurular', nav_helpdesk: 'Yardım Masası',
  nav_analytics: 'Analitik', nav_ai: 'AI Asistan', nav_automation: 'Otomasyon',
  nav_integrations: 'Entegrasyonlar', nav_settings: 'Ayarlar',
  group_main: 'Ana', group_hr_operations: 'İK Operasyonları',
  group_talent_work: 'Yetenek & İş', group_communication: 'İletişim',
  group_analytics_ai: 'Analitik & AI', group_integrations: 'Entegrasyonlar',
  notifications: 'Bildirimler', profile: 'Profil', logout: 'Çıkış yap',
  language: 'Dil', no_notifications: 'Bildirim yok', mark_all_read: 'Tümünü okundu işaretle',
  welcome_morning: 'Günaydın', welcome_afternoon: 'İyi günler', welcome_evening: 'İyi akşamlar',
  total_employees: 'Toplam çalışan', present_today: 'Bugün mevcut', on_leave: 'İzinde',
  new_this_month: 'Bu ay yeni', attendance_rate: 'Devam oranı', avg_performance: 'Ort. performans',
  open_positions: 'Açık pozisyonlar', pending_tasks: 'Bekleyen görevler',
  recent_hires: 'Son işe alınanlar', pending_leaves: 'Bekleyen izinler', quick_stats: 'Hızlı istatistik',
  check_in: 'Giriş', check_out: 'Çıkış', present: 'Mevcut', late: 'Geç kaldı', absent: 'Yok',
  work_hours: 'Çalışma saatleri', overtime: 'Fazla mesai', shift: 'Vardiya', location: 'Konum',
  leave_request: 'İzin talebi', approved: 'Onaylandı', rejected: 'Reddedildi',
  pending: 'Bekliyor', leave_type: 'İzin türü', leave_balance: 'İzin bakiyesi',
  annual_leave: 'Yıllık izin', sick_leave: 'Hastalık izni',
  salary: 'Maaş', bonus: 'Prim', deductions: 'Kesintiler', net_salary: 'Net maaş',
  gross_salary: 'Brüt maaş', tax: 'Vergi', payslip: 'Bordro',
  department: 'Departman', position: 'Pozisyon', employee_id: 'Çalışan ID', hire_date: 'İşe başlama tarihi',
  full_name: 'Tam ad', gender: 'Cinsiyet', contract_type: 'Sözleşme türü', branch: 'Şube',
  login: 'Giriş yap', register: 'Kayıt ol', password: 'Şifre',
  forgot_password: 'Şifremi unuttum', confirm_password: 'Şifreyi onayla',
  sign_in: 'Giriş yap', sign_up: 'Kayıt ol',
  have_account: 'Hesabınız var mı?', no_account: 'Hesabınız yok mu?',
  onboarding: 'Oryantasyon', offboarding: 'İşten ayrılma', tasks_completed: 'Tamamlanan görevler',
  workflow: 'İş akışı', template: 'Şablon', assign: 'Ata', progress: 'İlerleme',
  automation: 'Otomasyon', rule: 'Kural', trigger: 'Tetikleyici', action: 'Eylem',
  notification: 'Bildirim', telegram: 'Telegram', sms: 'SMS', channel: 'Kanal',
  target: 'Hedef', actual: 'Gerçek', score: 'Puan', performance: 'Performans', kpi: 'KPI',
  vacancy: 'Açık pozisyon', candidate: 'Aday', interview: 'Mülakat', offer: 'Teklif', hired: 'İşe alındı',
  integration: 'Entegrasyon', sync: 'Senkronizasyon', connected: 'Bağlı', disconnected: 'Bağlı değil', test: 'Test',
};

export const translations: Record<LangCode, TranslationKeys> = { uz, ru, en, ky, tg, kk, hy, az, tr };

export function t(lang: LangCode, key: keyof TranslationKeys): string {
  return translations[lang]?.[key] ?? translations['en']?.[key] ?? key;
}
