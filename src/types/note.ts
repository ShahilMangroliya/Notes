/**
 * Core Note interface representing a single note
 */
export interface Note {
  id: string; // UUID v4
  title: string; // Note title (max 200 chars)
  type: 'text' | 'drawing'; // Note type
  content: TextContent | DrawingContent;
  createdAt: number; // Unix timestamp (milliseconds)
  updatedAt: number; // Unix timestamp (milliseconds)
  color: string; // Hex color for note background
  isPinned: boolean; // Pin to top of list
  tags: string[]; // Optional tags (future feature)
}

/**
 * Text content structure for text notes
 */
export interface TextContent {
  type: 'text';
  blocks: TextBlock[]; // Array of text blocks
  version: number; // Content version for undo/redo
}

/**
 * Individual text block within a text note
 */
export interface TextBlock {
  id: string; // UUID v4
  text: string; // Block content
  formatting: TextFormatting; // Text formatting
  blockType: BlockType; // Block type
}

/**
 * Block type enumeration
 */
export type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'bullet'
  | 'numbered';

/**
 * Text formatting options
 */
export interface TextFormatting {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  fontSize: number; // 12-32 (px)
  fontFamily: FontFamily;
  color: string; // Hex color
  backgroundColor?: string; // Optional highlight color
}

/**
 * Font family options
 */
export type FontFamily = 'system' | 'serif' | 'monospace';

/**
 * Drawing content structure for drawing notes
 */
export interface DrawingContent {
  type: 'drawing';
  strokes: DrawingStroke[]; // Array of strokes
  canvasSize: CanvasSize; // Canvas dimensions
  backgroundColor: string; // Canvas background color
}

/**
 * Individual drawing stroke
 */
export interface DrawingStroke {
  id: string; // UUID v4
  points: Point[]; // Stroke path points
  color: string; // Hex color
  width: number; // 1-50 (px)
  tool: 'pencil' | 'eraser'; // Tool used
  timestamp: number; // When stroke was created
}

/**
 * Point in 2D space
 */
export interface Point {
  x: number; // X coordinate
  y: number; // Y coordinate
  pressure?: number; // Pressure (0-1, optional)
}

/**
 * Canvas size dimensions
 */
export interface CanvasSize {
  width: number;
  height: number;
}

/**
 * Note filter options
 */
export type NoteFilter = 'all' | 'text' | 'drawing' | 'pinned';

/**
 * Note sort options
 */
export type SortOption = 'updatedAt' | 'createdAt' | 'title';

/**
 * Export format options
 */
export type ExportFormat = 'pdf' | 'text' | 'image' | 'json';

/**
 * Default text formatting
 */
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

/**
 * Default canvas size
 */
export const DEFAULT_CANVAS_SIZE: CanvasSize = {
  width: 800,
  height: 1200,
};

/**
 * Predefined note colors
 */
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

/**
 * Available font sizes
 */
export const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24, 28, 32] as const;

/**
 * Note validation constraints
 */
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

/**
 * Type guard to check if content is TextContent
 */
export const isTextContent = (
  content: TextContent | DrawingContent,
): content is TextContent => {
  return content.type === 'text';
};

/**
 * Type guard to check if content is DrawingContent
 */
export const isDrawingContent = (
  content: TextContent | DrawingContent,
): content is DrawingContent => {
  return content.type === 'drawing';
};
