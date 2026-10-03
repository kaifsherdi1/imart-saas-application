import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
}

function readStoredUser(): User | null {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

const initialState: AuthState = {
  user: typeof window !== 'undefined' ? readStoredUser() : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user, token } }: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = user;
      state.token = token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    setUser: (state, { payload }: PayloadAction<User>) => {
      state.user = payload;
      localStorage.setItem('user', JSON.stringify(payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
