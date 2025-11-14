import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {TextFormatting, DrawingStroke} from '@/types/note';
import {DEFAULT_TEXT_FORMATTING} from '@/types/note';
import logger from '@/util/DebugLogger';

/**
 * Text editor state interface
 */
export interface TextEditorState {
  selectedBlockId: string | null;
  currentFormatting: TextFormatting;
  history: unknown[]; // Will be properly typed later with undo/redo system
  historyIndex: number;
  maxHistory: number;
}

/**
 * Drawing editor state interface
 */
export interface DrawingEditorState {
  selectedTool: 'pencil' | 'eraser';
  brushSize: number;
  brushColor: string;
  isDrawing: boolean;
  currentStroke: DrawingStroke | null;
  history: unknown[]; // Will be properly typed later with undo/redo system
  historyIndex: number;
}

/**
 * Editor state interface
 */
export interface EditorState {
  textEditor: TextEditorState;
  drawingEditor: DrawingEditorState;
  isDirty: boolean;
  lastSaved: number | null;
}

const initialState: EditorState = {
  textEditor: {
    selectedBlockId: null,
    currentFormatting: DEFAULT_TEXT_FORMATTING,
    history: [],
    historyIndex: -1,
    maxHistory: 50,
  },
  drawingEditor: {
    selectedTool: 'pencil',
    brushSize: 4,
    brushColor: '#000000',
    isDrawing: false,
    currentStroke: null,
    history: [],
    historyIndex: -1,
  },
  isDirty: false,
  lastSaved: null,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // Text editor actions
    setSelectedBlockId: (state, action: PayloadAction<string | null>) => {
      logger.action('editor/setSelectedBlockId', action.payload);
      state.textEditor.selectedBlockId = action.payload;
    },

    setTextFormatting: (state, action: PayloadAction<Partial<TextFormatting>>) => {
      logger.action('editor/setTextFormatting', action.payload);
      state.textEditor.currentFormatting = {
        ...state.textEditor.currentFormatting,
        ...action.payload,
      };
      state.isDirty = true;
    },

    toggleTextFormatting: (
      state,
      action: PayloadAction<'bold' | 'italic' | 'underline' | 'strikethrough'>,
    ) => {
      const key = action.payload;
      logger.action('editor/toggleTextFormatting', action.payload);
      state.textEditor.currentFormatting[key] =
        !state.textEditor.currentFormatting[key];
      state.isDirty = true;
    },

    resetTextFormatting: state => {
      logger.action('editor/resetTextFormatting');
      state.textEditor.currentFormatting = DEFAULT_TEXT_FORMATTING;
    },

    // Drawing editor actions
    setDrawingTool: (state, action: PayloadAction<'pencil' | 'eraser'>) => {
      state.drawingEditor.selectedTool = action.payload;
    },

    setBrushSize: (state, action: PayloadAction<number>) => {
      state.drawingEditor.brushSize = action.payload;
    },

    setBrushColor: (state, action: PayloadAction<string>) => {
      state.drawingEditor.brushColor = action.payload;
    },

    setIsDrawing: (state, action: PayloadAction<boolean>) => {
      state.drawingEditor.isDrawing = action.payload;
    },

    setCurrentStroke: (state, action: PayloadAction<DrawingStroke | null>) => {
      state.drawingEditor.currentStroke = action.payload;
    },

    // Common actions
    markDirty: state => {
      logger.action('editor/markDirty');
      state.isDirty = true;
    },

    markSaved: state => {
      logger.action('editor/markSaved');
      state.isDirty = false;
      state.lastSaved = Date.now();
    },

    resetEditor: () => {
      logger.action('editor/resetEditor');
      return initialState;
    },
  },
});

export const {
  setSelectedBlockId,
  setTextFormatting,
  toggleTextFormatting,
  resetTextFormatting,
  setDrawingTool,
  setBrushSize,
  setBrushColor,
  setIsDrawing,
  setCurrentStroke,
  markDirty,
  markSaved,
  resetEditor,
} = editorSlice.actions;

export default editorSlice.reducer;
