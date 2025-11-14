# Rich Text Editor System

## Overview

The Rich Text Editor system provides selection-based text formatting for notes, similar to apps like Google Keep, Samsung Notes, and Apple Notes. Users can type text, select it, and apply formatting (bold, italic, underline, strikethrough, font size).

## Architecture

### Core Concepts

**Selection-Based Formatting**: Unlike block-based editors, this system applies formatting to text ranges (start/end positions). When a user selects text and applies formatting, a `FormattingRange` is created with the selection boundaries and the formatting properties.

**Dual-Mode Display**: Since React Native's `TextInput` doesn't support rich text rendering natively, the editor has two modes:
- **Edit Mode**: Plain `TextInput` for typing and selection
- **Preview Mode**: Formatted text display using styled `Text` components

### Key Components

#### 1. FormattingRange (Type Definition)

```typescript
interface FormattingRange {
  start: number;      // Start position in text
  end: number;        // End position in text
  formatting: Partial<TextFormatting>; // Formatting to apply
}
```

Represents a continuous range of text with specific formatting applied.

**Example**:
```typescript
// "Hello World" with "Hello" bold
{
  start: 0,
  end: 5,
  formatting: { bold: true }
}
```

#### 2. RichTextEditor Component

**Location**: `src/components/RichTextEditor/RichTextEditor.tsx`

**Purpose**: Displays the text editor with mode toggle and handles user input.

**Props**:
- `text`: Plain text content
- `formattingRanges`: Array of formatting ranges
- `onTextChange`: Callback when text changes
- `onSelectionChange`: Callback when selection changes
- `placeholder`: Placeholder text
- `initialMode`: Initial display mode ('edit' | 'preview')

**Features**:
- Mode toggle buttons (Edit/Preview)
- Selection info display (shows selected text length)
- Plain TextInput in edit mode
- Formatted text display in preview mode
- Automatic focus management

**Usage**:
```tsx
<RichTextEditor
  text={text}
  formattingRanges={formattingRanges}
  onTextChange={handleTextChange}
  onSelectionChange={handleSelectionChange}
  placeholder="Start typing..."
/>
```

#### 3. FormattedText Component

**Location**: `src/components/FormattedText/FormattedText.tsx`

**Purpose**: Renders text with formatting ranges applied visually.

**How It Works**:
1. **Split Text into Segments**: Analyzes all formatting ranges and splits text at boundaries
2. **Merge Overlapping Formatting**: When multiple ranges overlap, their formatting is merged
3. **Render Segments**: Each segment is rendered as a `Text` component with appropriate styles

**Algorithm**:
```typescript
// Example: "Hello World" with overlapping ranges
// Range 1: [0, 5] bold
// Range 2: [6, 11] italic
// Result: Two segments with independent formatting
```

**Props**:
- `text`: Plain text to render
- `formattingRanges`: Formatting to apply
- `baseFontSize`: Default font size
- `baseColor`: Default text color

#### 4. useRichTextEditor Hook

**Location**: `src/hooks/useRichTextEditor.ts`

**Purpose**: Manages editor state and formatting operations.

**API**:

```typescript
const {
  // State
  text,                    // Current text content
  formattingRanges,        // Current formatting ranges
  selection,               // Current selection {start, end}
  currentFormatting,       // Formatting at selection

  // Actions
  updateText,              // Update text content
  handleSelectionChange,   // Handle selection changes
  toggleFormatting,        // Toggle bold/italic/etc.
  changeFontSize,          // Change font size
  applyFormatting,         // Apply custom formatting
} = useRichTextEditor();
```

**Internal Logic**:
- Reads text content from Redux store
- Validates formatting ranges
- Provides formatted text operations
- Automatically adjusts ranges when text changes
- Syncs with global formatting state

#### 5. FormattingHelper Utilities

**Location**: `src/util/FormattingHelper.ts`

**Purpose**: Pure functions for formatting range operations.

**Key Functions**:

##### `applyFormattingRange(existingRanges, newRange)`
Applies new formatting to a selection intelligently:
1. Removes overlapping parts of existing ranges
2. Splits ranges that partially overlap
3. Adds the new range
4. Merges adjacent ranges with identical formatting

```typescript
// Example
const ranges = [{ start: 0, end: 10, formatting: { bold: true } }];
const newRange = { start: 5, end: 15, formatting: { italic: true } };
const result = applyFormattingRange(ranges, newRange);
// Result:
// [
//   { start: 0, end: 5, formatting: { bold: true } },
//   { start: 5, end: 15, formatting: { italic: true } }
// ]
```

##### `toggleFormattingProperty(ranges, start, end, property)`
Toggles a boolean formatting property:
- If any part of the range has the property enabled → disable it
- Otherwise → enable it

##### `adjustRangesForTextChange(ranges, position, delta)`
Adjusts ranges after text insertion or deletion:
- Ranges before change: unchanged
- Ranges after change: shifted by delta
- Ranges overlapping change: adjusted accordingly

##### Other Utilities:
- `validateRanges`: Validates range array
- `getFormattingAtPosition`: Gets formatting at a position
- `mergeAdjacentRanges`: Merges adjacent identical ranges
- `clearFormattingInRange`: Removes formatting from a range

### Data Flow

```
User Action (Select Text + Click Bold)
    ↓
FormattingToolbar.onToggleBold()
    ↓
useRichTextEditor.toggleFormatting('bold')
    ↓
FormattingHelper.toggleFormattingProperty()
    ↓
Redux: updateCurrentNote() + markDirty()
    ↓
RichTextEditor re-renders with new ranges
    ↓
Preview Mode: FormattedText shows bold text
```

## User Workflow

### Creating Formatted Text

1. **Type Text**: User types in Edit mode (plain text input)
2. **Select Text**: User selects text to format
3. **Apply Formatting**: User clicks formatting button in toolbar
4. **View Result**: User switches to Preview mode to see formatted text

### Supported Formatting

- **Bold**: Heavy font weight
- **Italic**: Slanted text style
- **Underline**: Line under text
- **Strikethrough**: Line through text
- **Font Size**: 12-32px range

## Implementation Details

### Text Change Handling

When text changes (insertion/deletion), formatting ranges must be adjusted:

**Insertion Example**:
```
Before: "Hello" (bold: 0-5)
Insert "Big " at position 0
After: "Big Hello" (bold: 4-9)
```

**Deletion Example**:
```
Before: "Hello World" (bold: 0-5)
Delete "Hello "
After: "World" (no bold)
```

### Overlapping Ranges

Multiple ranges can overlap. Later ranges override earlier ones for conflicting properties:

```typescript
// "Hello" with both bold and italic
[
  { start: 0, end: 5, formatting: { bold: true } },
  { start: 0, end: 5, formatting: { italic: true } }
]
// Renders as bold + italic
```

### Performance Considerations

- **Memoization**: FormattedText uses `useMemo` to avoid recalculating segments
- **Range Merging**: Adjacent identical ranges are merged to reduce overhead
- **Validation**: Ranges are validated to prevent invalid states

## Error Handling

The system includes comprehensive error handling:

1. **Range Validation**: Checks for valid start/end positions
2. **Bounds Checking**: Ensures ranges don't exceed text length
3. **Logger Integration**: All operations are logged for debugging
4. **Graceful Degradation**: Invalid ranges are filtered out

## Testing Strategy

### Unit Tests (Recommended)

```typescript
// FormattingHelper.test.ts
describe('applyFormattingRange', () => {
  it('should remove overlapping ranges', () => {
    const existing = [{ start: 0, end: 10, formatting: { bold: true } }];
    const newRange = { start: 5, end: 15, formatting: { italic: true } };
    const result = applyFormattingRange(existing, newRange);
    expect(result).toHaveLength(2);
  });
});
```

### Integration Tests

- Test complete formatting workflow
- Test mode switching
- Test text editing with formatting

### Manual Testing Checklist

- [ ] Create new note and type text
- [ ] Select text and apply bold
- [ ] Switch to preview mode - verify bold is visible
- [ ] Apply multiple formats to same text
- [ ] Insert text in middle of formatted range
- [ ] Delete formatted text
- [ ] Change font size
- [ ] Apply formatting to overlapping ranges

## Troubleshooting

### "Formatting not showing in edit mode"
**Expected behavior**: Edit mode shows plain text. Switch to Preview mode to see formatting.

### "Formatting lost after editing text"
**Check**: Ensure `adjustRangesForTextChange` is being called properly in `updateText`.

### "Overlapping ranges have wrong formatting"
**Check**: Verify range merge order - later ranges should override earlier ones.

### "Performance issues with long text"
**Solution**: Implement range splitting/pagination for very long documents.

## Future Enhancements

### Planned Features

1. **Color Picker**: Add text/background color support
2. **Font Family**: Support multiple font families
3. **Inline Preview**: Show formatting in edit mode (requires native bridge or WebView)
4. **Undo/Redo**: Track formatting changes for undo/redo
5. **Keyboard Shortcuts**: Support Cmd+B for bold, etc.
6. **Export**: Export formatted text as HTML/Markdown

### Technical Improvements

1. **Performance**: Optimize for very long documents (>10,000 characters)
2. **Accessibility**: Add screen reader support for formatting
3. **Native Module**: Consider native rich text input for better UX
4. **WebView Option**: Alternative implementation using WebView-based editor

## Related Documentation

- **BEST_PRACTICES.md**: General coding standards
- **COMPONENTS.md**: Component documentation
- **THEME_SYSTEM.md**: Theme and styling details

## API Reference

### RichTextEditor Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| text | string | Yes | Plain text content |
| formattingRanges | FormattingRange[] | No | Formatting to apply |
| onTextChange | (text: string) => void | Yes | Text change handler |
| onSelectionChange | (start: number, end: number) => void | No | Selection change handler |
| placeholder | string | No | Placeholder text |
| initialMode | 'edit' \| 'preview' | No | Initial mode (default: 'edit') |

### useRichTextEditor Returns

| Property | Type | Description |
|----------|------|-------------|
| text | string | Current text |
| formattingRanges | FormattingRange[] | Current formatting |
| selection | {start: number, end: number} | Current selection |
| currentFormatting | Partial<TextFormatting> | Formatting at selection |
| updateText | (text: string) => void | Update text |
| handleSelectionChange | (start: number, end: number) => void | Handle selection |
| toggleFormatting | (property: string) => void | Toggle formatting |
| changeFontSize | (delta: number) => void | Change font size |
| applyFormatting | (formatting: Partial<TextFormatting>) => void | Apply formatting |

## Contributing

When modifying the rich text editor:

1. **Update Tests**: Add tests for new formatting operations
2. **Update Documentation**: Keep this file in sync with code
3. **Consider Performance**: Test with long documents
4. **Validate Ranges**: Always validate ranges after modifications
5. **Log Operations**: Use DebugLogger for troubleshooting
