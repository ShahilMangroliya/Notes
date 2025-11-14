import {configureStore} from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import notesReducer from './notesSlice';
import editorReducer from './editorSlice';
import voiceReducer from './voiceSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    notes: notesReducer,
    editor: editorReducer,
    voice: voiceReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['editor/pushHistory'],
        ignoredPaths: ['editor.drawingEditor.currentStroke'],
      },
    }),
});
// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch'];
