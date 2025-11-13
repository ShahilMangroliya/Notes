# Vibe Code Guide - Part 2: Redux State Management

## Task: Create Redux Slices and Store Configuration

Create Redux Toolkit slices for state management following strict patterns.

## File 1: `src/redux/notesSlice.ts`

### Instructions for AI Model

Generate a Redux Toolkit slice for notes management. Use these imports:

```typescript
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import type {Note, NoteFilter, SortOption} from '@/types/note';
import StorageHelper from '@/util/StorageHelper';
```

### State Interface

```typescript
export interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  filter: NoteFilter;
  searchQuery: string;
  sortBy: SortOption;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  currentNote: null,
  filter: 'all',
  searchQuery: '',
  sortBy: 'updatedAt',
  isLoading: false,
  error: null,
};
```

### Async Thunks to Implement

#### 1. loadNotes

```typescript
export const loadNotes = createAsyncThunk(
  'notes/loadNotes',
  async () => {
    const noteIds = StorageHelper.getItem('notes.list', 'string') as string;
    const ids = noteIds ? JSON.parse(noteIds) : [];

    const notes: Note[] = [];
    for (const id of ids) {
      const noteData = StorageHelper.getItem(`notes.${id}`, 'string') as string;
      if (noteData) {
        notes.push(JSON.parse(noteData));
      }
    }
    return notes;
  }
);
```

#### 2. saveNote

```typescript
export const saveNote = createAsyncThunk(
  'notes/saveNote',
  async (note: Note) => {
    StorageHelper.setItem(`notes.${note.id}`, JSON.stringify(note));

    const noteIds = StorageHelper.getItem('notes.list', 'string') as string;
    const ids = noteIds ? JSON.parse(noteIds) : [];

    if (!ids.includes(note.id)) {
      ids.push(note.id);
      StorageHelper.setItem('notes.list', JSON.stringify(ids));
    }

    return note;
  }
);
```

#### 3. deleteNote

```typescript
export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (noteId: string) => {
    StorageHelper.removeItem(`notes.${noteId}`);

    const noteIds = StorageHelper.getItem('notes.list', 'string') as string;
    const ids = noteIds ? JSON.parse(noteIds) : [];
    const updatedIds = ids.filter((id: string) => id !== noteId);
    StorageHelper.setItem('notes.list', JSON.stringify(updatedIds));

    return noteId;
  }
);
```

### Synchronous Reducers

```typescript
reducers: {
  setCurrentNote: (state, action: PayloadAction<Note | null>) => {
    state.currentNote = action.payload;
  },

  updateCurrentNote: (state, action: PayloadAction<Partial<Note>>) => {
    if (state.currentNote) {
      state.currentNote = {
        ...state.currentNote,
        ...action.payload,
        updatedAt: Date.now(),
      };
    }
  },

  setFilter: (state, action: PayloadAction<NoteFilter>) => {
    state.filter = action.payload;
  },

  setSearchQuery: (state, action: PayloadAction<string>) => {
    state.searchQuery = action.payload;
  },

  setSortBy: (state, action: PayloadAction<SortOption>) => {
    state.sortBy = action.payload;
  },

  togglePinNote: (state, action: PayloadAction<string>) => {
    const note = state.notes.find(n => n.id === action.payload);
    if (note) {
      note.isPinned = !note.isPinned;
      note.updatedAt = Date.now();
    }
  },

  updateNoteColor: (state, action: PayloadAction<{id: string; color: string}>) => {
    const note = state.notes.find(n => n.id === action.payload.id);
    if (note) {
      note.color = action.payload.color;
      note.updatedAt = Date.now();
    }
  },

  clearError: (state) => {
    state.error = null;
  },
},
```

### Extra Reducers

Handle async thunk states for loading, success, and error.

```typescript
extraReducers: (builder) => {
  // loadNotes
  builder.addCase(loadNotes.pending, (state) => {
    state.isLoading = true;
    state.error = null;
  });
  builder.addCase(loadNotes.fulfilled, (state, action) => {
    state.isLoading = false;
    state.notes = action.payload;
  });
  builder.addCase(loadNotes.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.error.message || 'Failed to load notes';
  });

  // saveNote
  builder.addCase(saveNote.fulfilled, (state, action) => {
    const index = state.notes.findIndex(n => n.id === action.payload.id);
    if (index >= 0) {
      state.notes[index] = action.payload;
    } else {
      state.notes.push(action.payload);
    }
  });

  // deleteNote
  builder.addCase(deleteNote.fulfilled, (state, action) => {
    state.notes = state.notes.filter(n => n.id !== action.payload);
    if (state.currentNote?.id === action.payload) {
      state.currentNote = null;
    }
  });
},
```

## File 2: `src/redux/editorSlice.ts`

### State Interface

```typescript
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {TextFormatting, Point} from '@/types/note';
import {DEFAULT_TEXT_FORMATTING} from '@/types/note';

export interface EditorState {
  textEditor: TextEditorState;
  drawingEditor: DrawingEditorState;
  isDirty: boolean;
  lastSaved: number | null;
}

export interface TextEditorState {
  selectedBlockId: string | null;
  currentFormatting: TextFormatting;
  history: any[];  // Will be properly typed later
  historyIndex: number;
  maxHistory: number;
}

export interface DrawingEditorState {
  selectedTool: 'pencil' | 'eraser';
  brushSize: number;
  brushColor: string;
  isDrawing: boolean;
  currentStroke: Point[] | null;
  history: any[];  // Will be properly typed later
  historyIndex: number;
}
```

### Key Actions

```typescript
// Text formatting
setTextFormatting: (state, action: PayloadAction<Partial<TextFormatting>>) => {
  state.textEditor.currentFormatting = {
    ...state.textEditor.currentFormatting,
    ...action.payload,
  };
  state.isDirty = true;
},

toggleTextFormatting: (
  state,
  action: PayloadAction<'bold' | 'italic' | 'underline' | 'strikethrough'>
) => {
  const key = action.payload;
  state.textEditor.currentFormatting[key] = !state.textEditor.currentFormatting[key];
  state.isDirty = true;
},

// Drawing tools
setDrawingTool: (state, action: PayloadAction<'pencil' | 'eraser'>) => {
  state.drawingEditor.selectedTool = action.payload;
},

setBrushSize: (state, action: PayloadAction<number>) => {
  state.drawingEditor.brushSize = action.payload;
},

setBrushColor: (state, action: PayloadAction<string>) => {
  state.drawingEditor.brushColor = action.payload;
},

// Common
markSaved: (state) => {
  state.isDirty = false;
  state.lastSaved = Date.now();
},

resetEditor: () => initialState,
```

## File 3: `src/redux/voiceSlice.ts`

### State Interface

```typescript
export interface VoiceState {
  stt: {
    isListening: boolean;
    recognizedText: string;
    language: string;
    error: string | null;
  };
  tts: {
    isPlaying: boolean;
    progress: number;
    rate: number;
    pitch: number;
    voice: string | null;
    error: string | null;
  };
}
```

### Actions

```typescript
// STT actions
startListening, stopListening, setRecognizedText, setSTTLanguage, setSTTError, clearSTTError

// TTS actions
startSpeaking, stopSpeaking, setTTSProgress, setTTSRate, setTTSPitch, setTTSVoice, setTTSError, clearTTSError
```

## File 4: Update `src/redux/store.ts`

### Instructions

Update the existing store to include new slices:

```typescript
import {configureStore} from '@reduxjs/toolkit';
import themeReducer from './themeSlice';          // Existing
import notesReducer from './notesSlice';          // New
import editorReducer from './editorSlice';        // New
import voiceReducer from './voiceSlice';          // New

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    notes: notesReducer,
    editor: editorReducer,
    voice: voiceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['editor/pushHistory'],
        ignoredPaths: ['editor.drawingEditor.currentStroke'],
      },
    }),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
```

## File 5: `src/redux/selectors.ts`

Create memoized selectors using `createSelector`:

```typescript
import {createSelector} from '@reduxjs/toolkit';
import type {RootState} from './store';

export const selectAllNotes = (state: RootState) => state.notes.notes;
export const selectFilter = (state: RootState) => state.notes.filter;
export const selectSearchQuery = (state: RootState) => state.notes.searchQuery;
export const selectSortBy = (state: RootState) => state.notes.sortBy;

export const selectFilteredNotes = createSelector(
  [selectAllNotes, selectFilter, selectSearchQuery],
  (notes, filter, searchQuery) => {
    let filtered = notes;

    if (filter !== 'all') {
      if (filter === 'pinned') {
        filtered = filtered.filter(note => note.isPinned);
      } else {
        filtered = filtered.filter(note => note.type === filter);
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note => {
        if (note.title.toLowerCase().includes(query)) return true;
        if (note.type === 'text') {
          return note.content.blocks.some(block =>
            block.text.toLowerCase().includes(query)
          );
        }
        return false;
      });
    }

    return filtered;
  }
);

export const selectSortedNotes = createSelector(
  [selectFilteredNotes, selectSortBy],
  (notes, sortBy) => {
    const sorted = [...notes];
    switch (sortBy) {
      case 'updatedAt': return sorted.sort((a, b) => b.updatedAt - a.updatedAt);
      case 'createdAt': return sorted.sort((a, b) => b.createdAt - a.createdAt);
      case 'title': return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default: return sorted;
    }
  }
);
```

## Verification Checklist

- [ ] All slices export actions and reducer
- [ ] Async thunks properly typed
- [ ] No `any` types (except temporary history arrays)
- [ ] All imports use `@/` alias
- [ ] Store configured with all reducers
- [ ] Selectors use createSelector for memoization
- [ ] TypeScript compiles without errors

## Next Step

Proceed to **Part 3: Utility Helpers**.
