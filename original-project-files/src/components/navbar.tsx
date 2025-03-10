'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { fetchUserProfile } from '@/lib/utils';

const mainLinks = [
  { href: '/profile', label: 'Your Profile', icon: faUser },
  { href: '/family', label: 'Your Family', icon: faUsers, role: 'user' },
  { href: '/family-management', label: 'Family Management', icon: faUserCog, role: 'admin' },
];

const familySublinks = [
  { href: '/decision-tree', label: 'Decision Tree' },
  { href: '/family-values', label: 'Family Values' },
  { href: '/family-code', label: 'Family Code' },
  { href: '/family-vision', label: 'Family Vision' },
  { href: '/contacts', label: 'Contacts' },
  { href: '/philanthropy', label: 'Philanthropy' },
  { href: '/policy-tree', label: 'Policy Tree' },
  { href: '/family-garden', label: 'Family Garden' },
  { href: '/wealth-forest', label: 'Wealth Forest' },
  { href: '/asset-allocation', label: 'Asset Allocation' },
  { href: '/family-tree', label: 'Family Tree' },
  { href: '/org-chart', label: 'Organizational Chart' },
  { href: '/family-crest', label: 'Family Crest' },
  { href: '/family-charter', label: 'Family Charter' },
  { href: '/pdf', label: 'Print PDF' },
  { href: '/video', label: 'Videos' },
  { href: '/chatbot', label: 'ChatBot Assistant'},
  { href: '/chat', label: 'Chat' }
];

export default function NavBar() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function getUserRole() {
      const profile = await fetchUserProfile();
      setUserRole(profile.role);
      setLoading(false);
    }
    getUserRole();

  }, [pathname]);

  if (loading) {
    return null;
  }

  return (
    <nav className="grid items-start px-2 text-sm font-medium md:mt-5 lg:mt-1 lg:px-4 print:hidden">
      {mainLinks
        .filter(({ role }) => role === undefined || role === userRole)
        .map(({ href, label, icon }) => (
          <Link key={label} className="w-full cursor-pointer" href={href}>
            <Button
              variant={pathname === href ? "default" : "ghost"}
              className="w-full flex items-center gap-2"
            >
              <FontAwesomeIcon icon={icon} className="h-4 w-4" />
              {label}
            </Button>
          </Link>
        ))}
      <Separator className="mx-auto mt-2 w-[90%]" />
      {familySublinks.map((link) => (
        <Link
          key={link.label}
          className="w-full cursor-pointer"
          href={link.href}>
          <Button
            variant={link.label === 'ChatBot Assistant' ? 'chatbot' : (pathname === link.href ? 'default' : 'ghost')}
            className="w-full">
            {link.label}
          </Button>
        </Link>
      ))}
    </nav>
  );
}
