import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'services/api_service.dart';
import 'screens/splash_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/dashboard/dashboard_screen.dart';
import 'screens/dashboard/director_dashboard_screen.dart';
import 'screens/attendance/attendance_screen.dart';
import 'screens/leave/leave_screen.dart';
import 'screens/payroll/payroll_screen.dart';
import 'screens/tasks/tasks_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/director/employees_monitor_screen.dart';
import 'screens/director/leave_approvals_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.dark,
  ));
  await ApiService.init();
  runApp(const ProviderScope(child: StaffFlowApp()));
}

class StaffFlowApp extends StatelessWidget {
  const StaffFlowApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'StaffFlow HR',
      debugShowCheckedModeBanner: false,
      theme: _buildTheme(),
      initialRoute: '/splash',
      routes: {
        '/splash': (_) => const SplashScreen(),
        '/login': (_) => const LoginScreen(),
        '/employee': (_) => const EmployeeMainScreen(),
        '/director': (_) => const DirectorMainScreen(),
      },
    );
  }

  ThemeData _buildTheme() => ThemeData(
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFF2563EB),
      primary: const Color(0xFF2563EB),
    ),
    fontFamily: 'Inter',
    useMaterial3: true,
    scaffoldBackgroundColor: const Color(0xFFF9FAFB),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: Color(0xFF111827),
      elevation: 0,
      surfaceTintColor: Colors.white,
      titleTextStyle: TextStyle(
        fontFamily: 'Inter', fontSize: 17,
        fontWeight: FontWeight.w600, color: Color(0xFF111827),
      ),
    ),
    cardTheme: CardTheme(
      color: Colors.white, elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: const BorderSide(color: Color(0xFFE5E7EB)),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 24),
        textStyle: const TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.w600, fontSize: 15),
        elevation: 0,
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: const Color(0xFFF9FAFB),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFF2563EB), width: 2),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    ),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: Colors.white,
      selectedItemColor: Color(0xFF2563EB),
      unselectedItemColor: Color(0xFF9CA3AF),
      type: BottomNavigationBarType.fixed,
      elevation: 12,
      selectedLabelStyle: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.w600, fontSize: 11),
      unselectedLabelStyle: TextStyle(fontFamily: 'Inter', fontSize: 11),
    ),
  );
}

// ─── Employee Navigation ───────────────────────────────────────────────────────

class EmployeeMainScreen extends StatefulWidget {
  const EmployeeMainScreen({super.key});
  @override State<EmployeeMainScreen> createState() => _EmployeeMainState();
}

class _EmployeeMainState extends State<EmployeeMainScreen> {
  int _index = 0;

  final _screens = const [
    DashboardScreen(),
    AttendanceScreen(),
    LeaveScreen(),
    TasksScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _index, children: _screens),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: Colors.grey.shade100, width: 1)),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 12, offset: const Offset(0, -4))],
        ),
        child: BottomNavigationBar(
          currentIndex: _index,
          onTap: (i) => setState(() => _index = i),
          backgroundColor: Colors.transparent,
          elevation: 0,
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.home_rounded), activeIcon: Icon(Icons.home_rounded), label: 'Bosh'),
            BottomNavigationBarItem(icon: Icon(Icons.access_time_rounded), activeIcon: Icon(Icons.access_time_filled_rounded), label: 'Davomat'),
            BottomNavigationBarItem(icon: Icon(Icons.beach_access_rounded), activeIcon: Icon(Icons.beach_access_rounded), label: "Ta'til"),
            BottomNavigationBarItem(icon: Icon(Icons.task_alt_rounded), activeIcon: Icon(Icons.task_alt_rounded), label: 'Vazifalar'),
            BottomNavigationBarItem(icon: Icon(Icons.person_outline_rounded), activeIcon: Icon(Icons.person_rounded), label: 'Profil'),
          ],
        ),
      ),
    );
  }
}

// ─── Director Navigation ──────────────────────────────────────────────────────

class DirectorMainScreen extends StatefulWidget {
  const DirectorMainScreen({super.key});
  @override State<DirectorMainScreen> createState() => _DirectorMainState();
}

class _DirectorMainState extends State<DirectorMainScreen> {
  int _index = 0;

  final _screens = const [
    DirectorDashboardScreen(),
    EmployeesMonitorScreen(),
    LeaveApprovalsScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _index, children: _screens),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: Colors.grey.shade100)),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 12, offset: const Offset(0, -4))],
        ),
        child: BottomNavigationBar(
          currentIndex: _index,
          onTap: (i) => setState(() => _index = i),
          backgroundColor: Colors.transparent,
          elevation: 0,
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.dashboard_rounded), activeIcon: Icon(Icons.dashboard_rounded), label: 'Dashboard'),
            BottomNavigationBarItem(icon: Icon(Icons.people_rounded), activeIcon: Icon(Icons.people_rounded), label: 'Xodimlar'),
            BottomNavigationBarItem(icon: Icon(Icons.approval_rounded), activeIcon: Icon(Icons.approval_rounded), label: 'Tasdiqlash'),
            BottomNavigationBarItem(icon: Icon(Icons.person_rounded), activeIcon: Icon(Icons.person_rounded), label: 'Profil'),
          ],
        ),
      ),
    );
  }
}
