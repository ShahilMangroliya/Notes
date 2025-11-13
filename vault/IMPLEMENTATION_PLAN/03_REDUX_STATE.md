# Redux State Management

## Overview

Redux Toolkit is used for centralized state management with typed hooks and slices.

## Store Configuration

**File:** `src/redux/store.ts`

```typescript
import {configureStore} from '@reduxjs/toolkit';
import themeReducer from './themeSlice';          // Existing
import notesReducer from './notesSlice';          // New
import editorReducer from './editorSlice';        // New
import exportReducer from './exportSlice';        // New
import voiceReducer from './voiceSlice';          // New

export const store = configureStore({
  reducer: {
    theme: themeReducer,      // Existing: theme mode management
    notes: notesReducer,      // Notes CRUD operations
    editor: editorReducer,    // Editor state (text/drawing)
    export: exportReducer,    // Export operations
    voice: voiceReducer,      // Voice features (STT/TTS)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for non-serializable values
        ignoredActions: ['editor/pushHistory'],
        // Ignore these paths in the state
        ignoredPaths: ['editor.drawingEditor.currentStroke'],
      },
    }),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
```

## Theme Slice (Existing)

**File:** `src/redux/themeSlice.ts`

This slice already exists and manages theme mode.

```typescript
interface ThemeState {
  mode: 'light' | 'dark' | 'system';
}

// Actions:
- setTheme(mode)          // Set theme mode
```

## Notes Slice

**File:** `src/redux/notesSlice.ts`

Manages all note-related state and operations.

```typescript
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import type {Note, NoteFilter, SortOption} from '@/types/note';
import StorageHelper from '@/util/StorageHelper';
import NoteHelper from '@/util/NoteHelper';

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

// Async thunks
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

export const saveNote = createAsyncThunk(
  'notes/saveNote',
  async (note: Note) => {
    // Save note content
    StorageHelper.setItem(`notes.${note.id}`, JSON.stringify(note));

    // Update note list
    const noteIds = StorageHelper.getItem('notes.list', 'string') as string;
    const ids = noteIds ? JSON.parse(noteIds) : [];

    if (!ids.includes(note.id)) {
      ids.push(note.id);
      StorageHelper.setItem('notes.list', JSON.stringify(ids));
    }

    return note;
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (noteId: string) => {
    // Remove note content
    StorageHelper.removeItem(`notes.${noteId}`);

    // Update note list
    const noteIds = StorageHelper.getItem('notes.list', 'string') as string;
    const ids = noteIds ? JSON.parse(noteIds) : [];
    const updatedIds = ids.filter((id: string) => id !== noteId);
    StorageHelper.setItem('notes.list', JSON.stringify(updatedIds));

    return noteId;
  }
);

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    // Synchronous actions
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

  extraReducers: (builder) => {
    // Load notes
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

    // Save note
    builder.addCase(saveNote.fulfilled, (state, action) => {
      const index = state.notes.findIndex(n => n.id === action.payload.id);
      if (index >= 0) {
        state.notes[index] = action.payload;
      } else {
        state.notes.push(action.payload);
      }
    });
    builder.addCase(saveNote.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to save note';
    });

    // Delete note
    builder.addCase(deleteNote.fulfilled, (state, action) => {
      state.notes = state.notes.filter(n => n.id !== action.payload);
      if (state.currentNote?.id === action.payload) {
        state.currentNote = null;
      }
    });
    builder.addCase(deleteNote.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to delete note';
    });
  },
});

export const {
  setCurrentNote,
  updateCurrentNote,
  setFilter,
  setSearchQuery,
  setSortBy,
  togglePinNote,
  updateNoteColor,
  clearError,
} = notesSlice.actions;

export default notesSlice.reducer;
```

## Editor Slice

**File:** `src/redux/editorSlice.ts`

Manages text and drawing editor state.

```typescript
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {
  TextFormatting,
  HistoryState,
  DrawingHistoryState,
} from '@/types/note';
import {DEFAULT_TEXT_FORMATTING} from '@/types/note';

export interface EditorState {
  textEditor: TextEditorState;
  drawingEditor: DrawingEditorState;
  isDirty: boolean;
  lastSaved: number | null;
}

export interface TextEditorState {
  selectedBlockId: string | null;
  cursorPosition: number;
  currentFormatting: TextFormatting;
  history: HistoryState[];
  historyIndex: number;
  maxHistory: number;
}

export interface DrawingEditorState {
  selectedTool: 'pencil' | 'eraser';
  brushSize: number;
  brushColor: string;
  isDrawing: boolean;
  currentStroke: Point[] | null;
  history: DrawingHistoryState[];
  historyIndex: number;
}

const initialState: EditorState = {
  textEditor: {
    selectedBlockId: null,
    cursorPosition: 0,
    currentFormatting: DEFAULT_TEXT_FORMATTING,
    history: [],
    historyIndex: -1,
    maxHistory: 50,
  },
  drawingEditor: {
    selectedTool: 'pencil',
    brushSize: 4,
    brushColor: '#000000',
    isDrawing: false,
    currentStroke: null,
    history: [],
    historyIndex: -1,
  },
  isDirty: false,
  lastSaved: null,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // Text editor actions
    setSelectedBlock: (state, action: PayloadAction<string | null>) => {
      state.textEditor.selectedBlockId = action.payload;
    },

    setCursorPosition: (state, action: PayloadAction<number>) => {
      state.textEditor.cursorPosition = action.payload;
    },

    setTextFormatting: (state, action: PayloadAction<Partial<TextFormatting>>) => {
      state.textEditor.currentFormatting = {
        ...state.textEditor.currentFormatting,
        ...action.payload,
      };
      state.isDirty = true;
    },

    toggleTextFormatting: (
      state,
      action: PayloadAction<keyof Pick<TextFormatting, 'bold' | 'italic' | 'underline' | 'strikethrough'>>
    ) => {
      const key = action.payload;
      state.textEditor.currentFormatting[key] = !state.textEditor.currentFormatting[key];
      state.isDirty = true;
    },

    // History management
    pushTextHistory: (state, action: PayloadAction<HistoryState>) => {
      const {history, historyIndex, maxHistory} = state.textEditor;

      // Remove any history after current index
      const newHistory = history.slice(0, historyIndex + 1);

      // Add new history state
      newHistory.push(action.payload);

      // Limit history size
      if (newHistory.length > maxHistory) {
        newHistory.shift();
      } else {
        state.textEditor.historyIndex++;
      }

      state.textEditor.history = newHistory;
      state.isDirty = true;
    },

    undoText: (state) => {
      if (state.textEditor.historyIndex > 0) {
        state.textEditor.historyIndex--;
        state.isDirty = true;
      }
    },

    redoText: (state) => {
      if (state.textEditor.historyIndex < state.textEditor.history.length - 1) {
        state.textEditor.historyIndex++;
        state.isDirty = true;
      }
    },

    clearTextHistory: (state) => {
      state.textEditor.history = [];
      state.textEditor.historyIndex = -1;
    },

    // Drawing editor actions
    setDrawingTool: (state, action: PayloadAction<'pencil' | 'eraser'>) => {
      state.drawingEditor.selectedTool = action.payload;
    },

    setBrushSize: (state, action: PayloadAction<number>) => {
      state.drawingEditor.brushSize = action.payload;
    },

    setBrushColor: (state, action: PayloadAction<string>) => {
      state.drawingEditor.brushColor = action.payload;
    },

    setIsDrawing: (state, action: PayloadAction<boolean>) => {
      state.drawingEditor.isDrawing = action.payload;
    },

    setCurrentStroke: (state, action: PayloadAction<Point[] | null>) => {
      state.drawingEditor.currentStroke = action.payload;
    },

    // Drawing history
    pushDrawingHistory: (state, action: PayloadAction<DrawingHistoryState>) => {
      const {history, historyIndex} = state.drawingEditor;

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(action.payload);

      if (newHistory.length > 50) {
        newHistory.shift();
      } else {
        state.drawingEditor.historyIndex++;
      }

      state.drawingEditor.history = newHistory;
      state.isDirty = true;
    },

    undoDrawing: (state) => {
      if (state.drawingEditor.historyIndex > 0) {
        state.drawingEditor.historyIndex--;
        state.isDirty = true;
      }
    },

    redoDrawing: (state) => {
      if (state.drawingEditor.historyIndex < state.drawingEditor.history.length - 1) {
        state.drawingEditor.historyIndex++;
        state.isDirty = true;
      }
    },

    clearDrawingHistory: (state) => {
      state.drawingEditor.history = [];
      state.drawingEditor.historyIndex = -1;
    },

    // Common actions
    markSaved: (state) => {
      state.isDirty = false;
      state.lastSaved = Date.now();
    },

    resetEditor: () => initialState,
  },
});

export const {
  setSelectedBlock,
  setCursorPosition,
  setTextFormatting,
  toggleTextFormatting,
  pushTextHistory,
  undoText,
  redoText,
  clearTextHistory,
  setDrawingTool,
  setBrushSize,
  setBrushColor,
  setIsDrawing,
  setCurrentStroke,
  pushDrawingHistory,
  undoDrawing,
  redoDrawing,
  clearDrawingHistory,
  markSaved,
  resetEditor,
} = editorSlice.actions;

export default editorSlice.reducer;
```

## Export Slice

**File:** `src/redux/exportSlice.ts`

Manages export operations.

```typescript
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import type {ExportFormat, Note} from '@/types/note';
import ExportHelper from '@/util/ExportHelper';

export interface ExportState {
  format: ExportFormat;
  isExporting: boolean;
  lastExportPath: string | null;
  error: string | null;
}

const initialState: ExportState = {
  format: 'pdf',
  isExporting: false,
  lastExportPath: null,
  error: null,
};

export const exportNote = createAsyncThunk(
  'export/exportNote',
  async ({note, format}: {note: Note; format: ExportFormat}) => {
    const filePath = await ExportHelper.exportNote(note, format);
    return {filePath, format};
  }
);

const exportSlice = createSlice({
  name: 'export',
  initialState,
  reducers: {
    setExportFormat: (state, action: PayloadAction<ExportFormat>) => {
      state.format = action.payload;
    },

    clearExportError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(exportNote.pending, (state) => {
      state.isExporting = true;
      state.error = null;
    });
    builder.addCase(exportNote.fulfilled, (state, action) => {
      state.isExporting = false;
      state.lastExportPath = action.payload.filePath;
      state.format = action.payload.format;
    });
    builder.addCase(exportNote.rejected, (state, action) => {
      state.isExporting = false;
      state.error = action.error.message || 'Export failed';
    });
  },
});

export const {setExportFormat, clearExportError} = exportSlice.actions;

export default exportSlice.reducer;
```

## Voice Slice

**File:** `src/redux/voiceSlice.ts`

Manages speech-to-text and text-to-speech state.

```typescript
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

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

const initialState: VoiceState = {
  stt: {
    isListening: false,
    recognizedText: '',
    language: 'en-US',
    error: null,
  },
  tts: {
    isPlaying: false,
    progress: 0,
    rate: 1.0,
    pitch: 1.0,
    voice: null,
    error: null,
  },
};

const voiceSlice = createSlice({
  name: 'voice',
  initialState,
  reducers: {
    // Speech-to-text actions
    startListening: (state) => {
      state.stt.isListening = true;
      state.stt.recognizedText = '';
      state.stt.error = null;
    },

    stopListening: (state) => {
      state.stt.isListening = false;
    },

    setRecognizedText: (state, action: PayloadAction<string>) => {
      state.stt.recognizedText = action.payload;
    },

    setSTTLanguage: (state, action: PayloadAction<string>) => {
      state.stt.language = action.payload;
    },

    setSTTError: (state, action: PayloadAction<string>) => {
      state.stt.error = action.payload;
      state.stt.isListening = false;
    },

    clearSTTError: (state) => {
      state.stt.error = null;
    },

    // Text-to-speech actions
    startSpeaking: (state) => {
      state.tts.isPlaying = true;
      state.tts.progress = 0;
      state.tts.error = null;
    },

    stopSpeaking: (state) => {
      state.tts.isPlaying = false;
      state.tts.progress = 0;
    },

    setTTSProgress: (state, action: PayloadAction<number>) => {
      state.tts.progress = action.payload;
    },

    setTTSRate: (state, action: PayloadAction<number>) => {
      state.tts.rate = action.payload;
    },

    setTTSPitch: (state, action: PayloadAction<number>) => {
      state.tts.pitch = action.payload;
    },

    setTTSVoice: (state, action: PayloadAction<string | null>) => {
      state.tts.voice = action.payload;
    },

    setTTSError: (state, action: PayloadAction<string>) => {
      state.tts.error = action.payload;
      state.tts.isPlaying = false;
    },

    clearTTSError: (state) => {
      state.tts.error = null;
    },
  },
});

export const {
  startListening,
  stopListening,
  setRecognizedText,
  setSTTLanguage,
  setSTTError,
  clearSTTError,
  startSpeaking,
  stopSpeaking,
  setTTSProgress,
  setTTSRate,
  setTTSPitch,
  setTTSVoice,
  setTTSError,
  clearTTSError,
} = voiceSlice.actions;

export default voiceSlice.reducer;
```

## Selectors

**File:** `src/redux/selectors.ts`

Memoized selectors for derived state.

```typescript
import {createSelector} from '@reduxjs/toolkit';
import type {RootState} from './store';
import type {Note} from '@/types/note';

// Notes selectors
export const selectAllNotes = (state: RootState) => state.notes.notes;
export const selectCurrentNote = (state: RootState) => state.notes.currentNote;
export const selectFilter = (state: RootState) => state.notes.filter;
export const selectSearchQuery = (state: RootState) => state.notes.searchQuery;
export const selectSortBy = (state: RootState) => state.notes.sortBy;

// Filtered notes selector
export const selectFilteredNotes = createSelector(
  [selectAllNotes, selectFilter, selectSearchQuery],
  (notes, filter, searchQuery) => {
    let filtered = notes;

    // Apply filter
    if (filter !== 'all') {
      if (filter === 'pinned') {
        filtered = filtered.filter(note => note.isPinned);
      } else {
        filtered = filtered.filter(note => note.type === filter);
      }
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note => {
        if (note.title.toLowerCase().includes(query)) {
          return true;
        }
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

// Sorted notes selector
export const selectSortedNotes = createSelector(
  [selectFilteredNotes, selectSortBy],
  (notes, sortBy) => {
    const sorted = [...notes];

    switch (sortBy) {
      case 'updatedAt':
        return sorted.sort((a, b) => b.updatedAt - a.updatedAt);
      case 'createdAt':
        return sorted.sort((a, b) => b.createdAt - a.createdAt);
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  }
);

// Editor selectors
export const selectTextFormatting = (state: RootState) =>
  state.editor.textEditor.currentFormatting;

export const selectCanUndo = (state: RootState) =>
  state.editor.textEditor.historyIndex > 0;

export const selectCanRedo = (state: RootState) =>
  state.editor.textEditor.historyIndex <
  state.editor.textEditor.history.length - 1;

export const selectDrawingTool = (state: RootState) =>
  state.editor.drawingEditor.selectedTool;

export const selectBrushSettings = createSelector(
  [(state: RootState) => state.editor.drawingEditor],
  (drawing) => ({
    size: drawing.brushSize,
    color: drawing.brushColor,
  })
);

// Voice selectors
export const selectIsListening = (state: RootState) =>
  state.voice.stt.isListening;

export const selectIsSpeaking = (state: RootState) =>
  state.voice.tts.isPlaying;

export const selectTTSSettings = createSelector(
  [(state: RootState) => state.voice.tts],
  (tts) => ({
    rate: tts.rate,
    pitch: tts.pitch,
    voice: tts.voice,
  })
);
```

## Usage in Components

### Using typed hooks

```typescript
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';
import {setFilter, selectSortedNotes} from '@/redux';

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const notes = useAppSelector(selectSortedNotes);

  const handleFilterChange = (filter: NoteFilter) => {
    dispatch(setFilter(filter));
  };

  return (
    // ...
  );
};
```

### Async operations

```typescript
import {loadNotes, saveNote} from '@/redux/notesSlice';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadNotes());
  }, [dispatch]);

  const handleSaveNote = async (note: Note) => {
    await dispatch(saveNote(note)).unwrap();
  };
};
```

## Best Practices

1. **Use typed hooks** - Always use `useAppDispatch` and `useAppSelector`
2. **Use selectors** - Create reusable selectors for derived state
3. **Use createAsyncThunk** - For async operations with loading states
4. **Normalize state** - Keep state flat and normalized
5. **Immutable updates** - Redux Toolkit uses Immer internally
6. **Action naming** - Use past tense (e.g., `noteCreated`)
7. **Slice organization** - One slice per domain
8. **Middleware** - Configure for non-serializable values if needed
9. **Error handling** - Always handle rejected promises
10. **Performance** - Use memoized selectors for expensive computations
