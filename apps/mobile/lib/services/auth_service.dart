import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'api_service.dart';

class AuthService {
  static const _storage = FlutterSecureStorage();

  static Future<Map<String, dynamic>?> login(String email, String password) async {
    try {
      final data = await ApiService.login(email, password);
      if (data['accessToken'] != null) {
        await ApiService.setTokens(data['accessToken'], data['refreshToken'] ?? '');
        await _saveUser(data['user']);
        return data['user'];
      }
      return null;
    } catch (_) {
      rethrow;
    }
  }

  static Future<void> _saveUser(Map<String, dynamic> user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('current_user', jsonEncode(user));
  }

  static Future<Map<String, dynamic>?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('current_user');
    if (raw == null) return null;
    return jsonDecode(raw);
  }

  static Future<bool> isLoggedIn() async {
    final token = await _storage.read(key: 'access_token');
    return token != null && token.isNotEmpty;
  }

  static Future<String?> getUserRole() async {
    final user = await getCurrentUser();
    return user?['role'];
  }

  static Future<void> logout() async {
    await ApiService.clearTokens();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('current_user');
  }
}
