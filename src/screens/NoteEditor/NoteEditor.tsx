import React from 'react';
import CreateNote from '@/screens/CreateNote/CreateNote';
import DrawingNote from '@/screens/DrawingNote/DrawingNote';
import type {NoteEditorScreenProps} from '@/types/navigation';

/**
 * NoteEditor wrapper component that renders the appropriate editor based on note type
 */
const NoteEditor: React.FC<NoteEditorScreenProps> = props => {
  const {noteType} = props.route.params;

  if (noteType === 'drawing') {
    return <DrawingNote {...props} />;
  }

  return <CreateNote {...props} />;
};

export default NoteEditor;
