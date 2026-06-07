import 'package:flutter/material.dart';

class EmployeesMonitorScreen extends StatefulWidget {
  const EmployeesMonitorScreen({super.key});
  @override State<EmployeesMonitorScreen> createState() => _EmployeesMonitorState();
}

class _EmployeesMonitorState extends State<EmployeesMonitorScreen> with SingleTickerProviderStateMixin {
  late TabController _tab;
  String _search = '';
  String _deptFilter = 'Barchasi';

  final _depts = ['Barchasi', 'IT', 'HR', 'Moliya', 'Marketing', 'Savdo', 'Admin'];

  final _employees = [
    {'name': 'Sardor Toshmatov', 'pos': 'Senior Dasturchi', 'dept': 'IT', 'status': 'present', 'time': '08:52', 'avatar': 'ST', 'loc': 'Asosiy ofis'},
    {'name': 'Malika Yusupova', 'pos': 'HR Manager', 'dept': 'HR', 'status': 'present', 'time': '08:45', 'avatar': 'MY', 'loc': 'Asosiy ofis'},
    {'name': 'Bobur Rakhimov', 'pos': 'Buxgalter', 'dept': 'Moliya', 'status': 'late', 'time': '09:35', 'avatar': 'BR', 'loc': 'Asosiy ofis'},
    {'name': 'Dilnoza Karimova', 'pos': 'Designer', 'dept': 'Marketing', 'status': 'present', 'time': '08:58', 'avatar': 'DK', 'loc': 'Asosiy ofis'},
    {'name': 'Jasur Mirzayev', 'pos': 'Savdo menejeri', 'dept': 'Savdo', 'status': 'remote', 'time': '09:05', 'avatar': 'JM', 'loc': 'Samarqand'},
    {'name': 'Nilufar Hasanova', 'pos': 'Junior Dasturchi', 'dept': 'IT', 'status': 'absent', 'time': '-', 'avatar': 'NH', 'loc': '-'},
    {'name': 'Otabek Sobirov', 'pos': 'Loyiha menejeri', 'dept': 'IT', 'status': 'present', 'time': '08:30', 'avatar': 'OS', 'loc': 'Asosiy ofis'},
    {'name': 'Gulnora Tursunova', 'pos': 'Moliyaviy tahlilchi', 'dept': 'Moliya', 'status': 'late', 'time': '09:48', 'avatar': 'GT', 'loc': 'Asosiy ofis'},
    {'name': 'Sherzod Nazarov', 'pos': 'Sotuvchi', 'dept': 'Savdo', 'status': 'present', 'time': '08:55', 'avatar': 'SN', 'loc': 'Showroom'},
    {'name': 'Kamola Ergasheva', 'pos': 'Kotib', 'dept': 'Admin', 'status': 'absent', 'time': '-', 'avatar': 'KE', 'loc': '-'},
  ];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() { _tab.dispose(); super.dispose(); }

  Color _statusColor(String s) {
    switch (s) {
      case 'present': return const Color(0xFF10B981);
      case 'late': return const Color(0xFFF59E0B);
      case 'remote': return const Color(0xFF3B82F6);
      default: return const Color(0xFFEF4444);
    }
  }

  String _statusLabel(String s) {
    switch (s) {
      case 'present': return 'Keldi';
      case 'late': return 'Kech';
      case 'remote': return 'Masofaviy';
      default: return 'Kelmadi';
    }
  }

  List<Map<String, dynamic>> _filtered(String? statusFilter) {
    return _employees.where((e) {
      final matchSearch = _search.isEmpty ||
        (e['name'] as String).toLowerCase().contains(_search.toLowerCase()) ||
        (e['dept'] as String).toLowerCase().contains(_search.toLowerCase());
      final matchDept = _deptFilter == 'Barchasi' || e['dept'] == _deptFilter;
      final matchStatus = statusFilter == null || e['status'] == statusFilter;
      return matchSearch && matchDept && matchStatus;
    }).toList().cast<Map<String, dynamic>>();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Xodimlar monitoringi'),
        backgroundColor: Colors.white,
        bottom: TabBar(
          controller: _tab,
          labelColor: const Color(0xFF2563EB),
          unselectedLabelColor: const Color(0xFF6B7280),
          indicatorColor: const Color(0xFF2563EB),
          indicatorSize: TabBarIndicatorSize.label,
          labelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12),
          tabs: [
            Tab(text: 'Barchasi (${_employees.length})'),
            Tab(text: "Keldi (${_employees.where((e)=>e['status']=='present'||e['status']=='remote').length})"),
            Tab(text: "Kech (${_employees.where((e)=>e['status']=='late').length})"),
            Tab(text: "Yo'q (${_employees.where((e)=>e['status']=='absent').length})"),
          ],
        ),
      ),
      body: Column(
        children: [
          // Search & Filter
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
            child: Column(children: [
              TextField(
                onChanged: (v) => setState(() => _search = v),
                decoration: const InputDecoration(
                  hintText: 'Xodim qidirish...',
                  prefixIcon: Icon(Icons.search_rounded, color: Color(0xFF9CA3AF), size: 20),
                  contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  isDense: true,
                ),
              ),
              const SizedBox(height: 8),
              SizedBox(
                height: 34,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: _depts.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 6),
                  itemBuilder: (_, i) {
                    final selected = _deptFilter == _depts[i];
                    return GestureDetector(
                      onTap: () => setState(() => _deptFilter = _depts[i]),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: selected ? const Color(0xFF2563EB) : const Color(0xFFF3F4F6),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(_depts[i], style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: selected ? Colors.white : const Color(0xFF374151))),
                      ),
                    );
                  },
                ),
              ),
            ]),
          ),
          const Divider(height: 1),

          Expanded(
            child: TabBarView(
              controller: _tab,
              children: [
                _buildList(null),
                _buildList('present'),
                _buildList('late'),
                _buildList('absent'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildList(String? statusFilter) {
    final list = _filtered(statusFilter);
    if (list.isEmpty) {
      return const Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Icon(Icons.people_outline_rounded, size: 48, color: Color(0xFFD1D5DB)),
        SizedBox(height: 12),
        Text("Xodim topilmadi", style: TextStyle(color: Color(0xFF9CA3AF))),
      ]));
    }
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: list.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (_, i) {
        final e = list[i];
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFFE5E7EB)),
          ),
          child: Row(children: [
            Stack(children: [
              CircleAvatar(
                radius: 22,
                backgroundColor: _statusColor(e['status'] as String).withOpacity(0.15),
                child: Text(e['avatar'] as String, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: _statusColor(e['status'] as String))),
              ),
              Positioned(
                bottom: 0, right: 0,
                child: Container(
                  width: 12, height: 12,
                  decoration: BoxDecoration(
                    color: _statusColor(e['status'] as String),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                ),
              ),
            ]),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(e['name'] as String, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
              Text('${e['pos']} • ${e['dept']}', style: const TextStyle(fontSize: 12, color: Color(0xFF9CA3AF))),
              if (e['loc'] != '-') Row(children: [
                const Icon(Icons.location_on_rounded, size: 12, color: Color(0xFF9CA3AF)),
                Text(e['loc'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
              ]),
            ])),
            Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: _statusColor(e['status'] as String).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(_statusLabel(e['status'] as String), style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: _statusColor(e['status'] as String))),
              ),
              if (e['time'] != '-') ...[
                const SizedBox(height: 4),
                Text(e['time'] as String, style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
              ],
            ]),
          ]),
        );
      },
    );
  }
}
