import {useEffect, useCallback} from 'react';
import {useAppDispatch, useAppSelector} from './hooks';
import {
  loadNotes,
  saveNote,
  deleteNote,
  setFilter,
  setSearchQuery,
  setSortBy,
  togglePinNote,
  updateNoteColor,
} from '@/redux/notesSlice';
import {
  selectSortedNotes,
  selectFilter,
  selectSearchQuery,
  selectSortBy,
  selectNotesLoading,
  selectNotesError,
  selectNoteCounts,
} from '@/redux/selectors';
import type {Note, NoteFilter, SortOption} from '@/types/note';

/**
 * Custom hook for managing notes state and operations
 *
 * @example
 * ```tsx
 * const {
 *   notes,
 *   filter,
 *   searchQuery,
 *   isLoading,
 *   counts,
 *   setFilter,
 *   setSearchQuery,
 *   saveNote,
 *   deleteNote,
 * } = useNotes();
 * ```
 */
export const useNotes = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const notes = useAppSelector(selectSortedNotes);
  const filter = useAppSelector(selectFilter);
  const searchQuery = useAppSelector(selectSearchQuery);
  const sortBy = useAppSelector(selectSortBy);
  const isLoading = useAppSelector(selectNotesLoading);
  const error = useAppSelector(selectNotesError);
  const counts = useAppSelector(selectNoteCounts);

  // Load notes on mount
  useEffect(() => {
    dispatch(loadNotes());
  }, [dispatch]);

  // Actions
  const handleSetFilter = useCallback(
    (newFilter: NoteFilter) => {
      dispatch(setFilter(newFilter));
    },
    [dispatch],
  );

  const handleSetSearchQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch],
  );

  const handleSetSortBy = useCallback(
    (sort: SortOption) => {
      dispatch(setSortBy(sort));
    },
    [dispatch],
  );

  const handleSaveNote = useCallback(
    async (note: Note) => {
      await dispatch(saveNote(note));
    },
    [dispatch],
  );

  const handleDeleteNote = useCallback(
    async (noteId: string) => {
      await dispatch(deleteNote(noteId));
    },
    [dispatch],
  );

  const handleTogglePin = useCallback(
    (noteId: string) => {
      dispatch(togglePinNote(noteId));
    },
    [dispatch],
  );

  const handleUpdateColor = useCallback(
    (noteId: string, color: string) => {
      dispatch(updateNoteColor({id: noteId, color}));
    },
    [dispatch],
  );

  return {
    // Data
    notes,
    filter,
    searchQuery,
    sortBy,
    isLoading,
    error,
    counts,

    // Actions
    setFilter: handleSetFilter,
    setSearchQuery: handleSetSearchQuery,
    setSortBy: handleSetSortBy,
    saveNote: handleSaveNote,
    deleteNote: handleDeleteNote,
    togglePin: handleTogglePin,
    updateColor: handleUpdateColor,
  };
};

export default useNotes;
