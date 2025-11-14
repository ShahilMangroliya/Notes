# RichTextEditor Component

A hybrid rich text editor for React Native with selection-based formatting.

## Overview

The RichTextEditor provides a dual-mode editing experience:
- **Edit Mode**: Plain text input with selection support
- **Preview Mode**: Visual display of formatted text

## Features

- Selection-based text formatting
- Toggle between edit and preview modes
- Support for bold, italic, underline, strikethrough
- Font size adjustment (12-32px)
- Selection info display
- Automatic formatting range management

## Installation

The component is already integrated into the app. Import from the components directory:

```typescript
import RichTextEditor from '@/components/RichTextEditor';
```

## Basic Usage

```tsx
import React from 'react';
import RichTextEditor from '@/components/RichTextEditor';
import useRichTextEditor from '@/hooks/useRichTextEditor';

const MyEditor: React.FC = () => {
  const {
    text,
    formattingRanges,
    updateText,
    handleSelectionChange,
  } = useRichTextEditor();

  return (
    <RichTextEditor
      text={text}
      formattingRanges={formattingRanges}
      onTextChange={updateText}
      onSelectionChange={handleSelectionChange}
      placeholder="Start typing..."
    />
  );
};
```

## Props

### Required Props

#### `text: string`
The plain text content to display/edit.

```tsx
<RichTextEditor text="Hello World" />
```

#### `onTextChange: (text: string) => void`
Callback fired when text content changes.

```tsx
<RichTextEditor
  text={text}
  onTextChange={(newText) => setText(newText)}
/>
```

### Optional Props

#### `formattingRanges?: FormattingRange[]`
Array of formatting ranges to apply to the text.

```tsx
<RichTextEditor
  text="Hello World"
  formattingRanges={[
    { start: 0, end: 5, formatting: { bold: true } }
  ]}
/>
```

#### `onSelectionChange?: (start: number, end: number) => void`
Callback fired when text selection changes.

```tsx
<RichTextEditor
  text={text}
  onSelectionChange={(start, end) => {
    console.log('Selected:', text.slice(start, end));
  }}
/>
```

#### `placeholder?: string`
Placeholder text shown when editor is empty. Default: `"Start typing..."`

```tsx
<RichTextEditor
  text=""
  placeholder="Enter your note here..."
/>
```

#### `initialMode?: 'edit' | 'preview'`
Initial display mode. Default: `'edit'`

```tsx
<RichTextEditor
  text={text}
  initialMode="preview"
/>
```

## Complete Example

```tsx
import React, {useState} from 'react';
import {View} from 'react-native';
import RichTextEditor from '@/components/RichTextEditor';
import FormattingToolbar from '@/components/FormattingToolbar';
import type {FormattingRange} from '@/types/note';

const NoteEditor: React.FC = () => {
  const [text, setText] = useState('');
  const [ranges, setRanges] = useState<FormattingRange[]>([]);
  const [selection, setSelection] = useState({start: 0, end: 0});

  const handleToggleBold = () => {
    if (selection.start === selection.end) return;

    const newRange: FormattingRange = {
      start: selection.start,
      end: selection.end,
      formatting: {bold: true},
    };

    setRanges([...ranges, newRange]);
  };

  return (
    <View style={{flex: 1}}>
      <FormattingToolbar
        formatting={{}}
        onToggleBold={handleToggleBold}
        // ... other toolbar props
      />

      <RichTextEditor
        text={text}
        formattingRanges={ranges}
        onTextChange={setText}
        onSelectionChange={(start, end) => setSelection({start, end})}
        placeholder="Start writing your note..."
      />
    </View>
  );
};
```

## With useRichTextEditor Hook

The recommended way to use RichTextEditor is with the `useRichTextEditor` hook, which handles all state management:

```tsx
import React from 'react';
import {View} from 'react-native';
import RichTextEditor from '@/components/RichTextEditor';
import FormattingToolbar from '@/components/FormattingToolbar';
import useRichTextEditor from '@/hooks/useRichTextEditor';

const NoteEditor: React.FC = () => {
  const {
    text,
    formattingRanges,
    currentFormatting,
    updateText,
    handleSelectionChange,
    toggleFormatting,
    changeFontSize,
  } = useRichTextEditor();

  return (
    <View style={{flex: 1}}>
      <FormattingToolbar
        formatting={currentFormatting || {}}
        onToggleBold={() => toggleFormatting('bold')}
        onToggleItalic={() => toggleFormatting('italic')}
        onToggleUnderline={() => toggleFormatting('underline')}
        onToggleStrikethrough={() => toggleFormatting('strikethrough')}
        onIncreaseFontSize={() => changeFontSize(2)}
        onDecreaseFontSize={() => changeFontSize(-2)}
      />

      <RichTextEditor
        text={text}
        formattingRanges={formattingRanges}
        onTextChange={updateText}
        onSelectionChange={handleSelectionChange}
        placeholder="Start typing..."
      />
    </View>
  );
};
```

## Mode Toggle

The editor includes built-in mode toggle buttons:

- **Edit Mode**: Shows plain TextInput for editing
- **Preview Mode**: Shows formatted text with styles applied

Users can switch between modes using the toggle buttons at the top of the editor.

## Selection Info

When text is selected in Edit mode, a selection info bar appears showing:
- Number of characters selected
- Preview of selected text (up to 20 characters)

## Styling

The component uses styled-components with theme support:

```tsx
// Theme colors are automatically applied
const EditorInput = styled.TextInput`
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.background};
`;
```

### Customizing Styles

To customize styles, modify the styled components in `RichTextEditor.tsx`:

```typescript
const EditorInput = styled.TextInput`
  flex: 1;
  color: ${props => props.theme.text};
  font-size: 18px;  // Customize font size
  line-height: 28px; // Customize line height
  padding: 24px;     // Customize padding
`;
```

## Accessibility

The component includes proper accessibility support:

```tsx
<EditorInput
  accessibilityLabel="Text editor"
  accessibilityHint="Type to edit text. Select text to apply formatting."
/>

<ModeButton
  accessibilityRole="button"
  accessibilityLabel="Edit mode"
  accessibilityState={{selected: mode === 'edit'}}
>
  <ModeButtonText>Edit</ModeButtonText>
</ModeButton>
```

## Performance Considerations

- **Memoization**: The component uses `useCallback` for event handlers
- **Ref Usage**: TextInput ref is used for focus management
- **State Management**: Local state is minimized; most state lives in Redux

## Limitations

### React Native TextInput Limitations

React Native's TextInput doesn't support native rich text rendering. Therefore:

1. **No Inline Formatting**: Formatting is not visible in Edit mode
2. **Mode Toggle Required**: Users must switch to Preview mode to see formatting
3. **Selection-Only Formatting**: Formatting can only be applied to selected text

### Workarounds

- Use Preview mode to view formatted text
- Consider WebView-based editor for inline formatting (future enhancement)

## Troubleshooting

### Formatting Not Visible

**Problem**: Applied formatting doesn't appear in the editor.

**Solution**: Switch to Preview mode. Edit mode shows plain text only.

### Selection Not Working

**Problem**: Selection callbacks not firing.

**Solution**: Ensure `onSelectionChange` prop is provided and editor is in Edit mode.

### Text Input Not Focusing

**Problem**: Tapping editor doesn't focus the input.

**Solution**: Ensure mode is set to 'edit'. Preview mode doesn't allow text input.

### Theme Colors Not Applied

**Problem**: Editor colors don't match app theme.

**Solution**: Ensure ThemeProvider wraps the component tree.

## Related Components

- **FormattedText**: Renders formatted text in Preview mode
- **FormattingToolbar**: Provides formatting controls
- **useRichTextEditor**: Hook for state management

## API Reference

See the main documentation in `/vault/RICH_TEXT_EDITOR.md` for complete API reference.

## Contributing

When modifying this component:

1. Update this README
2. Add tests for new features
3. Ensure accessibility support
4. Follow coding standards in CLAUDE.md
5. Update TypeScript types
