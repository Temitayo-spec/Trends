'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import Thread from '../models/thread.model';

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
