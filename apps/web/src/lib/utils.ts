import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'UZS') {
  if (currency === 'UZS') {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatDate(date: string | Date, format = 'DD.MM.YYYY') {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', String(year))
    .replace('HH', hours)
    .replace('mm', minutes);
}

export function formatTime(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatRelativeTime(date: string | Date) {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} days ago`;
  return formatDate(d);
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    ACTIVE: 'badge-green',
    INACTIVE: 'badge-gray',
    ON_LEAVE: 'badge-yellow',
    RESIGNED: 'badge-red',
    TERMINATED: 'badge-red',
    PENDING: 'badge-yellow',
    APPROVED: 'badge-green',
    REJECTED: 'badge-red',
    PRESENT: 'badge-green',
    ABSENT: 'badge-red',
    LATE: 'badge-yellow',
    OPEN: 'badge-blue',
    CLOSED: 'badge-gray',
    IN_PROGRESS: 'badge-blue',
    DONE: 'badge-green',
    TODO: 'badge-gray',
    HIGH: 'badge-red',
    MEDIUM: 'badge-yellow',
    LOW: 'badge-blue',
    URGENT: 'badge-red',
  };
  return map[status] || 'badge-gray';
}

export function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}

export function truncate(str: string, length = 50) {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getDaysSince(date: string | Date) {
  const d = new Date(date);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / 86400000);
}
