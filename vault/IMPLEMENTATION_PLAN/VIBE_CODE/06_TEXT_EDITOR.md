# Vibe Code Guide - Part 6: Rich Text Editor

## Task: Implement Rich Text Editor with Formatting

Create a custom rich text editor with formatting toolbar using native React Native components.

## Critical Pattern: TextInput with Styled Formatting

The key to the text editor is using `TextInput` with multiline and applying styles via styled-components transient props.

## File 1: TextBlock Component - `src/screens/NoteEditor/TextEditor/TextBlock.tsx`

### Instructions

This is the CORE component - each editable text block:

```typescript
import React from 'react';
import styled from 'styled-components/native';
import type {TextBlock as TextBlockType, BlockType, FontFamily} from '@/types/note';

export interface TextBlockProps {
  block: TextBlockType;
  onTextChange: (text: string) => void;
  $isSelected?: boolean;
  onFocus?: () => void;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  block,
  onTextChange,
  $isSelected = false,
  onFocus,
}) => {
  return (
    <StyledTextInput
      value={block.text}
      onChangeText={onTextChange}
      onFocus={onFocus}
      multiline
      $bold={block.formatting.bold}
      $italic={block.formatting.italic}
      $underline={block.formatting.underline}
      $strikethrough={block.formatting.strikethrough}
      $fontSize={block.formatting.fontSize}
      $fontFamily={block.formatting.fontFamily}
      $color={block.formatting.color}
      $backgroundColor={block.formatting.backgroundColor}
      $blockType={block.blockType}
      placeholder="Start typing..."
      placeholderTextColor={(theme: any) => theme.textSecondary}
      accessibilityLabel="Text block"
      accessibilityRole="text"
    />
  );
};

const StyledTextInput = styled.TextInput<{
  $bold: boolean;
  $italic: boolean;
  $underline: boolean;
  $strikethrough: boolean;
  $fontSize: number;
  $fontFamily: FontFamily;
  $color: string;
  $backgroundColor?: string;
  $blockType: BlockType;
}>`
  font-weight: ${props => props.$bold ? 'bold' : 'normal'};
  font-style: ${props => props.$italic ? 'italic' : 'normal'};
  text-decoration-line: ${props => {
    const decorations: string[] = [];
    if (props.$underline) decorations.push('underline');
    if (props.$strikethrough) decorations.push('line-through');
    return decorations.length > 0 ? decorations.join(' ') : 'none';
  }};
  font-size: ${props => props.$fontSize}px;
  font-family: ${props => getFontFamily(props.$fontFamily)};
  color: ${props => props.$color};
  background-color: ${props => props.$backgroundColor || 'transparent'};
  padding: 8px 16px;
  ${props => getBlockTypeStyles(props.$blockType)}
`;

const getFontFamily = (family: FontFamily): string => {
  switch (family) {
    case 'serif': return 'Georgia';
    case 'monospace': return 'Courier';
    default: return 'System';
  }
};

const getBlockTypeStyles = (type: BlockType): string => {
  switch (type) {
    case 'heading1':
      return 'font-size: 28px; font-weight: bold; margin-top: 16px; margin-bottom: 8px;';
    case 'heading2':
      return 'font-size: 22px; font-weight: bold; margin-top: 12px; margin-bottom: 6px;';
    case 'bullet':
      return 'padding-left: 32px;';
    case 'numbered':
      return 'padding-left: 32px;';
    default:
      return '';
  }
};

export default TextBlock;
```

## File 2: FormattingToolbar - `src/screens/NoteEditor/TextEditor/FormattingToolbar.tsx`

### Instructions

Create the formatting toolbar with all controls:

```typescript
import React from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import IconButton from '@/components/IconButton';
import ColorPicker from '@/components/ColorPicker';
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';
import {toggleTextFormatting, setTextFormatting} from '@/redux/editorSlice';
import {FONT_SIZES} from '@/types/note';

export const FormattingToolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const formatting = useAppSelector(state => state.editor.textEditor.currentFormatting);

  return (
    <ToolbarContainer>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ToolbarContent>
          {/* Text Style */}
          <ToolbarGroup>
            <IconButton
              icon="B"
              onPress={() => dispatch(toggleTextFormatting('bold'))}
              $active={formatting.bold}
              $size="medium"
              accessibilityLabel="Toggle bold"
            />
            <IconButton
              icon="I"
              onPress={() => dispatch(toggleTextFormatting('italic'))}
              $active={formatting.italic}
              $size="medium"
              accessibilityLabel="Toggle italic"
            />
            <IconButton
              icon="U"
              onPress={() => dispatch(toggleTextFormatting('underline'))}
              $active={formatting.underline}
              $size="medium"
              accessibilityLabel="Toggle underline"
            />
            <IconButton
              icon="S"
              onPress={() => dispatch(toggleTextFormatting('strikethrough'))}
              $active={formatting.strikethrough}
              $size="medium"
              accessibilityLabel="Toggle strikethrough"
            />
          </ToolbarGroup>

          <Divider />

          {/* Font Size */}
          <ToolbarGroup>
            <FontSizeButton
              onPress={() => {/* Show font size picker */}}
              accessibilityLabel="Change font size"
            >
              <ButtonText>{formatting.fontSize}px</ButtonText>
            </FontSizeButton>
          </ToolbarGroup>

          <Divider />

          {/* Colors */}
          <ToolbarGroup>
            <ColorPicker
              $selectedColor={formatting.color}
              onColorSelect={(color) => dispatch(setTextFormatting({color}))}
              $variant="compact"
              label="Text"
            />
          </ToolbarGroup>
        </ToolbarContent>
      </ScrollView>
    </ToolbarContainer>
  );
};

const ToolbarContainer = styled.View`
  height: 56px;
  background-color: ${props => props.theme.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.border};
  padding-horizontal: 8px;
`;

const ToolbarContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const ToolbarGroup = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const Divider = styled.View`
  width: 1px;
  height: 32px;
  background-color: ${props => props.theme.border};
`;

const FontSizeButton = styled.TouchableOpacity`
  padding: 8px 12px;
  background-color: ${props => props.theme.background};
  border-radius: 8px;
`;

const ButtonText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.text};
`;

export default FormattingToolbar;
```

## File 3: TextEditor Container - `src/screens/NoteEditor/TextEditor/TextEditor.tsx`

### Instructions

Create the main text editor container:

```typescript
import React, {useCallback} from 'react';
import {FlatList, KeyboardAvoidingView, Platform} from 'react-native';
import styled from 'styled-components/native';
import {v4 as uuidv4} from 'uuid';

import TextBlock from './TextBlock';
import FormattingToolbar from './FormattingToolbar';

import type {TextContent, TextBlock as TextBlockType} from '@/types/note';
import {useAppSelector} from '@/hooks/hooks';

export interface TextEditorProps {
  content: TextContent;
  onChange: (content: TextContent) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({content, onChange}) => {
  const formatting = useAppSelector(state => state.editor.textEditor.currentFormatting);

  const handleBlockChange = useCallback((blockId: string, text: string) => {
    const updatedBlocks = content.blocks.map(block =>
      block.id === blockId ? {...block, text} : block
    );

    onChange({
      ...content,
      blocks: updatedBlocks,
      version: content.version + 1,
    });
  }, [content, onChange]);

  const handleAddBlock = useCallback(() => {
    const newBlock: TextBlockType = {
      id: uuidv4(),
      text: '',
      formatting: {...formatting},
      blockType: 'paragraph',
    };

    onChange({
      ...content,
      blocks: [...content.blocks, newBlock],
      version: content.version + 1,
    });
  }, [content, formatting, onChange]);

  const renderBlock = ({item}: {item: TextBlockType}) => (
    <TextBlock
      block={item}
      onTextChange={(text) => handleBlockChange(item.id, text)}
    />
  );

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <FormattingToolbar />

      <FlatList
        data={content.blocks}
        renderItem={renderBlock}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{padding: 16}}
        keyboardShouldPersistTaps="handled"
      />

      <AddBlockButton
        onPress={handleAddBlock}
        accessibilityLabel="Add new text block"
      >
        <AddBlockText>+ Add Block</AddBlockText>
      </AddBlockButton>
    </Container>
  );
};

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const AddBlockButton = styled.TouchableOpacity`
  padding: 16px;
  align-items: center;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.border};
`;

const AddBlockText = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.text};
`;

export default TextEditor;
```

## File 4: Auto-Save Hook - `src/hooks/useAutoSave.ts`

### Instructions

Create debounced auto-save hook:

```typescript
import {useEffect, useRef} from 'react';

export const useAutoSave = <T>(
  value: T,
  saveCallback: (value: T) => void,
  delay: number = 500,
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(saveCallback);

  // Update callback ref
  useEffect(() => {
    callbackRef.current = saveCallback;
  }, [saveCallback]);

  // Debounced save
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      callbackRef.current(value);
    };
  }, []);
};

export default useAutoSave;
```

## File 5: NoteEditor Screen - `src/screens/NoteEditor/NoteEditor.tsx`

### Instructions

Create the main editor screen:

```typescript
import React, {useEffect} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import styled from 'styled-components/native';

import SafeAreaContainer from '@/components/SafeAreaContainer';
import TextEditor from './TextEditor/TextEditor';
import DrawingEditor from './DrawingEditor/DrawingEditor';
import EditorHeader from './EditorHeader';

import {useAppDispatch, useAppSelector} from '@/hooks/hooks';
import {setCurrentNote, updateCurrentNote} from '@/redux/notesSlice';
import {saveNote} from '@/redux/notesSlice';
import useAutoSave from '@/hooks/useAutoSave';
import {createTextNote, createDrawingNote} from '@/util/NoteHelper';

import type {RootStackParamList} from '@/types/navigation';
import type {Note} from '@/types/note';

type NoteEditorRouteProp = RouteProp<RootStackParamList, 'NoteEditor'>;

export const NoteEditor: React.FC = () => {
  const route = useRoute<NoteEditorRouteProp>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const currentNote = useAppSelector(state => state.notes.currentNote);
  const {noteId, noteType} = route.params;

  // Initialize note
  useEffect(() => {
    if (!noteId) {
      // Create new note
      const newNote = noteType === 'text'
        ? createTextNote('Untitled Note')
        : createDrawingNote('Untitled Drawing');
      dispatch(setCurrentNote(newNote));
    } else {
      // Load existing note
      // (already in Redux from home screen)
    }
  }, [noteId, noteType, dispatch]);

  // Auto-save
  useAutoSave(currentNote, (note) => {
    if (note) {
      dispatch(saveNote(note));
    }
  }, 500);

  if (!currentNote) {
    return (
      <SafeAreaContainer>
        <LoadingText>Loading...</LoadingText>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer>
      <EditorHeader />

      {currentNote.type === 'text' ? (
        <TextEditor
          content={currentNote.content}
          onChange={(content) => dispatch(updateCurrentNote({content}))}
        />
      ) : (
        <DrawingEditor
          content={currentNote.content}
          onChange={(content) => dispatch(updateCurrentNote({content}))}
        />
      )}
    </SafeAreaContainer>
  );
};

const LoadingText = styled.Text`
  font-size: 18px;
  color: ${props => props.theme.text};
  text-align: center;
  margin-top: 32px;
`;

export default NoteEditor;
```

## Verification Checklist

- [ ] TextBlock component applies all formatting
- [ ] FormattingToolbar updates Redux state
- [ ] Toolbar buttons show active state
- [ ] Auto-save works (500ms debounce)
- [ ] Multiple blocks can be added
- [ ] Keyboard handling works
- [ ] All imports use `@/` alias
- [ ] All styled props use `$` prefix
- [ ] TypeScript compiles without errors

## Key Patterns

1. **Formatting via Styled Props**: Apply formatting by passing transient props to StyledTextInput
2. **Redux for Toolbar State**: Current formatting stored in Redux
3. **Auto-save Hook**: Debounced save on content changes
4. **Block Management**: Array of TextBlock components in FlatList

## Next Step

Proceed to **Part 7: Drawing Editor with Skia**.
