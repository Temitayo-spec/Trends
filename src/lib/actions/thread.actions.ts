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
  connectToDB();
  try {
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
  connectToDB();

  try {
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
    console.error(`Failed to fetch post: ${error.message}`);
  }
};

export const fetchThreadById = async (id: string) => {
  connectToDB();
  try {
    const thread = await Thread.findById(id)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image',
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id id name image',
          },
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: '_id id name parentId image',
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error: any) {
    console.error(`Failed to fetch thread by id: ${error.message}`);
  }
};

interface CommentToThreadProps {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}

export const addCommentToThread = async ({
  threadId,
  commentText,
  userId,
  path,
}: CommentToThreadProps) => {
  connectToDB();

  try {
    //Find original thread by id
    const originalThread = await Thread.findById(threadId);

    console.log('fetching')
    if (!originalThread)
      throw Error(`Could not find thread with id ${threadId}`);
    // create a new thread with the comment text
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    //save new thread to db

    const savedCommentThread = await commentThread.save();

    //Update the original thread to include comment
    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    console.error(`Failed to add comment to thread: ${error.message}`);
  }
};
