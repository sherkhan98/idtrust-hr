import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  onClick?: () => void;
}

export function StatsCard({
  title, value, subtitle, icon: Icon, iconColor = 'text-blue-600',
  iconBg = 'bg-blue-50', trend, className, onClick,
}: StatsCardProps) {
  const trendPositive = trend && trend.value >= 0;

  return (
    <div
      className={cn(
        'stat-card hover:shadow-card-hover transition-all duration-200',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            {subtitle && <span className="text-sm text-gray-400">{subtitle}</span>}
          </div>
          {trend && (
            <div className={cn('mt-2 flex items-center gap-1 text-xs font-medium', trendPositive ? 'text-green-600' : 'text-red-500')}>
              {trendPositive
                ? <TrendingUp className="w-3.5 h-3.5" />
                : trend.value === 0
                ? <Minus className="w-3.5 h-3.5 text-gray-400" />
                : <TrendingDown className="w-3.5 h-3.5" />
              }
              <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
              <span className="text-gray-400 font-normal">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ml-4', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
      </div>
    </div>
  );
}
