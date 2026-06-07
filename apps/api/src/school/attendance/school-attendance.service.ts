import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SchoolNotificationService } from '../notifications/school-notification.service';
import { FaceDetectionEvent } from '../cameras/hikvision.service';

@Injectable()
export class SchoolAttendanceService {
  private readonly logger = new Logger(SchoolAttendanceService.name);

  constructor(
    private prisma: PrismaService,
    private notifications: SchoolNotificationService,
  ) {}

  @OnEvent('face.detected')
  async handleFaceDetected(event: FaceDetectionEvent) {
    if (!event.studentId) {
      this.logger.warn(`Unknown face on camera ${event.cameraId}`);
      return;
    }

    const student = await this.prisma.schoolStudent.findUnique({
      where: { id: event.studentId },
      include: {
        parents: true,
        class: { include: { school: true } },
      },
    });

    if (!student) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.prisma.schoolAttendance.findFirst({
      where: { studentId: event.studentId, date: { gte: today } },
      orderBy: { createdAt: 'desc' },
    });

    let eventType = event.eventType;

    // Auto-determine arrival vs departure based on existing records
    if (eventType === 'UNKNOWN') {
      eventType = !existing || !existing.arrivalTime ? 'ARRIVAL' : 'DEPARTURE';
    }

    // Create or update attendance record
    let record;
    if (eventType === 'ARRIVAL') {
      if (existing?.arrivalTime) {
        this.logger.log(`${student.firstName} already arrived today`);
        return;
      }
      record = await this.prisma.schoolAttendance.upsert({
        where: { studentId_date: { studentId: event.studentId, date: today } },
        update: { arrivalTime: event.timestamp, arrivalPhoto: event.imageUrl },
        create: {
          studentId: event.studentId,
          schoolId: student.class.schoolId,
          classId: student.classId,
          date: today,
          arrivalTime: event.timestamp,
          arrivalPhoto: event.imageUrl,
          cameraId: event.cameraId,
          status: 'PRESENT',
        },
      });
    } else {
      if (!existing?.arrivalTime) {
        this.logger.warn(`${student.firstName} departing without arrival record`);
      }
      record = await this.prisma.schoolAttendance.upsert({
        where: { studentId_date: { studentId: event.studentId, date: today } },
        update: { departureTime: event.timestamp, departurePhoto: event.imageUrl },
        create: {
          studentId: event.studentId,
          schoolId: student.class.schoolId,
          classId: student.classId,
          date: today,
          departureTime: event.timestamp,
          departurePhoto: event.imageUrl,
          cameraId: event.cameraId,
          status: 'PRESENT',
        },
      });
    }

    // Send notifications to parents
    for (const parent of student.parents) {
      await this.notifications.notifyParent({
        parent,
        student,
        school: student.class.school,
        eventType,
        timestamp: event.timestamp,
        photoUrl: event.imageUrl,
      });
    }

    this.logger.log(
      `${eventType}: ${student.firstName} ${student.lastName} @ ${student.class.school.name} — ${event.timestamp.toLocaleTimeString('uz-UZ')}`,
    );
  }

  async getTodayStats(schoolId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalStudents, arrived, departed] = await Promise.all([
      this.prisma.schoolStudent.count({ where: { schoolId, status: 'ACTIVE' } }),
      this.prisma.schoolAttendance.count({
        where: { schoolId, date: { gte: today }, arrivalTime: { not: null } },
      }),
      this.prisma.schoolAttendance.count({
        where: { schoolId, date: { gte: today }, departureTime: { not: null } },
      }),
    ]);

    return {
      totalStudents,
      arrived,
      departed,
      absent: totalStudents - arrived,
      presentRate: totalStudents > 0 ? Math.round((arrived / totalStudents) * 100) : 0,
    };
  }

  async getAttendanceLogs(schoolId: string, filters?: {
    classId?: string; date?: Date; studentName?: string; page?: number;
  }) {
    const { page = 1, ...where } = filters || {};
    const dateFilter = where.date || new Date();
    const dayStart = new Date(dateFilter);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dateFilter);
    dayEnd.setHours(23, 59, 59, 999);

    return this.prisma.schoolAttendance.findMany({
      where: {
        schoolId,
        date: { gte: dayStart, lte: dayEnd },
        ...(where.classId && { classId: where.classId }),
        ...(where.studentName && {
          student: {
            OR: [
              { firstName: { contains: where.studentName, mode: 'insensitive' } },
              { lastName: { contains: where.studentName, mode: 'insensitive' } },
            ],
          },
        }),
      },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, photo: true, studentCode: true },
        },
        class: { select: { name: true } },
      },
      orderBy: { arrivalTime: 'desc' },
      skip: (page - 1) * 50,
      take: 50,
    });
  }

  async getStudentAttendanceHistory(studentId: string, month: number, year: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    return this.prisma.schoolAttendance.findMany({
      where: { studentId, date: { gte: start, lte: end } },
      orderBy: { date: 'asc' },
    });
  }

  async generateReport(schoolId: string, from: Date, to: Date) {
    const records = await this.prisma.schoolAttendance.findMany({
      where: { schoolId, date: { gte: from, lte: to } },
      include: {
        student: { select: { firstName: true, lastName: true, studentCode: true } },
        class: { select: { name: true } },
      },
      orderBy: [{ date: 'desc' }, { arrivalTime: 'asc' }],
    });

    const byStudent = records.reduce((acc, r) => {
      const key = r.studentId;
      if (!acc[key]) {
        acc[key] = {
          student: r.student,
          class: r.class,
          totalDays: 0,
          presentDays: 0,
          absentDays: 0,
          lateArrivals: 0,
        };
      }
      acc[key].totalDays++;
      if (r.status === 'PRESENT') acc[key].presentDays++;
      if (r.status === 'ABSENT') acc[key].absentDays++;
      return acc;
    }, {} as Record<string, any>);

    return { records, summary: Object.values(byStudent) };
  }
}
