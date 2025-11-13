import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  currentTheme: ThemeMode;
  systemPrefersDark: boolean;
  isInitialized: boolean;
}

const initialState: ThemeState = {
  currentTheme: 'system',
  systemPrefersDark: false,
  isInitialized: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      if (['light', 'dark', 'system'].includes(action.payload)) {
        state.currentTheme = action.payload;
      }
    },
    setSystemPrefersDark: (state, action: PayloadAction<boolean>) => {
      state.systemPrefersDark = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    initializeTheme: (
      state,
      action: PayloadAction<{theme: ThemeMode; systemPrefersDark: boolean}>,
    ) => {
      state.currentTheme = action.payload.theme;
      state.systemPrefersDark = action.payload.systemPrefersDark;
      state.isInitialized = true;
    },
  },
});

export const {setTheme, setSystemPrefersDark, setInitialized, initializeTheme} =
  themeSlice.actions;
export default themeSlice.reducer;
