import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  static const String _baseUrl = 'http://10.0.2.2:4000/api/v1'; // Android emulator
  // Use 'http://localhost:4000/api/v1' for iOS simulator

  static final Dio _dio = Dio(BaseOptions(
    baseUrl: _baseUrl,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 15),
    headers: {'Content-Type': 'application/json'},
  ));

  static const _storage = FlutterSecureStorage();

  static Future<void> init() async {
    final token = await _storage.read(key: 'access_token');
    if (token != null) {
      _dio.options.headers['Authorization'] = 'Bearer $token';
    }

    _dio.interceptors.add(InterceptorsWrapper(
      onError: (e, handler) async {
        if (e.response?.statusCode == 401) {
          final refreshed = await _refreshToken();
          if (refreshed) {
            final token = await _storage.read(key: 'access_token');
            e.requestOptions.headers['Authorization'] = 'Bearer $token';
            return handler.resolve(await _dio.fetch(e.requestOptions));
          }
        }
        return handler.next(e);
      },
    ));
  }

  static Future<bool> _refreshToken() async {
    try {
      final refresh = await _storage.read(key: 'refresh_token');
      if (refresh == null) return false;
      final res = await _dio.post('/auth/refresh', data: {'refreshToken': refresh});
      await setTokens(res.data['accessToken'], res.data['refreshToken']);
      return true;
    } catch (_) {
      return false;
    }
  }

  static Future<void> setTokens(String access, String refresh) async {
    await _storage.write(key: 'access_token', value: access);
    await _storage.write(key: 'refresh_token', value: refresh);
    _dio.options.headers['Authorization'] = 'Bearer $access';
  }

  static Future<void> clearTokens() async {
    await _storage.deleteAll();
    _dio.options.headers.remove('Authorization');
  }

  static Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await _dio.post('/auth/login', data: {'email': email, 'password': password});
    return res.data;
  }

  static Future<Map<String, dynamic>> getProfile() async {
    final res = await _dio.get('/auth/profile');
    return res.data;
  }

  static Future<Map<String, dynamic>> checkIn({
    required double lat, required double lng,
    String? photo, String? method,
  }) async {
    final res = await _dio.post('/attendance/check-in', data: {
      'lat': lat, 'lng': lng, 'photo': photo, 'method': method ?? 'GPS',
    });
    return res.data;
  }

  static Future<Map<String, dynamic>> checkOut({
    required double lat, required double lng,
  }) async {
    final res = await _dio.post('/attendance/check-out', data: {'lat': lat, 'lng': lng});
    return res.data;
  }

  static Future<List<dynamic>> getAttendanceHistory({int page = 1}) async {
    final res = await _dio.get('/attendance', queryParameters: {'page': page, 'limit': 20});
    return res.data['data'] ?? res.data;
  }

  static Future<List<dynamic>> getLeaveRequests() async {
    final res = await _dio.get('/leave/my-requests');
    return res.data['data'] ?? res.data;
  }

  static Future<Map<String, dynamic>> createLeaveRequest(Map<String, dynamic> data) async {
    final res = await _dio.post('/leave/request', data: data);
    return res.data;
  }

  static Future<Map<String, dynamic>> getPayrollSummary() async {
    final res = await _dio.get('/payroll/my-payroll');
    return res.data;
  }

  static Future<List<dynamic>> getTasks() async {
    final res = await _dio.get('/tasks/my-tasks');
    return res.data['data'] ?? res.data;
  }

  static Future<void> completeTask(String taskId) async {
    await _dio.patch('/tasks/$taskId/complete');
  }

  // Director endpoints
  static Future<Map<String, dynamic>> getDashboardStats() async {
    final res = await _dio.get('/dashboard/overview');
    return res.data;
  }

  static Future<List<dynamic>> getLiveAttendance() async {
    final res = await _dio.get('/attendance/live');
    return res.data['data'] ?? res.data;
  }

  static Future<List<dynamic>> getEmployees({String? dept, String? status}) async {
    final res = await _dio.get('/employees', queryParameters: {
      if (dept != null) 'department': dept,
      if (status != null) 'status': status,
      'limit': 50,
    });
    return res.data['data'] ?? res.data;
  }

  static Future<List<dynamic>> getPendingLeaves() async {
    final res = await _dio.get('/leave/pending');
    return res.data['data'] ?? res.data;
  }

  static Future<void> approveLeave(String id, bool approve) async {
    await _dio.patch('/leave/$id/${approve ? 'approve' : 'reject'}');
  }
}
