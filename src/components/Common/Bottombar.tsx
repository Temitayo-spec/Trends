'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { sidebarLinks } from '../../../constants';
import Image from 'next/image';

const Bottombar = () => {
  const pathname = usePathname();
  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link, i) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`${isActive && 'bg-primary-500'} bottombar_link`}
            >
              <Image src={link.imgURL} alt="icon" height={24} width={24} />

              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Bottombar;
