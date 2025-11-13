# Sprint 6: Note View & Display (Week 8-9)

## Goals

Create read-only note viewing screen with proper rendering of text and drawings.

## Tasks

### 1. NoteView Screen

**File:** `src/screens/NoteView/NoteView.tsx`

- [ ] Create NoteView screen component
- [ ] Get noteId from route params
- [ ] Load note from Redux/storage
- [ ] Conditional rendering: TextRenderer vs DrawingRenderer
- [ ] Add ViewHeader component
- [ ] Handle loading and error states
- [ ] Navigate to edit mode
- [ ] Add export functionality
- [ ] Add share functionality

### 2. ViewHeader Component

**File:** `src/screens/NoteView/components/ViewHeader.tsx`

- [ ] Display note title
- [ ] Back button
- [ ] Edit button (navigate to NoteEditor)
- [ ] Options menu:
  - Export
  - Share
  - Pin/Unpin
  - Change Color
  - Delete
- [ ] Show note metadata (created, updated dates)
- [ ] Style with theme

### 3. TextRenderer Component

**File:** `src/screens/NoteView/components/TextRenderer.tsx`

- [ ] Create TextRenderer component
- [ ] Receive TextContent as prop
- [ ] Render all blocks
- [ ] Apply formatting to each block
- [ ] Apply block type styles
- [ ] Use ScrollView for long content
- [ ] Support text selection for copying
- [ ] Style with theme

### 4. DrawingRenderer Component

**File:** `src/screens/NoteView/components/DrawingRenderer.tsx`

- [ ] Create DrawingRenderer component
- [ ] Receive DrawingContent as prop
- [ ] Setup Skia Canvas (read-only)
- [ ] Render all strokes
- [ ] Apply stroke colors and widths
- [ ] Support pinch-to-zoom (optional)
- [ ] Support pan gestures (optional)
- [ ] Style with theme

### 5. Read-Only Mode Features

- [ ] Disable editing in TextRenderer
- [ ] Disable gestures in DrawingRenderer
- [ ] Show "Edit" button to enable editing
- [ ] Prevent accidental modifications
- [ ] Allow text selection for copying

### 6. Metadata Display

**File:** `src/screens/NoteView/components/NoteMetadata.tsx`

- [ ] Display creation date
- [ ] Display last updated date
- [ ] Display note type
- [ ] Display word count (text notes)
- [ ] Display stroke count (drawings)
- [ ] Style with theme

### 7. Options Menu

**File:** `src/screens/NoteView/components/OptionsMenu.tsx`

- [ ] Create popup menu component
- [ ] Export option
- [ ] Share option
- [ ] Pin/Unpin option
- [ ] Change Color option
- [ ] Delete option
- [ ] Duplicate option (future)
- [ ] Dispatch appropriate actions
- [ ] Close menu after action

### 8. Export Integration

- [ ] Add export button/option
- [ ] Show export modal with format options
- [ ] Call export helper functions
- [ ] Show progress indicator
- [ ] Handle export errors
- [ ] Show success message

### 9. Share Integration

- [ ] Add share button/option
- [ ] Export note first
- [ ] Open native share sheet
- [ ] Support multiple formats
- [ ] Handle share cancellation

### 10. Navigate to Edit Mode

- [ ] Add Edit button in header
- [ ] Navigate to NoteEditor with noteId
- [ ] Pass note type
- [ ] Preserve scroll position (optional)

### 11. Pinned Note Indicator

- [ ] Show pin icon if note is pinned
- [ ] Toggle pin status
- [ ] Update UI immediately

### 12. Color Background

- [ ] Apply note color to background
- [ ] Ensure text readability
- [ ] Support light/dark theme

### 13. Text Selection

- [ ] Enable text selection in TextRenderer
- [ ] Show selection handles
- [ ] Support copy to clipboard
- [ ] Context menu for selection

### 14. Zoom and Pan (Drawing - Optional)

- [ ] Implement pinch-to-zoom gesture
- [ ] Implement pan gesture
- [ ] Constrain zoom limits (0.5x - 3x)
- [ ] Reset zoom button

## Testing Checklist

- [ ] View text note correctly
- [ ] View drawing note correctly
- [ ] All formatting displays correctly
- [ ] All block types display correctly
- [ ] All strokes render correctly
- [ ] Navigate to edit mode
- [ ] Export note works
- [ ] Share note works
- [ ] Pin/unpin works
- [ ] Change color works
- [ ] Delete note works (with confirmation)
- [ ] Metadata displays correctly
- [ ] Text selection works
- [ ] Copy text works
- [ ] Loading state displays
- [ ] Error state displays
- [ ] Theme colors applied
- [ ] Back navigation works

## Definition of Done

- NoteView screen fully functional
- Text notes render correctly
- Drawing notes render correctly
- All formatting preserved
- Export and share work
- Options menu implemented
- Navigate to edit mode works
- Text selection enabled
- Performance acceptable
- Follows CLAUDE.md patterns
- TypeScript strict mode
- Accessibility implemented
