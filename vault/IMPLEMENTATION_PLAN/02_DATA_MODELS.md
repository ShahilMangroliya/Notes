# Data Models and Types

## Overview

All TypeScript type definitions for the Notes app, following strict typing principles.

## Core Note Types

### Note Interface

**File:** `src/types/note.ts`

```typescript
export interface Note {
  id: string;                    // UUID v4
  title: string;                 // Note title (max 200 chars)
  type: 'text' | 'drawing';      // Note type
  content: TextContent | DrawingContent;
  createdAt: number;             // Unix timestamp (milliseconds)
  updatedAt: number;             // Unix timestamp (milliseconds)
  color: string;                 // Hex color for note background
  isPinned: boolean;             // Pin to top of list
  tags: string[];                // Optional tags (future feature)
}
```

### Text Content Types

```typescript
export interface TextContent {
  type: 'text';
  blocks: TextBlock[];           // Array of text blocks
  version: number;               // Content version for undo/redo
}

export interface TextBlock {
  id: string;                    // UUID v4
  text: string;                  // Block content
  formatting: TextFormatting;    // Text formatting
  blockType: BlockType;          // Block type
}

export type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'bullet'
  | 'numbered';

export interface TextFormatting {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  fontSize: number;              // 12-32 (px)
  fontFamily: FontFamily;
  color: string;                 // Hex color
  backgroundColor?: string;      // Optional highlight color
}

export type FontFamily = 'system' | 'serif' | 'monospace';
```

### Drawing Content Types

```typescript
export interface DrawingContent {
  type: 'drawing';
  strokes: DrawingStroke[];      // Array of strokes
  canvasSize: CanvasSize;        // Canvas dimensions
  backgroundColor: string;       // Canvas background color
}

export interface DrawingStroke {
  id: string;                    // UUID v4
  points: Point[];               // Stroke path points
  color: string;                 // Hex color
  width: number;                 // 1-50 (px)
  tool: 'pencil' | 'eraser';     // Tool used
  timestamp: number;             // When stroke was created
}

export interface Point {
  x: number;                     // X coordinate
  y: number;                     // Y coordinate
  pressure?: number;             // Pressure (0-1, optional)
}

export interface CanvasSize {
  width: number;
  height: number;
}
```

## Redux State Types

### Notes State

**File:** `src/redux/notesSlice.ts`

```typescript
export interface NotesState {
  notes: Note[];                 // All notes
  currentNote: Note | null;      // Currently editing/viewing
  filter: NoteFilter;            // Active filter
  searchQuery: string;           // Search text
  sortBy: SortOption;            // Sort criteria
  isLoading: boolean;            // Loading state
  error: string | null;          // Error message
}

export type NoteFilter = 'all' | 'text' | 'drawing' | 'pinned';

export type SortOption = 'updatedAt' | 'createdAt' | 'title';
```

### Editor State

**File:** `src/redux/editorSlice.ts`

```typescript
export interface EditorState {
  // Text editor state
  textEditor: TextEditorState;

  // Drawing editor state
  drawingEditor: DrawingEditorState;

  // Common state
  isDirty: boolean;              // Has unsaved changes
  lastSaved: number | null;      // Last save timestamp
}

export interface TextEditorState {
  selectedBlockId: string | null;     // Currently selected block
  cursorPosition: number;             // Cursor position in block
  currentFormatting: TextFormatting;  // Active formatting
  history: HistoryState[];            // Undo/redo history
  historyIndex: number;               // Current history position
  maxHistory: number;                 // Max history items (50)
}

export interface DrawingEditorState {
  selectedTool: 'pencil' | 'eraser';
  brushSize: number;                  // 1-50
  brushColor: string;                 // Hex color
  isDrawing: boolean;                 // Currently drawing
  currentStroke: Point[] | null;      // Stroke in progress
  history: DrawingHistoryState[];     // Undo/redo history
  historyIndex: number;               // Current history position
}

export interface HistoryState {
  content: TextContent;
  timestamp: number;
  description: string;           // Action description
}

export interface DrawingHistoryState {
  strokes: DrawingStroke[];
  timestamp: number;
  description: string;           // Action description
}
```

### Export State

**File:** `src/redux/exportSlice.ts`

```typescript
export interface ExportState {
  format: ExportFormat;
  isExporting: boolean;
  lastExportPath: string | null;
  error: string | null;
}

export type ExportFormat = 'pdf' | 'text' | 'image' | 'json';
```

### Voice State

**File:** `src/redux/voiceSlice.ts`

```typescript
export interface VoiceState {
  // Speech-to-text
  stt: {
    isListening: boolean;
    recognizedText: string;
    language: string;              // 'en-US', 'es-ES', etc.
    error: string | null;
  };

  // Text-to-speech
  tts: {
    isPlaying: boolean;
    progress: number;              // 0-100
    rate: number;                  // 0.5-2.0
    pitch: number;                 // 0.5-2.0
    voice: string | null;          // Voice ID
    error: string | null;
  };
}
```

## Navigation Types

**File:** `src/types/navigation.ts`

```typescript
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  NoteEditor: {
    noteId?: string;              // undefined = create new
    noteType: 'text' | 'drawing';
  };
  NoteView: {
    noteId: string;
  };
  Settings: undefined;
};

// Screen props helpers
export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;

export type NoteEditorScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NoteEditor'
>;

export type NoteViewScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NoteView'
>;

export type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Settings'
>;
```

## Component Props Types

### Common Props

```typescript
// Base button props
export interface BaseButtonProps {
  onPress: () => void;
  $disabled?: boolean;
  accessibilityLabel: string;
}

// Base input props
export interface BaseInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  $disabled?: boolean;
}
```

### Specific Component Props

**File:** Component-specific files (e.g., `src/components/ColorPicker/ColorPicker.tsx`)

```typescript
export interface ColorPickerProps {
  $selectedColor: string;
  onColorSelect: (color: string) => void;
  colors?: string[];             // Default palette if not provided
  $variant?: 'compact' | 'full';
}

export interface IconButtonProps extends BaseButtonProps {
  icon: string | React.ReactNode;
  $variant?: 'primary' | 'secondary' | 'ghost';
  $size?: 'small' | 'medium' | 'large';
  $active?: boolean;
}

export interface SliderProps {
  $min: number;
  $max: number;
  $value: number;
  onValueChange: (value: number) => void;
  $step?: number;
  label?: string;
  $showValue?: boolean;
}

export interface FABProps {
  onPress: () => void;
  icon: React.ReactNode;
  $position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  $size?: 'small' | 'medium' | 'large';
  label?: string;
}

export interface ModalProps {
  $visible: boolean;
  onClose: () => void;
  $variant?: 'center' | 'bottom-sheet';
  $dismissOnBackdrop?: boolean;
  children: React.ReactNode;
}

export interface ConfirmDialogProps {
  $visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  $confirmText?: string;
  $cancelText?: string;
  $destructive?: boolean;
}
```

### Screen-Specific Props

```typescript
export interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onLongPress?: () => void;
  onDelete: () => void;
  $selected?: boolean;
}

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export interface FilterBarProps {
  activeFilter: NoteFilter;
  onFilterChange: (filter: NoteFilter) => void;
  noteCount: Record<NoteFilter, number>;
}

export interface FormattingToolbarProps {
  formatting: TextFormatting;
  onFormattingChange: (formatting: Partial<TextFormatting>) => void;
  onVoiceInput?: () => void;
  $isVoiceListening?: boolean;
}

export interface TextBlockProps {
  block: TextBlock;
  onTextChange: (text: string) => void;
  onFormattingChange: (formatting: Partial<TextFormatting>) => void;
  $isSelected?: boolean;
  onSelect: () => void;
}
```

## Utility Types

### Storage Types

```typescript
export type StorageValue = boolean | string | number | ArrayBuffer;

export interface StorageKeys {
  THEME: 'notes.theme';
  NOTE_LIST: 'notes.list';
  NOTE_PREFIX: 'notes.';
  SETTINGS: 'notes.settings';
  VOICE_LANGUAGE: 'notes.voice.language';
  TTS_RATE: 'notes.tts.rate';
  TTS_PITCH: 'notes.tts.pitch';
  TTS_VOICE: 'notes.tts.voice';
}
```

### Export Types

```typescript
export interface ExportOptions {
  format: ExportFormat;
  includeMetadata?: boolean;
  quality?: number;              // For image export (0-100)
  pageSize?: 'A4' | 'Letter';    // For PDF export
}

export interface ExportResult {
  success: boolean;
  filePath?: string;
  error?: string;
}
```

### Voice Types

```typescript
export interface VoiceLanguage {
  code: string;                  // 'en-US'
  label: string;                 // 'English (US)'
}

export interface TTSVoice {
  id: string;
  name: string;
  language: string;
  gender?: 'male' | 'female';
}

export interface VoiceCommand {
  trigger: string;               // 'bold', 'new line', etc.
  action: () => void;
}
```

## Validation Types

```typescript
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// Note validation rules
export const NOTE_CONSTRAINTS = {
  TITLE_MAX_LENGTH: 200,
  TITLE_MIN_LENGTH: 1,
  MAX_BLOCKS: 1000,
  MAX_STROKES: 1000,
  MAX_HISTORY: 50,
  MIN_FONT_SIZE: 12,
  MAX_FONT_SIZE: 32,
  MIN_BRUSH_SIZE: 1,
  MAX_BRUSH_SIZE: 50,
} as const;
```

## Type Guards

```typescript
// Type guard for Note content
export const isTextContent = (
  content: TextContent | DrawingContent
): content is TextContent => {
  return content.type === 'text';
};

export const isDrawingContent = (
  content: TextContent | DrawingContent
): content is DrawingContent => {
  return content.type === 'drawing';
};

// Type guard for Note filter
export const isValidFilter = (value: string): value is NoteFilter => {
  return ['all', 'text', 'drawing', 'pinned'].includes(value);
};

// Type guard for Export format
export const isValidExportFormat = (value: string): value is ExportFormat => {
  return ['pdf', 'text', 'image', 'json'].includes(value);
};
```

## Default Values

```typescript
// Default text formatting
export const DEFAULT_TEXT_FORMATTING: TextFormatting = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  fontSize: 16,
  fontFamily: 'system',
  color: '#000000',
  backgroundColor: undefined,
};

// Default canvas size
export const DEFAULT_CANVAS_SIZE: CanvasSize = {
  width: 800,
  height: 1200,
};

// Default note colors
export const NOTE_COLORS = [
  '#FFFFFF', // White
  '#FFE5E5', // Light Red
  '#FFF4E5', // Light Orange
  '#FFFBE5', // Light Yellow
  '#E5F7E5', // Light Green
  '#E5F7FF', // Light Blue
  '#F0E5FF', // Light Purple
  '#FFE5F9', // Light Pink
] as const;

// Default brush sizes
export const BRUSH_SIZES = [1, 2, 4, 8, 12, 16, 24, 32, 40, 50] as const;

// Supported languages for voice input
export const VOICE_LANGUAGES: VoiceLanguage[] = [
  {code: 'en-US', label: 'English (US)'},
  {code: 'en-GB', label: 'English (UK)'},
  {code: 'es-ES', label: 'Spanish'},
  {code: 'fr-FR', label: 'French'},
  {code: 'de-DE', label: 'German'},
  {code: 'it-IT', label: 'Italian'},
  {code: 'pt-BR', label: 'Portuguese (Brazil)'},
  {code: 'ja-JP', label: 'Japanese'},
  {code: 'ko-KR', label: 'Korean'},
  {code: 'zh-CN', label: 'Chinese (Simplified)'},
];
```

## Type Usage Examples

### Creating a new text note

```typescript
import {v4 as uuidv4} from 'uuid';
import type {Note, TextContent, TextBlock} from '@/types/note';
import {DEFAULT_TEXT_FORMATTING} from '@/types/note';

const createTextNote = (title: string): Note => {
  const blockId = uuidv4();
  const noteId = uuidv4();
  const now = Date.now();

  const initialBlock: TextBlock = {
    id: blockId,
    text: '',
    formatting: DEFAULT_TEXT_FORMATTING,
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

### Creating a new drawing note

```typescript
const createDrawingNote = (title: string): Note => {
  const noteId = uuidv4();
  const now = Date.now();

  const content: DrawingContent = {
    type: 'drawing',
    strokes: [],
    canvasSize: DEFAULT_CANVAS_SIZE,
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

### Using type guards

```typescript
const renderNoteContent = (note: Note) => {
  if (isTextContent(note.content)) {
    // TypeScript knows content is TextContent
    return <TextRenderer blocks={note.content.blocks} />;
  } else {
    // TypeScript knows content is DrawingContent
    return <DrawingRenderer strokes={note.content.strokes} />;
  }
};
```

## Best Practices

1. **Always use explicit types** - Never use `any`
2. **Use type guards** - For runtime type checking
3. **Use const assertions** - For immutable arrays/objects
4. **Use readonly** - For immutable properties
5. **Use Pick/Omit** - For deriving types
6. **Export all types** - Make types reusable
7. **Document complex types** - Add JSDoc comments
8. **Use discriminated unions** - For content types
9. **Validate at boundaries** - User input, storage, network
10. **Use branded types** - For IDs (future enhancement)
