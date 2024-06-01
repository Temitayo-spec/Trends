'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { ChangeEvent, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { updateUser } from '@/lib/actions/user.actions';
import { ThreadValidation } from '@/lib/validations/thread';
import { Textarea } from '../ui/textarea';
import { createThread } from '@/lib/actions/thread.actions';

const PostThread = ({ userId }: { userId: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: '',
      accountId: userId,
    },
  });

  async function onSubmit(values: z.infer<typeof ThreadValidation>) {
    try {
      setLoading(true);
      await createThread({
        text: values.thread,
        author: userId,
        communityId: null,
        path: pathname,
      });

      router.push('/');
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-10 mt-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          {loading && (
            <div className="animate-spin h-5 w-5 mr-3 border border-t-white border-gray-500 rounded-full" />
          )}
          Post Thread
        </Button>
      </form>
    </Form>
  );
};

export default PostThread;
