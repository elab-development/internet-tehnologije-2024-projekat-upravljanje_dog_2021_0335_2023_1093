import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import api from '../lib/api';
import type {
  ApiAuthLoginResponse,
  ApiAuthRegisterResponse,
  ApiMeResponse,
  LoginPayload,
  RegisterPayload,
  Role,
  User,
} from '../types/auth';

type AuthContextValue = {
  token: string | null;
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  loading: boolean;
  register: (
    payload: RegisterPayload
  ) => Promise<{ ok: true } | { ok: false; error: unknown }>;
  login: (
    payload: LoginPayload
  ) => Promise<{ ok: true } | { ok: false; error: unknown }>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<User | null>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const LS_TOKEN = 'eg_token';
const LS_USER = 'eg_user';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(LS_TOKEN)
  );
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(LS_USER);
    try {
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(token);
  const role: Role = (user?.role as Role) ?? 'user';

  const persist = (nextToken: string | null, nextUser: User | null) => {
    if (nextToken) {
      localStorage.setItem(LS_TOKEN, nextToken);
      setToken(nextToken);
    } else {
      localStorage.removeItem(LS_TOKEN);
      setToken(null);
    }
    if (nextUser) {
      localStorage.setItem(LS_USER, JSON.stringify(nextUser));
      setUser(nextUser);
    } else {
      localStorage.removeItem(LS_USER);
      setUser(null);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const { data } = await api.post<ApiAuthRegisterResponse>(
        '/register',
        payload
      );
      persist(data.access_token, data.data);
      return { ok: true } as const;
    } catch (err) {
      return { ok: false, error: (err as any)?.response?.data ?? err } as const;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const { data } = await api.post<ApiAuthLoginResponse & { data?: User }>(
        '/login',
        payload
      );
      persist(data.access_token, data.data ?? null);
      if (!data.data) {
        await fetchMe();
      }
      return { ok: true } as const;
    } catch (err) {
      persist(null, null);
      return { ok: false, error: (err as any)?.response?.data ?? err } as const;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch {
      // ignore
    } finally {
      persist(null, null);
    }
  };

  const fetchMe = async () => {
    if (!token) return null;
    try {
      const { data } = await api.get<ApiMeResponse>('/me');
      const u = data?.data ?? null;
      setUser(u);
      if (u) localStorage.setItem(LS_USER, JSON.stringify(u));
      else localStorage.removeItem(LS_USER);
      return u;
    } catch {
      persist(null, null);
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      if (token && !user) await fetchMe();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      role,
      isAuthenticated,
      loading,
      register,
      login,
      logout,
      fetchMe,
      setUser,
    }),
    [token, user, role, isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
