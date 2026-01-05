import { useGetMeQuery } from "../features/auth/api/authApi";

export const AuthBootstrap = ({ children }: { children: React.ReactNode }) => {
  useGetMeQuery();
  return <>{children}</>;
};
