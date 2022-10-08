import { LinkIcon, PhotographIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import React from 'react';
import Avatar from './Avatar';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutation';
import client from '../apollo-client';
import { GET_ALL_POST, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries';
import toast from 'react-hot-toast';
import { type } from 'os';
type FormData = {
  postTitle: string;
  postBody: string;
  postImage: string;
  subreddit: string;
};

type Props = {
  subreddit?: string;
};

function PostBox({ subreddit }: Props) {
  const { data: session } = useSession();
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POST, 'getPostList'],
  });
  const [addSubreddit] = useMutation(ADD_SUBREDDIT);
  const [imageBoxOpen, setImageBoxOpen] = useState(false);
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (formData) => {
    const notification = toast.loading('creating new post');

    try {
      // query the subreddit topic if exists
      console.log(formData);

      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subreddit || formData.subreddit,
        },
      });
      console.log(getSubredditListByTopic);
      const subredditExists = getSubredditListByTopic.length > 0;
      console.log(subredditExists);

      if (!subredditExists) {
        // create subreddit
        console.log('subreddit does not exists');
        console.log('creating new subreddit');
        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit,
          },
        });

        console.log('creating post....', formData);
        const image = formData.postImage;

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        });
        console.log('new post created  . . . ', newPost);
      } else {
        console.log('create using existing subbreddit');
        console.log(getSubredditListByTopic);

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: formData.postImage,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        });
        console.log('new post created  . . . ', newPost);
      }
      setValue('postBody', '');
      setValue('postImage', '');
      setValue('postTitle', '');
      setValue('subreddit', '');
      console.log(notification);

      toast.success('New Post Created!', {
        id: notification,
      });
    } catch (error) {
      console.log(notification);
      toast.error('Oops! Someting went wrong', {
        id: notification,
      });
      console.log(error);
    }
    console.log(formData);
  });
  return (
    <form
      onSubmit={onSubmit}
      className='sticky top-20 z-50  border rounded-md border-gray-300 bg-white p-2'
    >
      <div className='flex items-center space-x-2'>
        {/* avatar */}
        <Avatar />
        <input
          {...register('postTitle', { required: true })}
          disabled={!session}
          type='text'
          className='flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none'
          placeholder={
            session
              ? subreddit
                ? `create a post in r/${subreddit}`
                : 'Create a post by entering a title'
              : 'Sign In to post'
          }
        />

        <PhotographIcon
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 cursor-pointer text-gray-300 ${
            imageBoxOpen && 'text-blue-300'
          }`}
        />
        <LinkIcon className='h-6 text-gray-300' />
      </div>

      {watch('postTitle') && (
        <div className='flex flex-col py-2'>
          {/* body */}
          <div className='flex items-center px-2'>
            <p className='min-w-[90px]'>Body</p>
            <input
              {...register('postBody')}
              type='text'
              placeholder='Text (Optional)'
              className='m-2 flex-1 bg-blue-50 p-2 outline-none'
            />
          </div>

          {!subreddit && (
            <div className='flex items-center px-2'>
              <p className='min-w-[90px]'>Subreddit</p>
              <input
                {...register('subreddit', { required: true })}
                type='text'
                placeholder='i.e React JS'
                className='m-2 flex-1 bg-blue-50 p-2 outline-none'
              />
            </div>
          )}

          {imageBoxOpen && (
            <div className='flex items-center px-2'>
              <p className='min-w-[90px]'>Image URL:</p>
              <input
                {...register('postImage')}
                type='text'
                placeholder='optional'
                className='m-2 flex-1 bg-blue-50 p-2 outline-none'
              />
            </div>
          )}

          {/* errors */}
          {Object.keys(errors).length > 0 && (
            <div className='space-y-2 p-2 text-red-500'>
              {errors.postTitle?.type == 'required' && (
                <p>A post title is reqiuired</p>
              )}

              {errors.subreddit?.type == 'required' && (
                <p>A Subreddit is required</p>
              )}
            </div>
          )}

          {watch('postTitle') && (
            <button type='submit' className='bg-blue-400 p-2 text-white w-full'>
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  );
}

export default PostBox;
