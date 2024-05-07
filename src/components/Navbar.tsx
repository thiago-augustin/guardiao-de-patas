import { AppBar, Toolbar, Typography, Button, IconButton, Avatar } from '@mui/material';
import { Logout } from '@mui/icons-material'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
	const { user, logout } = useContext(AuthContext);
	const router = useRouter();

	return (
		<AppBar position="static">
			<Toolbar>
				<Avatar srcSet='https://firebasestorage.googleapis.com/v0/b/guardiao-de-patas.appspot.com/o/Logo%20App.png?alt=media&token=ccff7844-7d63-4782-a35e-7924d080e097' alt='Logo Guardião de Patas' />
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }} ml={1}>
					Guardião de Patas
				</Typography>
				{user ? (
					<>
						<Button onClick={() => router.push('/profile-edit')}>
							<Avatar alt={user.displayName || null} src={user.photoURL} />
							<Typography variant="overline" component="p" ml={1} color={'#fff'}>
								{user.displayName}
							</Typography>
						</Button>
						<IconButton color="inherit" onClick={logout}>
							<Logout />
						</IconButton>
					</>
				) : (
					<Link href="/login" passHref>
						<Button color="inherit">Login</Button>
					</Link>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;