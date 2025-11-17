import React, {useCallback, useEffect, useState, useRef} from 'react';
import {Platform, Keyboard} from 'react-native';
import {useTheme} from 'styled-components/native';
import {RichEditor} from 'react-native-pell-rich-editor';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import InlineRichTextEditor from '@/components/InlineRichTextEditor';
import InlineFormattingToolbar from '@/components/InlineFormattingToolbar';
import IconButton from '@/components/IconButton';
import Icon from '@/components/Icon';
import {createTextNote} from '@/util/NoteHelper';
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';
import {setCurrentNote} from '@/redux/notesSlice';
import useAutoSave from '@/hooks/useAutoSave';
import type {NoteEditorScreenProps} from '@/types/navigation';
import logger from '@/util/DebugLogger';
import * as S from './styles';

/**
 * CreateNote - Text editor screen with inline rich text editing
 *
 * Features:
 * - Inline rich text editing (WYSIWYG)
 * - Auto-save as you type (debounced)
 * - No Edit/Preview mode - see formatting as you type
 * - Works like Google Docs, Word, Samsung Notes
 * - Formatting toolbar always accessible
 */
const CreateNote: React.FC<NoteEditorScreenProps> = ({navigation, route}) => {
  const dispatch = useAppDispatch();
  const {noteId, noteType} = route.params;
  const isInitializedRef = useRef(false);
  const editorRef = useRef<RichEditor>(null);
  const theme = useTheme();

  logger.component('CreateNote', 'render', {noteId, noteType});

  const currentNote = useAppSelector(state => state.notes.currentNote);
  const [title, setTitle] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isTitleFocused, setIsTitleFocused] = useState(false);

  // Create updated note object for auto-save (memoized to prevent re-renders)
  const noteToSave = React.useMemo(() => {
    if (!currentNote) return null;
    return {
      ...currentNote,
      title,
      content: {
        ...(currentNote.content as any),
        html: htmlContent,
        text: htmlContent,
      },
    };
  }, [currentNote, title, htmlContent]);

  // Auto-save hook - saves after 1.5 seconds of inactivity
  const {isSaving, saveNow} = useAutoSave(
    noteToSave,
    [title, htmlContent],
    {delay: 1500},
  );

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
  }, [noteId, noteType, dispatch]);

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

      // Load HTML content from note
      // For now, use text as HTML (we'll need to convert between formats)
      if (currentNote.type === 'text') {
        const content = currentNote.content as any;
        const html = content.html || content.text || '';
        setHtmlContent(html);
      }
    }
  }, [currentNote]);

  // Keyboard listeners
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => {
        logger.effect('CreateNote', 'keyboard-show', {
          height: e.endCoordinates.height,
        });
        setKeyboardHeight(e.endCoordinates.height);
      },
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        logger.effect('CreateNote', 'keyboard-hide');
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleBack = useCallback(async () => {
    logger.callback('CreateNote', 'handleBack');
    // Save immediately before leaving
    await saveNow();
    navigation.goBack();
  }, [navigation, saveNow]);

  const handleContentChange = useCallback((html: string) => {
    logger.callback('CreateNote', 'handleContentChange', {
      length: html.length,
    });
    setHtmlContent(html);
  }, []);

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
          </S.HeaderLeft>
          <S.HeaderRight>
            {isSaving && <S.SavingIndicator>Saving...</S.SavingIndicator>}
          </S.HeaderRight>
        </S.Header>

        <S.TitleInput
          value={title}
          onChangeText={setTitle}
          placeholder="Note title"
          maxLength={200}
          onFocus={() => setIsTitleFocused(true)}
          onBlur={() => setIsTitleFocused(false)}
        />

        <S.EditorContainer>
          <InlineRichTextEditor
            ref={editorRef}
            initialContent={htmlContent}
            onContentChange={handleContentChange}
            placeholder="Start typing..."
          />
        </S.EditorContainer>

        {!isTitleFocused && (
          <InlineFormattingToolbar
            editorRef={editorRef}
            keyboardHeight={keyboardHeight}
          />
        )}
      </S.Container>
    </SafeAreaContainer>
  );
};

export default CreateNote;
