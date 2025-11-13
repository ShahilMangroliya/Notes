# Rich Text Editor Implementation

## Overview

Custom-built rich text editor using React Native components without external libraries for maximum control and performance.

## Architecture

```
TextEditor (Container)
    ├── EditorHeader (Title, Save, Back)
    ├── FormattingToolbar (Format controls)
    └── TextBlockList (Editable blocks)
        └── TextBlock[] (Individual blocks)
```

## Core Components

### TextEditor.tsx

**File:** `src/screens/NoteEditor/TextEditor/TextEditor.tsx`

```typescript
import React, {useCallback, useState} from 'react';
import {FlatList} from 'react-native';
import type {TextBlock, TextContent} from '@/types/note';
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';
import {useAutoSave} from '@/hooks/useAutoSave';

export interface TextEditorProps {
  content: TextContent;
  onChange: (content: TextContent) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({content, onChange}) => {
  const dispatch = useAppDispatch();
  const formatting = useAppSelector(selectTextFormatting);

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
    const newBlock: TextBlock = {
      id: uuid(),
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

  return (
    <EditorContainer>
      <FormattingToolbar />

      <FlatList
        data={content.blocks}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <TextBlock
            block={item}
            onTextChange={(text) => handleBlockChange(item.id, text)}
            onFormattingChange={(fmt) => handleFormattingChange(item.id, fmt)}
          />
        )}
      />

      <AddBlockButton onPress={handleAddBlock} />
    </EditorContainer>
  );
};
```

### TextBlock.tsx

**File:** `src/screens/NoteEditor/TextEditor/TextBlock.tsx`

```typescript
import React from 'react';
import styled from 'styled-components/native';
import type {TextBlock as TextBlockType} from '@/types/note';

export interface TextBlockProps {
  block: TextBlockType;
  onTextChange: (text: string) => void;
  onFormattingChange: (formatting: Partial<TextFormatting>) => void;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  block,
  onTextChange,
}) => {
  return (
    <StyledTextInput
      value={block.text}
      onChangeText={onTextChange}
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
      placeholderTextColor={theme => theme.textSecondary}
    />
  );
};

const StyledTextInput = styled.TextInput<{
  $bold?: boolean;
  $italic?: boolean;
  $underline?: boolean;
  $strikethrough?: boolean;
  $fontSize?: number;
  $fontFamily?: string;
  $color?: string;
  $backgroundColor?: string;
  $blockType?: BlockType;
}>`
  font-weight: ${props => props.$bold ? 'bold' : 'normal'};
  font-style: ${props => props.$italic ? 'italic' : 'normal'};
  text-decoration-line: ${props => {
    const decorations = [];
    if (props.$underline) decorations.push('underline');
    if (props.$strikethrough) decorations.push('line-through');
    return decorations.length > 0 ? decorations.join(' ') : 'none';
  }};
  font-size: ${props => props.$fontSize || 16}px;
  font-family: ${props => getFontFamily(props.$fontFamily || 'system')};
  color: ${props => props.$color || props.theme.text};
  background-color: ${props => props.$backgroundColor || 'transparent'};
  padding: 8px 16px;
  ${props => getBlockTypeStyles(props.$blockType || 'paragraph')}
`;

const getFontFamily = (family: string): string => {
  switch (family) {
    case 'serif': return 'Georgia, serif';
    case 'monospace': return 'Courier, monospace';
    default: return 'System';
  }
};

const getBlockTypeStyles = (type: BlockType): string => {
  switch (type) {
    case 'heading1': return 'font-size: 28px; font-weight: bold; margin-top: 16px;';
    case 'heading2': return 'font-size: 22px; font-weight: bold; margin-top: 12px;';
    case 'bullet': return 'padding-left: 32px;'; // Add bullet via ::before
    case 'numbered': return 'padding-left: 32px;'; // Add number via ::before
    default: return '';
  }
};
```

### FormattingToolbar.tsx

**File:** `src/screens/NoteEditor/TextEditor/FormattingToolbar.tsx`

```typescript
import React from 'react';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native';
import IconButton from '@/components/IconButton';
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';
import {toggleTextFormatting, setTextFormatting} from '@/redux/editorSlice';

export const FormattingToolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const formatting = useAppSelector(selectTextFormatting);

  return (
    <ToolbarContainer>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ToolbarGroup>
          <IconButton
            icon="bold"
            onPress={() => dispatch(toggleTextFormatting('bold'))}
            $active={formatting.bold}
            accessibilityLabel="Toggle bold"
          />
          <IconButton
            icon="italic"
            onPress={() => dispatch(toggleTextFormatting('italic'))}
            $active={formatting.italic}
            accessibilityLabel="Toggle italic"
          />
          <IconButton
            icon="underline"
            onPress={() => dispatch(toggleTextFormatting('underline'))}
            $active={formatting.underline}
            accessibilityLabel="Toggle underline"
          />
          <IconButton
            icon="strikethrough"
            onPress={() => dispatch(toggleTextFormatting('strikethrough'))}
            $active={formatting.strikethrough}
            accessibilityLabel="Toggle strikethrough"
          />
        </ToolbarGroup>

        <Divider />

        <ToolbarGroup>
          <FontSizePicker
            value={formatting.fontSize}
            onChange={(size) => dispatch(setTextFormatting({fontSize: size}))}
          />
          <FontFamilyPicker
            value={formatting.fontFamily}
            onChange={(family) => dispatch(setTextFormatting({fontFamily: family}))}
          />
        </ToolbarGroup>

        <Divider />

        <ToolbarGroup>
          <ColorPicker
            $selectedColor={formatting.color}
            onColorSelect={(color) => dispatch(setTextFormatting({color}))}
            label="Text"
          />
          <ColorPicker
            $selectedColor={formatting.backgroundColor || 'transparent'}
            onColorSelect={(color) => dispatch(setTextFormatting({backgroundColor: color}))}
            label="Highlight"
          />
        </ToolbarGroup>

        <Divider />

        <ToolbarGroup>
          <IconButton
            icon="microphone"
            onPress={handleVoiceInput}
            $active={isListening}
            accessibilityLabel="Voice input"
          />
        </ToolbarGroup>
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

const ToolbarGroup = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const Divider = styled.View`
  width: 1px;
  height: 32px;
  background-color: ${props => props.theme.border};
  margin-horizontal: 8px;
`;
```

## Formatting Features

### Font Sizes

```typescript
export const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24, 28, 32] as const;

export const FontSizePicker: React.FC<FontSizePickerProps> = ({value, onChange}) => {
  return (
    <Picker value={value} onValueChange={onChange}>
      {FONT_SIZES.map(size => (
        <Picker.Item key={size} label={`${size}px`} value={size} />
      ))}
    </Picker>
  );
};
```

### Font Families

```typescript
export const FONT_FAMILIES = [
  {label: 'System', value: 'system'},
  {label: 'Serif', value: 'serif'},
  {label: 'Monospace', value: 'monospace'},
] as const;
```

### Block Types

```typescript
export const BLOCK_TYPES = [
  {label: 'Paragraph', value: 'paragraph', icon: 'paragraph'},
  {label: 'Heading 1', value: 'heading1', icon: 'h1'},
  {label: 'Heading 2', value: 'heading2', icon: 'h2'},
  {label: 'Bullet List', value: 'bullet', icon: 'list-ul'},
  {label: 'Numbered List', value: 'numbered', icon: 'list-ol'},
] as const;
```

## Undo/Redo System

### History Management

```typescript
// src/hooks/useTextHistory.ts
export const useTextHistory = () => {
  const dispatch = useAppDispatch();
  const {history, historyIndex} = useAppSelector(state => state.editor.textEditor);

  const pushHistory = useCallback((content: TextContent, description: string) => {
    const historyState: HistoryState = {
      content,
      timestamp: Date.now(),
      description,
    };
    dispatch(pushTextHistory(historyState));
  }, [dispatch]);

  const undo = useCallback(() => {
    dispatch(undoText());
  }, [dispatch]);

  const redo = useCallback(() => {
    dispatch(redoText());
  }, [dispatch]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {pushHistory, undo, redo, canUndo, canRedo};
};
```

### Debounced History Push

```typescript
import {debounce} from 'lodash';

const debouncedPushHistory = useRef(
  debounce((content: TextContent) => {
    pushHistory(content, 'Text edit');
  }, 500)
).current;

useEffect(() => {
  if (content) {
    debouncedPushHistory(content);
  }
}, [content]);
```

## Auto-Save Implementation

```typescript
// src/hooks/useAutoSave.ts
export const useAutoSave = (
  note: Note,
  saveCallback: (note: Note) => void,
  delay: number = 500,
) => {
  const debouncedSave = useRef(
    debounce(saveCallback, delay)
  ).current;

  useEffect(() => {
    if (note) {
      debouncedSave(note);
    }
  }, [note]);

  useEffect(() => {
    return () => {
      debouncedSave.flush(); // Save immediately on unmount
    };
  }, []);
};

// Usage in TextEditor
const {saveNote} = useNotes();

useAutoSave(currentNote, (note) => {
  dispatch(saveNote(note));
}, 500);
```

## Keyboard Handling

```typescript
// Handle keyboard shortcuts (optional, for future)
const handleKeyPress = useCallback((e: KeyboardEvent) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 'b': toggleBold(); break;
      case 'i': toggleItalic(); break;
      case 'u': toggleUnderline(); break;
      case 'z': e.shiftKey ? redo() : undo(); break;
      case 's': saveNote(); break;
    }
  }
}, []);
```

## Performance Optimization

1. **Memoization**
   ```typescript
   const MemoizedTextBlock = React.memo(TextBlock);
   ```

2. **FlatList Optimization**
   ```typescript
   <FlatList
     data={blocks}
     renderItem={renderBlock}
     keyExtractor={(item) => item.id}
     removeClippedSubviews
     maxToRenderPerBatch={10}
     windowSize={21}
   />
   ```

3. **Debounced Updates**
   - Text input: 300ms
   - Auto-save: 500ms
   - History push: 500ms

4. **Lazy Formatting**
   - Only update block being edited
   - Batch formatting updates

## Accessibility

```typescript
<TextInput
  accessibilityLabel="Note content"
  accessibilityHint="Enter your note text here"
  accessibilityRole="text"
/>

<IconButton
  icon="bold"
  accessibilityLabel="Bold"
  accessibilityHint="Make selected text bold"
  accessibilityState={{selected: formatting.bold}}
/>
```

## Testing Checklist

- [ ] Text input and display
- [ ] Bold formatting
- [ ] Italic formatting
- [ ] Underline formatting
- [ ] Strikethrough formatting
- [ ] Font size changes
- [ ] Font family changes
- [ ] Text color changes
- [ ] Highlight color changes
- [ ] Block type changes
- [ ] Multiple blocks
- [ ] Add/remove blocks
- [ ] Undo/redo
- [ ] Auto-save
- [ ] Performance with 100+ blocks
- [ ] Accessibility
