import { useState } from 'react';
import { Avatar, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase';
import { useAuth } from '../context/AuthContext';
import { Bounce, ToastContainer, toast } from 'react-toastify';

const ProfilePicture = () => {
  const { user } = useAuth();
  const [image, setImage] = useState(user?.photoURL || '');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !user) return;

    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    setUploading(true);
    
    try {
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL });
      setImage(photoURL);
      toast.success('Sua foto foi alterada com sucesso!');
    } catch (error) {
      toast.error('Não foi possível alterar sua foto. Por favor, tente novamente mais tarde.');
      console.error('Error updating profile picture:', error);
    }

    setUploading(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Avatar src={image} alt="Profile Picture" style={{ width: 256, height: 256 }} />
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        id="icon-button-file"
        onChange={handleFileChange}
      />
      <label htmlFor="icon-button-file">
        <IconButton
          color="primary"
          component="span"
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            background: 'white',
            borderRadius: '50%',
          }}
        >
          <EditIcon />
        </IconButton>
      </label>

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
    </div>
  );
};

export default ProfilePicture;