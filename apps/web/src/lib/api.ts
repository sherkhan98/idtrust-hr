import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    const tenantId = session?.user?.tenantId;
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  },
);

// API endpoints
export const authApi = {
  login: (data: { email: string; password: string; mfaCode?: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  refreshToken: (token: string) => api.post('/auth/refresh', { refreshToken: token }),
};

export const employeesApi = {
  list: (params?: any) => api.get('/employees', { params }),
  get: (id: string) => api.get(`/employees/${id}`),
  create: (data: any) => api.post('/employees', data),
  update: (id: string, data: any) => api.put(`/employees/${id}`, data),
  delete: (id: string) => api.delete(`/employees/${id}`),
  stats: () => api.get('/employees/stats'),
  orgChart: () => api.get('/employees/org-chart'),
};

export const attendanceApi = {
  checkIn: (data: any) => api.post('/attendance/check-in', data),
  checkOut: (data: any) => api.post('/attendance/check-out', data),
  today: () => api.get('/attendance/today'),
  monthlyReport: (month: number, year: number) =>
    api.get('/attendance/monthly-report', { params: { month, year } }),
  employeeHistory: (id: string, startDate: string, endDate: string) =>
    api.get(`/attendance/employee/${id}`, { params: { startDate, endDate } }),
};

export const payrollApi = {
  listPeriods: () => api.get('/payroll/periods'),
  createPeriod: (data: any) => api.post('/payroll/periods', data),
  calculate: (periodId: string) => api.post(`/payroll/periods/${periodId}/calculate`),
  getPeriodPayrolls: (periodId: string) => api.get(`/payroll/periods/${periodId}/payrolls`),
  myHistory: () => api.get('/payroll/my-history'),
};

export const leaveApi = {
  types: () => api.get('/leave/types'),
  list: (params?: any) => api.get('/leave', { params }),
  apply: (data: any) => api.post('/leave/apply', data),
  approve: (id: string) => api.put(`/leave/${id}/approve`),
  reject: (id: string, reason?: string) => api.put(`/leave/${id}/reject`, { reason }),
  balance: () => api.get('/leave/balance'),
};

export const kpiApi = {
  list: () => api.get('/kpi'),
  create: (data: any) => api.post('/kpi', data),
  recordScore: (data: any) => api.post('/kpi/score', data),
  employeeKPI: (id: string, period?: string) =>
    api.get(`/kpi/employee/${id}`, { params: { period } }),
  departmentKPI: (id: string, period: string) =>
    api.get(`/kpi/department/${id}`, { params: { period } }),
};

export const recruitmentApi = {
  vacancies: (status?: string) => api.get('/recruitment/vacancies', { params: { status } }),
  createVacancy: (data: any) => api.post('/recruitment/vacancies', data),
  candidates: (vacancyId: string) => api.get(`/recruitment/vacancies/${vacancyId}/candidates`),
  addCandidate: (vacancyId: string, data: any) =>
    api.post(`/recruitment/vacancies/${vacancyId}/candidates`, data),
  updateStage: (candidateId: string, stage: string) =>
    api.put(`/recruitment/candidates/${candidateId}/stage`, { stage }),
  pipelineStats: () => api.get('/recruitment/pipeline-stats'),
};

export const dashboardApi = {
  ceo: () => api.get('/dashboard/ceo'),
  hr: () => api.get('/dashboard/hr'),
  employee: () => api.get('/dashboard/employee'),
};

export const orgApi = {
  branches: () => api.get('/organization/branches'),
  departments: () => api.get('/organization/departments'),
  positions: () => api.get('/organization/positions'),
  createBranch: (data: any) => api.post('/organization/branches', data),
  createDepartment: (data: any) => api.post('/organization/departments', data),
  createPosition: (data: any) => api.post('/organization/positions', data),
};

export const notificationsApi = {
  list: (page?: number) => api.get('/notifications', { params: { page } }),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/mark-all-read'),
};

export const tasksApi = {
  list: (params?: any) => api.get('/tasks', { params }),
  create: (data: any) => api.post('/tasks', data),
  update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  projects: () => api.get('/tasks/projects'),
};
