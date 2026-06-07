import 'package:flutter/material.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  bool _checkedIn = true;
  bool _isLoading = false;

  Future<void> _toggleAttendance() async {
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(milliseconds: 800));
    setState(() {
      _checkedIn = !_checkedIn;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(title: const Text('Davomat'), backgroundColor: Colors.white),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Main check-in card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE5E7EB)),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4))],
              ),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: _checkedIn ? const Color(0xFFECFDF5) : const Color(0xFFF0F4FF),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      _checkedIn ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
                      color: _checkedIn ? const Color(0xFF10B981) : const Color(0xFF2563EB),
                      size: 60,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    _checkedIn ? 'Ishda' : 'Hali kelmadingiz',
                    style: TextStyle(
                      fontSize: 22, fontWeight: FontWeight.bold,
                      color: _checkedIn ? const Color(0xFF10B981) : const Color(0xFF374151),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _checkedIn ? 'Kirish vaqti: 09:02' : 'Bugun hali kiritilmagan',
                    style: const TextStyle(fontSize: 13, color: Color(0xFF6B7280)),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _isLoading ? null : _toggleAttendance,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _checkedIn ? const Color(0xFFEF4444) : const Color(0xFF2563EB),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      icon: _isLoading
                          ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : Icon(_checkedIn ? Icons.logout_rounded : Icons.login_rounded),
                      label: Text(_checkedIn ? 'Ketishni belgilash' : 'Kelishni belgilash', style: const TextStyle(fontSize: 15)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Method buttons
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Davomat usuli', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _methodBtn(Icons.face_retouching_natural_rounded, 'Face ID', const Color(0xFF2563EB)),
                        _methodBtn(Icons.qr_code_rounded, 'QR Kod', const Color(0xFF7C3AED)),
                        _methodBtn(Icons.location_on_rounded, 'GPS', const Color(0xFF059669)),
                        _methodBtn(Icons.wifi_rounded, 'WiFi', const Color(0xFFD97706)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // This month summary
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Bu oy statistikasi', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        _statItem('22', 'Kelgan', const Color(0xFF10B981)),
                        _statItem('0', 'Kelmagan', const Color(0xFFEF4444)),
                        _statItem('2', 'Kechikdi', const Color(0xFFF59E0B)),
                        _statItem('1', "Ta'tilda", const Color(0xFF3B82F6)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _methodBtn(IconData icon, String label, Color color) {
    return Column(
      children: [
        Container(
          width: 50, height: 50,
          decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
          child: Icon(icon, color: color, size: 26),
        ),
        const SizedBox(height: 6),
        Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w500, color: Color(0xFF374151))),
      ],
    );
  }

  Widget _statItem(String value, String label, Color color) {
    return Expanded(
      child: Column(
        children: [
          Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: color)),
          Text(label, style: const TextStyle(fontSize: 10, color: Color(0xFF9CA3AF))),
        ],
      ),
    );
  }
}
