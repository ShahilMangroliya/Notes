# Vibe Code Guide - Part 3: Utility Helpers

## Task: Create Utility Helper Functions

Create pure utility functions for note operations, UUID generation, and permissions.

## File 1: `src/util/NoteHelper.ts`

### Instructions for AI Model

Create helper functions for note creation and validation. Use these imports:

```typescript
import {v4 as uuidv4} from 'uuid';
import type {Note, TextContent, DrawingContent, TextBlock} from '@/types/note';
import {DEFAULT_TEXT_FORMATTING, DEFAULT_CANVAS_SIZE} from '@/types/note';
```

### Function 1: Create Text Note

```typescript
/**
 * Creates a new text note with default content
 * @param title - Note title
 * @returns New Note object with text content
 */
export const createTextNote = (title: string): Note => {
  const blockId = uuidv4();
  const noteId = uuidv4();
  const now = Date.now();

  const initialBlock: TextBlock = {
    id: blockId,
    text: '',
    formatting: {...DEFAULT_TEXT_FORMATTING},
    blockType: 'paragraph',
  };

  const content: TextContent = {
    type: 'text',
    blocks: [initialBlock],
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
```

### Function 2: Create Drawing Note

```typescript
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
```

### Function 3: Update Timestamp

```typescript
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
```

### Function 4: Validate Note

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

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
    if (textContent.blocks.length > 1000) {
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
```

### Export

```typescript
export default {
  createTextNote,
  createDrawingNote,
  updateNoteTimestamp,
  validateNote,
};
```

## File 2: `src/util/uuid.ts`

### Instructions

Create a simple UUID wrapper:

```typescript
import {v4 as uuidv4} from 'uuid';

/**
 * Generates a UUID v4
 * @returns UUID string
 */
export const generateId = (): string => {
  return uuidv4();
};

export default generateId;
```

## File 3: `src/util/PermissionHelper.ts`

### Instructions

Create permission helper for microphone access:

```typescript
import {PermissionsAndroid, Platform, Alert, Linking} from 'react-native';

/**
 * Requests microphone permission
 * @returns Promise<boolean> - true if granted
 */
export const requestMicrophonePermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'Notes app needs access to your microphone for voice input',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      return false;
    }
  }
  // iOS permissions are handled via Info.plist
  return true;
};

/**
 * Checks if microphone permission is granted
 * @returns Promise<boolean> - true if granted
 */
export const checkMicrophonePermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      return granted;
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      return false;
    }
  }
  return true;
};

/**
 * Shows permission denied alert with option to open settings
 */
export const showPermissionDeniedAlert = (): void => {
  Alert.alert(
    'Permission Required',
    'Microphone permission is required for voice input. Please enable it in Settings.',
    [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Open Settings', onPress: () => Linking.openSettings()},
    ]
  );
};

export default {
  requestMicrophonePermission,
  checkMicrophonePermission,
  showPermissionDeniedAlert,
};
```

## File 4: Update `src/util/StorageHelper.ts`

### Instructions

Add new storage key constants to the existing file:

```typescript
// Add these constants to the existing file
export const NOTES_LIST_KEY = 'notes.list';
export const NOTE_PREFIX = 'notes.';
export const VOICE_LANGUAGE_KEY = 'notes.voice.language';
export const TTS_RATE_KEY = 'notes.tts.rate';
export const TTS_PITCH_KEY = 'notes.tts.pitch';
export const TTS_VOICE_KEY = 'notes.tts.voice';

// Helper function to get note key
export const getNoteKey = (noteId: string): string => {
  return `${NOTE_PREFIX}${noteId}`;
};
```

## Verification Checklist

- [ ] All functions are pure (no side effects except storage/permissions)
- [ ] All functions have JSDoc comments
- [ ] All imports use `@/` alias
- [ ] UUID generation works
- [ ] Validation function covers all cases
- [ ] Permission helper handles both platforms
- [ ] TypeScript compiles without errors
- [ ] No `any` types used

## Usage Examples

### Creating Notes

```typescript
import NoteHelper from '@/util/NoteHelper';

// Create text note
const textNote = NoteHelper.createTextNote('My Note');

// Create drawing note
const drawingNote = NoteHelper.createDrawingNote('My Drawing');

// Validate note
const result = NoteHelper.validateNote(note);
if (!result.isValid) {
  console.error('Validation errors:', result.errors);
}
```

### Requesting Permissions

```typescript
import PermissionHelper from '@/util/PermissionHelper';

const hasPermission = await PermissionHelper.requestMicrophonePermission();
if (!hasPermission) {
  PermissionHelper.showPermissionDeniedAlert();
}
```

## Next Step

Proceed to **Part 4: Base Components**.
