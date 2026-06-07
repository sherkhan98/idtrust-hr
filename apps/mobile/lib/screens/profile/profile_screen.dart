import 'package:flutter/material.dart';
import '../auth/login_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});
  @override State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String _lang = 'uz';
  bool _notifications = true;
  bool _telegramNotif = true;

  final _langs = [
    {'code': 'uz', 'flag': '🇺🇿', 'name': "O'zbek"},
    {'code': 'ru', 'flag': '🇷🇺', 'name': 'Русский'},
    {'code': 'en', 'flag': '🇬🇧', 'name': 'English'},
    {'code': 'ky', 'flag': '🇰🇬', 'name': 'Кыргызча'},
    {'code': 'tg', 'flag': '🇹🇯', 'name': 'Тоҷикӣ'},
    {'code': 'kk', 'flag': '🇰🇿', 'name': 'Қазақша'},
    {'code': 'tr', 'flag': '🇹🇷', 'name': 'Türkçe'},
    {'code': 'az', 'flag': '🇦🇿', 'name': 'Azərbaycan'},
  ];

  void _showLangPicker() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          const SizedBox(height: 8),
          Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2))),
          const Padding(
            padding: EdgeInsets.all(16),
            child: Text('Til tanlash', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ),
          ...(_langs.map((l) => ListTile(
            leading: Text(l['flag']!, style: const TextStyle(fontSize: 24)),
            title: Text(l['name']!, style: const TextStyle(fontWeight: FontWeight.w500)),
            trailing: _lang == l['code'] ? const Icon(Icons.check_circle_rounded, color: Color(0xFF2563EB)) : null,
            onTap: () { setState(() => _lang = l['code']!); Navigator.pop(context); },
          ))).toList(),
          const SizedBox(height: 16),
        ]),
      ),
    );
  }

  void _confirmLogout() {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Chiqmoqchimisiz?'),
        content: const Text('Tizimdan chiqiladi.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Bekor qilish")),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (_) => const LoginScreen()),
                (r) => false,
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEF4444)),
            child: const Text('Chiqish'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentLang = _langs.firstWhere((l) => l['code'] == _lang, orElse: () => _langs.first);

    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(title: const Text('Profil'), backgroundColor: Colors.white),
      body: ListView(
        children: [
          // Avatar & name
          Container(
            color: Colors.white,
            padding: const EdgeInsets.all(24),
            child: Row(children: [
              Stack(children: [
                Container(
                  width: 72, height: 72,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(colors: [Color(0xFF2563EB), Color(0xFF1D4ED8)]),
                    shape: BoxShape.circle,
                  ),
                  child: const Center(child: Text('ST', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold))),
                ),
                Positioned(
                  bottom: 0, right: 0,
                  child: Container(
                    width: 22, height: 22,
                    decoration: BoxDecoration(color: const Color(0xFF10B981), shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 2)),
                    child: const Icon(Icons.check_rounded, color: Colors.white, size: 12),
                  ),
                ),
              ]),
              const SizedBox(width: 16),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Text('Sardor Toshmatov', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const Text('Senior Dasturchi', style: TextStyle(fontSize: 13, color: Color(0xFF6B7280))),
                const SizedBox(height: 4),
                Row(children: [
                  const Icon(Icons.business_rounded, size: 12, color: Color(0xFF9CA3AF)),
                  const SizedBox(width: 4),
                  const Text('IT Bo\'limi • Nexus Group', style: TextStyle(fontSize: 12, color: Color(0xFF9CA3AF))),
                ]),
              ])),
            ]),
          ),

          const SizedBox(height: 12),

          // Contact info
          _section('Shaxsiy ma\'lumotlar', [
            _infoTile(Icons.email_rounded, 'Email', 'sardor@nexusgroup.uz'),
            _infoTile(Icons.phone_rounded, 'Telefon', '+998 90 123 45 67'),
            _infoTile(Icons.send_rounded, 'Telegram', '@sardor_dev', color: const Color(0xFF2AABEE)),
            _infoTile(Icons.calendar_today_rounded, 'Ishga kirgan', '15 Yanvar 2022'),
            _infoTile(Icons.badge_rounded, 'Xodim ID', 'EMP-00142'),
          ]),
          const SizedBox(height: 12),

          // Settings
          _section('Sozlamalar', [
            ListTile(
              leading: Container(width: 36, height: 36, decoration: BoxDecoration(color: const Color(0xFFEEF2FF), borderRadius: BorderRadius.circular(10)), child: const Icon(Icons.language_rounded, color: Color(0xFF2563EB), size: 20)),
              title: const Text('Til', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
              trailing: Row(mainAxisSize: MainAxisSize.min, children: [
                Text('${currentLang['flag']} ${currentLang['name']}', style: const TextStyle(fontSize: 13, color: Color(0xFF6B7280))),
                const Icon(Icons.chevron_right_rounded, color: Color(0xFFD1D5DB), size: 20),
              ]),
              onTap: _showLangPicker,
            ),
            SwitchListTile(
              secondary: Container(width: 36, height: 36, decoration: BoxDecoration(color: const Color(0xFFFFF7ED), borderRadius: BorderRadius.circular(10)), child: const Icon(Icons.notifications_rounded, color: Color(0xFFF59E0B), size: 20)),
              title: const Text('Bildirishnomalar', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
              value: _notifications,
              onChanged: (v) => setState(() => _notifications = v),
              activeColor: const Color(0xFF2563EB),
            ),
            SwitchListTile(
              secondary: Container(width: 36, height: 36, decoration: BoxDecoration(color: const Color(0xFFEFF8FF), borderRadius: BorderRadius.circular(10)), child: const Icon(Icons.send_rounded, color: Color(0xFF2AABEE), size: 20)),
              title: const Text('Telegram xabarnomalar', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
              subtitle: const Text('@sardor_dev', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
              value: _telegramNotif,
              onChanged: (v) => setState(() => _telegramNotif = v),
              activeColor: const Color(0xFF2563EB),
            ),
          ]),
          const SizedBox(height: 12),

          // Logout
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: ElevatedButton.icon(
              onPressed: _confirmLogout,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFEE2E2),
                foregroundColor: const Color(0xFFEF4444),
                elevation: 0,
                minimumSize: const Size(double.infinity, 50),
              ),
              icon: const Icon(Icons.logout_rounded, size: 18),
              label: const Text('Tizimdan chiqish', style: TextStyle(fontWeight: FontWeight.w600)),
            ),
          ),
          const SizedBox(height: 32),
          const Center(child: Text('StaffFlow HR v1.0.0\nMade in Uzbekistan 🇺🇿', textAlign: TextAlign.center, style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF), height: 1.6))),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _section(String title, List<Widget> children) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Padding(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
        child: Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF6B7280), letterSpacing: 0.5)),
      ),
      Container(
        color: Colors.white,
        child: Column(children: children),
      ),
    ],
  );

  Widget _infoTile(IconData icon, String label, String value, {Color? color}) => ListTile(
    dense: true,
    leading: Container(
      width: 36, height: 36,
      decoration: BoxDecoration(color: (color ?? const Color(0xFF2563EB)).withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
      child: Icon(icon, color: color ?? const Color(0xFF2563EB), size: 18),
    ),
    title: Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
    subtitle: Text(value, style: const TextStyle(fontSize: 13, color: Color(0xFF111827), fontWeight: FontWeight.w500)),
  );
}
