import 'package:flutter/material.dart';

class DirectorDashboardScreen extends StatefulWidget {
  const DirectorDashboardScreen({super.key});
  @override State<DirectorDashboardScreen> createState() => _DirectorDashboardState();
}

class _DirectorDashboardState extends State<DirectorDashboardScreen> {
  bool _loading = false;
  DateTime _lastUpdated = DateTime.now();

  final _stats = {
    'total': 156, 'present': 128, 'late': 14, 'absent': 14,
    'onLeave': 8, 'remote': 5, 'attendanceRate': 91,
  };

  final _depts = [
    {'name': 'IT', 'total': 32, 'present': 28, 'color': 0xFF2563EB},
    {'name': 'HR', 'total': 12, 'present': 10, 'color': 0xFF7C3AED},
    {'name': 'Moliya', 'total': 18, 'present': 15, 'color': 0xFF059669},
    {'name': 'Marketing', 'total': 24, 'present': 21, 'color': 0xFFD97706},
    {'name': 'Savdo', 'total': 45, 'present': 38, 'color': 0xFFDC2626},
    {'name': 'Admin', 'total': 25, 'present': 16, 'color': 0xFF0891B2},
  ];

  final _recentActivity = [
    {'name': 'Sardor Toshmatov', 'dept': 'IT', 'time': '08:52', 'status': 'present', 'avatar': 'ST'},
    {'name': 'Malika Yusupova', 'dept': 'HR', 'time': '08:45', 'status': 'present', 'avatar': 'MY'},
    {'name': 'Bobur Rakhimov', 'dept': 'Moliya', 'time': '09:35', 'status': 'late', 'avatar': 'BR'},
    {'name': 'Dilnoza Karimova', 'dept': 'Marketing', 'time': '08:58', 'status': 'present', 'avatar': 'DK'},
    {'name': 'Nilufar Hasanova', 'dept': 'IT', 'time': '-', 'status': 'absent', 'avatar': 'NH'},
  ];

  Future<void> _refresh() async {
    setState(() => _loading = true);
    await Future.delayed(const Duration(milliseconds: 800));
    setState(() { _loading = false; _lastUpdated = DateTime.now(); });
  }

  Color _statusColor(String s) => s == 'present' ? const Color(0xFF10B981) : s == 'late' ? const Color(0xFFF59E0B) : const Color(0xFFEF4444);
  String _statusLabel(String s) => s == 'present' ? 'Keldi' : s == 'late' ? 'Kech' : 'Kelmadi';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      body: RefreshIndicator(
        onRefresh: _refresh,
        color: const Color(0xFF2563EB),
        child: CustomScrollView(
          slivers: [
            // Header
            SliverAppBar(
              expandedHeight: 180,
              pinned: true,
              backgroundColor: const Color(0xFF1E40AF),
              surfaceTintColor: Colors.transparent,
              flexibleSpace: FlexibleSpaceBar(
                background: Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Color(0xFF1E40AF), Color(0xFF2563EB), Color(0xFF3B82F6)],
                    ),
                  ),
                  child: SafeArea(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Nexus Group', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                              Row(children: [
                                if (_loading) const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)),
                                IconButton(icon: const Icon(Icons.refresh_rounded, color: Colors.white), onPressed: _refresh),
                                IconButton(icon: const Icon(Icons.notifications_outlined, color: Colors.white), onPressed: () {}),
                              ]),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Yangilangan: ${_lastUpdated.hour.toString().padLeft(2,'0')}:${_lastUpdated.minute.toString().padLeft(2,'0')}',
                            style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 12),
                          ),
                          const SizedBox(height: 16),
                          Row(children: [
                            _headerStat('${_stats['total']}', 'Jami', Colors.white.withOpacity(0.2)),
                            const SizedBox(width: 8),
                            _headerStat('${_stats['present']}', 'Keldi', const Color(0xFF10B981).withOpacity(0.3)),
                            const SizedBox(width: 8),
                            _headerStat('${_stats['late']}', 'Kech', const Color(0xFFF59E0B).withOpacity(0.3)),
                            const SizedBox(width: 8),
                            _headerStat('${_stats['absent']}', 'Kelmadi', const Color(0xFFEF4444).withOpacity(0.3)),
                          ]),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),

            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    // Attendance rate card
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE5E7EB)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                            const Text('Davomat darajasi', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                            Text('${_stats['attendanceRate']}%', style: const TextStyle(color: Color(0xFF2563EB), fontWeight: FontWeight.bold, fontSize: 16)),
                          ]),
                          const SizedBox(height: 10),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: LinearProgressIndicator(
                              value: (_stats['attendanceRate'] as int) / 100,
                              backgroundColor: const Color(0xFFF3F4F6),
                              color: const Color(0xFF2563EB),
                              minHeight: 8,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                            _progressLegend(const Color(0xFF10B981), "Keldi: ${_stats['present']}"),
                            _progressLegend(const Color(0xFFF59E0B), "Kech: ${_stats['late']}"),
                            _progressLegend(const Color(0xFFEF4444), "Kelmadi: ${_stats['absent']}"),
                            _progressLegend(const Color(0xFF3B82F6), "Ta'til: ${_stats['onLeave']}"),
                          ]),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Department breakdown
                    _sectionCard(
                      title: "Bo'limlar bo'yicha",
                      child: Column(
                        children: _depts.map((d) {
                          final pct = ((d['present'] as int) / (d['total'] as int));
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: Row(children: [
                              Container(
                                width: 8, height: 8,
                                decoration: BoxDecoration(color: Color(d['color'] as int), shape: BoxShape.circle),
                              ),
                              const SizedBox(width: 8),
                              Expanded(child: Text(d['name'] as String, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500))),
                              SizedBox(
                                width: 120,
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(4),
                                  child: LinearProgressIndicator(
                                    value: pct, minHeight: 6,
                                    backgroundColor: const Color(0xFFF3F4F6),
                                    color: Color(d['color'] as int),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text('${d['present']}/${d['total']}', style: const TextStyle(fontSize: 11, color: Color(0xFF6B7280))),
                            ]),
                          );
                        }).toList(),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Recent activity
                    _sectionCard(
                      title: "So'nggi harakatlar",
                      child: Column(
                        children: _recentActivity.map((e) => Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: Row(children: [
                            CircleAvatar(
                              radius: 20,
                              backgroundColor: _statusColor(e['status'] as String).withOpacity(0.15),
                              child: Text(e['avatar'] as String, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: _statusColor(e['status'] as String))),
                            ),
                            const SizedBox(width: 12),
                            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              Text(e['name'] as String, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                              Text(e['dept'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                            ])),
                            Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: _statusColor(e['status'] as String).withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(_statusLabel(e['status'] as String), style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: _statusColor(e['status'] as String))),
                              ),
                              if (e['time'] != '-') Text(e['time'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                            ]),
                          ]),
                        )).toList(),
                      ),
                    ),
                    const SizedBox(height: 80),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _headerStat(String value, String label, Color bg) => Expanded(
    child: Container(
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
      child: Column(children: [
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
        Text(label, style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 10)),
      ]),
    ),
  );

  Widget _progressLegend(Color color, String label) => Row(children: [
    Container(width: 8, height: 8, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
    const SizedBox(width: 4),
    Text(label, style: const TextStyle(fontSize: 10, color: Color(0xFF6B7280))),
  ]);

  Widget _sectionCard({required String title, required Widget child}) => Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: Colors.white, borderRadius: BorderRadius.circular(16),
      border: Border.all(color: const Color(0xFFE5E7EB)),
    ),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Color(0xFF374151))),
      const SizedBox(height: 14),
      child,
    ]),
  );
}
