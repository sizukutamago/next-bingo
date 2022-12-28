import { Room } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import prisma from '../../lib/prisma';

type Props = {
  room: Pick<Room, 'id' | 'name'>;
};

const RoomId: NextPage = () => {
  const router = useRouter();
  const { roomId } = router.query;

  return <div></div>;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const cookies = nookies.get(ctx);

  const room = await prisma.room.findFirst({
    select: {
      id: true,
      name: true,
    },
    where: {
      hash: cookies.next_bingo_room,
    },
  });

  if (!room) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  return {
    props: {
      room,
    },
  };
};

export default RoomId;
