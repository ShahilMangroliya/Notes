import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import type {Note, NoteFilter, SortOption} from '@/types/note';
import StorageHelper from '@/util/StorageHelper';
import logger from '@/util/DebugLogger';

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
  logger.action('notes/loadNotes', 'pending');
  const noteIds = StorageHelper.getItem('notes.list', 'string') as string;
  const ids = noteIds ? JSON.parse(noteIds) : [];

  const notes: Note[] = [];
  for (const id of ids) {
    const noteData = StorageHelper.getItem(`notes.${id}`, 'string') as string;
    if (noteData) {
      notes.push(JSON.parse(noteData));
    }
  }
  logger.action('notes/loadNotes', 'fulfilled', {count: notes.length});
  return notes;
});

/**
 * Save a note to storage
 */
export const saveNote = createAsyncThunk(
  'notes/saveNote',
  async (note: Note) => {
    logger.action('notes/saveNote', 'pending', {noteId: note.id, title: note.title});
    StorageHelper.setItem(`notes.${note.id}`, JSON.stringify(note));

    const noteIds = StorageHelper.getItem('notes.list', 'string') as string;
    const ids = noteIds ? JSON.parse(noteIds) : [];

    if (!ids.includes(note.id)) {
      ids.push(note.id);
      StorageHelper.setItem('notes.list', JSON.stringify(ids));
    }

    logger.action('notes/saveNote', 'fulfilled', {noteId: note.id});
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
      const prevNoteId = state.currentNote?.id;
      const nextNoteId = action.payload?.id;
      logger.action('notes/setCurrentNote', action.payload, {
        prevNoteId,
        nextNoteId,
      });
      state.currentNote = action.payload;
      logger.reducer('notes', 'setCurrentNote', {prevNoteId}, {nextNoteId});
    },

    updateCurrentNote: (state, action: PayloadAction<Partial<Note>>) => {
      if (state.currentNote) {
        const prevNote = {...state.currentNote};
        state.currentNote = {
          ...state.currentNote,
          ...action.payload,
          updatedAt: Date.now(),
        };
        logger.action('notes/updateCurrentNote', action.payload, {
          noteId: state.currentNote.id,
        });
        logger.reducer('notes', 'updateCurrentNote', prevNote, state.currentNote);
      }
    },

    setFilter: (state, action: PayloadAction<NoteFilter>) => {
      logger.action('notes/setFilter', action.payload);
      state.filter = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      logger.action('notes/setSearchQuery', action.payload);
      state.searchQuery = action.payload;
    },

    setSortBy: (state, action: PayloadAction<SortOption>) => {
      logger.action('notes/setSortBy', action.payload);
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
      logger.reducer('notes', 'loadNotes.pending', state, {...state, isLoading: true});
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loadNotes.fulfilled, (state, action) => {
      logger.reducer('notes', 'loadNotes.fulfilled', state, {
        ...state,
        notes: action.payload,
        isLoading: false,
      });
      state.isLoading = false;
      state.notes = action.payload;
    });
    builder.addCase(loadNotes.rejected, (state, action) => {
      logger.error('notes/loadNotes.rejected', action.error as Error, {
        error: action.error.message,
      });
      state.isLoading = false;
      state.error = action.error.message || 'Failed to load notes';
    });

    // saveNote
    builder.addCase(saveNote.fulfilled, (state, action) => {
      const index = state.notes.findIndex(n => n.id === action.payload.id);
      const prevNotes = [...state.notes];
      if (index >= 0) {
        state.notes[index] = action.payload;
      } else {
        state.notes.push(action.payload);
      }
      logger.reducer('notes', 'saveNote.fulfilled', prevNotes, state.notes);
    });

    // deleteNote
    builder.addCase(deleteNote.fulfilled, (state, action) => {
      const prevNotes = [...state.notes];
      state.notes = state.notes.filter(n => n.id !== action.payload);
      if (state.currentNote?.id === action.payload) {
        state.currentNote = null;
      }
      logger.reducer('notes', 'deleteNote.fulfilled', prevNotes, state.notes);
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
