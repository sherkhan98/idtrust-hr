// ZKTeco Biometric Terminal Integration Service
// -----------------------------------------------
// To use real ZKTeco:
// npm install node-zklib
// import ZKLib from 'node-zklib';
// const zk = new ZKLib(ip, port, timeout, inport);
// await zk.createSocket();
// const data = await zk.getAttendances();
// -----------------------------------------------

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

// ZKTeco PULL SDK Protocol simulation
// Real implementation would use: node-zklib or zklib npm package
// Protocol: TCP port 4370, binary commands

interface ZKDevice {
  ip: string;
  port: number;
  timeout?: number;
}

interface AttendanceRecord {
  userId: string;
  timestamp: Date;
  type: number; // 0=check-in, 1=check-out, 4=overtime-in, 5=overtime-out
}

interface DeviceInfo {
  name: string;
  serialNo: string;
  firmware: string;
  enrolledUsers: number;
}

interface ConnectionResult {
  connected: boolean;
  deviceName?: string;
  serialNumber?: string;
}

interface SyncResult {
  synced: number;
  skipped: number;
}

@Injectable()
export class ZKTecoService {
  private readonly logger = new Logger(ZKTecoService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Test TCP connection to a ZKTeco device.
   *
   * Real SDK equivalent:
   *   const zk = new ZKLib(device.ip, device.port, device.timeout ?? 5000, 4000);
   *   await zk.createSocket();
   *   const info = await zk.getInfo();
   *   await zk.disconnect();
   */
  async testConnection(device: ZKDevice): Promise<ConnectionResult> {
    this.logger.log(`Testing connection to ${device.ip}:${device.port}`);

    // Simulate network round-trip delay (200–600 ms)
    await new Promise<void>((resolve) =>
      setTimeout(resolve, 200 + Math.random() * 400),
    );

    // Simulate ~85 % success rate for demo purposes
    const connected = Math.random() > 0.15;

    if (!connected) {
      this.logger.warn(`Connection to ${device.ip}:${device.port} timed out`);
      return { connected: false };
    }

    const models = ['ZKTeco K40', 'ZKTeco K80', 'ZK9500', 'iClock760', 'ZKTeco F22', 'ZKTeco MA300'];
    const deviceName = models[Math.floor(Math.random() * models.length)];
    const serialNumber = `ZK${Date.now().toString(36).toUpperCase()}`;

    this.logger.log(`Connected to ${deviceName} (S/N: ${serialNumber})`);
    return { connected: true, deviceName, serialNumber };
  }

  /**
   * Pull attendance records from the device starting from `fromDate`.
   *
   * Real SDK equivalent:
   *   const zk = new ZKLib(device.ip, device.port, device.timeout ?? 5000, 4000);
   *   await zk.createSocket();
   *   const { data } = await zk.getAttendances((percent: number) => {
   *     console.log(`Downloading: ${percent}%`);
   *   });
   *   await zk.disconnect();
   *   // data is an array of { deviceUserId, recordTime, type, ... }
   */
  async getAttendanceRecords(
    device: ZKDevice,
    fromDate: Date,
  ): Promise<AttendanceRecord[]> {
    this.logger.log(
      `Fetching attendance records from ${device.ip}:${device.port} since ${fromDate.toISOString()}`,
    );

    // Simulate download time proportional to record count
    await new Promise<void>((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1000),
    );

    // Generate between 20 and 120 simulated records
    const count = Math.floor(20 + Math.random() * 100);
    const records: AttendanceRecord[] = [];

    const now = Date.now();
    const from = fromDate.getTime();
    const attendanceTypes = [0, 1, 4, 5] as const; // check-in, check-out, ot-in, ot-out

    for (let i = 0; i < count; i++) {
      const userId = `EMP${String(Math.floor(1 + Math.random() * 250)).padStart(4, '0')}`;
      const timestamp = new Date(from + Math.random() * (now - from));
      const type = attendanceTypes[Math.floor(Math.random() * attendanceTypes.length)];
      records.push({ userId, timestamp, type });
    }

    this.logger.log(`Retrieved ${records.length} attendance records from ${device.ip}`);
    return records;
  }

  /**
   * Persist attendance records to the database, skipping duplicates.
   *
   * Upserts into the `attendances` table keyed on (employeeId, date).
   * check-in  → type 0 or 4  → populates `checkIn`  field
   * check-out → type 1 or 5  → populates `checkOut` field
   */
  async syncToDatabase(
    tenantId: string,
    terminalId: string,
    records: AttendanceRecord[],
  ): Promise<SyncResult> {
    this.logger.log(
      `Syncing ${records.length} records for tenant ${tenantId} from terminal ${terminalId}`,
    );

    let synced = 0;
    let skipped = 0;

    for (const record of records) {
      try {
        // Resolve ZKTeco userId → internal Employee record
        // ZKTeco stores the employee code in the userId field on the device
        const employee = await this.prisma.employee.findFirst({
          where: { tenantId, employeeCode: record.userId },
          select: { id: true },
        });

        if (!employee) {
          skipped++;
          continue;
        }

        const date = new Date(record.timestamp);
        date.setHours(0, 0, 0, 0);

        const isCheckIn = record.type === 0 || record.type === 4;

        // Real SDK would batch these with prisma.$transaction for performance
        await this.prisma.attendance.upsert({
          where: { employeeId_date: { employeeId: employee.id, date } },
          create: {
            tenantId,
            employeeId: employee.id,
            date,
            checkIn: isCheckIn ? record.timestamp : undefined,
            checkOut: !isCheckIn ? record.timestamp : undefined,
            checkInMethod: isCheckIn ? ('FINGERPRINT' as any) : undefined,
            checkOutMethod: !isCheckIn ? ('FINGERPRINT' as any) : undefined,
          },
          update: {
            ...(isCheckIn
              ? { checkIn: record.timestamp, checkInMethod: 'FINGERPRINT' as any }
              : { checkOut: record.timestamp, checkOutMethod: 'FINGERPRINT' as any }),
          },
        });

        synced++;
      } catch (err) {
        this.logger.warn(`Skipped record for userId ${record.userId}: ${(err as Error).message}`);
        skipped++;
      }
    }

    this.logger.log(`Sync complete — synced: ${synced}, skipped: ${skipped}`);
    return { synced, skipped };
  }

  /**
   * Wipe the attendance log stored on the device (after a confirmed backup).
   *
   * Real SDK equivalent:
   *   const zk = new ZKLib(device.ip, device.port, device.timeout ?? 5000, 4000);
   *   await zk.createSocket();
   *   await zk.clearAttendanceLog();
   *   await zk.disconnect();
   */
  async clearAttendanceLog(device: ZKDevice): Promise<boolean> {
    this.logger.warn(`Clearing attendance log on device ${device.ip}:${device.port}`);

    await new Promise<void>((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

    const success = Math.random() > 0.05; // 95 % success rate
    if (success) {
      this.logger.log(`Attendance log cleared on ${device.ip}`);
    } else {
      this.logger.error(`Failed to clear attendance log on ${device.ip}`);
    }
    return success;
  }

  /**
   * Retrieve hardware and firmware information from the device.
   *
   * Real SDK equivalent:
   *   const zk = new ZKLib(device.ip, device.port, device.timeout ?? 5000, 4000);
   *   await zk.createSocket();
   *   const info = await zk.getInfo();
   *   // info.deviceName, info.serialNumber, info.fwVersion, info.userCounts
   *   await zk.disconnect();
   */
  async getDeviceInfo(device: ZKDevice): Promise<DeviceInfo> {
    this.logger.log(`Fetching device info from ${device.ip}:${device.port}`);

    await new Promise<void>((resolve) => setTimeout(resolve, 200 + Math.random() * 200));

    const models: DeviceInfo[] = [
      { name: 'ZKTeco K40',    serialNo: `K40-${Math.floor(Math.random() * 90000 + 10000)}`,    firmware: 'Ver 6.60 Sep 12 2022', enrolledUsers: Math.floor(100 + Math.random() * 300) },
      { name: 'ZKTeco K80',    serialNo: `K80-${Math.floor(Math.random() * 90000 + 10000)}`,    firmware: 'Ver 6.70 Jan 05 2023', enrolledUsers: Math.floor(80  + Math.random() * 250) },
      { name: 'ZK9500',        serialNo: `ZK9-${Math.floor(Math.random() * 90000 + 10000)}`,    firmware: 'Ver 8.10 Mar 22 2023', enrolledUsers: Math.floor(50  + Math.random() * 200) },
      { name: 'iClock760',     serialNo: `IC7-${Math.floor(Math.random() * 90000 + 10000)}`,    firmware: 'Ver 10.2 Jul 01 2023', enrolledUsers: Math.floor(30  + Math.random() * 150) },
      { name: 'ZKTeco F22',    serialNo: `F22-${Math.floor(Math.random() * 90000 + 10000)}`,    firmware: 'Ver 4.90 Nov 14 2022', enrolledUsers: Math.floor(20  + Math.random() * 100) },
      { name: 'ZKTeco MA300',  serialNo: `MA3-${Math.floor(Math.random() * 90000 + 10000)}`,    firmware: 'Ver 3.40 Feb 08 2022', enrolledUsers: Math.floor(10  + Math.random() *  50) },
    ];

    return models[Math.floor(Math.random() * models.length)];
  }

  /**
   * Register a new user (fingerprint slot) on the device.
   * In a real scenario the fingerprint template is already stored on the device;
   * this call links the internal user record to the ZKTeco user ID.
   *
   * Real SDK equivalent:
   *   const zk = new ZKLib(device.ip, device.port, device.timeout ?? 5000, 4000);
   *   await zk.createSocket();
   *   await zk.setUser(uid, userId, name, password, role, cardNo);
   *   await zk.disconnect();
   */
  async enrollUser(
    device: ZKDevice,
    userId: string,
    name: string,
  ): Promise<boolean> {
    this.logger.log(
      `Enrolling user "${name}" (${userId}) on device ${device.ip}:${device.port}`,
    );

    await new Promise<void>((resolve) => setTimeout(resolve, 400 + Math.random() * 600));

    const success = Math.random() > 0.1; // 90 % success rate
    if (success) {
      this.logger.log(`User "${name}" enrolled successfully on ${device.ip}`);
    } else {
      this.logger.error(`Failed to enroll user "${name}" on ${device.ip}`);
    }
    return success;
  }
}
