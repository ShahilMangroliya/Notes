import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, Alert} from 'react-native';
import styled from 'styled-components/native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import FormattingToolbar from '@/components/FormattingToolbar';
import BlockTypeSelector from '@/components/BlockTypeSelector';
import TextBlockEditor from '@/components/TextBlockEditor';
import IconButton from '@/components/IconButton';
import {createTextNote} from '@/util/NoteHelper';
import {useAppDispatch} from '@/hooks/hooks';
import {setCurrentNote} from '@/redux/notesSlice';
import {saveNote} from '@/redux/notesSlice';
import useTextEditor from '@/hooks/useTextEditor';
import type {NoteEditorScreenProps} from '@/types/navigation';

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

const EditorContainer = styled.View`
  flex: 1;
`;

const BlocksContainer = styled.View`
  padding-bottom: 100px;
`;

const AddBlockButton = styled.TouchableOpacity`
  padding: 16px;
  align-items: center;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.border};
  background-color: ${props => props.theme.surface};
`;

const AddBlockText = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
`;

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
      const newNote = createTextNote('');
      dispatch(setCurrentNote(newNote));
      if (newNote.type === 'text' && 'blocks' in newNote.content) {
        setSelectedBlockId(newNote.content.blocks[0].id);
      }
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
    (blockType: typeof textBlocks[0]['blockType']) => {
      if (selectedBlockId) {
        changeBlockType(selectedBlockId, blockType);
      }
    },
    [selectedBlockId, changeBlockType],
  );

  const currentBlockType =
    selectedBlockId && textBlocks.find(b => b.id === selectedBlockId)?.blockType || 'paragraph';

  if (!currentNote || noteType !== 'text') {
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
            <HeaderTitle>Edit Note</HeaderTitle>
            {isDirty && <DirtyIndicator />}
          </HeaderLeft>
          <HeaderRight>
            <IconButton
              onPress={handleSave}
              $disabled={!isDirty}
              accessibilityLabel="Save note"
            >
              <SaveButton>Save</SaveButton>
            </IconButton>
          </HeaderRight>
        </Header>

        <TitleInput
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

        <EditorContainer>
          <ScrollView showsVerticalScrollIndicator={false}>
            <BlocksContainer>
              {textBlocks.map(block => (
                <TextBlockEditor
                  key={block.id}
                  block={block}
                  onTextChange={updateText}
                  onSelect={handleBlockSelect}
                  $isSelected={selectedBlockId === block.id}
                />
              ))}
            </BlocksContainer>

            <AddBlockButton onPress={() => addBlock()}>
              <AddBlockText>+ Add Block</AddBlockText>
            </AddBlockButton>
          </ScrollView>
        </EditorContainer>
      </Container>
    </SafeAreaContainer>
  );
};

export default CreateNote;
