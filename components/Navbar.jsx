'use client';

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
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

const userNavigation = [
  { name: 'Profil', href: '#' },
  { name: 'Sozlamalar', href: '#' },
  { name: 'Chiqish', href: '#' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const pathname = usePathname();
  const [role, setRole] = useState('');
  const [navigation, setNavigation] = useState([]);
  const [murojaatCount, setMurojaatCount] = useState(0);

  useEffect(() => {
    const r = sessionStorage.getItem('role');
    if (r) {
      setRole(r);

      if (r === 'shtab') {
        setNavigation([
          { name: 'Bosh Sahifa', href: '/dashboard/shtab' },
          {
            name: 'Murojaatlar',
            href: '/dashboard/shtab/murojaatlar',
            badge: murojaatCount,
          },
          { name: 'Operatorlar', href: '/dashboard/shtab/operatorlar' },
          { name: 'Tashkilotlar', href: '/dashboard/shtab/tashkilotlar' },
          { name: 'Statistika', href: '/dashboard/statistika' },
        ]);
      } else if (r === 'operator') {
        setNavigation([
          { name: 'Murojaatlar', href: '/dashboard/operator/murojaatlar' },
          { name: 'Tashkilotlar', href: '/dashboard/operator/tashkilotlar' },
        ]);
      } else if (r === 'tashkilot') {
        setNavigation([
          { name: 'Murojaatlar', href: '/dashboard/tashkilot/murojaatlar' },
        ]);
      }
    }
  }, [murojaatCount]);

  useEffect(() => {
    // Faqat shtab uchun murojaat sonini yuklaymiz
    const fetchCount = async () => {
      try {
        const res = await fetch('http://localhost:3001/murojaatlar');
        const data = await res.json();
        setMurojaatCount(data.length);
      } catch (error) {
        console.error('❌ Murojaatlarni olishda xatolik:', error);
      }
    };
    fetchCount();
  }, []);

  if (!role) return null;

  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Logo"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <a
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
                    </a>
                  ))}
                </div>
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  type="button"
                  className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                >
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="flex rounded-full bg-white text-sm focus:ring-2 focus:ring-indigo-500">
                      <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                    </MenuButton>
                  </div>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        {({ active }) => (
                          <a
                            href={item.href}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            {item.name}
                          </a>
                        )}
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>

              <div className="-mr-2 flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
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
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
