import {useCallback, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from './hooks';
import {updateCurrentNote} from '@/redux/notesSlice';
import {setTextFormatting, markDirty} from '@/redux/editorSlice';
import {selectCurrentNote} from '@/redux/selectors';
import logger from '@/util/DebugLogger';
import {
  applyFormattingRange,
  toggleFormattingProperty,
  adjustRangesForTextChange,
  getFormattingAtPosition,
  validateRanges,
} from '@/util/FormattingHelper';
import type {TextContent, FormattingRange, TextFormatting} from '@/types/note';

/**
 * useRichTextEditor Hook
 *
 * Custom hook for managing rich text editor state and operations with selection-based formatting.
 *
 * Features:
 * - Text content management
 * - Selection tracking
 * - Formatting application and toggling
 * - Font size adjustment
 * - Automatic range adjustment on text changes
 * - Validation and error handling
 *
 * Architecture:
 * - Uses Redux for state management
 * - Delegates formatting logic to FormattingHelper utilities
 * - Provides a clean API for the RichTextEditor component
 *
 * @returns Editor state and action handlers
 *
 * @example
 * ```tsx
 * const {
 *   text,
 *   formattingRanges,
 *   selection,
 *   currentFormatting,
 *   updateText,
 *   handleSelectionChange,
 *   toggleFormatting,
 *   changeFontSize,
 *   applyFormatting,
 * } = useRichTextEditor();
 * ```
 */
export const useRichTextEditor = () => {
  const dispatch = useAppDispatch();
  const currentNote = useAppSelector(selectCurrentNote);
  const [selection, setSelection] = useState({start: 0, end: 0});
  const [pendingFormatting, setPendingFormatting] = useState<Partial<TextFormatting>>({});

  logger.hook('useRichTextEditor', 'render', {
    hasCurrentNote: !!currentNote,
    noteId: currentNote?.id,
    selectionStart: selection.start,
    selectionEnd: selection.end,
  });

  /**
   * Gets text content from current note
   * Returns empty content if no note or non-text note
   */
  const textContent = useMemo(() => {
    if (!currentNote || currentNote.type !== 'text') {
      return {text: '', formattingRanges: []};
    }
    const content = currentNote.content as TextContent;

    // Validate ranges
    const ranges = content.formattingRanges || [];
    const errors = validateRanges(ranges, content.text?.length || 0);
    if (errors.length > 0) {
      logger.warn('Invalid formatting ranges detected:', {errors});
    }

    return {
      text: content.text || '',
      formattingRanges: ranges,
    };
  }, [currentNote]);

  /**
   * Gets formatting for current selection
   * Returns merged formatting from all overlapping ranges
   * If no selection, returns pending formatting for new text
   */
  const getSelectionFormatting = useCallback((): Partial<TextFormatting> => {
    if (selection.start === selection.end) {
      // No selection - return pending formatting (for new text)
      // Or get formatting at cursor position
      if (Object.keys(pendingFormatting).length > 0) {
        return pendingFormatting;
      }

      if (selection.start > 0) {
        return getFormattingAtPosition(
          textContent.formattingRanges,
          selection.start - 1,
        );
      }
      return {};
    }

    // Get formatting at start of selection
    return getFormattingAtPosition(textContent.formattingRanges, selection.start);
  }, [selection, textContent.formattingRanges, pendingFormatting]);

  /**
   * Applies formatting to the current selection
   *
   * @param formatting - Formatting to apply
   */
  const applyFormatting = useCallback(
    (formatting: Partial<TextFormatting>) => {
      if (!currentNote || currentNote.type !== 'text') {
        logger.warn('applyFormatting: No valid text note');
        return;
      }

      if (selection.start === selection.end) {
        // No selection - buttons should be disabled in UI
        return;
      }

      logger.callback('useRichTextEditor', 'applyFormatting', {
        start: selection.start,
        end: selection.end,
        formatting,
      });

      const content = currentNote.content as TextContent;

      // Create new formatting range
      const newRange: FormattingRange = {
        start: selection.start,
        end: selection.end,
        formatting,
      };

      // Apply the range using helper function
      const updatedRanges = applyFormattingRange(
        content.formattingRanges || [],
        newRange,
      );

      logger.callback('useRichTextEditor', 'applyFormatting.result', {
        rangeCount: updatedRanges.length,
        newRange,
      });

      // Update note content
      dispatch(
        updateCurrentNote({
          content: {
            ...content,
            formattingRanges: updatedRanges,
          },
        }),
      );
      dispatch(markDirty());

      // Update global formatting state for toolbar
      dispatch(setTextFormatting(formatting as TextFormatting));
    },
    [currentNote, selection, dispatch],
  );

  /**
   * Toggles a boolean formatting property (bold, italic, etc.)
   * Works with both selected text and pending formatting for new text
   *
   * @param property - Property to toggle
   */
  const toggleFormatting = useCallback(
    (
      property: keyof Pick<
        TextFormatting,
        'bold' | 'italic' | 'underline' | 'strikethrough'
      >,
    ) => {
      if (!currentNote || currentNote.type !== 'text') {
        logger.warn('toggleFormatting: No valid text note');
        return;
      }

      // No selection - toggle pending formatting for new text
      if (selection.start === selection.end) {
        logger.callback('useRichTextEditor', 'toggleFormatting.pending', {
          property,
          currentPending: pendingFormatting,
        });

        const currentValue = (pendingFormatting[property] as boolean) || false;
        const newPending = {
          ...pendingFormatting,
          [property]: !currentValue,
        };

        setPendingFormatting(newPending);

        // Update global formatting state for toolbar
        dispatch(setTextFormatting(newPending as Partial<TextFormatting> as TextFormatting));
        return;
      }

      logger.callback('useRichTextEditor', 'toggleFormatting', {
        property,
        start: selection.start,
        end: selection.end,
      });

      const content = currentNote.content as TextContent;

      // Toggle the property using helper function
      const updatedRanges = toggleFormattingProperty(
        content.formattingRanges || [],
        selection.start,
        selection.end,
        property,
      );

      // Update note content
      dispatch(
        updateCurrentNote({
          content: {
            ...content,
            formattingRanges: updatedRanges,
          },
        }),
      );
      dispatch(markDirty());

      // Update global formatting state for toolbar
      const newFormatting = getFormattingAtPosition(updatedRanges, selection.start);
      dispatch(setTextFormatting(newFormatting as TextFormatting));
    },
    [currentNote, selection, dispatch, pendingFormatting],
  );

  /**
   * Changes font size for the current selection or pending formatting
   *
   * @param delta - Amount to change font size by (positive or negative)
   */
  const changeFontSize = useCallback(
    (delta: number) => {
      if (!currentNote || currentNote.type !== 'text') {
        logger.warn('changeFontSize: No valid text note');
        return;
      }

      const currentFormatting = getSelectionFormatting();
      const currentSize = (currentFormatting.fontSize as number) || 16;
      const newSize = Math.max(12, Math.min(32, currentSize + delta));

      logger.callback('useRichTextEditor', 'changeFontSize', {
        delta,
        currentSize,
        newSize,
      });

      // No selection - update pending formatting
      if (selection.start === selection.end) {
        setPendingFormatting(prev => ({
          ...prev,
          fontSize: newSize,
        }));
        dispatch(setTextFormatting({fontSize: newSize} as TextFormatting));
        return;
      }

      applyFormatting({
        fontSize: newSize,
      });
    },
    [currentNote, selection, getSelectionFormatting, applyFormatting, dispatch],
  );

  /**
   * Updates text content and adjusts formatting ranges accordingly
   * Applies pending formatting to newly typed text
   *
   * @param newText - New text content
   */
  const updateText = useCallback(
    (newText: string) => {
      if (!currentNote || currentNote.type !== 'text') {
        logger.warn('updateText: No valid text note');
        return;
      }

      const content = currentNote.content as TextContent;
      const oldText = content.text || '';
      const textDelta = newText.length - oldText.length;

      logger.callback('useRichTextEditor', 'updateText', {
        oldLength: oldText.length,
        newLength: newText.length,
        delta: textDelta,
        selectionStart: selection.start,
        hasPendingFormatting: Object.keys(pendingFormatting).length > 0,
      });

      // Adjust formatting ranges based on text changes
      let updatedRanges = adjustRangesForTextChange(
        content.formattingRanges || [],
        selection.start,
        textDelta,
      );

      // Apply pending formatting to newly typed text
      if (textDelta > 0 && Object.keys(pendingFormatting).length > 0) {
        logger.callback('useRichTextEditor', 'updateText.applyPending', {
          start: selection.start,
          end: selection.start + textDelta,
          formatting: pendingFormatting,
        });

        const newRange: FormattingRange = {
          start: selection.start,
          end: selection.start + textDelta,
          formatting: pendingFormatting,
        };

        updatedRanges = applyFormattingRange(updatedRanges, newRange);

        // Clear pending formatting after applying
        setPendingFormatting({});
      }

      // Validate adjusted ranges
      const errors = validateRanges(updatedRanges, newText.length);
      if (errors.length > 0) {
        logger.warn('Invalid ranges after text update:', {errors});
      }

      // Update note content
      dispatch(
        updateCurrentNote({
          content: {
            ...content,
            text: newText,
            formattingRanges: updatedRanges,
          },
        }),
      );
      dispatch(markDirty());
    },
    [currentNote, selection, dispatch, pendingFormatting],
  );

  /**
   * Handles selection changes from the editor
   *
   * @param start - Selection start position
   * @param end - Selection end position
   */
  const handleSelectionChange = useCallback(
    (start: number, end: number) => {
      // Validate selection bounds
      if (start < 0 || end < 0 || start > end) {
        logger.warn('Invalid selection:', {start, end});
        return;
      }

      logger.callback('useRichTextEditor', 'handleSelectionChange', {
        start,
        end,
        hasSelection: start !== end,
      });

      setSelection({start, end});

      // Update toolbar to reflect formatting at selection
      const formatting = getFormattingAtPosition(
        textContent.formattingRanges,
        start,
      );
      if (Object.keys(formatting).length > 0) {
        dispatch(setTextFormatting(formatting as TextFormatting));
      }
    },
    [textContent.formattingRanges, dispatch],
  );

  return {
    // State
    text: textContent.text,
    formattingRanges: textContent.formattingRanges,
    selection,
    currentFormatting: getSelectionFormatting(),

    // Actions
    updateText,
    handleSelectionChange,
    toggleFormatting,
    changeFontSize,
    applyFormatting,
  };
};

export default useRichTextEditor;

