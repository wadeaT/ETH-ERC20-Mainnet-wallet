// src/components/layout/dashboard/NavItem.js
import Link from 'next/link';

export const NavItem = ({ item, isActive, isMobile = false }) => {
  const Icon = item.icon;
  const baseClasses = `flex items-center gap-${isMobile ? '2' : '3'} px-4 py-2 rounded-lg transition-colors`;
  const activeClasses = isActive
    ? 'bg-primary text-primary-foreground'
    : 'text-muted-foreground hover:bg-secondary hover:text-foreground';
  const mobileClasses = isMobile ? 'whitespace-nowrap' : '';

  return (
    <Link href={item.path}>
      <div className={`${baseClasses} ${activeClasses} ${mobileClasses}`}>
        <Icon size={20} />
        <span>{item.name}</span>
      </div>
    </Link>
  );
};