import { PostThread } from '@/components';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const CreateThread = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onBoarded) redirect('/onboarding');
  return (
    <div>
      <h1 className="head-text">Create Thread</h1>

      <PostThread userId={userInfo?._id} />
    </div>
  );
};

export default CreateThread;
