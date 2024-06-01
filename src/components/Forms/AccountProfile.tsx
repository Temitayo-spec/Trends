'use client';

import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserValidation } from '@/lib/validations/user';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import profile_svg from '../../../public/assets/profile.svg';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Textarea } from '../ui/textarea';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { updateUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';

interface AccountProfileProps {
  user: {
    id: string;
    objectId: string;
    username: string;
    bio: string;
    name: string;
    image: string;
  };
  btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: AccountProfileProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing('media');
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || '',
      name: user?.name || '',
      username: user?.username || '',
      bio: user?.bio || '',
    },
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (...event: string[]) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target?.files && e.target.files?.length > 0) {
      const file = e.target.files[0];

      setFiles(Array.from(e.target.files));

      if (!file.type.includes('image')) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';

        onChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof UserValidation>) {
    try {
      setLoading(true);
      const blob = values.profile_photo;

      const hasImageChanged = isBase64Image(blob);

      if (hasImageChanged) {
        const imgRes = (await startUpload(files)) as any[];

        if (imgRes && imgRes[0]?.url) {
          values.profile_photo = imgRes[0]?.url;
        }
      }

      // TODO: update user profile
      await updateUser({
        userId: user.id,
        username: values.username,
        name: values.name,
        bio: values.bio,
        image: values.profile_photo,
        path: pathname,
      });

      if (pathname === '/profile/edit') router.back();
      else router.push('/');
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label relative">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile_photo"
                    fill
                    priority
                    className="rounded-full object-cover"
                  />
                ) : (
                  <Image
                    src={profile_svg}
                    alt="profile_photo"
                    width="24"
                    height="24"
                    className="rounded-full object-cover"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a Photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                  //{...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          {loading && (
            <div className="animate-spin h-5 w-5 mr-3 border border-t-white border-gray-500 rounded-full" />
          )}
          {btnTitle}
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
