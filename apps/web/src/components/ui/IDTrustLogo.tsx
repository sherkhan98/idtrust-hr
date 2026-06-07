import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface IDTrustLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  href?: string;
  className?: string;
  cloudBadge?: string;
  cloudBadgeColor?: string;
}

export function IDTrustLogo({
  size = 'md',
  showText = true,
  href = '/',
  className,
  cloudBadge,
  cloudBadgeColor = 'bg-blue-100 text-blue-700',
}: IDTrustLogoProps) {
  const iconSizes = { sm: 28, md: 36, lg: 48 };
  const textSizes = { sm: 'text-base', md: 'text-lg', lg: 'text-2xl' };
  const iconPx = iconSizes[size];

  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      <Image src="/logo.svg" alt="IDTrust" width={iconPx} height={iconPx} priority />
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn('font-bold tracking-tight', textSizes[size])}>
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">ID</span>
            <span className="text-slate-800">TRUST</span>
          </span>
          {cloudBadge && (
            <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5 w-fit', cloudBadgeColor)}>
              {cloudBadge}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

export function IDTrustLogoWhite({
  size = 'md',
  showText = true,
  href = '/',
  className,
}: Omit<IDTrustLogoProps, 'cloudBadge' | 'cloudBadgeColor'>) {
  const iconSizes = { sm: 28, md: 36, lg: 48 };
  const textSizes = { sm: 'text-base', md: 'text-lg', lg: 'text-2xl' };
  const iconPx = iconSizes[size];

  const content = (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Image src="/logo.svg" alt="IDTrust" width={iconPx} height={iconPx} priority />
      {showText && (
        <span className={cn('font-bold text-white tracking-tight', textSizes[size])}>
          IDTrust
        </span>
      )}
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
