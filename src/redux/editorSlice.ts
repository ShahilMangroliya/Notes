import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {DrawingStroke} from '@/types/note';
import logger from '@/util/DebugLogger';

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
  drawingEditor: DrawingEditorState;
  isDirty: boolean;
  lastSaved: number | null;
}

const initialState: EditorState = {
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
