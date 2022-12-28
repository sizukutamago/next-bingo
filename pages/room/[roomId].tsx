import {
  Box,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Room } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import { useQRCode } from 'next-qrcode';
import Link from 'next/link';
import nookies from 'nookies';
import prisma from '../../lib/prisma';

type Props = {
  room: Pick<Room, 'id' | 'name'>;
  host: string;
};

const RoomId: NextPage<Props> = ({ room, host }) => {
  const { SVG } = useQRCode();
  const roomUrl = `${host}/room/${room.id}/card`;

  return (
    <Box h='100vh' width='100%'>
      <Flex
        h='100%'
        justify='center'
        align='center'
        gridRow='auto'
        flexFlow='column'
      >
        <VStack spacing='24px'>
          <Box style={{ width: '40rem' }}>
            <Text
              align='center'
              marginBottom='24px'
              fontSize='4xl'
              fontWeight='extrabold'
            >
              参加者用のQRコード
            </Text>
            <SVG text={roomUrl} />
          </Box>
          <Box>
            <Popover>
              <PopoverTrigger>
                <Button
                  colorScheme='orange'
                  value={roomUrl}
                  onClick={() => navigator.clipboard.writeText(roomUrl)}
                >
                  参加者用URLをコピー
                </Button>
              </PopoverTrigger>
              <PopoverContent width='auto'>
                <PopoverArrow />
                <PopoverBody>URLをコピーしました</PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
          <Box>
            <Link href={`/room/${room.id}/roulette`}>
              <Button colorScheme='red'>ビンゴを始める</Button>
            </Link>
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
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
      host: ctx.req.headers.host as string,
    },
  };
};

export default RoomId;
