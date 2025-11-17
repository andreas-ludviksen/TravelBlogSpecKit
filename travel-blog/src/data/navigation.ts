import { NavigationItem } from '@/types';

export const navigationItems: NavigationItem[] = [
  {
    id: 'nav-1',
    label: 'Home',
    href: '/',
    order: 1,
    isActive: true,
  },
  {
    id: 'nav-2',
    label: 'Blog',
    href: '/blog',
    order: 2,
    isActive: true,
  },
];
