import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Container, Button, TextField, Box, Dialog, DialogActions, DialogTitle } from '@mui/material';
import ProfilePicture from '@/components/ProfilePicture';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { isValidPassword } from '@/functions/getPasswordValidation';
import { getFriendlyErrorMessage } from '@/functions/getFirebaseFriendlyErrorMessage';

const ProfileEditPage = () => {
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user, router]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    if (newPassword) {
      if (!password) {
        toast.warning('Para alterar sua senha, é necessário fornecer a senha atual para confirmação.');
        return;
      }

      if (!isValidPassword(newPassword)) {
        toast.warning('A senha deve ter pelo menos 8 caracteres, incluir uma letra maiúscula, uma minúscula, um número e um caractere especial.');
        return;
      }

      try {
        const credential = EmailAuthProvider.credential(user.email as string, password);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        toast.success('Senha atualizada com sucesso!');
      } catch (error: any) {
        console.error("Erro: ", error);
        toast.error(getFriendlyErrorMessage(error.code));
        return;
      }
    }
    
    if (user.displayName !== displayName) {
      try {
        await updateProfile(user, { displayName });
        toast.success('Perfil atualizado com sucesso!');
      } catch (error: any) {
        console.error("Erro: ", error);
        toast.error(getFriendlyErrorMessage(error.code));
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      await deleteUser(user);
      logout();
      router.push('/');
    } catch (error) {
      toast.error('Erro ao excluir sua conta. Por favor, tente novamente mais tarde.');
      console.error('Failed to delete account:', error);
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <Container maxWidth="lg">
      <Box my={4} textAlign="center">
        <Box component="form" sx={{ '& > :not(style)': { m: 1 } }}>
          <ProfilePicture />
          <TextField label="Nome" value={displayName} onChange={(e) => setDisplayName(e.target.value)} fullWidth />
          <TextField label="Email" type="email" value={email} InputProps={{ readOnly: true }} fullWidth />
          <TextField label="Senha atual" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          <TextField label="Nova senha" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} fullWidth />
          <Button onClick={handleUpdateProfile} variant="contained">Atualizar Perfil</Button>
          <Button onClick={handleOpenDialog} variant="contained" color="error">Excluir conta</Button>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Tem certeza que deseja excluir sua conta?</DialogTitle>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancelar</Button>
              <Button onClick={handleDeleteAccount} color="error">Sim, desejo excluir</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </Container >
  );
};

export default ProfileEditPage;