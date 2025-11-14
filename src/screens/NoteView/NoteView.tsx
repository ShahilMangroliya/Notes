import React, {useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import CreateNote from '@/screens/CreateNote/CreateNote';
import DrawingNote from '@/screens/DrawingNote/DrawingNote';
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';
import {selectNoteById} from '@/redux/selectors';
import {setCurrentNote} from '@/redux/notesSlice';
import type {NoteViewScreenProps, NoteEditorScreenProps} from '@/types/navigation';

const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.background};
`;

const ErrorContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: ${props => props.theme.background};
`;

const ErrorText = styled.Text`
  font-size: 18px;
  color: ${props => props.theme.text};
  text-align: center;
  margin-bottom: 8px;
`;

const ErrorSubtext = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  text-align: center;
`;

/**
 * NoteView screen for viewing and editing existing notes
 * Loads the note by ID and renders the appropriate editor
 */
const NoteView: React.FC<NoteViewScreenProps> = props => {
  const {noteId} = props.route.params;
  const dispatch = useAppDispatch();
  const note = useAppSelector(selectNoteById(noteId));

  // Load note into current state
  useEffect(() => {
    if (note) {
      dispatch(setCurrentNote(note));
    }
  }, [note, dispatch]);

  // Loading state - note hasn't loaded yet
  if (!note) {
    return (
      <SafeAreaContainer>
        <ErrorContainer>
          <ErrorText>Note not found</ErrorText>
          <ErrorSubtext>
            This note may have been deleted or doesn't exist
          </ErrorSubtext>
        </ErrorContainer>
      </SafeAreaContainer>
    );
  }

  // Render appropriate editor based on note type
  // Create proper editor props by converting navigation type
  const editorProps: NoteEditorScreenProps = {
    navigation: props.navigation as any, // Type cast navigation
    route: {
      key: props.route.key,
      name: 'NoteEditor',
      params: {
        noteId,
        noteType: note.type,
      },
    },
  };

  if (note.type === 'drawing') {
    return <DrawingNote {...editorProps} />;
  }

  return <CreateNote {...editorProps} />;
};

export default NoteView;
