import 'package:flutter/material.dart';

class PayrollScreen extends StatefulWidget {
  const PayrollScreen({super.key});
  @override State<PayrollScreen> createState() => _PayrollScreenState();
}

class _PayrollScreenState extends State<PayrollScreen> {
  int _selectedMonth = 0;

  final _months = [
    {
      'label': 'Yanvar 2024', 'gross': 8500000, 'net': 7225000, 'tax': 850000,
      'bonus': 500000, 'deductions': 425000, 'status': 'paid',
      'items': [
        {'label': 'Asosiy maosh', 'amount': 8000000, 'type': 'income'},
        {'label': "Mukofot", 'amount': 500000, 'type': 'income'},
        {'label': 'JSHIR (10%)', 'amount': -800000, 'type': 'deduction'},
        {'label': 'INPS (1%)', 'amount': -80000, 'type': 'deduction'},
        {'label': 'Sug\'urta', 'amount': -50000, 'type': 'deduction'},
        {'label': "Kechikish jarima", 'amount': -25000, 'type': 'deduction'},
      ],
    },
    {
      'label': 'Dekabr 2023', 'gross': 8000000, 'net': 6800000, 'tax': 800000,
      'bonus': 0, 'deductions': 400000, 'status': 'paid',
      'items': [
        {'label': 'Asosiy maosh', 'amount': 8000000, 'type': 'income'},
        {'label': 'JSHIR (10%)', 'amount': -800000, 'type': 'deduction'},
        {'label': 'INPS (1%)', 'amount': -80000, 'type': 'deduction'},
        {'label': "Sug'urta", 'amount': -50000, 'type': 'deduction'},
      ],
    },
    {
      'label': 'Noyabr 2023', 'gross': 8000000, 'net': 6920000, 'tax': 800000,
      'bonus': 200000, 'deductions': 280000, 'status': 'paid',
      'items': [
        {'label': 'Asosiy maosh', 'amount': 8000000, 'type': 'income'},
        {'label': "Bonous", 'amount': 200000, 'type': 'income'},
        {'label': 'JSHIR (10%)', 'amount': -800000, 'type': 'deduction'},
        {'label': 'INPS (1%)', 'amount': -80000, 'type': 'deduction'},
      ],
    },
  ];

  String _fmt(int v) {
    final s = v.abs().toString();
    final buf = StringBuffer();
    for (int i = 0; i < s.length; i++) {
      if (i > 0 && (s.length - i) % 3 == 0) buf.write(' ');
      buf.write(s[i]);
    }
    return '${v < 0 ? '-' : ''}${buf.toString()} so\'m';
  }

  @override
  Widget build(BuildContext context) {
    final m = _months[_selectedMonth];
    final items = m['items'] as List;

    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(title: const Text('Maosh'), backgroundColor: Colors.white),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Month selector
          SizedBox(
            height: 40,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _months.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (_, i) {
                final selected = _selectedMonth == i;
                return GestureDetector(
                  onTap: () => setState(() => _selectedMonth = i),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: selected ? const Color(0xFF2563EB) : Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: selected ? const Color(0xFF2563EB) : const Color(0xFFE5E7EB)),
                    ),
                    child: Text(_months[i]['label'] as String,
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: selected ? Colors.white : const Color(0xFF374151))),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 16),

          // Summary card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft, end: Alignment.bottomRight,
                colors: [Color(0xFF1E40AF), Color(0xFF2563EB)],
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text(m['label'] as String, style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 14)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: const Color(0xFF10B981), borderRadius: BorderRadius.circular(8)),
                  child: const Text('To\'langan', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)),
                ),
              ]),
              const SizedBox(height: 8),
              const Text('Toza maosh', style: TextStyle(color: Colors.white70, fontSize: 13)),
              Text(_fmt(m['net'] as int),
                style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold, letterSpacing: -0.5)),
              const SizedBox(height: 16),
              Row(children: [
                Expanded(child: _summaryItem('Yalpi', _fmt(m['gross'] as int))),
                Container(width: 1, height: 36, color: Colors.white24),
                Expanded(child: _summaryItem('Mukofot', _fmt(m['bonus'] as int))),
                Container(width: 1, height: 36, color: Colors.white24),
                Expanded(child: _summaryItem('Ushlanma', _fmt(m['deductions'] as int))),
              ]),
            ]),
          ),
          const SizedBox(height: 16),

          // Breakdown
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE5E7EB)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("Maosh tafsiloti", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                const SizedBox(height: 14),
                ...items.map((item) {
                  final isIncome = item['type'] == 'income';
                  final amount = item['amount'] as int;
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Row(children: [
                      Container(
                        width: 32, height: 32,
                        decoration: BoxDecoration(
                          color: isIncome ? const Color(0xFFECFDF5) : const Color(0xFFFEE2E2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          isIncome ? Icons.add_rounded : Icons.remove_rounded,
                          color: isIncome ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                          size: 18,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(child: Text(item['label'] as String, style: const TextStyle(fontSize: 13))),
                      Text(
                        isIncome ? '+ ${_fmt(amount)}' : '- ${_fmt(amount.abs())}',
                        style: TextStyle(
                          fontSize: 13, fontWeight: FontWeight.w600,
                          color: isIncome ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                        ),
                      ),
                    ]),
                  );
                }).toList(),
                const Divider(height: 20),
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  const Text('Toza maosh', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                  Text(_fmt(m['net'] as int), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF2563EB))),
                ]),
              ],
            ),
          ),
          const SizedBox(height: 16),

          OutlinedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.download_rounded, size: 18),
            label: const Text('Maosh varaqasini yuklab olish'),
            style: OutlinedButton.styleFrom(
              minimumSize: const Size(double.infinity, 48),
              side: const BorderSide(color: Color(0xFF2563EB)),
              foregroundColor: const Color(0xFF2563EB),
            ),
          ),
          const SizedBox(height: 80),
        ],
      ),
    );
  }

  Widget _summaryItem(String label, String value) => Column(children: [
    Text(label, style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 11)),
    const SizedBox(height: 4),
    Text(value.split(' ').first, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
  ]);
}
