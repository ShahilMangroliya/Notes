import {v4 as uuidv4} from 'uuid';
import type {Note, TextContent, DrawingContent, TextBlock} from '@/types/note';
import {DEFAULT_TEXT_FORMATTING, DEFAULT_CANVAS_SIZE} from '@/types/note';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Creates a new text note with default content
 * @param title - Note title
 * @returns New Note object with text content
 */
export const createTextNote = (title: string): Note => {
  const noteId = uuidv4();
  const now = Date.now();

  const content: TextContent = {
    type: 'text',
    text: '', // Plain text content
    formattingRanges: [], // Formatting ranges for selection-based formatting
    version: 1,
  };

  return {
    id: noteId,
    title,
    type: 'text',
    content,
    createdAt: now,
    updatedAt: now,
    color: '#FFFFFF',
    isPinned: false,
    tags: [],
  };
};

/**
 * Creates a new drawing note with empty canvas
 * @param title - Note title
 * @returns New Note object with drawing content
 */
export const createDrawingNote = (title: string): Note => {
  const noteId = uuidv4();
  const now = Date.now();

  const content: DrawingContent = {
    type: 'drawing',
    strokes: [],
    canvasSize: {...DEFAULT_CANVAS_SIZE},
    backgroundColor: '#FFFFFF',
  };

  return {
    id: noteId,
    title,
    type: 'drawing',
    content,
    createdAt: now,
    updatedAt: now,
    color: '#FFFFFF',
    isPinned: false,
    tags: [],
  };
};

/**
 * Updates the updatedAt timestamp of a note
 * @param note - Note to update
 * @returns Updated note
 */
export const updateNoteTimestamp = (note: Note): Note => {
  return {
    ...note,
    updatedAt: Date.now(),
  };
};

/**
 * Validates a note object
 * @param note - Note to validate
 * @returns Validation result with errors
 */
export const validateNote = (note: Note): ValidationResult => {
  const errors: string[] = [];

  if (!note.id || note.id.trim() === '') {
    errors.push('Note ID is required');
  }

  if (!note.title || note.title.trim() === '') {
    errors.push('Note title is required');
  }

  if (note.title.length > 200) {
    errors.push('Note title cannot exceed 200 characters');
  }

  if (!note.type || !['text', 'drawing'].includes(note.type)) {
    errors.push('Invalid note type');
  }

  if (note.type === 'text') {
    const textContent = note.content as TextContent;
    if (!textContent.blocks || textContent.blocks.length === 0) {
      errors.push('Text note must have at least one block');
    }
    if (textContent.blocks && textContent.blocks.length > 1000) {
      errors.push('Text note cannot have more than 1000 blocks');
    }
  }

  if (note.type === 'drawing') {
    const drawingContent = note.content as DrawingContent;
    if (drawingContent.strokes.length > 1000) {
      errors.push('Drawing cannot have more than 1000 strokes');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  createTextNote,
  createDrawingNote,
  updateNoteTimestamp,
  validateNote,
};
