import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import type {Note, NoteFilter, SortOption} from '@/types/note';
import StorageHelper from '@/util/StorageHelper';

/**
 * Notes state interface
 */
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

/**
 * Load all notes from storage
 */
export const loadNotes = createAsyncThunk('notes/loadNotes', async () => {
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
});

/**
 * Save a note to storage
 */
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
  },
);

/**
 * Delete a note from storage
 */
export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (noteId: string) => {
    StorageHelper.removeItem(`notes.${noteId}`);

    const noteIds = StorageHelper.getItem('notes.list', 'string') as string;
    const ids = noteIds ? JSON.parse(noteIds) : [];
    const updatedIds = ids.filter((id: string) => id !== noteId);
    StorageHelper.setItem('notes.list', JSON.stringify(updatedIds));

    return noteId;
  },
);

const notesSlice = createSlice({
  name: 'notes',
  initialState,
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

    updateNoteColor: (
      state,
      action: PayloadAction<{id: string; color: string}>,
    ) => {
      const note = state.notes.find(n => n.id === action.payload.id);
      if (note) {
        note.color = action.payload.color;
        note.updatedAt = Date.now();
      }
    },

    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // loadNotes
    builder.addCase(loadNotes.pending, state => {
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
