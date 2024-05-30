import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../public/assets/logo.svg';
import logout_img from '../../../public/assets/logo.svg';
import { OrganizationSwitcher, SignOutButton, SignedIn } from '@clerk/nextjs';

const Topbar = () => {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src={logo} alt="logo" />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Trends</p>
      </Link>
      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image src={logout_img} alt="log out" />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
              <OrganizationSwitcher
                  appearance={{
                      elements: {
                    organizationSwitcherTrigger: 'py-2 px-4'
                }
            }}
              />
      </div>
    </nav>
  );
};

export default Topbar;
