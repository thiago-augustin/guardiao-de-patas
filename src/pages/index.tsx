import type { NextPage } from 'next';
import { Box, Container, Typography } from '@mui/material';

const Home: NextPage = () => {
  return (
    <Container maxWidth="lg">
      <Box my={4} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Bem-vindo à Nossa Causa Animal
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Nosso objetivo é conectar animais a pessoas amorosas. Explore as funcionalidades para adoção, doação, educação sobre animais, e mais.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;