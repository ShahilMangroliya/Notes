import React, {useCallback, useEffect, useState, useRef} from 'react';
import {Alert} from 'react-native';
import {useTheme} from 'styled-components/native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import FormattingToolbar from '@/components/FormattingToolbar';
import RichTextEditor from '@/components/RichTextEditor';
import IconButton from '@/components/IconButton';
import Icon from '@/components/Icon';
import {createTextNote} from '@/util/NoteHelper';
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';
import {setCurrentNote, saveNote} from '@/redux/notesSlice';
import useRichTextEditor from '@/hooks/useRichTextEditor';
import type {NoteEditorScreenProps} from '@/types/navigation';
import logger from '@/util/DebugLogger';
import * as S from './styles';

/**
 * Text Editor screen for creating and editing text notes
 */
const CreateNote: React.FC<NoteEditorScreenProps> = ({navigation, route}) => {
  const dispatch = useAppDispatch();
  const {noteId, noteType} = route.params;
  const isInitializedRef = useRef(false);
  const theme = useTheme();

  logger.component('CreateNote', 'render', {noteId, noteType});

  const {
    text,
    formattingRanges,
    selection,
    currentFormatting,
    updateText,
    handleSelectionChange,
    toggleFormatting,
    changeFontSize,
  } = useRichTextEditor();

  const currentNote = useAppSelector(state => state.notes.currentNote);
  const isDirty = useAppSelector(state => state.editor.isDirty);
  const [title, setTitle] = useState('');

  // Initialize note - only run once per mount
  useEffect(() => {
    logger.effect('CreateNote', 'initialize', {
      noteId,
      noteType,
      isInitialized: isInitializedRef.current,
      hasCurrentNote: !!currentNote,
    });

    // Prevent re-initialization
    if (isInitializedRef.current) {
      logger.component('CreateNote', 'skip-initialization', {
        reason: 'already-initialized',
      });
      return;
    }

    if (!noteId && noteType === 'text') {
      // Create new note - only if we don't already have a current note
      if (!currentNote) {
        logger.component('CreateNote', 'create-new-note');
        const newNote = createTextNote('');
        dispatch(setCurrentNote(newNote));
        isInitializedRef.current = true;
      }
    } else if (noteId && currentNote) {
      // Load existing note - already loaded by NoteView
      logger.component('CreateNote', 'load-existing-note', {
        noteId,
        currentNoteId: currentNote.id,
      });
      isInitializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId, noteType, dispatch]); // currentNote intentionally excluded to prevent loop - handled separately below

  // Handle currentNote changes for existing notes (after it's loaded)
  useEffect(() => {
    if (
      noteId &&
      currentNote &&
      !isInitializedRef.current &&
      currentNote.id === noteId
    ) {
      logger.effect('CreateNote', 'sync-existing-note', {
        noteId,
        currentNoteId: currentNote.id,
      });
      isInitializedRef.current = true;
    }
  }, [noteId, currentNote]);

  // Sync title with current note
  useEffect(() => {
    if (currentNote) {
      logger.effect('CreateNote', 'sync-title', {title: currentNote.title});
      setTitle(currentNote.title);
    }
  }, [currentNote]);

  const handleBack = useCallback(() => {
    logger.callback('CreateNote', 'handleBack', {isDirty});
    if (isDirty) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save before leaving?',
        [
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              logger.callback('CreateNote', 'handleBack.discard');
              navigation.goBack();
            },
          },
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Save',
            onPress: async () => {
              logger.callback('CreateNote', 'handleBack.save');
              if (currentNote) {
                await dispatch(saveNote({...currentNote, title}));
                navigation.goBack();
              }
            },
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  }, [isDirty, currentNote, title, navigation, dispatch]);

  const handleSave = useCallback(async () => {
    logger.callback('CreateNote', 'handleSave', {
      noteId: currentNote?.id,
      title,
    });
    if (currentNote) {
      await dispatch(saveNote({...currentNote, title}));
      Alert.alert('Saved', 'Note saved successfully');
    }
  }, [currentNote, title, dispatch]);

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
              <Icon name="arrow-left" size={24} color={theme.text} />
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

        <FormattingToolbar
          formatting={currentFormatting || {}}
          onToggleBold={handleToggleBold}
          onToggleItalic={handleToggleItalic}
          onToggleUnderline={handleToggleUnderline}
          onToggleStrikethrough={handleToggleStrikethrough}
          onIncreaseFontSize={handleIncreaseFontSize}
          onDecreaseFontSize={handleDecreaseFontSize}
        />

        <S.EditorContainer>
          <RichTextEditor
            text={text}
            formattingRanges={formattingRanges}
            onTextChange={updateText}
            onSelectionChange={handleSelectionChange}
            placeholder="Start typing..."
          />
        </S.EditorContainer>
      </S.Container>
    </SafeAreaContainer>
  );
};

export default CreateNote;
