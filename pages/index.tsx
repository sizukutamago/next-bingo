import { NextPage } from 'next';
import { Box, Flex, Heading, VStack } from '@chakra-ui/react';
import { FormControl } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { useState } from 'react';

const Top: NextPage = () => {
  const [name, setName] = useState<string>('');

  return (
    <Box h='100vh' width='100vw'>
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
            <Button type='submit' h='4rem' border='2px' borderColor='#919191'>
              ビンゴを始める
            </Button>
          </VStack>
        </FormControl>
      </Flex>
    </Box>
  );
};

export default Top;
