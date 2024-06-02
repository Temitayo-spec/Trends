import { ProfileHeader, ThreadsTab } from '@/components';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '../../../../../constants';
import Image from 'next/image';

const ProfilePage = async ({ params: { id } }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(id);

  if (!userInfo?.onBoarded) redirect('/onboarding');
  return (
    <section>
      <ProfileHeader
        accountId={userInfo?.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt="tab icons"
                  width={24}
                  height={24}
                  className="object-contain"
                />

                <p className="max-sm-hidden">{tab.label}</p>
                {tab.label === 'Threads' && (
                  <p className="ml-1 rounded-sm bg-light-4 !text-tiny-medium py-1 px-2 text-light-2">
                    {userInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent value={tab.value} key={`content-${tab.label}`}>
              <ThreadsTab
                currentUserId={user.id}
                accountId={userInfo.id}
                accountType="User"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ProfilePage;
