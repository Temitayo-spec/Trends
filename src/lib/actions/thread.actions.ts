'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import Thread from '../models/thread.model';

interface Props {
  text: string;
  author: string;
  communityId: string;
  path: string;
}

export const createThread = async ({
  text,
  author,
  communityId,
  path,
}: Props) => {
  try {
    connectToDB();

    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    // update user model
    await User.findByIdAndUpdate(author, {
      $push: {
        threads: createdThread._id,
      },
    });

    revalidatePath(path);
  } catch (error: any) {
    console.error(`Failed to create thread ${path}`, error.message);
  }
};

export const fetchPosts = async (pageNumber = 1, pageSize = 20) => {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const postsQuery = Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: 'author',
        model: User,
      })
      .populate({
        path: 'children',
        populate: {
          path: 'author',
          model: User,
          select: '_id name parentId image',
        },
      });

    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
  } catch (error: any) {
    console.log(`Failed to fetch post: ${error.message}`);
  }
};
