import 'package:flutter/material.dart';

class TasksScreen extends StatefulWidget {
  const TasksScreen({super.key});
  @override State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> {
  String _filter = 'all';

  final _tasks = [
    {'id': '1', 'title': "Xodimlar qo'llanmasini yangilash", 'priority': 'HIGH', 'due': '15 Feb', 'done': false, 'dept': 'HR', 'assigned': 'Siz'},
    {'id': '2', 'title': '3 yangi xodim uchun onboarding', 'priority': 'URGENT', 'due': '10 Feb', 'done': false, 'dept': 'HR', 'assigned': 'Siz'},
    {'id': '3', 'title': "Yanvar oylik hisoboti tayyorlash", 'priority': 'MEDIUM', 'due': '31 Yan', 'done': true, 'dept': 'Moliya', 'assigned': 'Siz'},
    {'id': '4', 'title': 'API dokumentatsiya yozish', 'priority': 'LOW', 'due': '20 Feb', 'done': false, 'dept': 'IT', 'assigned': 'Siz'},
    {'id': '5', 'title': 'Q1 KPI natijalarini tahlil qilish', 'priority': 'HIGH', 'due': '5 Feb', 'done': false, 'dept': 'Rahbariyat', 'assigned': 'Siz'},
    {'id': '6', 'title': "Yangi ofis qoidalarini e'lon qilish", 'priority': 'MEDIUM', 'due': '1 Feb', 'done': true, 'dept': 'Admin', 'assigned': 'Siz'},
  ];

  Color _priorityColor(String p) {
    switch (p) {
      case 'URGENT': return const Color(0xFFDC2626);
      case 'HIGH': return const Color(0xFFF59E0B);
      case 'MEDIUM': return const Color(0xFF2563EB);
      default: return const Color(0xFF6B7280);
    }
  }

  String _priorityLabel(String p) {
    switch (p) {
      case 'URGENT': return 'Shoshilinch';
      case 'HIGH': return 'Yuqori';
      case 'MEDIUM': return "O'rta";
      default: return 'Past';
    }
  }

  List<Map<String, dynamic>> get _filtered {
    return _tasks.where((t) {
      if (_filter == 'pending') return !(t['done'] as bool);
      if (_filter == 'done') return t['done'] as bool;
      return true;
    }).toList().cast<Map<String, dynamic>>();
  }

  @override
  Widget build(BuildContext context) {
    final done = _tasks.where((t) => t['done'] as bool).length;
    final total = _tasks.length;

    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(title: const Text('Vazifalar'), backgroundColor: Colors.white),
      body: Column(children: [
        // Progress header
        Container(
          color: Colors.white,
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
          child: Column(children: [
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text('$done / $total vazifa bajarildi', style: const TextStyle(fontSize: 13, color: Color(0xFF6B7280))),
              Text('${(done / total * 100).round()}%', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF2563EB))),
            ]),
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: LinearProgressIndicator(
                value: done / total,
                backgroundColor: const Color(0xFFF3F4F6),
                color: const Color(0xFF2563EB),
                minHeight: 7,
              ),
            ),
            const SizedBox(height: 12),
            // Filter chips
            Row(children: [
              _chip('all', 'Barchasi ($total)'),
              const SizedBox(width: 8),
              _chip('pending', "Bajarilmagan (${total - done})"),
              const SizedBox(width: 8),
              _chip('done', 'Bajarilgan ($done)'),
            ]),
          ]),
        ),
        const Divider(height: 1),

        Expanded(
          child: _filtered.isEmpty
            ? const Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                Icon(Icons.task_alt_rounded, size: 56, color: Color(0xFFD1D5DB)),
                SizedBox(height: 12),
                Text('Vazifalar yo\'q', style: TextStyle(color: Color(0xFF9CA3AF), fontSize: 15)),
              ]))
            : ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: _filtered.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (_, i) {
                  final task = _filtered[i];
                  final isDone = task['done'] as bool;
                  return GestureDetector(
                    onTap: () => setState(() => task['done'] = !isDone),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isDone ? const Color(0xFFF9FAFB) : Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: isDone ? const Color(0xFFE5E7EB) : const Color(0xFFE5E7EB)),
                      ),
                      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Container(
                          width: 24, height: 24,
                          decoration: BoxDecoration(
                            color: isDone ? const Color(0xFF10B981) : Colors.transparent,
                            border: Border.all(
                              color: isDone ? const Color(0xFF10B981) : const Color(0xFFD1D5DB),
                              width: 2,
                            ),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: isDone ? const Icon(Icons.check_rounded, color: Colors.white, size: 14) : null,
                        ),
                        const SizedBox(width: 12),
                        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(
                            task['title'] as String,
                            style: TextStyle(
                              fontSize: 14, fontWeight: FontWeight.w600,
                              color: isDone ? const Color(0xFF9CA3AF) : const Color(0xFF111827),
                              decoration: isDone ? TextDecoration.lineThrough : null,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Row(children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: _priorityColor(task['priority'] as String).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(_priorityLabel(task['priority'] as String),
                                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: _priorityColor(task['priority'] as String))),
                            ),
                            const SizedBox(width: 8),
                            const Icon(Icons.calendar_today_rounded, size: 12, color: Color(0xFF9CA3AF)),
                            const SizedBox(width: 3),
                            Text(task['due'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                            const SizedBox(width: 8),
                            Text(task['dept'] as String, style: const TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                          ]),
                        ])),
                      ]),
                    ),
                  );
                },
              ),
        ),
      ]),
    );
  }

  Widget _chip(String value, String label) => GestureDetector(
    onTap: () => setState(() => _filter = value),
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
      decoration: BoxDecoration(
        color: _filter == value ? const Color(0xFF2563EB) : const Color(0xFFF3F4F6),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(label, style: TextStyle(
        fontSize: 12, fontWeight: FontWeight.w600,
        color: _filter == value ? Colors.white : const Color(0xFF374151),
      )),
    ),
  );
}
