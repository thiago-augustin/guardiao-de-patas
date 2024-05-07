export function getFriendlyErrorMessage(errorCode: string) {
  switch (errorCode) {
      case 'auth/email-already-in-use':
          return 'Este e-mail já está em uso. Por favor, tente fazer login ou use outro e-mail.';
      case 'auth/invalid-email':
          return 'O e-mail fornecido é inválido. Por favor, verifique e tente novamente.';
      case 'auth/operation-not-allowed':
          return 'Login com e-mail e senha não está habilitado. Entre em contato com o suporte.';
      case 'auth/weak-password':
          return 'A senha é muito fraca. Por favor, use uma senha mais forte com pelo menos 6 caracteres.';
      case 'auth/user-disabled':
          return 'Esta conta de usuário foi desativada. Entre em contato com o suporte.';
      case 'auth/user-not-found':
          return 'Não foi possível encontrar uma conta com este e-mail. Por favor, verifique o e-mail inserido.';
      case 'auth/wrong-password':
          return 'Senha incorreta. Por favor, tente novamente ou redefina sua senha.';
      case 'auth/invalid-credential':
          return 'Esta combinação de e-mail e senha são incorretos. Por favor, tente novamente ou redefina sua senha.';
      default:
          return 'Ocorreu um erro desconhecido. Por favor, tente novamente mais tarde.';
  }
}