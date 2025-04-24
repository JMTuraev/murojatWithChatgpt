'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/auth-context';
import { useMurojaat } from '@/app/context/murojaat-context';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  InboxArrowDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [navigation, setNavigation] = useState([]);
  const { murojaatCount } = useMurojaat();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      const result = await res.json();
      if (result.ok) {
        localStorage.removeItem('user');
        sessionStorage.removeItem('role');
        router.push('/login');
      }
    } catch (err) {
      console.error('❌ Logout xatolik:', err);
    }
  };

 
  useEffect(() => {
    if (!user?.rol) return;
    const routes = {
      shtab: [
        { name: 'Bosh Sahifa', href: '/dashboard/shtab' },
        { name: 'Murojaatlar', href: '/dashboard/shtab/murojaatlar' },
        { name: 'Operatorlar', href: '/dashboard/shtab/operatorlar' },
        { name: 'Tashkilotlar', href: '/dashboard/shtab/tashkilotlar/murojaatlar' },
        { name: 'Statistika', href: '/dashboard/statistika' },
      ],
      operator: [
        {
          name: 'Murojaatlar',
          href: '/dashboard/operator/murojaatlar',
          badge: murojaatCount,
        },
        { name: 'Biriktirilgan', href: '/dashboard/operator/biriktirilgan' },
        { name: 'Bajarilgan', href: '/dashboard/operator/bajarilgan' },
        { name: 'Arxiv', href: '/dashboard/operator/arxiv' },
      ],
      tashkilot: [
        { name: 'Murojaatlar', href: '/dashboard/tashkilot' },
      ],
    };
    setNavigation(routes[user.rol] || []);
  }, [user, murojaatCount]);

  if (loading || !user?.rol) return null;

  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex items-center">
                  <InboxArrowDownIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        pathname === item.href
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium relative'
                      )}
                    >
                      {item.name}
                      {item.badge > 0 && (
                        <span className="ml-1 inline-block bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  type="button"
                  className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                >
                  <BellIcon className="h-6 w-6" />
                </button>

                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-indigo-600 text-sm font-bold ring-2 ring-indigo-500">
                      {user.ism.charAt(0).toUpperCase()}
                      {user.familiya.charAt(0).toUpperCase()}
                    </MenuButton>
                  </div>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'w-full text-left px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Chiqish
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>

              <div className="-mr-2 flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500">
                  <span className="sr-only">Open menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" />
                  )}
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                    'block border-l-4 py-2 pl-3 pr-4 text-base font-medium relative'
                  )}
                >
                  {item.name}
                  {item.badge > 0 && (
                    <span className="ml-2 inline-block bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="block w-full text-left border-l-4 py-2 pl-3 pr-4 text-base font-medium text-red-600 hover:bg-gray-50"
              >
                Chiqish
              </button>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
