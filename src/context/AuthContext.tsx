import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User, getIdToken, sendPasswordResetEmail, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '@/config/firebase';
import { setCookie, destroyCookie, parseCookies } from 'nookies';
import { getFriendlyErrorMessage } from '@/functions/getFirebaseFriendlyErrorMessage';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isValidPassword } from '@/functions/getPasswordValidation';

const DEFAULT_VALUE = {
	user: null as User | null,
	setUser: () => { },
	loading: true,
	setLoading: () => { },
	login: async (email: string, password: string) => {
		console.warn("login function not implemented");
	},
	passwordReset: async (email: string) => {
			console.warn("passwordReset function not implemented");
	},
	logout: async () => {
			console.warn("logout function not implemented");
	},
	signUp: async (email: string, password: string, fullName: string) => {
			console.warn("signUp function not implemented");
	}
}
export const AuthContext = createContext<AuthContext>(DEFAULT_VALUE)
AuthContext.displayName = 'Auth'

export const useAuth = () => useContext(AuthContext) ?? ({} as AuthContext);

export const AuthProvider = ({ children }: Props) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const login = async (email: string, password: string) => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
			router.push('/');
		} catch (error: any) {
			toast.error(getFriendlyErrorMessage(error.code));
		}
	};

	const logout = async () => {
		await signOut(auth);
		destroyCookie(null, 'token');
		setUser(null);
	};

	const passwordReset = async (email: string) => {
		if (!email) {
			toast.error('Por favor, insira seu e-mail para redefinição de senha.');
			return;
		}
		try {
			await sendPasswordResetEmail(auth, email);
			toast.success('E-mail de redefinição de senha enviado. Verifique sua caixa de entrada!');
		} catch (error: any) {
			toast.error('Falha ao enviar e-mail de redefinição. Tente novamente.');
		}
	};

	const signUp = async (email: string, password: string, fullName: string) => {
		if (!email.match(/^[^@]+@\w+(\.\w+)+\w$/)) {
			toast.error('Por favor, insira um endereço de e-mail válido.');
			return;
		}

		if (!isValidPassword(password)) {
			toast.warning('A senha deve ter pelo menos 8 caracteres, incluir uma letra maiúscula, uma minúscula, um número e um caractere especial.');
			return;
		}
		
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			await sendEmailVerification(userCredential.user);
			await updateProfile(userCredential.user, { displayName: fullName });
			router.push('/profile-edit');
		} catch (error: any) {
			toast.error(getFriendlyErrorMessage(error.code));
		}
	};

	useEffect(() => {
		return onAuthStateChanged(auth, async (user) => {
			if (user) {
				const token = await getIdToken(user);
				setCookie(null, 'token', token, {
					maxAge: 30 * 24 * 60 * 60,
					path: '/'
				});
				setUser(user);
			} else {
				destroyCookie(null, 'token');
				setUser(null);
			}
			setLoading(false);
		});
	}, []);

	return (
		<AuthContext.Provider value={{ user, setUser, loading, setLoading, login, logout, passwordReset, signUp }}>
			{!loading && children}

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
		</AuthContext.Provider>
	)
}

interface Props {
	children: ReactNode
}

interface AuthContext {
	user: User | null,
	setUser: React.Dispatch<React.SetStateAction<User | null>>,
	loading: boolean,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
	login: (email: string, password: string) => Promise<void>;
	passwordReset: (email: string) => Promise<void>;
	logout: () => Promise<void>;
	signUp: (email: string, password: string, fullName: string) => Promise<void>;
}