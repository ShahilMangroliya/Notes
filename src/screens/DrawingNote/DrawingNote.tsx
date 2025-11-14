import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, Alert} from 'react-native';
import {useTheme} from 'styled-components/native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import DrawingToolbar from '@/components/DrawingToolbar';
import DrawingCanvas from '@/components/DrawingCanvas';
import IconButton from '@/components/IconButton';
import Icon from '@/components/Icon';
import {createDrawingNote} from '@/util/NoteHelper';
import {useAppDispatch} from '@/hooks/hooks';
import {setCurrentNote, saveNote} from '@/redux/notesSlice';
import useDrawingEditor from '@/hooks/useDrawingEditor';
import type {NoteEditorScreenProps} from '@/types/navigation';
import {NOTE_COLORS} from '@/types/note';
import * as S from './styles';

/**
 * Drawing Editor screen for creating and editing drawing notes
 */
const DrawingNote: React.FC<NoteEditorScreenProps> = ({navigation, route}) => {
  const dispatch = useAppDispatch();
  const {noteId, noteType} = route.params;
  const theme = useTheme();

  const {
    currentNote,
    strokes,
    canvasSize,
    selectedTool,
    brushSize,
    brushColor,
    currentStroke,
    isDirty,
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

  const handleBack = useCallback(() => {
    if (isDirty) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save before leaving?',
        [
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Save',
            onPress: async () => {
              if (currentNote) {
                await dispatch(saveNote({...currentNote, title}));
                markSaved();
                navigation.goBack();
              }
            },
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  }, [isDirty, currentNote, title, navigation, dispatch, markSaved]);

  const handleSave = useCallback(async () => {
    if (currentNote) {
      await dispatch(saveNote({...currentNote, title}));
      markSaved();
      Alert.alert('Saved', 'Drawing saved successfully');
    }
  }, [currentNote, title, dispatch, markSaved]);

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
            {isDirty && <S.DirtyIndicator />}
          </S.HeaderLeft>
          <S.HeaderRight>
            <IconButton
              onPress={handleSave}
              $disabled={!isDirty}
              accessibilityLabel="Save drawing"
            >
              <S.SaveButton>Save</S.SaveButton>
            </IconButton>
          </S.HeaderRight>
        </S.Header>

        <S.TitleInput
          value={title}
          onChangeText={setTitle}
          placeholder="Drawing title"
          maxLength={200}
        />

        <S.CanvasContainer>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DrawingCanvas
              strokes={strokes}
              currentStroke={currentStroke}
              width={canvasSize.width}
              height={canvasSize.height}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            />
          </ScrollView>
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
    </SafeAreaContainer>
  );
};

export default DrawingNote;
