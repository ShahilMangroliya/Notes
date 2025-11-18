import React, {useCallback, useEffect, useState, useRef} from 'react';
import {Alert, useWindowDimensions, View} from 'react-native';
import {useTheme} from 'styled-components/native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import DrawingToolbar from '@/components/DrawingToolbar';
import DrawingCanvas from '@/components/DrawingCanvas';
import IconButton from '@/components/IconButton';
import Icon from '@/components/Icon';
import ExportModal from '@/components/ExportModal';
import {createDrawingNote} from '@/util/NoteHelper';
import {useAppDispatch} from '@/hooks/hooks';
import {setCurrentNote} from '@/redux/notesSlice';
import useDrawingEditor from '@/hooks/useDrawingEditor';
import useAutoSave from '@/hooks/useAutoSave';
import type {NoteEditorScreenProps} from '@/types/navigation';
import {NOTE_COLORS} from '@/types/note';
import * as S from './styles';

/**
 * Drawing Editor screen for creating and editing drawing notes
 * Features auto-save functionality
 */
const DrawingNote: React.FC<NoteEditorScreenProps> = ({navigation, route}) => {
  const {noteId, noteType} = route.params;
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const dimensions = useWindowDimensions();

  const {
    currentNote,
    strokes,
    selectedTool,
    brushSize,
    brushColor,
    currentStroke,
    canUndo,
    setTool,
    setBrushSize,
    setBrushColor,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    clearCanvas,
    undo,
    markSaved,
  } = useDrawingEditor();

  const [title, setTitle] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const canvasRef = useRef<View>(null);

  // Calculate responsive canvas size that fits the screen
  // Account for: header (~60px) + title input (~70px) + toolbar (~60px) = ~190px
  const responsiveCanvasSize = {
    width: dimensions.width,
    height: Math.max(400, dimensions.height - 190),
  };

  // Create updated note object for auto-save (memoized to prevent re-renders)
  const noteToSave = React.useMemo(() => {
    if (!currentNote) return null;
    return {
      ...currentNote,
      title,
    };
  }, [currentNote, title]);

  // Auto-save hook - only saves title, not drawing content
  // Drawing content is saved when user navigates back
  const {isSaving, saveNow} = useAutoSave(
    noteToSave,
    [title], // Only auto-save when title changes, not when drawing
    {delay: 1500},
  );

  // Initialize note
  useEffect(() => {
    if (!noteId && noteType === 'drawing') {
      // Create new note
      const newNote = createDrawingNote('');
      dispatch(setCurrentNote(newNote));
    }
    // If noteId is provided, note is already loaded by NoteView
    // No additional action needed
  }, [noteId, noteType, dispatch]);

  // Sync title with current note
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
    }
  }, [currentNote]);

  const handleBack = useCallback(async () => {
    // Save immediately before leaving
    await saveNow();
    markSaved();
    navigation.goBack();
  }, [navigation, saveNow, markSaved]);

  const handleClear = useCallback(() => {
    Alert.alert(
      'Clear Canvas',
      'Are you sure you want to clear the entire drawing? This cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Clear', style: 'destructive', onPress: clearCanvas},
      ],
    );
  }, [clearCanvas]);

  const handleExport = useCallback(async () => {
    setShowExportModal(true);
  }, []);

  // Unused export format handler - kept for potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleExportFormat = useCallback(
    async (_format: 'pdf' | 'text' | 'markdown' | 'image' | 'json') => {
      // Function body removed as it's not currently used
      // Export is handled by ExportModal component
    },
    [],
  );

  if (!currentNote || noteType !== 'drawing') {
    return (
      <SafeAreaContainer>
        <S.Header>
          <S.HeaderTitle>Loading...</S.HeaderTitle>
        </S.Header>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer>
      <S.Container>
        <S.Header>
          <S.HeaderLeft>
            <IconButton onPress={handleBack} accessibilityLabel="Go back">
              <Icon name="arrow-left" size={24} color={theme.text} />
            </IconButton>
            <S.HeaderTitle>Drawing</S.HeaderTitle>
          </S.HeaderLeft>
          <S.HeaderRight>
            {isSaving && <S.SavingIndicator>Saving...</S.SavingIndicator>}
            <IconButton
              onPress={handleExport}
              accessibilityLabel="Export drawing"
            >
              <Icon name="upload" size={24} color={theme.text} />
            </IconButton>
          </S.HeaderRight>
        </S.Header>

        <S.TitleInput
          value={title}
          onChangeText={setTitle}
          placeholder="Drawing title"
          maxLength={200}
        />

        <S.CanvasContainer ref={canvasRef} collapsable={false}>
          <DrawingCanvas
            strokes={strokes}
            currentStroke={currentStroke}
            width={responsiveCanvasSize.width}
            height={responsiveCanvasSize.height}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
        </S.CanvasContainer>

        <S.ToolbarContainer>
          <DrawingToolbar
            selectedTool={selectedTool}
            brushSize={brushSize}
            brushColor={brushColor}
            colors={NOTE_COLORS}
            onToolChange={setTool}
            onBrushSizeChange={setBrushSize}
            onColorChange={setBrushColor}
            onUndo={undo}
            onClear={handleClear}
            canUndo={canUndo}
          />
        </S.ToolbarContainer>
      </S.Container>

      {currentNote && (
        <ExportModal
          visible={showExportModal}
          note={currentNote}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </SafeAreaContainer>
  );
};

export default DrawingNote;
