import { fetchUserPosts } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import { ThreadCard } from '@/components';
import { Key } from 'react';

interface ThreadsTabProps {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({
  currentUserId,
  accountId,
  accountType,
}: ThreadsTabProps) => {
  //TODO: fetch user threads
  let result = await fetchUserPosts(accountId);

  if (!result) redirect('/');

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map(
        (thread: {
          _id: string;
          parentId: string | null;
          text: string;
          author: { id: string; name: string; image: string };
          community: { id: string; name: string; image: string } | null;
          createdAt: string;
          children: { author: { image: string }[] }[];
        }) => (
          <ThreadCard
            key={thread._id}
            id={thread?._id}
            currentUserId={currentUserId}
            parentId={thread?.parentId}
            content={thread?.text}
            author={
              accountType === 'User'
                ? { name: result.name, image: result.image, id: result.id }
                : {
                    name: thread.author.name,
                    image: thread.author.image,
                    id: thread.author.id,
                  }
            }
            community={thread?.community}
            createdAt={thread?.createdAt}
            comments={thread?.children}
          />
        )
      )}
    </section>
  );
};

export default ThreadsTab;
