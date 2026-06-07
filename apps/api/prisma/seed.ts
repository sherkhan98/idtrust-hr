import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const UZ_FIRST_NAMES_M = ['Alisher', 'Bobur', 'Jasur', 'Sherzod', 'Ulugbek', 'Otabek', 'Sardor', 'Nodir', 'Timur', 'Akbar', 'Jamshid', 'Dilshod', 'Mansur', 'Ravshan', 'Laziz'];
const UZ_FIRST_NAMES_F = ['Malika', 'Zulfiya', 'Nilufar', 'Mohira', 'Dilnoza', 'Kamola', 'Gulnora', 'Feruza', 'Nozima', 'Shahlo', 'Sabohat', 'Umida', 'Barno', 'Iroda', 'Hulkar'];
const UZ_LAST_NAMES = ['Toshmatov', 'Yusupov', 'Karimov', 'Rahimov', 'Nazarov', 'Xasanov', 'Qodirov', 'Mirzayev', 'Sultanov', 'Holmatov', 'Botirov', 'Turgunov', 'Ergashev', 'Ismoilov', 'Baxtiyorov'];

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function main() {
  console.log('🌱 Seeding StaffFlow HR database...');

  // Super Admin
  const superAdminHash = await bcrypt.hash('SuperAdmin@123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@staffflow.uz' },
    update: {},
    create: {
      email: 'admin@staffflow.uz',
      passwordHash: superAdminHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
    },
  });

  // Demo Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'nexus-group' },
    update: {},
    create: {
      name: 'Nexus Group LLC',
      slug: 'nexus-group',
      plan: 'ENTERPRISE',
      maxEmployees: 500,
      settings: {
        currency: 'UZS',
        timezone: 'Asia/Tashkent',
        workDays: [1, 2, 3, 4, 5],
        language: 'uz',
      },
    },
  });

  console.log(`✅ Tenant created: ${tenant.name}`);

  // Tenant Admin
  const adminHash = await bcrypt.hash('Admin@123456', 12);
  await prisma.user.upsert({
    where: { email: 'ceo@nexusgroup.uz' },
    update: {},
    create: {
      email: 'ceo@nexusgroup.uz',
      passwordHash: adminHash,
      firstName: 'Alisher',
      lastName: 'Nazarov',
      role: 'TENANT_ADMIN',
      tenantId: tenant.id,
    },
  });

  // HR Manager
  const hrHash = await bcrypt.hash('Hr@123456', 12);
  await prisma.user.upsert({
    where: { email: 'hr@nexusgroup.uz' },
    update: {},
    create: {
      email: 'hr@nexusgroup.uz',
      passwordHash: hrHash,
      firstName: 'Kamola',
      lastName: 'Yusupova',
      role: 'HR_MANAGER',
      tenantId: tenant.id,
    },
  });

  // Branches
  const branches = await Promise.all([
    prisma.branch.upsert({
      where: { id: 'branch-tashkent' },
      update: {},
      create: { id: 'branch-tashkent', tenantId: tenant.id, name: 'Tashkent HQ', nameRu: 'Ташкент ГО', nameUz: 'Toshkent Bosh Ofisi', city: 'Tashkent', address: 'Amir Temur ko\'chasi 107B, Toshkent' },
    }),
    prisma.branch.upsert({
      where: { id: 'branch-samarkand' },
      update: {},
      create: { id: 'branch-samarkand', tenantId: tenant.id, name: 'Samarkand Branch', nameRu: 'Самарканд Филиал', city: 'Samarkand', address: 'Registon ko\'chasi 15, Samarqand' },
    }),
    prisma.branch.upsert({
      where: { id: 'branch-namangan' },
      update: {},
      create: { id: 'branch-namangan', tenantId: tenant.id, name: 'Namangan Branch', nameRu: 'Наманган Филиал', city: 'Namangan', address: 'Mustaqillik xiyoboni 22, Namangan' },
    }),
  ]);

  console.log(`✅ Branches created: ${branches.length}`);

  // Departments
  const deptData = [
    { id: 'dept-it', name: 'Information Technology', nameRu: 'Информационные технологии', nameUz: 'Axborot texnologiyalari', code: 'IT' },
    { id: 'dept-hr', name: 'Human Resources', nameRu: 'Кадры', nameUz: 'Kadrlar bo\'limi', code: 'HR' },
    { id: 'dept-finance', name: 'Finance', nameRu: 'Финансы', nameUz: 'Moliya', code: 'FIN' },
    { id: 'dept-sales', name: 'Sales & Marketing', nameRu: 'Продажи и маркетинг', nameUz: 'Savdo va marketing', code: 'SLS' },
    { id: 'dept-ops', name: 'Operations', nameRu: 'Операции', nameUz: 'Operatsiyalar', code: 'OPS' },
    { id: 'dept-legal', name: 'Legal', nameRu: 'Юридический', nameUz: 'Yuridik bo\'lim', code: 'LEG' },
    { id: 'dept-logistics', name: 'Logistics', nameRu: 'Логистика', nameUz: 'Logistika', code: 'LOG' },
    { id: 'dept-support', name: 'Customer Support', nameRu: 'Поддержка клиентов', nameUz: 'Mijozlarga xizmat', code: 'SUP' },
  ];

  const departments = await Promise.all(
    deptData.map((d) =>
      prisma.department.upsert({
        where: { id: d.id },
        update: {},
        create: { ...d, tenantId: tenant.id },
      }),
    ),
  );

  console.log(`✅ Departments created: ${departments.length}`);

  // Positions
  const positionData = [
    { name: 'Chief Executive Officer', nameRu: 'Генеральный директор', nameUz: 'Bosh direktor', code: 'CEO', departmentId: 'dept-ops', minSalary: 20000000, maxSalary: 50000000 },
    { name: 'HR Director', nameRu: 'Директор по персоналу', nameUz: 'Kadrlar direktori', code: 'HRD', departmentId: 'dept-hr', minSalary: 10000000, maxSalary: 20000000 },
    { name: 'Software Engineer', nameRu: 'Программист', nameUz: 'Dasturchi', code: 'SWE', departmentId: 'dept-it', minSalary: 5000000, maxSalary: 15000000 },
    { name: 'Frontend Developer', nameRu: 'Фронтенд разработчик', nameUz: 'Frontend dasturchi', code: 'FE', departmentId: 'dept-it', minSalary: 4000000, maxSalary: 12000000 },
    { name: 'Backend Developer', nameRu: 'Бэкенд разработчик', nameUz: 'Backend dasturchi', code: 'BE', departmentId: 'dept-it', minSalary: 5000000, maxSalary: 14000000 },
    { name: 'DevOps Engineer', nameRu: 'DevOps инженер', nameUz: 'DevOps muhandis', code: 'DEVOPS', departmentId: 'dept-it', minSalary: 6000000, maxSalary: 16000000 },
    { name: 'HR Manager', nameRu: 'HR менеджер', nameUz: 'HR menejer', code: 'HRM', departmentId: 'dept-hr', minSalary: 4000000, maxSalary: 8000000 },
    { name: 'HR Specialist', nameRu: 'HR специалист', nameUz: 'HR mutaxassisi', code: 'HRS', departmentId: 'dept-hr', minSalary: 2500000, maxSalary: 5000000 },
    { name: 'Financial Manager', nameRu: 'Финансовый менеджер', nameUz: 'Moliya menejeri', code: 'FM', departmentId: 'dept-finance', minSalary: 6000000, maxSalary: 12000000 },
    { name: 'Accountant', nameRu: 'Бухгалтер', nameUz: 'Buxgalter', code: 'ACC', departmentId: 'dept-finance', minSalary: 3000000, maxSalary: 6000000 },
    { name: 'Sales Manager', nameRu: 'Менеджер по продажам', nameUz: 'Savdo menejeri', code: 'SM', departmentId: 'dept-sales', minSalary: 4000000, maxSalary: 10000000 },
    { name: 'Marketing Specialist', nameRu: 'Маркетолог', nameUz: 'Marketing mutaxassisi', code: 'MKT', departmentId: 'dept-sales', minSalary: 3000000, maxSalary: 7000000 },
    { name: 'Logistics Coordinator', nameRu: 'Координатор логистики', nameUz: 'Logistika koordinatori', code: 'LC', departmentId: 'dept-logistics', minSalary: 2500000, maxSalary: 5000000 },
    { name: 'Support Agent', nameRu: 'Агент поддержки', nameUz: 'Qo\'llab-quvvatlash agenti', code: 'SA', departmentId: 'dept-support', minSalary: 2000000, maxSalary: 4000000 },
  ];

  const positions = await Promise.all(
    positionData.map((p) =>
      prisma.position.upsert({
        where: { id: `pos-${p.code.toLowerCase()}` },
        update: {},
        create: { id: `pos-${p.code.toLowerCase()}`, tenantId: tenant.id, ...p, minSalary: p.minSalary, maxSalary: p.maxSalary },
      }),
    ),
  );

  console.log(`✅ Positions created: ${positions.length}`);

  // Default Shift
  const shift = await prisma.shift.upsert({
    where: { id: 'shift-standard' },
    update: {},
    create: {
      id: 'shift-standard',
      tenantId: tenant.id,
      name: 'Standard (9:00 - 18:00)',
      startTime: '09:00',
      endTime: '18:00',
      breakMinutes: 60,
      workDays: [1, 2, 3, 4, 5],
      lateGraceMins: 15,
      overtimeAfterMins: 30,
    },
  });

  // Leave Types
  const leaveTypes = await Promise.all([
    prisma.leaveType.upsert({
      where: { tenantId_code: { tenantId: tenant.id, code: 'ANNUAL' } },
      update: {},
      create: { tenantId: tenant.id, name: 'Annual Leave', nameRu: 'Ежегодный отпуск', nameUz: 'Yillik ta\'til', code: 'ANNUAL', daysPerYear: 24, isPaid: true, color: '#3B82F6' },
    }),
    prisma.leaveType.upsert({
      where: { tenantId_code: { tenantId: tenant.id, code: 'SICK' } },
      update: {},
      create: { tenantId: tenant.id, name: 'Sick Leave', nameRu: 'Больничный', nameUz: 'Kasallik ta\'tili', code: 'SICK', daysPerYear: 15, isPaid: true, requiresDocs: true, color: '#EF4444' },
    }),
    prisma.leaveType.upsert({
      where: { tenantId_code: { tenantId: tenant.id, code: 'UNPAID' } },
      update: {},
      create: { tenantId: tenant.id, name: 'Unpaid Leave', nameRu: 'Отпуск за свой счёт', nameUz: 'Haqsiz ta\'til', code: 'UNPAID', daysPerYear: 0, isPaid: false, color: '#6B7280' },
    }),
    prisma.leaveType.upsert({
      where: { tenantId_code: { tenantId: tenant.id, code: 'BTRIP' } },
      update: {},
      create: { tenantId: tenant.id, name: 'Business Trip', nameRu: 'Командировка', nameUz: 'Xizmat safari', code: 'BTRIP', daysPerYear: 0, isPaid: true, color: '#F59E0B' },
    }),
    prisma.leaveType.upsert({
      where: { tenantId_code: { tenantId: tenant.id, code: 'MATERNITY' } },
      update: {},
      create: { tenantId: tenant.id, name: 'Maternity Leave', nameRu: 'Декретный отпуск', nameUz: 'Tug\'ruq ta\'tili', code: 'MATERNITY', daysPerYear: 126, isPaid: true, color: '#EC4899' },
    }),
  ]);

  console.log(`✅ Leave types created: ${leaveTypes.length}`);

  // Create 50 employees
  console.log('Creating 50 employees...');
  const deptIds = ['dept-it', 'dept-hr', 'dept-finance', 'dept-sales', 'dept-ops', 'dept-logistics', 'dept-support'];
  const branchIds = ['branch-tashkent', 'branch-samarkand', 'branch-namangan'];

  const employees: any[] = [];

  for (let i = 1; i <= 50; i++) {
    const isMale = Math.random() > 0.4;
    const firstName = isMale ? rand(UZ_FIRST_NAMES_M) : rand(UZ_FIRST_NAMES_F);
    const lastName = rand(UZ_LAST_NAMES);
    const deptId = rand(deptIds);
    const branchId = rand(branchIds);
    const salary = randInt(2000000, 12000000);
    const hireDate = new Date(2020 + randInt(0, 4), randInt(0, 11), randInt(1, 28));

    const emp = await prisma.employee.upsert({
      where: { tenantId_employeeCode: { tenantId: tenant.id, employeeCode: `EMP${String(i).padStart(4, '0')}` } },
      update: {},
      create: {
        tenantId: tenant.id,
        employeeCode: `EMP${String(i).padStart(4, '0')}`,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@nexusgroup.uz`,
        phone: `+9989${randInt(10, 99)}${randInt(1000000, 9999999)}`,
        gender: isMale ? 'MALE' : 'FEMALE',
        dateOfBirth: new Date(1985 + randInt(0, 15), randInt(0, 11), randInt(1, 28)),
        hireDate,
        departmentId: deptId,
        branchId,
        baseSalary: salary,
        currency: 'UZS',
        status: Math.random() > 0.1 ? 'ACTIVE' : 'ON_LEAVE',
        workType: Math.random() > 0.2 ? 'FULL_TIME' : 'HYBRID',
        contractType: Math.random() > 0.3 ? 'PERMANENT' : 'CONTRACT',
        city: branchId === 'branch-tashkent' ? 'Tashkent' : branchId === 'branch-samarkand' ? 'Samarkand' : 'Namangan',
        region: branchId === 'branch-tashkent' ? 'Tashkent' : branchId === 'branch-samarkand' ? 'Samarkand' : 'Namangan',
      },
    });
    employees.push(emp);
  }

  console.log(`✅ Employees created: ${employees.length}`);

  // Create attendance for last 30 days
  console.log('Creating attendance records...');
  const today = new Date();
  let attendanceCount = 0;

  for (const emp of employees.slice(0, 30)) {
    for (let d = 30; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);
      const dow = date.getDay();
      if (dow === 0 || dow === 6) continue;

      const isPresent = Math.random() > 0.1;
      if (!isPresent) continue;

      const lateChance = Math.random() > 0.8;
      const checkInHour = lateChance ? 9 + randInt(1, 2) : 9;
      const checkInMin = lateChance ? randInt(0, 59) : randInt(0, 30);
      const checkIn = new Date(date);
      checkIn.setHours(checkInHour, checkInMin, 0);

      const checkOut = new Date(date);
      checkOut.setHours(18 + randInt(0, 2), randInt(0, 59), 0);

      const workMinutes = Math.floor((checkOut.getTime() - checkIn.getTime()) / 60000);
      const lateMinutes = lateChance ? (checkInHour - 9) * 60 + checkInMin : 0;

      await prisma.attendance.upsert({
        where: { employeeId_date: { employeeId: emp.id, date } },
        update: {},
        create: {
          tenantId: tenant.id,
          employeeId: emp.id,
          shiftId: shift.id,
          date,
          checkIn,
          checkOut,
          checkInMethod: Math.random() > 0.5 ? 'FACE' : 'MOBILE',
          checkOutMethod: 'MOBILE',
          workMinutes,
          lateMinutes,
          overtimeMinutes: workMinutes > 540 ? workMinutes - 540 : 0,
          status: lateMinutes > 0 ? 'LATE' : 'PRESENT',
        },
      });
      attendanceCount++;
    }
  }

  console.log(`✅ Attendance records: ${attendanceCount}`);

  // Payroll period
  const payrollPeriod = await prisma.payrollPeriod.upsert({
    where: { id: 'period-may-2024' },
    update: {},
    create: {
      id: 'period-may-2024',
      tenantId: tenant.id,
      name: 'May 2024',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-05-31'),
      status: 'COMPLETED',
      processedAt: new Date('2024-06-01'),
    },
  });

  // KPIs
  const kpis = await Promise.all([
    prisma.kPI.upsert({
      where: { id: 'kpi-attendance' },
      update: {},
      create: { id: 'kpi-attendance', tenantId: tenant.id, name: 'Attendance Rate', nameRu: 'Посещаемость', nameUz: 'Davomat', unit: '%', targetValue: 95, period: 'MONTHLY', category: 'Performance', weight: 30 },
    }),
    prisma.kPI.upsert({
      where: { id: 'kpi-tasks' },
      update: {},
      create: { id: 'kpi-tasks', tenantId: tenant.id, name: 'Task Completion', nameRu: 'Выполнение задач', nameUz: 'Vazifalar bajarish', unit: '%', targetValue: 90, period: 'MONTHLY', category: 'Productivity', weight: 40 },
    }),
    prisma.kPI.upsert({
      where: { id: 'kpi-quality' },
      update: {},
      create: { id: 'kpi-quality', tenantId: tenant.id, name: 'Quality Score', nameRu: 'Оценка качества', nameUz: 'Sifat bahosi', unit: 'score', targetValue: 90, period: 'MONTHLY', category: 'Quality', weight: 30 },
    }),
  ]);

  // Vacancies
  await prisma.vacancy.upsert({
    where: { id: 'vac-001' },
    update: {},
    create: {
      id: 'vac-001',
      tenantId: tenant.id,
      title: 'Senior React Developer',
      departmentId: 'dept-it',
      description: 'We are looking for an experienced React developer to join our growing team.',
      requirements: '3+ years React, TypeScript, REST APIs',
      salary: '8,000,000 - 15,000,000 UZS',
      type: 'FULL_TIME',
      location: 'Tashkent',
      remote: true,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  await prisma.vacancy.upsert({
    where: { id: 'vac-002' },
    update: {},
    create: {
      id: 'vac-002',
      tenantId: tenant.id,
      title: 'HR Specialist',
      departmentId: 'dept-hr',
      description: 'Join our HR team to manage employee relations and recruitment.',
      requirements: 'HR education, 2+ years experience',
      salary: '3,000,000 - 5,000,000 UZS',
      type: 'FULL_TIME',
      location: 'Tashkent',
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  // Announcements/Posts
  await prisma.post.upsert({
    where: { id: 'post-001' },
    update: {},
    create: {
      id: 'post-001',
      tenantId: tenant.id,
      authorId: 'ceo@nexusgroup.uz',
      content: '🎉 Kelajakka qadam! Biz bu yil rekord ko\'rsatkichlarga erishdik. Barcha xodimlarimizga katta rahmat! / Шаг в будущее! В этом году мы достигли рекордных показателей. Спасибо всем нашим сотрудникам!',
      type: 'ANNOUNCEMENT',
      pinned: true,
    },
  });

  console.log('\n🎉 StaffFlow HR database seeded successfully!\n');
  console.log('Demo accounts:');
  console.log('  Super Admin: admin@staffflow.uz / SuperAdmin@123');
  console.log('  CEO/Admin:   ceo@nexusgroup.uz / Admin@123456');
  console.log('  HR Manager:  hr@nexusgroup.uz  / Hr@123456\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
