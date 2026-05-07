'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, Search } from 'lucide-react';
import { clsx } from 'clsx';

const TABS = [
  { href: '/', label: '홈', icon: Home },
  { href: '/list', label: '목록', icon: List },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-50
                    bg-white/90 backdrop-blur border-t border-primary/15
                    flex items-center justify-around h-16 px-4"
    >
      {TABS.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex flex-col items-center gap-1 text-xs font-medium transition-colors',
              isActive ? 'text-primary' : 'text-navy/40 hover:text-navy'
            )}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
