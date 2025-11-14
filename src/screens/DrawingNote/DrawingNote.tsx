import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, Alert} from 'react-native';
import styled from 'styled-components/native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import DrawingToolbar from '@/components/DrawingToolbar';
import DrawingCanvas from '@/components/DrawingCanvas';
import IconButton from '@/components/IconButton';
import {createDrawingNote} from '@/util/NoteHelper';
import {useAppDispatch} from '@/hooks/hooks';
import {setCurrentNote, saveNote} from '@/redux/notesSlice';
import useDrawingEditor from '@/hooks/useDrawingEditor';
import type {NoteEditorScreenProps} from '@/types/navigation';
import {NOTE_COLORS} from '@/types/note';

const Container = styled.View`
  flex: 1;
`;

const Header = styled.View`
  background-color: ${props => props.theme.background};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.border};
  padding: 12px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const HeaderRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const BackButton = styled.Text`
  font-size: 20px;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const SaveButton = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const DirtyIndicator = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #ff9500;
`;

const TitleInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: props.theme.textSecondary,
}))`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.text};
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.border};
`;

const CanvasContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.background};
`;

const ToolbarContainer = styled.View`
  max-height: 400px;
`;

/**
 * Drawing Editor screen for creating and editing drawing notes
 */
const DrawingNote: React.FC<NoteEditorScreenProps> = ({navigation, route}) => {
  const dispatch = useAppDispatch();
  const {noteId, noteType} = route.params;

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
      const newNote = createDrawingNote('');
      dispatch(setCurrentNote(newNote));
    }
    // TODO: Load existing note if noteId is provided
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
          {text: 'Discard', style: 'destructive', onPress: () => navigation.goBack()},
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
        <Header>
          <HeaderTitle>Loading...</HeaderTitle>
        </Header>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer>
      <Container>
        <Header>
          <HeaderLeft>
            <IconButton onPress={handleBack} accessibilityLabel="Go back">
              <BackButton>←</BackButton>
            </IconButton>
            <HeaderTitle>Drawing</HeaderTitle>
            {isDirty && <DirtyIndicator />}
          </HeaderLeft>
          <HeaderRight>
            <IconButton
              onPress={handleSave}
              $disabled={!isDirty}
              accessibilityLabel="Save drawing"
            >
              <SaveButton>Save</SaveButton>
            </IconButton>
          </HeaderRight>
        </Header>

        <TitleInput
          value={title}
          onChangeText={setTitle}
          placeholder="Drawing title"
          maxLength={200}
        />

        <CanvasContainer>
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
        </CanvasContainer>

        <ToolbarContainer>
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
        </ToolbarContainer>
      </Container>
    </SafeAreaContainer>
  );
};

export default DrawingNote;
