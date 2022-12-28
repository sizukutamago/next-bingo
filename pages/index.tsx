import { NextPage } from 'next';
import { Box, Flex, Heading, useToast, VStack } from '@chakra-ui/react';
import { FormControl } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { MouseEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { Room } from '@prisma/client';

const Top: NextPage = () => {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toast = useToast();

  const onClickHandler = async (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    const response = await fetch('/api/createRoom', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      setIsLoading(false);

      toast({
        position: 'top-right',
        title: 'エラーが発生しました',
        description: '部屋を作成できませんでした',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const room = (await response.json()) as Room;
    router.replace(`/room/${room.id}`);
  };

  return (
    <Box h='100vh' width='100%'>
      <Flex h='100%' justify='center' align='center'>
        <FormControl w='50%'>
          <VStack spacing={18}>
            <Heading as='h1' size='2xl'>
              Bingo Next
            </Heading>
            <Input
              type='text'
              placeholder='ビンゴルームの名前'
              name='name'
              value={name}
              bg='white'
              border='2px'
              width={{ base: 'xs', md: 'xl' }}
              borderColor='#919191'
              textAlign='center'
              onChange={(event) => {
                event.preventDefault();
                setName(event.target.value);
              }}
            />
            <Button
              type='submit'
              onClick={onClickHandler}
              h='4rem'
              border='2px'
              borderColor='#919191'
            >
              ビンゴを始める
            </Button>
          </VStack>
        </FormControl>
      </Flex>
    </Box>
  );
};

export default Top;
