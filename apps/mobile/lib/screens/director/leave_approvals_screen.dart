import 'package:flutter/material.dart';

class LeaveApprovalsScreen extends StatefulWidget {
  const LeaveApprovalsScreen({super.key});
  @override State<LeaveApprovalsScreen> createState() => _LeaveApprovalsState();
}

class _LeaveApprovalsState extends State<LeaveApprovalsScreen> {
  final _requests = [
    {'id': '1', 'name': 'Sardor Toshmatov', 'dept': 'IT', 'type': "Yillik ta'til", 'from': '25 Yan', 'to': '1 Feb', 'days': 8, 'status': 'pending', 'avatar': 'ST', 'reason': "Oilaviy ta'til"},
    {'id': '2', 'name': 'Malika Yusupova', 'dept': 'HR', 'type': 'Kasal ta\'til', 'from': '23 Yan', 'to': '24 Yan', 'days': 2, 'status': 'pending', 'avatar': 'MY', 'reason': 'Kasal'},
    {'id': '3', 'name': 'Bobur Rakhimov', 'dept': 'Moliya', 'type': 'Xizmat safari', 'from': '28 Yan', 'to': '30 Yan', 'days': 3, 'status': 'pending', 'avatar': 'BR', 'reason': 'Samarqand filialida audit'},
    {'id': '4', 'name': 'Jasur Mirzayev', 'dept': 'Savdo', 'type': 'Masofaviy', 'from': '22 Yan', 'to': '22 Yan', 'days': 1, 'status': 'approved', 'avatar': 'JM', 'reason': 'Mijoz bilan uchrashuv'},
    {'id': '5', 'name': 'Kamola Ergasheva', 'dept': 'Admin', 'type': "Yillik ta'til", 'from': '15 Feb', 'to': '20 Feb', 'days': 6, 'status': 'rejected', 'avatar': 'KE', 'reason': ''},
  ];

  Future<void> _action(Map<String, dynamic> req, bool approve) async {
    await Future.delayed(const Duration(milliseconds: 400));
    setState(() => req['status'] = approve ? 'approved' : 'rejected');
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(approve ? '${req['name']} so\'rovi tasdiqlandi' : '${req['name']} so\'rovi rad etildi'),
        backgroundColor: approve ? const Color(0xFF10B981) : const Color(0xFFEF4444),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ));
    }
  }

  Color _typeColor(String type) {
    if (type.contains('Yillik')) return const Color(0xFF2563EB);
    if (type.contains('Kasal')) return const Color(0xFFDC2626);
    if (type.contains('Xizmat')) return const Color(0xFF7C3AED);
    if (type.contains('Masofaviy')) return const Color(0xFF059669);
    return const Color(0xFF6B7280);
  }

  @override
  Widget build(BuildContext context) {
    final pending = _requests.where((r) => r['status'] == 'pending').toList();
    final others = _requests.where((r) => r['status'] != 'pending').toList();

    return Scaffold(
      appBar: AppBar(title: const Text("Ta'til tasdiqlash"), backgroundColor: Colors.white),
      backgroundColor: const Color(0xFFF9FAFB),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          if (pending.isNotEmpty) ...[
            Row(children: [
              const Text('Kutilmoqda', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(color: const Color(0xFFFEF3C7), borderRadius: BorderRadius.circular(10)),
                child: Text('${pending.length}', style: const TextStyle(color: Color(0xFFD97706), fontWeight: FontWeight.bold, fontSize: 12)),
              ),
            ]),
            const SizedBox(height: 10),
            ...pending.map((r) => _requestCard(r, showActions: true)),
            const SizedBox(height: 20),
          ],
          if (others.isNotEmpty) ...[
            const Text('Yakunlangan', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
            const SizedBox(height: 10),
            ...others.map((r) => _requestCard(r, showActions: false)),
          ],
        ],
      ),
    );
  }

  Widget _requestCard(Map<String, dynamic> r, {required bool showActions}) {
    final isPending = r['status'] == 'pending';
    final isApproved = r['status'] == 'approved';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          CircleAvatar(
            radius: 20,
            backgroundColor: _typeColor(r['type'] as String).withOpacity(0.12),
            child: Text(r['avatar'] as String, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: _typeColor(r['type'] as String))),
          ),
          const SizedBox(width: 12),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(r['name'] as String, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
            Text('${r['dept']} • ${r['type']}', style: const TextStyle(fontSize: 12, color: Color(0xFF9CA3AF))),
          ])),
          if (!isPending) Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: isApproved ? const Color(0xFFECFDF5) : const Color(0xFFFEE2E2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(isApproved ? 'Tasdiqlandi' : 'Rad etildi',
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: isApproved ? const Color(0xFF10B981) : const Color(0xFFEF4444))),
          ),
        ]),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: const Color(0xFFF9FAFB), borderRadius: BorderRadius.circular(10)),
          child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            _infoItem(Icons.calendar_today_rounded, '${r['from']} - ${r['to']}'),
            _infoItem(Icons.access_time_rounded, '${r['days']} kun'),
            if (r['reason'] != '') _infoItem(Icons.notes_rounded, r['reason'] as String),
          ]),
        ),
        if (showActions) ...[
          const SizedBox(height: 12),
          Row(children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => _action(r, false),
                style: OutlinedButton.styleFrom(foregroundColor: const Color(0xFFEF4444), side: const BorderSide(color: Color(0xFFEF4444))),
                icon: const Icon(Icons.close_rounded, size: 16),
                label: const Text('Rad etish'),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: ElevatedButton.icon(
                onPressed: () => _action(r, true),
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
                icon: const Icon(Icons.check_rounded, size: 16),
                label: const Text('Tasdiqlash'),
              ),
            ),
          ]),
        ],
      ]),
    );
  }

  Widget _infoItem(IconData icon, String text) => Row(children: [
    Icon(icon, size: 14, color: const Color(0xFF9CA3AF)),
    const SizedBox(width: 4),
    Text(text, style: const TextStyle(fontSize: 12, color: Color(0xFF374151))),
  ]);
}
