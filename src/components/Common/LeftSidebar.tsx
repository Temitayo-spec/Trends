'use client';
import Link from 'next/link';
import { sidebarLinks } from '../../../constants';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SignOutButton, SignedIn, useAuth } from '@clerk/nextjs';
import logout_img from '../../../public/assets/logout.svg';

const LeftSidebar = () => {
  const pathname = usePathname();
  const {userId} = useAuth();
  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link, i) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          if (link.route === '/profile') link.route = `${link.route}/${userId}`;
          return (
            <Link
              href={link.route}
              key={i}
              className={`${isActive && 'bg-primary-500'} leftsidebar_link`}
            >
              <Image src={link.imgURL} alt="icons" width={24} height={24} />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton
            signOutOptions={{
              redirectUrl: '/sign-in',
            }}
          >
            <div className="flex cursor-pointer gap-4 p-4">
              <Image src={logout_img} alt="log out" />

              <p className="text-light-1 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar;
