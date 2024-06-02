'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CommentValidation } from '@/lib/validations/thread';
import Image from 'next/image';

import { addCommentToThread } from '@/lib/actions/thread.actions';

interface CommentProps {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: CommentProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    try {
      setLoading(true);
      await addCommentToThread({
        threadId,
        userId: JSON.parse(currentUserId),
        commentText: values.comment,
        path: pathname,
      });

      form.reset();
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 w-full">
              <FormLabel className="w-12 h-12 relative flex-shrink-0">
                <Image
                  src={currentUserImg}
                  alt="current use image"
                  fill
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">
          {loading && (
            <div className="animate-spin h-5 w-5 mr-3 border border-t-white border-gray-500 rounded-full" />
          )}
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
