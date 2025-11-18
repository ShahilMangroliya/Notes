import {configureStore, Middleware} from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import notesReducer from './notesSlice';
import editorReducer from './editorSlice';
import voiceReducer from './voiceSlice';
import logger from '@/util/DebugLogger';

/**
 * Redux middleware to log all actions
 */
const loggerMiddleware: Middleware = store => next => action => {
  // Log action before it's processed
  if (typeof action === 'object' && action !== null && 'type' in action) {
    logger.action(action.type as string, 'payload' in action ? action.payload : undefined, {
      state: store.getState(),
    });
  }
  const result = next(action);
  return result;
};

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
    }).concat(loggerMiddleware),
});
// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch'];
