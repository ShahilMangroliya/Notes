import {createSelector} from '@reduxjs/toolkit';
import type {RootState} from './store';
import {isTextContent} from '@/types/note';

/**
 * Base selectors
 */
export const selectAllNotes = (state: RootState) => state.notes.notes;
export const selectCurrentNote = (state: RootState) => state.notes.currentNote;
export const selectFilter = (state: RootState) => state.notes.filter;
export const selectSearchQuery = (state: RootState) => state.notes.searchQuery;
export const selectSortBy = (state: RootState) => state.notes.sortBy;
export const selectNotesLoading = (state: RootState) => state.notes.isLoading;
export const selectNotesError = (state: RootState) => state.notes.error;

/**
 * Editor selectors
 */
export const selectTextEditor = (state: RootState) => state.editor.textEditor;
export const selectDrawingEditor = (state: RootState) =>
  state.editor.drawingEditor;
export const selectCurrentFormatting = (state: RootState) =>
  state.editor.textEditor.currentFormatting;
export const selectSelectedTool = (state: RootState) =>
  state.editor.drawingEditor.selectedTool;
export const selectBrushSize = (state: RootState) =>
  state.editor.drawingEditor.brushSize;
export const selectBrushColor = (state: RootState) =>
  state.editor.drawingEditor.brushColor;
export const selectIsDirty = (state: RootState) => state.editor.isDirty;
export const selectLastSaved = (state: RootState) => state.editor.lastSaved;

/**
 * Voice selectors
 */
export const selectSTTState = (state: RootState) => state.voice.stt;
export const selectTTSState = (state: RootState) => state.voice.tts;
export const selectIsListening = (state: RootState) =>
  state.voice.stt.isListening;
export const selectRecognizedText = (state: RootState) =>
  state.voice.stt.recognizedText;
export const selectIsPlaying = (state: RootState) => state.voice.tts.isPlaying;

/**
 * Memoized selector: Filter notes by type and pinned status
 */
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
        // Search in title
        if (note.title.toLowerCase().includes(query)) return true;

        // Search in text content
        if (note.type === 'text' && isTextContent(note.content)) {
          return note.content.blocks?.some(block =>
            block.text.toLowerCase().includes(query),
          ) || false;
        }

        return false;
      });
    }

    return filtered;
  },
);

/**
 * Memoized selector: Sort filtered notes
 */
export const selectSortedNotes = createSelector(
  [selectFilteredNotes, selectSortBy],
  (notes, sortBy) => {
    const sorted = [...notes];

    // Sort pinned notes to the top first
    const pinned = sorted.filter(note => note.isPinned);
    const unpinned = sorted.filter(note => !note.isPinned);

    // Sort each group
    const sortFn = (a: typeof sorted[0], b: typeof sorted[0]) => {
      switch (sortBy) {
        case 'updatedAt':
          return b.updatedAt - a.updatedAt;
        case 'createdAt':
          return b.createdAt - a.createdAt;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    };

    pinned.sort(sortFn);
    unpinned.sort(sortFn);

    return [...pinned, ...unpinned];
  },
);

/**
 * Memoized selector: Get note by ID
 */
export const selectNoteById = (noteId: string) =>
  createSelector([selectAllNotes], notes =>
    notes.find(note => note.id === noteId),
  );

/**
 * Memoized selector: Count notes by type
 */
export const selectNoteCounts = createSelector([selectAllNotes], notes => {
  return {
    all: notes.length,
    text: notes.filter(note => note.type === 'text').length,
    drawing: notes.filter(note => note.type === 'drawing').length,
    pinned: notes.filter(note => note.isPinned).length,
  };
});
