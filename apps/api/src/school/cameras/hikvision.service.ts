import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import axios from 'axios';

export interface HikvisionCamera {
  id: string;
  name: string;
  ip: string;
  port: number;
  username: string;
  password: string;
  rtspPath: string;
  location: 'ENTRANCE' | 'EXIT' | 'CORRIDOR' | 'CLASSROOM';
  isOnline: boolean;
  schoolId: string;
}

export interface FaceDetectionEvent {
  cameraId: string;
  timestamp: Date;
  imageUrl: string;
  faceConfidence: number;
  studentId?: string;
  eventType: 'ARRIVAL' | 'DEPARTURE' | 'UNKNOWN';
}

@Injectable()
export class HikvisionService {
  private readonly logger = new Logger(HikvisionService.name);

  constructor(private eventEmitter: EventEmitter2) {}

  getRtspUrl(camera: Pick<HikvisionCamera, 'ip' | 'port' | 'username' | 'password' | 'rtspPath'>): string {
    return `rtsp://${camera.username}:${camera.password}@${camera.ip}:${camera.port}/${camera.rtspPath}`;
  }

  async testConnection(camera: HikvisionCamera): Promise<{ online: boolean; info?: any }> {
    try {
      // Hikvision ISAPI — device info endpoint
      const response = await axios.get(
        `http://${camera.ip}:80/ISAPI/System/deviceInfo`,
        {
          auth: { username: camera.username, password: camera.password },
          timeout: 5000,
          headers: { 'Content-Type': 'application/xml' },
        },
      );
      return { online: true, info: response.data };
    } catch (err: any) {
      this.logger.warn(`Camera ${camera.name} (${camera.ip}) offline: ${err.message}`);
      return { online: false };
    }
  }

  async getSnapshot(camera: HikvisionCamera): Promise<Buffer | null> {
    try {
      // Hikvision ISAPI snapshot endpoint
      const response = await axios.get(
        `http://${camera.ip}:80/ISAPI/Streaming/channels/101/picture`,
        {
          auth: { username: camera.username, password: camera.password },
          responseType: 'arraybuffer',
          timeout: 8000,
        },
      );
      return Buffer.from(response.data);
    } catch (err: any) {
      this.logger.error(`Snapshot failed for ${camera.name}: ${err.message}`);
      return null;
    }
  }

  async subscribeToEvents(camera: HikvisionCamera): Promise<void> {
    // Hikvision ISAPI event subscription — long-polling
    // In production, use: GET /ISAPI/Event/notification/alertStream
    // Here we simulate the subscription setup
    this.logger.log(`Subscribed to events from camera: ${camera.name} @ ${camera.ip}`);

    // In production: maintain long-lived RTSP connection with OpenCV/YOLO processing
    // Event comes in → trigger face recognition → emit event
  }

  // Called by the YOLO face recognition processor when a face is detected
  async onFaceDetected(event: FaceDetectionEvent): Promise<void> {
    this.logger.log(`Face detected on camera ${event.cameraId}: ${event.studentId || 'unknown'}`);
    this.eventEmitter.emit('face.detected', event);
  }

  // Hikvision Smart Event — Face Recognition via ISAPI
  async configureFaceRecognition(camera: HikvisionCamera, enable: boolean): Promise<boolean> {
    try {
      const body = `<?xml version="1.0" encoding="UTF-8"?>
<FaceRecognition>
  <enabled>${enable}</enabled>
  <detectionInterval>500</detectionInterval>
  <sensitivityLevel>5</sensitivityLevel>
</FaceRecognition>`;

      await axios.put(
        `http://${camera.ip}:80/ISAPI/Smart/FaceDetect`,
        body,
        {
          auth: { username: camera.username, password: camera.password },
          headers: { 'Content-Type': 'application/xml' },
          timeout: 5000,
        },
      );
      return true;
    } catch {
      return false;
    }
  }

  async enrollFace(camera: HikvisionCamera, personId: string, faceImageBase64: string): Promise<boolean> {
    try {
      const body = `<?xml version="1.0" encoding="UTF-8"?>
<FaceDataRecord>
  <employeeNo>${personId}</employeeNo>
  <FaceDataList>
    <FaceData>
      <dataType>faceData</dataType>
      <FaceURL>data:image/jpeg;base64,${faceImageBase64}</FaceURL>
    </FaceData>
  </FaceDataList>
</FaceDataRecord>`;

      await axios.post(
        `http://${camera.ip}:80/ISAPI/Intelligent/FDLib/FaceDataRecord`,
        body,
        {
          auth: { username: camera.username, password: camera.password },
          headers: { 'Content-Type': 'application/xml' },
          timeout: 10000,
        },
      );
      return true;
    } catch (err: any) {
      this.logger.error(`Face enrollment failed: ${err.message}`);
      return false;
    }
  }
}
