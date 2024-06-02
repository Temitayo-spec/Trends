import { ThreadCard, Comment } from '@/components';
import { fetchThreadById } from '@/lib/actions/thread.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const revalidate = 0;

const CommentPage = async ({
  params: { id },
}: {
  params: {
    id: string;
  };
}) => {
  if (!id) return null;

  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onBoarded) redirect('/onboarding');

  const trend = await fetchThreadById(id);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          id={trend?._id}
          currentUserId={user?.id as string}
          parentId={trend?.parentId}
          content={trend?.text}
          author={trend?.author}
          community={trend?.community}
          createdAt={trend?.createdAt}
          comments={trend?.children}
        />
      </div>
      <div className="mt-7">
        <Comment
          threadId={trend?._id}
          currentUserImg={userInfo?.image}
          currentUserId={JSON.stringify(userInfo?._id)}
        />
      </div>
      <div className="mt-7">
        {trend?.children?.map(
          (childrenItem: {
            _id: string;
            parentId: string | null;
            text: string;
            author: { id: string; name: string; image: string };
            community: { id: string; name: string; image: string } | null;
            createdAt: string;
            children: { author: { image: string }[] }[];
          }) => (
            <ThreadCard
              key={childrenItem._id}
              id={childrenItem._id}
              currentUserId={user?.id as string}
              parentId={childrenItem.parentId}
              content={childrenItem.text}
              author={childrenItem.author}
              community={childrenItem.community}
              createdAt={childrenItem.createdAt}
              comments={childrenItem.children}
              isComment={true}
            />
          )
        )}
      </div>
    </section>
  );
};

export default CommentPage;
