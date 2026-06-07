import 'package:flutter/material.dart';

class LeaveScreen extends StatefulWidget {
  const LeaveScreen({super.key});
  @override State<LeaveScreen> createState() => _LeaveScreenState();
}

class _LeaveScreenState extends State<LeaveScreen> with SingleTickerProviderStateMixin {
  late TabController _tab;

  final _balance = [
    {'type': "Yillik ta'til", 'total': 24, 'used': 10, 'remaining': 14, 'color': 0xFF2563EB, 'icon': Icons.beach_access_rounded},
    {'type': "Kasal ta'til", 'total': 15, 'used': 3, 'remaining': 12, 'color': 0xFFDC2626, 'icon': Icons.medical_services_rounded},
    {'type': 'Xizmat safari', 'total': 10, 'used': 4, 'remaining': 6, 'color': 0xFF7C3AED, 'icon': Icons.flight_rounded},
    {'type': 'Masofaviy ish', 'total': 12, 'used': 2, 'remaining': 10, 'color': 0xFF059669, 'icon': Icons.home_work_rounded},
  ];

  final _requests = [
    {'type': "Yillik ta'til", 'from': '25 Yan 2024', 'to': '1 Feb 2024', 'days': 8, 'status': 'approved', 'reason': "Oilaviy ta'til"},
    {'type': "Kasal ta'til", 'from': '10 Yan 2024', 'to': '11 Yan 2024', 'days': 2, 'status': 'approved', 'reason': 'ARVI'},
    {'type': "Yillik ta'til", 'from': '15 Mar 2024', 'to': '20 Mar 2024', 'days': 6, 'status': 'pending', 'reason': 'Shaxsiy'},
    {'type': 'Xizmat safari', 'from': '5 Feb 2024', 'to': '7 Feb 2024', 'days': 3, 'status': 'rejected', 'reason': 'Toshkent-Samarqand'},
  ];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() { _tab.dispose(); super.dispose(); }

  Color _statusColor(String s) => s == 'approved' ? const Color(0xFF10B981) : s == 'pending' ? const Color(0xFFF59E0B) : const Color(0xFFEF4444);
  String _statusLabel(String s) => s == 'approved' ? 'Tasdiqlandi' : s == 'pending' ? 'Kutilmoqda' : 'Rad etildi';

  void _showNewRequest() {
    final types = ["Yillik ta'til", "Kasal ta'til", "Xizmat safari", "Masofaviy ish", "Qo'shimcha vaqt"];
    String selectedType = types[0];
    DateTime? fromDate;
    DateTime? toDate;
    final reasonCtrl = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => StatefulBuilder(
        builder: (ctx, setModal) => Container(
          height: MediaQuery.of(context).size.height * 0.85,
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(children: [
            const SizedBox(height: 8),
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 16),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Row(children: [
                Text("Yangi ta'til so'rovi", style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
              ]),
            ),
            const SizedBox(height: 20),
            Expanded(child: ListView(padding: const EdgeInsets.symmetric(horizontal: 20), children: [
              const Text("Ta'til turi", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF374151))),
              const SizedBox(height: 8),
              Wrap(spacing: 8, runSpacing: 8, children: types.map((t) => GestureDetector(
                onTap: () => setModal(() => selectedType = t),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: selectedType == t ? const Color(0xFF2563EB) : const Color(0xFFF3F4F6),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(t, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: selectedType == t ? Colors.white : const Color(0xFF374151))),
                ),
              )).toList()),
              const SizedBox(height: 20),
              Row(children: [
                Expanded(child: _dateField("Boshlanish", fromDate, () async {
                  final d = await showDatePicker(context: context, initialDate: DateTime.now(), firstDate: DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 365)));
                  if (d != null) setModal(() => fromDate = d);
                })),
                const SizedBox(width: 12),
                Expanded(child: _dateField("Tugash", toDate, () async {
                  final d = await showDatePicker(context: context, initialDate: fromDate ?? DateTime.now(), firstDate: fromDate ?? DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 365)));
                  if (d != null) setModal(() => toDate = d);
                })),
              ]),
              const SizedBox(height: 20),
              const Text("Sabab", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF374151))),
              const SizedBox(height: 8),
              TextField(
                controller: reasonCtrl,
                maxLines: 3,
                decoration: const InputDecoration(hintText: "Izohlang..."),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                    content: const Text("So'rov yuborildi!"),
                    backgroundColor: const Color(0xFF10B981),
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ));
                },
                style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
                child: const Text("So'rov yuborish"),
              ),
            ])),
          ]),
        ),
      ),
    );
  }

  Widget _dateField(String label, DateTime? value, VoidCallback onTap) => GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      decoration: BoxDecoration(
        color: const Color(0xFFF9FAFB),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Row(children: [
        const Icon(Icons.calendar_today_rounded, size: 16, color: Color(0xFF9CA3AF)),
        const SizedBox(width: 8),
        Text(
          value != null ? '${value.day}.${value.month}.${value.year}' : label,
          style: TextStyle(fontSize: 13, color: value != null ? const Color(0xFF111827) : const Color(0xFF9CA3AF)),
        ),
      ]),
    ),
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        title: const Text("Ta'tillar"),
        backgroundColor: Colors.white,
        actions: [
          TextButton.icon(
            onPressed: _showNewRequest,
            icon: const Icon(Icons.add_rounded, size: 18),
            label: const Text("So'rov", style: TextStyle(fontWeight: FontWeight.w600)),
          ),
        ],
        bottom: TabBar(
          controller: _tab,
          labelColor: const Color(0xFF2563EB),
          unselectedLabelColor: const Color(0xFF6B7280),
          indicatorColor: const Color(0xFF2563EB),
          indicatorSize: TabBarIndicatorSize.label,
          tabs: const [Tab(text: 'Balans'), Tab(text: "Tarix")],
        ),
      ),
      body: TabBarView(
        controller: _tab,
        children: [
          // Balance Tab
          ListView(padding: const EdgeInsets.all(16), children: [
            ..._balance.map((b) => Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE5E7EB)),
              ),
              child: Row(children: [
                Container(
                  width: 44, height: 44,
                  decoration: BoxDecoration(color: Color(b['color'] as int).withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                  child: Icon(b['icon'] as IconData, color: Color(b['color'] as int), size: 22),
                ),
                const SizedBox(width: 14),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(b['type'] as String, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: LinearProgressIndicator(
                      value: (b['used'] as int) / (b['total'] as int),
                      backgroundColor: const Color(0xFFF3F4F6),
                      color: Color(b['color'] as int),
                      minHeight: 6,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                    Text('Ishlatildi: ${b['used']} kun', style: const TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                    Text('Qoldi: ${b['remaining']} kun', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(b['color'] as int))),
                  ]),
                ])),
              ]),
            )).toList(),
          ]),

          // History Tab
          ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: _requests.length,
            separatorBuilder: (_, __) => const SizedBox(height: 10),
            itemBuilder: (_, i) {
              final r = _requests[i];
              return Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                ),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [
                    Expanded(child: Text(r['type'] as String, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14))),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: _statusColor(r['status'] as String).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(_statusLabel(r['status'] as String), style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: _statusColor(r['status'] as String))),
                    ),
                  ]),
                  const SizedBox(height: 8),
                  Row(children: [
                    const Icon(Icons.date_range_rounded, size: 14, color: Color(0xFF9CA3AF)),
                    const SizedBox(width: 4),
                    Text('${r['from']} – ${r['to']}', style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
                    const SizedBox(width: 12),
                    const Icon(Icons.access_time_rounded, size: 14, color: Color(0xFF9CA3AF)),
                    const SizedBox(width: 4),
                    Text('${r['days']} kun', style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
                  ]),
                  if ((r['reason'] as String).isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(r['reason'] as String, style: const TextStyle(fontSize: 12, color: Color(0xFF9CA3AF))),
                  ],
                ]),
              );
            },
          ),
        ],
      ),
    );
  }
}
