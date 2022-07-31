import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

type props = {
  seed?: string;
  large?: Boolean;
};
function Avatar({ seed, large }: props) {
  const { data: session } = useSession();
  return (
    <div
      className={`relative h-10 w-10 overflow-hidden rounded-full border-gray-300 bg-white ${
        large && 'h-20 w-20'
      }`}
    >
      <Image
        layout='fill'
        src={`https://avatars.dicebear.com/api/croodles/${
          seed || session?.user?.name || 'John_Doe'
        }.svg`}
      />
    </div>
  );
}

export default Avatar;
