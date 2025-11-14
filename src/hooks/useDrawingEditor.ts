import {useCallback} from 'react';
import {useAppDispatch, useAppSelector} from './hooks';
import {
  setDrawingTool,
  setBrushSize,
  setBrushColor,
  setIsDrawing,
  setCurrentStroke,
  markDirty,
  markSaved,
  resetEditor,
} from '@/redux/editorSlice';
import {updateCurrentNote} from '@/redux/notesSlice';
import {
  selectDrawingEditor,
  selectIsDirty,
  selectCurrentNote,
} from '@/redux/selectors';
import {generateId} from '@/util/uuid';
import type {DrawingStroke, Point, DrawingContent} from '@/types/note';

/**
 * Custom hook for managing drawing editor state
 */
export const useDrawingEditor = () => {
  const dispatch = useAppDispatch();

  const currentNote = useAppSelector(selectCurrentNote);
  const drawingEditor = useAppSelector(selectDrawingEditor);
  const isDirty = useAppSelector(selectIsDirty);

  // Get drawing strokes if current note is a drawing note
  const drawingStrokes =
    currentNote?.type === 'drawing'
      ? (currentNote.content as DrawingContent).strokes
      : [];

  const canvasSize =
    currentNote?.type === 'drawing'
      ? (currentNote.content as DrawingContent).canvasSize
      : {width: 800, height: 1200};

  // Actions
  const handleToolChange = useCallback(
    (tool: 'pencil' | 'eraser') => {
      dispatch(setDrawingTool(tool));
    },
    [dispatch],
  );

  const handleBrushSizeChange = useCallback(
    (size: number) => {
      dispatch(setBrushSize(size));
    },
    [dispatch],
  );

  const handleBrushColorChange = useCallback(
    (color: string) => {
      dispatch(setBrushColor(color));
    },
    [dispatch],
  );

  const handleTouchStart = useCallback(
    (point: Point) => {
      const newStroke: DrawingStroke = {
        id: generateId(),
        points: [point],
        color: drawingEditor.brushColor,
        width: drawingEditor.brushSize,
        tool: drawingEditor.selectedTool,
        timestamp: Date.now(),
      };

      dispatch(setIsDrawing(true));
      dispatch(setCurrentStroke(newStroke));
    },
    [drawingEditor.brushColor, drawingEditor.brushSize, drawingEditor.selectedTool, dispatch],
  );

  const handleTouchMove = useCallback(
    (point: Point) => {
      if (
        !drawingEditor.isDrawing ||
        !drawingEditor.currentStroke
      )
        return;

      const updatedStroke: DrawingStroke = {
        ...drawingEditor.currentStroke,
        points: [...drawingEditor.currentStroke.points, point],
      };

      dispatch(setCurrentStroke(updatedStroke));
    },
    [drawingEditor.isDrawing, drawingEditor.currentStroke, dispatch],
  );

  const handleTouchEnd = useCallback(() => {
    if (!currentNote || currentNote.type !== 'drawing') return;
    if (!drawingEditor.currentStroke) return;

    const content = currentNote.content as DrawingContent;

    // Add completed stroke to strokes array
    const updatedStrokes = [...content.strokes, drawingEditor.currentStroke];

    dispatch(
      updateCurrentNote({
        content: {
          type: 'drawing',
          strokes: updatedStrokes,
          canvasSize: content.canvasSize,
          backgroundColor: content.backgroundColor,
        },
      }),
    );

    dispatch(setIsDrawing(false));
    dispatch(setCurrentStroke(null));
    dispatch(markDirty());
  }, [currentNote, drawingEditor.currentStroke, dispatch]);

  const handleClearCanvas = useCallback(() => {
    if (!currentNote || currentNote.type !== 'drawing') return;

    const content = currentNote.content as DrawingContent;

    dispatch(
      updateCurrentNote({
        content: {
          type: 'drawing',
          strokes: [],
          canvasSize: content.canvasSize,
          backgroundColor: content.backgroundColor,
        },
      }),
    );

    dispatch(markDirty());
  }, [currentNote, dispatch]);

  const handleUndo = useCallback(() => {
    if (!currentNote || currentNote.type !== 'drawing') return;

    const content = currentNote.content as DrawingContent;
    if (content.strokes.length === 0) return;

    const updatedStrokes = content.strokes.slice(0, -1);

    dispatch(
      updateCurrentNote({
        content: {
          type: 'drawing',
          strokes: updatedStrokes,
          canvasSize: content.canvasSize,
          backgroundColor: content.backgroundColor,
        },
      }),
    );

    dispatch(markDirty());
  }, [currentNote, dispatch]);

  const handleMarkSaved = useCallback(() => {
    dispatch(markSaved());
  }, [dispatch]);

  const handleResetEditor = useCallback(() => {
    dispatch(resetEditor());
  }, [dispatch]);

  return {
    // State
    currentNote,
    strokes: drawingStrokes,
    canvasSize,
    selectedTool: drawingEditor.selectedTool,
    brushSize: drawingEditor.brushSize,
    brushColor: drawingEditor.brushColor,
    isDrawing: drawingEditor.isDrawing,
    currentStroke: drawingEditor.currentStroke,
    isDirty,
    canUndo: drawingStrokes.length > 0,

    // Actions
    setTool: handleToolChange,
    setBrushSize: handleBrushSizeChange,
    setBrushColor: handleBrushColorChange,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    clearCanvas: handleClearCanvas,
    undo: handleUndo,
    markSaved: handleMarkSaved,
    resetEditor: handleResetEditor,
  };
};

export default useDrawingEditor;
