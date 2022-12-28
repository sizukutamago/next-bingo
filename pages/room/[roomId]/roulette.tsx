import { Box, Button, Center, Text } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import nookies from 'nookies';
import prisma from '../../../lib/prisma';
import { Room } from '@prisma/client';

type Props = {
  room: Pick<Room, 'id' | 'name'>;
  host: string;
};

type Numbers = {
  number: number;
  isAppear: boolean;
}[];

const Roulette: NextPage<Props> = ({ room }) => {
  const [nowNumber, setNowNumber] = useState<number>(0);
  const [numbers, setNumbers] = useState<Numbers>([]);
  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);

  const range = (start: number, end: number): Numbers => {
    const list = [];
    for (let i = start; i <= end; i++) {
      list.push({ number: i, isAppear: false });
    }
    return list;
  };

  const randomRange = (start: number, end: number) => {
    const list = [];
    for (let i = start; i <= end; i++) {
      list.push(i);
    }

    for (let i = list.length; 1 < i; i--) {
      let k = Math.floor(Math.random() * i);
      [list[k], list[i - 1]] = [list[i - 1], list[k]];
    }

    return list;
  };

  useEffect(() => {
    const saveNumbers = JSON.parse(
      localStorage.getItem(`${room.id}_numbers`) as string,
    ) as Numbers;

    const saveRandomNumbers = JSON.parse(
      localStorage.getItem(`${room.id}_random_numbers`) as string,
    ) as number[];

    if (saveNumbers != null && saveNumbers.length > 0) {
      setNumbers(saveNumbers);
      setRandomNumbers(saveRandomNumbers);
      return;
    }

    const numbers = range(1, 75);
    setNumbers(numbers);

    const randomNumbers = randomRange(1, 75);
    setRandomNumbers(randomNumbers);

    localStorage.setItem(`${room.id}_numbers`, JSON.stringify(numbers));
    localStorage.setItem(
      `${room.id}_random_numbers`,
      JSON.stringify(randomNumbers),
    );
  }, []);

  const numberPanel = (number: number, isAppear: boolean) => {
    return (
      <td
        key={number}
        style={{
          backgroundColor: isAppear ? 'white' : 'auto',
        }}
      >
        <Text fontSize='4xl'>{number}</Text>
      </td>
    );
  };

  return (
    <Box>
      <Center flexFlow='column'>
        <Box border='1px' borderRadius='sm' margin='20px'>
          <Text fontSize='8xl' padding='48px' bg='white'>
            {nowNumber}
          </Text>
        </Box>
        <table border={1}>
          <tbody>
            <tr>
              {numbers.map(({ number, isAppear }) => {
                if (number > 15) return;
                return numberPanel(number, isAppear);
              })}
            </tr>
            <tr>
              {numbers.map(({ number, isAppear }) => {
                if (number < 16 || number > 30) return;
                return numberPanel(number, isAppear);
              })}
            </tr>
            <tr>
              {numbers.map(({ number, isAppear }) => {
                if (number < 31 || number > 45) return;
                return numberPanel(number, isAppear);
              })}
            </tr>
            <tr>
              {numbers.map(({ number, isAppear }) => {
                if (number < 46 || number > 60) return;
                return numberPanel(number, isAppear);
              })}
            </tr>
            <tr>
              {numbers.map(({ number, isAppear }) => {
                if (number < 61) return;
                return numberPanel(number, isAppear);
              })}
            </tr>
          </tbody>
        </table>
        <Box>
          <Button
            colorScheme='orange'
            margin='2rem'
            padding='4rem'
            fontSize='4xl'
            onClick={() => {
              if (randomNumbers.length == 0) return;
              const number = randomNumbers.pop() as number;
              numbers[number - 1].isAppear = true;
              setNumbers(numbers);
              setNowNumber(number);
              setRandomNumbers(randomNumbers);

              localStorage.setItem(
                `${room.id}_numbers`,
                JSON.stringify(numbers),
              );
              localStorage.setItem(
                `${room.id}_random_numbers`,
                JSON.stringify(randomNumbers),
              );
            }}
          >
            ルーレットスタート！
          </Button>
        </Box>
      </Center>
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

export default Roulette;
