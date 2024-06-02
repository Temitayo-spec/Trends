'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import Thread from '../models/thread.model';
import { FilterQuery, SortOrder } from 'mongoose';

interface Props {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export const updateUser: ({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Props) => Promise<void> = async ({
  userId,
  username,
  name,
  bio,
  image,
  path,
}) => {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onBoarded: true,
      },
      { upsert: true }
    );

    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw Error(`Failed to create/update user: ${error.message}`);
  }
};

export const fetchUser = async (userId: string) => {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
    //   .populate({
    //   path: 'communities',
    //   model: Community,
    // });
  } catch (error: any) {
    console.log(`Failed to fetch user: ${error.message}`);
  }
};

export const fetchUserPosts = async (userId: string) => {
  try {
    connectToDB();

    // Find all threads authored by the user of this userId

    //TODO: populate the community the user is in
    const threads = await User.findOne({ id: userId }).populate({
      path: 'threads',
      model: Thread,
      populate: {
        path: 'children',
        model: Thread,
        populate: {
          path: 'author',
          model: User,
          select: 'name image id',
        },
      },
    });
    return threads;
  } catch (error: any) {
    console.log(`Failed to fetch user: ${error.message}`);
  }
};

export const fetchUsers = async ({
  userId,
  pageNumber = 1,
  pageSize = 20,
  searchString = '',
  sortBy = 'desc',
}: {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
  searchString?: string;
  sortBy?: SortOrder;
}) => {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, 'i');

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() === '') {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUserCounts = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUserCounts > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    console.log(`Failed to fetch users: ${error.message}`);
  }
};

export const getNotifications = async (userId: string) => {
  try {
    connectToDB();

    const userThreads = await Thread.find({ author: userId });

    //collect all the child thread ids (replies) from 'children' field

    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id',
    });

    return replies;
  } catch (error: any) {
    console.log(`Failed to fetch users: ${error.message}`);
  }
};
