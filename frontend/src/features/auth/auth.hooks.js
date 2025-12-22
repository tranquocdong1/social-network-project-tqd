import { useAuth } from "./auth.context";

export const useCurrentUser = () => {
  const { user, loading } = useAuth();
  return { user, loading, isAuthenticated: !!user };
};
