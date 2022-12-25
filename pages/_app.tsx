import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

export default function App({ Component, pageProps }: AppProps) {
  const theme = extendTheme({
    styles: {
      global: {
        body: {
          backgroundColor: '#defcff',
        },
      },
      html: {
        height: '100%',
        width: '100%',
      },
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
