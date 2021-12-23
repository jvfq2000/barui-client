class AuthTokenError extends Error {
  constructor() {
    super("Erro do token de autenticação!");
  }
}

export { AuthTokenError };
