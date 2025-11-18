import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type {Note, ExportFormat} from '@/types/note';
import {
  exportNote,
  exportAndShare,
  exportDrawingToImage,
  exportDrawingToPDF,
} from '@/util/ExportHelper';

/**
 * Export state interface
 */
export interface ExportState {
  isExporting: boolean;
  error: string | null;
  lastExportedPath: string | null;
}

const initialState: ExportState = {
  isExporting: false,
  error: null,
  lastExportedPath: null,
};

/**
 * Async thunk to export note
 */
export const exportNoteThunk = createAsyncThunk(
  'export/exportNote',
  async (
    {note, format}: {note: Note; format: ExportFormat},
    {rejectWithValue},
  ) => {
    try {
      const filePath = await exportNote(note, format);
      return filePath;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || 'Failed to export note',
      );
    }
  },
);

/**
 * Async thunk to export and share note
 */
export const exportAndShareThunk = createAsyncThunk(
  'export/exportAndShare',
  async (
    {note, format}: {note: Note; format: ExportFormat},
    {rejectWithValue},
  ) => {
    try {
      const filePath = await exportAndShare(note, format);
      return filePath;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || 'Failed to export and share note',
      );
    }
  },
);

/**
 * Async thunk to export drawing to image
 */
export const exportDrawingImageThunk = createAsyncThunk(
  'export/exportDrawingImage',
  async (
    {imageUri, note}: {imageUri: string; note: Note},
    {rejectWithValue},
  ) => {
    try {
      const filePath = await exportDrawingToImage(imageUri, note);
      return filePath;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || 'Failed to export drawing image',
      );
    }
  },
);

/**
 * Async thunk to export drawing to PDF
 */
export const exportDrawingPDFThunk = createAsyncThunk(
  'export/exportDrawingPDF',
  async (
    {imageUri, note}: {imageUri: string; note: Note},
    {rejectWithValue},
  ) => {
    try {
      const filePath = await exportDrawingToPDF(imageUri, note);
      return filePath;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || 'Failed to export drawing PDF',
      );
    }
  },
);

const exportSlice = createSlice({
  name: 'export',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearLastExportedPath: state => {
      state.lastExportedPath = null;
    },
    resetExportState: () => initialState,
  },
  extraReducers: builder => {
    // Export note
    builder
      .addCase(exportNoteThunk.pending, state => {
        state.isExporting = true;
        state.error = null;
      })
      .addCase(exportNoteThunk.fulfilled, (state, action) => {
        state.isExporting = false;
        state.lastExportedPath = action.payload;
      })
      .addCase(exportNoteThunk.rejected, (state, action) => {
        state.isExporting = false;
        state.error = action.payload as string;
      });

    // Export and share
    builder
      .addCase(exportAndShareThunk.pending, state => {
        state.isExporting = true;
        state.error = null;
      })
      .addCase(exportAndShareThunk.fulfilled, (state, action) => {
        state.isExporting = false;
        state.lastExportedPath = action.payload;
      })
      .addCase(exportAndShareThunk.rejected, (state, action) => {
        state.isExporting = false;
        state.error = action.payload as string;
      });

    // Export drawing image
    builder
      .addCase(exportDrawingImageThunk.pending, state => {
        state.isExporting = true;
        state.error = null;
      })
      .addCase(exportDrawingImageThunk.fulfilled, (state, action) => {
        state.isExporting = false;
        state.lastExportedPath = action.payload;
      })
      .addCase(exportDrawingImageThunk.rejected, (state, action) => {
        state.isExporting = false;
        state.error = action.payload as string;
      });

    // Export drawing PDF
    builder
      .addCase(exportDrawingPDFThunk.pending, state => {
        state.isExporting = true;
        state.error = null;
      })
      .addCase(exportDrawingPDFThunk.fulfilled, (state, action) => {
        state.isExporting = false;
        state.lastExportedPath = action.payload;
      })
      .addCase(exportDrawingPDFThunk.rejected, (state, action) => {
        state.isExporting = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearError, clearLastExportedPath, resetExportState} =
  exportSlice.actions;

export default exportSlice.reducer;
