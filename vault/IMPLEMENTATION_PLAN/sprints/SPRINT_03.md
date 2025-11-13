# Sprint 3: Rich Text Editor (Week 3-5)

## Goals

Implement full-featured rich text editor with formatting toolbar, block types, and real-time editing.

## Tasks

### 1. NoteEditor Screen Structure

**File:** `src/screens/NoteEditor/NoteEditor.tsx`

- [ ] Create NoteEditor screen component
- [ ] Get note from route params (create vs edit)
- [ ] Initialize currentNote in Redux
- [ ] Conditional rendering: TextEditor vs DrawingEditor
- [ ] Add EditorHeader component
- [ ] Handle back navigation (prompt if unsaved changes)

### 2. EditorHeader Component

**File:** `src/screens/NoteEditor/EditorHeader.tsx`

- [ ] Create EditorHeader component
- [ ] Title input field
- [ ] Save button
- [ ] Back button
- [ ] Undo/Redo buttons
- [ ] Options menu (color, export, delete)
- [ ] Show last saved indicator
- [ ] Style with theme

### 3. TextEditor Component

**File:** `src/screens/NoteEditor/TextEditor/TextEditor.tsx`

- [ ] Create TextEditor container component
- [ ] Manage TextBlock array
- [ ] Render blocks in FlatList
- [ ] Handle block addition
- [ ] Handle block deletion
- [ ] Handle block reordering (future)
- [ ] Implement auto-save with useAutoSave hook
- [ ] Push to history on changes

### 4. TextBlock Component

**File:** `src/screens/NoteEditor/TextEditor/TextBlock.tsx`

- [ ] Create TextBlock component
- [ ] Use styled TextInput with multiline
- [ ] Apply formatting via transient props:
  - `$bold`
  - `$italic`
  - `$underline`
  - `$strikethrough`
  - `$fontSize`
  - `$fontFamily`
  - `$color`
  - `$backgroundColor`
- [ ] Apply block type styles
- [ ] Handle text change
- [ ] Handle selection change
- [ ] Focus management

### 5. FormattingToolbar Component

**File:** `src/screens/NoteEditor/TextEditor/FormattingToolbar.tsx`

- [ ] Create FormattingToolbar component
- [ ] Horizontal scrollable toolbar
- [ ] Text style buttons (Bold, Italic, Underline, Strikethrough)
- [ ] Font size picker
- [ ] Font family picker
- [ ] Text color picker
- [ ] Highlight color picker
- [ ] Block type selector
- [ ] Voice input button
- [ ] Get current formatting from Redux
- [ ] Dispatch formatting changes
- [ ] Style with theme

### 6. Font Size Picker

**File:** `src/screens/NoteEditor/TextEditor/components/FontSizePicker.tsx`

- [ ] Create FontSizePicker component
- [ ] Display size options (12-32px)
- [ ] Dropdown or modal picker
- [ ] Dispatch setTextFormatting action
- [ ] Style with theme

### 7. Font Family Picker

**File:** `src/screens/NoteEditor/TextEditor/components/FontFamilyPicker.tsx`

- [ ] Create FontFamilyPicker component
- [ ] Options: System, Serif, Monospace
- [ ] Dropdown or modal picker
- [ ] Dispatch setTextFormatting action
- [ ] Style with theme

### 8. Block Type Selector

**File:** `src/screens/NoteEditor/TextEditor/components/BlockTypeSelector.tsx`

- [ ] Create BlockTypeSelector component
- [ ] Options: Paragraph, H1, H2, Bullet, Numbered
- [ ] Dropdown or modal picker
- [ ] Update current block type
- [ ] Style with theme

### 9. Formatting Logic

- [ ] Implement toggleTextFormatting in Redux
- [ ] Implement setTextFormatting in Redux
- [ ] Apply formatting to selected block
- [ ] Apply formatting to new blocks
- [ ] Preserve formatting when typing

### 10. Auto-Save Hook

**File:** `src/hooks/useAutoSave.ts`

- [ ] Create useAutoSave custom hook
- [ ] Debounce save callback (500ms)
- [ ] Call saveNote on content change
- [ ] Flush on unmount
- [ ] Update lastSaved timestamp

### 11. Block Management

- [ ] Add new block on Enter key (optional)
- [ ] Delete block if empty on Backspace
- [ ] Merge blocks on Backspace
- [ ] Split block on Enter (optional)

### 12. Color Pickers

- [ ] Reuse ColorPicker component
- [ ] Text color picker in toolbar
- [ ] Highlight color picker in toolbar
- [ ] Default color palette
- [ ] Support custom colors (future)

### 13. Keyboard Handling

- [ ] KeyboardAvoidingView setup
- [ ] Scroll to focused block
- [ ] Handle keyboard show/hide

### 14. History Integration

- [ ] Push history state on text change (debounced 500ms)
- [ ] Include content snapshot
- [ ] Limit history to 50 items
- [ ] Clear history on note close

## Testing Checklist

- [ ] Create new text note
- [ ] Type text in editor
- [ ] Apply bold formatting
- [ ] Apply italic formatting
- [ ] Apply underline formatting
- [ ] Apply strikethrough formatting
- [ ] Change font size
- [ ] Change font family
- [ ] Change text color
- [ ] Change highlight color
- [ ] Create heading 1
- [ ] Create heading 2
- [ ] Create bullet list
- [ ] Create numbered list
- [ ] Add multiple blocks
- [ ] Delete block
- [ ] Auto-save works
- [ ] Manual save works
- [ ] Formatting persists on save
- [ ] Keyboard handling works
- [ ] Performance with long notes
- [ ] Theme colors applied

## Definition of Done

- Text editor fully functional
- All formatting options work
- Font size and family selectable
- Block types work correctly
- Auto-save implemented
- Manual save works
- Formatting persists
- Performance acceptable
- Follows CLAUDE.md patterns
- TypeScript strict mode
- Accessibility implemented
