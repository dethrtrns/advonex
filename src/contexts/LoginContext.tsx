"use client";

import { createContext, useContext } from "react";
import { useLogin } from "@/hooks/login/useLogin";
import { UseLoginHookType } from "@/hooks/login/login-types";

const LoginContext = createContext<UseLoginHookType | undefined>(undefined);

// seems redundant, we can probably expose the hook in existing auth context???
export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const loginHook = useLogin();
  return (
    <LoginContext.Provider value={loginHook}>{children}</LoginContext.Provider>
  );
};

export const useLoginContext = () => {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error("useLoginContext must be used within a LoginProvider");
  }
  return context;
};
