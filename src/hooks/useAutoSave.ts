import {useEffect, useRef, useCallback, useState} from 'react';
import {useAppDispatch} from '@/hooks/hooks';
import {saveNote} from '@/redux/notesSlice';
import type {Note} from '@/types/note';
import logger from '@/util/DebugLogger';

/**
 * Auto-save configuration
 */
export interface AutoSaveConfig {
  /** Delay in milliseconds before auto-saving (default: 1500ms) */
  delay?: number;
  /** Enable/disable auto-save (default: true) */
  enabled?: boolean;
}

/**
 * Auto-save hook result
 */
export interface AutoSaveResult {
  /** Whether auto-save is currently in progress */
  isSaving: boolean;
  /** Timestamp of last successful save */
  lastSaved: number | null;
  /** Manually trigger save (bypasses debounce) */
  saveNow: () => Promise<void>;
}

/**
 * Custom hook for auto-saving notes with debouncing
 *
 * Automatically saves a note after the user stops making changes for a specified delay.
 * Uses debouncing to prevent excessive saves during rapid edits.
 *
 * @param note - The note to auto-save
 * @param dependencies - Values that trigger auto-save when changed (e.g., title, content)
 * @param config - Auto-save configuration options
 *
 * @example
 * ```tsx
 * const {isSaving, lastSaved, saveNow} = useAutoSave(
 *   currentNote,
 *   [title, htmlContent],
 *   {delay: 2000}
 * );
 * ```
 */
export const useAutoSave = (
  note: Note | null,
  dependencies: unknown[],
  config: AutoSaveConfig = {},
): AutoSaveResult => {
  const {delay = 1500, enabled = true} = config;
  const dispatch = useAppDispatch();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const isInitialMount = useRef(true);

  const performSave = useCallback(async () => {
    if (!note) return;

    logger.callback('useAutoSave', 'performSave', {noteId: note.id});
    setIsSaving(true);

    try {
      await dispatch(saveNote(note));
      setLastSaved(Date.now());
      logger.callback('useAutoSave', 'performSave.success', {noteId: note.id});
    } catch (error) {
      logger.error('useAutoSave', error as Error, {noteId: note.id});
    } finally {
      setIsSaving(false);
    }
  }, [note, dispatch]);

  const saveNow = useCallback(async () => {
    // Cancel any pending auto-save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    await performSave();
  }, [performSave]);

  useEffect(() => {
    // Skip auto-save on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Skip if auto-save is disabled or note is null
    if (!enabled || !note) {
      return;
    }

    logger.effect('useAutoSave', 'schedule-save', {
      delay,
      noteId: note.id,
    });

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule auto-save
    timeoutRef.current = setTimeout(() => {
      performSave();
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, enabled, delay]);

  return {
    isSaving,
    lastSaved,
    saveNow,
  };
};

export default useAutoSave;
