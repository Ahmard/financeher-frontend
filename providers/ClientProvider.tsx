"use client";

import type {Session} from "next-auth";
import {SessionProvider} from "next-auth/react";
import type React from "react";

interface IProps {
  children: React.ReactNode
  session: Session | null
}

export default function ClientProvider({children, session}: IProps): React.ReactNode {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}