import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@/styles/theme';
import Head from 'next/head';
import Navbar from '../components/Navbar';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Head>
          <title>Guardião de Patas</title>
          <meta name="description" content="Junte-se a nós na nossa missão de ajudar animais. Explore as diversas funcionalidades do nosso site." />
          <link rel="icon" href="https://firebasestorage.googleapis.com/v0/b/guardiao-de-patas.appspot.com/o/recursosApp%2Ficone-app.ico?alt=media&token=bacc49b5-8139-46c7-9e5c-6d69844cca01" />
        </Head>

        <Navbar />
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default MyApp;