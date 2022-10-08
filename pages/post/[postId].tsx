import { useMutation, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import Post from '../../components/Post';
import { GET_ALL_POST_BY_ID } from '../../graphql/queries';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { ADD_COMMENT } from '../../graphql/mutation';

type FormData = {
  comment: String;
};
function PostPage() {
  const { data: session } = useSession();
  const {
    query: { postId },
  } = useRouter();
  const { data } = useQuery(GET_ALL_POST_BY_ID, {
    variables: {
      postId: postId,
    },
  });
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_ALL_POST_BY_ID, 'getPostListById'],
  });

  const post: Post = data?.getPostListById;
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);
    const notification = toast.loading('Posting your comment');
    await addComment({
      variables: {
        post_id: postId,
        text: data.comment,
        username: session?.user?.name,
      },
    });

    setValue('comment', '');
    toast.success('Comment Successfull Posted!!', {
      id: notification,
    });
  };
  return (
    <div className='mx-auto my-7 max-w-5xl'>
      <Post post={post} />

      {/* Comment Box */}
      <div className='-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16'>
        <p className='text-sm'>
          Comment as <span className='text-red-500'>{session?.user?.name}</span>
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col space-y-2'
        >
          <textarea
            {...register('comment')}
            className='h24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50'
            placeholder={
              session ? 'What are your thoughts?' : 'Please sign in to comment'
            }
          />
          <button
            type='submit'
            className='rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200'
          >
            Comment
          </button>
        </form>
      </div>

      {/* Comment List */}
    </div>
  );
}

export default PostPage;
