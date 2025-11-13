# Sprint 4: Undo/Redo System (Week 5-6)

## Goals

Implement comprehensive undo/redo functionality for both text and drawing editors.

## Tasks

### 1. Text History Management

**File:** `src/hooks/useTextHistory.ts`

- [ ] Create useTextHistory hook
- [ ] Get history state from Redux
- [ ] Implement pushHistory function (debounced)
- [ ] Implement undo function
- [ ] Implement redo function
- [ ] Return canUndo and canRedo flags
- [ ] Handle history limits (max 50)

### 2. History State Structure

- [ ] Store content snapshots in history array
- [ ] Include timestamp for each snapshot
- [ ] Include description (e.g., "Text edit", "Formatting change")
- [ ] Track current history index
- [ ] Remove future history when new changes made

### 3. Text Editor Integration

**In TextEditor.tsx:**

- [ ] Call pushHistory on content change (debounced 500ms)
- [ ] Connect undo button to undo action
- [ ] Connect redo button to redo action
- [ ] Restore content from history on undo/redo
- [ ] Update editor state when navigating history

### 4. Undo/Redo UI

**In EditorHeader.tsx:**

- [ ] Add Undo button with icon
- [ ] Add Redo button with icon
- [ ] Disable undo when at history start
- [ ] Disable redo when at history end
- [ ] Show keyboard shortcuts (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z)
- [ ] Add accessibility labels

### 5. Drawing History Management

**File:** `src/hooks/useDrawingHistory.ts`

- [ ] Create useDrawingHistory hook
- [ ] Get history state from Redux
- [ ] Implement pushHistory for strokes array
- [ ] Implement undo function
- [ ] Implement redo function
- [ ] Return canUndo and canRedo flags

### 6. Drawing Editor Integration

**In DrawingEditor.tsx:**

- [ ] Push history after each stroke completion
- [ ] Connect undo button to undo action
- [ ] Connect redo button to redo action
- [ ] Restore strokes from history
- [ ] Re-render canvas on history navigation

### 7. History Optimization

- [ ] Limit history size to 50 items
- [ ] Remove oldest items when limit reached
- [ ] Compress history (store diffs instead of full copies - future)
- [ ] Clear history when note closed
- [ ] Don't push duplicate states

### 8. Debounced History Push

- [ ] Implement debounce for text edits (500ms)
- [ ] Immediate push for major actions (formatting, block type)
- [ ] Immediate push for drawing strokes
- [ ] Flush debounced saves on unmount

### 9. History Actions in Redux

**editorSlice.ts:**

- [ ] pushTextHistory action
- [ ] undoText action
- [ ] redoText action
- [ ] clearTextHistory action
- [ ] pushDrawingHistory action
- [ ] undoDrawing action
- [ ] redoDrawing action
- [ ] clearDrawingHistory action

### 10. Keyboard Shortcuts (Optional)

- [ ] Implement keyboard event listeners
- [ ] Ctrl/Cmd + Z for undo
- [ ] Ctrl/Cmd + Shift + Z for redo
- [ ] Prevent default browser behavior
- [ ] Only active when editor focused

### 11. Visual Feedback

- [ ] Toast notification on undo/redo (optional)
- [ ] Button press animation
- [ ] Disabled button styling
- [ ] Loading state during history restore

### 12. Edge Cases

- [ ] Handle empty history
- [ ] Handle single item in history
- [ ] Handle rapid undo/redo clicks
- [ ] Handle undo/redo while typing
- [ ] Prevent memory leaks with large history

## Testing Checklist

- [ ] Text edit creates history entry
- [ ] Undo restores previous text
- [ ] Redo restores undone text
- [ ] Undo button disabled at start
- [ ] Redo button disabled at end
- [ ] Multiple undos work correctly
- [ ] Multiple redos work correctly
- [ ] New edits clear redo history
- [ ] Drawing stroke creates history entry
- [ ] Undo removes last stroke
- [ ] Redo restores removed stroke
- [ ] History limited to 50 items
- [ ] History cleared on note close
- [ ] Debounce works correctly
- [ ] Performance with full history
- [ ] No memory leaks

## Definition of Done

- Undo/redo fully functional for text
- Undo/redo fully functional for drawing
- History properly managed
- Keyboard shortcuts work (optional)
- Buttons properly disabled
- Performance acceptable
- No memory leaks
- Follows CLAUDE.md patterns
- TypeScript strict mode
