'use client';

import * as React from 'react';
import {createContext, useContext, useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
import {AuthUserData} from "@/lib/types/auth";
import {redirect, RedirectType} from "next/navigation";
import {getFlashMessage, setCallbackUrl, setFlashMessage} from "@/lib/helpers/navigation";
import {appName} from "@/lib/helpers/app.helper";
import {useNotify} from "@/lib/hooks/notify";
import {isBrowser} from "@/lib/helpers/dom";

interface IAuthContext {
  state: {
    user: AuthUserData;
    isAuthenticated: boolean;
  };
  setState: React.Dispatch<React.SetStateAction<IAuthContext['state']>>;
  hasPermission: (permission: string) => boolean;
}

interface IUseAppContextProps {
  authRequired?: boolean;
}

interface IProps {
  children: React.ReactNode
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider(props: IProps) {
  const {children} = props;

  const {notify} = useNotify();
  const {data: session} = useSession();
  const [state, setState] = useState({
    user: session?.user,
    isAuthenticated: !!session?.user,
  });

  const hasPermission = (permission: string) => {
    return state.user?.auth_data.permission_names.includes(permission);
  };

  // Handle a flash message
  useEffect(() => {
    const flashMessage = getFlashMessage();
    if (flashMessage) {
      notify({
        title: flashMessage.title ?? appName(),
        message: flashMessage.message,
        type: flashMessage.type
      });
    }
  }, [notify]);

  return (
    <AuthContext.Provider value={{state, setState, hasPermission}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(props?: IUseAppContextProps) {
  const context = useContext(AuthContext);
  const isAuthenticated = context.state.isAuthenticated;

  if (props?.authRequired && !isAuthenticated && isBrowser()) {
    setCallbackUrl(window.location.pathname);
    setFlashMessage({
      type: 'warning',
      message: 'You must be authenticated to access this page'
    });

    redirect('/login', RedirectType.replace);
  }

  return context;
}
