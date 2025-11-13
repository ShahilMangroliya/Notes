# Vibe Code Guide - Part 1: Type Definitions

## Task: Create TypeScript Type Definitions

Create all TypeScript type definitions for the Notes app in strict mode (no `any` types).

## File to Create: `src/types/note.ts`

### Instructions for AI Model

Generate a TypeScript file with the following type definitions. Follow these rules:
- Use `export` for all types
- Use `interface` for object types
- Use `type` for unions
- Use `as const` for constant arrays
- Add JSDoc comments for complex types

### Required Types

#### 1. Core Note Interface

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

#### 2. Text Content Types

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

#### 3. Drawing Content Types

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

#### 4. Default Values

```typescript
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

export const DEFAULT_CANVAS_SIZE: CanvasSize = {
  width: 800,
  height: 1200,
};

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

export const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24, 28, 32] as const;

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

#### 5. Type Guards

```typescript
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
```

#### 6. Filter and Sort Types

```typescript
export type NoteFilter = 'all' | 'text' | 'drawing' | 'pinned';
export type SortOption = 'updatedAt' | 'createdAt' | 'title';
export type ExportFormat = 'pdf' | 'text' | 'image' | 'json';
```

## File to Create: `src/types/navigation.ts`

### Instructions

Generate navigation types for React Navigation v7.

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
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type NoteEditorScreenProps = NativeStackScreenProps<RootStackParamList, 'NoteEditor'>;
export type NoteViewScreenProps = NativeStackScreenProps<RootStackParamList, 'NoteView'>;
export type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;
```

## Verification Checklist

After generating types, verify:
- [ ] No `any` types used
- [ ] All exports are explicit
- [ ] All interfaces have proper JSDoc comments
- [ ] Type guards are correctly implemented
- [ ] Constants use `as const`
- [ ] File compiles without TypeScript errors

## Next Step

Once types are created and verified, proceed to **Part 2: Redux Slices**.
