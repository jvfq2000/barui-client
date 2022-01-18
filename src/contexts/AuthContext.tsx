import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";

import { api } from "../services/apiClient";
import { IShowToast } from "../utils/iShowToast";

interface ISignInCredentials {
  email: string;
  password: string;
  showToast: (infoToast: IShowToast) => void;
}

interface IUser {
  name: string;
  lastName: string;
  email: string;
  avatar: string;
  avatarUrl: string;
  identifier: string;
  accessLevel: string;
}

interface IAuthContextData {
  signIn(credentials: ISignInCredentials): Promise<void>;
  user: IUser;
  isAuthenticated: boolean;
}

interface IAuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as IAuthContextData);

let authChannel: BroadcastChannel;

function signOut(): void {
  destroyCookie(undefined, "baruiApp.token");
  destroyCookie(undefined, "baruiApp.refreshToken");

  authChannel.postMessage("signOut");

  Router.push("/");
}

function AuthProvider({ children }: IAuthProviderProps) {
  const [user, setUser] = useState<IUser>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = message => {
      switch (message.data) {
        case "signOut":
          signOut();
          break;
        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    const { "baruiApp.token": token } = parseCookies();

    if (token) {
      api
        .get("users/profile")
        .then(response => {
          const {
            email,
            accessLevel,
            name,
            lastName,
            avatar,
            avatarUrl,
            identifier,
          } = response.data as IUser;

          setUser({
            email,
            accessLevel,
            name,
            lastName,
            avatar,
            avatarUrl,
            identifier,
          });
        })
        .catch(() => {
          if (process.browser) {
            signOut();
          }
        });
    }
  }, []);

  async function signIn({
    email,
    password,
    showToast,
  }: ISignInCredentials): Promise<void> {
    try {
      const response = await api.post("sessions", { email, password });

      const { accessLevel, name, lastName, avatar, avatarUrl, identifier } =
        response.data.user;

      const { token, refreshToken } = response.data;

      setCookie(undefined, "baruiApp.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
      setCookie(undefined, "baruiApp.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      setUser({
        email,
        accessLevel,
        name,
        lastName,
        avatar,
        avatarUrl,
        identifier,
      });

      // eslint-disable-next-line dot-notation
      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");
    } catch (error) {
      showToast({
        description: error.response.data.message,
        status: "error",
      });
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext, signOut };
