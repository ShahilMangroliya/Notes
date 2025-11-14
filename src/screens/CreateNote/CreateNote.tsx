import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, Alert} from 'react-native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import FormattingToolbar from '@/components/FormattingToolbar';
import BlockTypeSelector from '@/components/BlockTypeSelector';
import TextBlockEditor from '@/components/TextBlockEditor';
import IconButton from '@/components/IconButton';
import {createTextNote} from '@/util/NoteHelper';
import {useAppDispatch} from '@/hooks/hooks';
import {setCurrentNote, saveNote} from '@/redux/notesSlice';
import useTextEditor from '@/hooks/useTextEditor';
import type {NoteEditorScreenProps} from '@/types/navigation';
import * as S from './styles';

/**
 * Text Editor screen for creating and editing text notes
 */
const CreateNote: React.FC<NoteEditorScreenProps> = ({navigation, route}) => {
  const dispatch = useAppDispatch();
  const {noteId, noteType} = route.params;

  const {
    currentNote,
    textBlocks,
    currentFormatting,
    isDirty,
    selectBlock,
    updateText,
    addBlock,
    changeBlockType,
    toggleFormatting,
    changeFontSize,
    markSaved,
    resetEditor,
  } = useTextEditor();

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [title, setTitle] = useState('');

  // Initialize note
  useEffect(() => {
    if (!noteId && noteType === 'text') {
      // Create new note
      const newNote = createTextNote('');
      dispatch(setCurrentNote(newNote));
      if (newNote.type === 'text' && 'blocks' in newNote.content) {
        setSelectedBlockId(newNote.content.blocks[0].id);
      }
    } else if (noteId && currentNote) {
      // Load existing note - already loaded by NoteView
      if (currentNote.type === 'text' && 'blocks' in currentNote.content) {
        setSelectedBlockId(currentNote.content.blocks[0].id);
      }
    }
  }, [noteId, noteType, currentNote, dispatch]);

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
      Alert.alert('Saved', 'Note saved successfully');
    }
  }, [currentNote, title, dispatch, markSaved]);

  const handleBlockSelect = useCallback(
    (blockId: string) => {
      setSelectedBlockId(blockId);
      selectBlock(blockId);
    },
    [selectBlock],
  );

  const handleToggleBold = useCallback(() => {
    toggleFormatting('bold');
  }, [toggleFormatting]);

  const handleToggleItalic = useCallback(() => {
    toggleFormatting('italic');
  }, [toggleFormatting]);

  const handleToggleUnderline = useCallback(() => {
    toggleFormatting('underline');
  }, [toggleFormatting]);

  const handleToggleStrikethrough = useCallback(() => {
    toggleFormatting('strikethrough');
  }, [toggleFormatting]);

  const handleIncreaseFontSize = useCallback(() => {
    changeFontSize(2);
  }, [changeFontSize]);

  const handleDecreaseFontSize = useCallback(() => {
    changeFontSize(-2);
  }, [changeFontSize]);

  const handleChangeBlockType = useCallback(
    (blockType: (typeof textBlocks)[0]['blockType']) => {
      if (selectedBlockId) {
        changeBlockType(selectedBlockId, blockType);
      }
    },
    [selectedBlockId, changeBlockType],
  );

  const currentBlockType =
    (selectedBlockId &&
      textBlocks.find(b => b.id === selectedBlockId)?.blockType) ||
    'paragraph';

  if (!currentNote || noteType !== 'text') {
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
              <S.BackButton>←</S.BackButton>
            </IconButton>
            <S.HeaderTitle>Edit Note</S.HeaderTitle>
            {isDirty && <S.DirtyIndicator />}
          </S.HeaderLeft>
          <S.HeaderRight>
            <IconButton
              onPress={handleSave}
              $disabled={!isDirty}
              accessibilityLabel="Save note"
            >
              <S.SaveButton>Save</S.SaveButton>
            </IconButton>
          </S.HeaderRight>
        </S.Header>

        <S.TitleInput
          value={title}
          onChangeText={setTitle}
          placeholder="Note title"
          maxLength={200}
        />

        <BlockTypeSelector
          currentType={currentBlockType}
          onTypeChange={handleChangeBlockType}
        />

        <FormattingToolbar
          formatting={currentFormatting}
          onToggleBold={handleToggleBold}
          onToggleItalic={handleToggleItalic}
          onToggleUnderline={handleToggleUnderline}
          onToggleStrikethrough={handleToggleStrikethrough}
          onIncreaseFontSize={handleIncreaseFontSize}
          onDecreaseFontSize={handleDecreaseFontSize}
        />

        <S.EditorContainer>
          <ScrollView showsVerticalScrollIndicator={false}>
            <S.BlocksContainer>
              {textBlocks.map(block => (
                <TextBlockEditor
                  key={block.id}
                  block={block}
                  onTextChange={updateText}
                  onSelect={handleBlockSelect}
                  $isSelected={selectedBlockId === block.id}
                />
              ))}
            </S.BlocksContainer>

            <S.AddBlockButton onPress={() => addBlock()}>
              <S.AddBlockText>+ Add Block</S.AddBlockText>
            </S.AddBlockButton>
          </ScrollView>
        </S.EditorContainer>
      </S.Container>
    </SafeAreaContainer>
  );
};

export default CreateNote;
