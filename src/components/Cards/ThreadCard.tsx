import Image from 'next/image';
import Link from 'next/link';
import heart_icon_outlined from '../../../public/assets/heart-gray.svg';
import reply_icon from '../../../public/assets/reply.svg';
import repost_icon from '../../../public/assets/repost.svg';
import share_icon from '../../../public/assets/share.svg';
import { formatDateString } from '@/lib/utils';
import DeleteThread from '../Forms/DeleteThread';

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) => {
  return (
    <article
      className={`flex flex-col w-full rounded-xl  ${
        isComment ? 'px-0 xs:px-7 ' : 'bg-dark-2 p-7'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={`/profile/${author?.id}`}
              className="relative h-11 w-11"
            >
              <Image
                src={author?.image}
                alt="Profile image"
                fill
                className="cursor-pointer rounded-full object-cover"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>
          <div className="flex flex-col w-full">
            <Link href={`/profile/${author?.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author?.name}
              </h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2">{content}</p>
            <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <Image
                  src={heart_icon_outlined}
                  alt="heart"
                  className="cursor-pointer object-contain"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src={reply_icon}
                    alt="reply"
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src={repost_icon}
                  alt="repost"
                  className="cursor-pointer object-contain"
                />
                <Image
                  src={share_icon}
                  alt="share"
                  className="cursor-pointer object-contain"
                />
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} repl{comments.length > 1 ? 'ies' : 'y'}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
        <DeleteThread
          threadId={JSON.stringify(id)}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>
      {!isComment && comments?.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2">
          {comments?.slice(0, 2).map((comment, index) => (
            <Image
              key={index}
              src={(comment.author as any).image}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && '-ml-5'} rounded-full object-cover`}
            />
          ))}

          <Link href={`/thread/${id}`}>
            <p className="mt-1 text-subtle-medium text-gray-1">
              {comments.length} repl{comments.length > 1 ? 'ies' : 'y'}
            </p>
          </Link>
        </div>
      )}

      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)}
            {community && ` - ${community.name} Community`}
          </p>

          <Image
            src={community.image}
            alt={community.name}
            width={14}
            height={14}
            className="ml-1 rounded-full object-cover"
          />
        </Link>
      )}
    </article>
  );
};

export default ThreadCard;
