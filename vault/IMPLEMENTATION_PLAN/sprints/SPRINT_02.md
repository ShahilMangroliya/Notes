# Sprint 2: Home Screen & Note List (Week 2-3)

## Goals

Build the Home screen with note list, search, filter, and note management functionality.

## Tasks

### 1. Home Screen Structure

**File:** `src/screens/Home/Home.tsx`

- [ ] Create Home screen component
- [ ] Add SafeAreaContainer wrapper
- [ ] Implement screen layout
- [ ] Load notes on mount (dispatch loadNotes)
- [ ] Handle loading and error states
- [ ] Add pull-to-refresh functionality
- [ ] Navigate to NoteEditor on FAB press
- [ ] Navigate to NoteView on card press

### 2. NoteCard Component

**File:** `src/screens/Home/components/NoteCard.tsx`

- [ ] Create NoteCard component
- [ ] Display note title
- [ ] Display note type icon (text/drawing)
- [ ] Display last updated date
- [ ] Display preview (first few lines for text notes)
- [ ] Support pin indicator
- [ ] Support color background
- [ ] Add press handler
- [ ] Add long press handler
- [ ] Support swipe-to-delete (react-native-gesture-handler)
- [ ] Add delete confirmation dialog
- [ ] Use React.memo for optimization

### 3. SearchBar Component

**File:** `src/screens/Home/components/SearchBar.tsx`

- [ ] Create SearchBar component
- [ ] Text input with search icon
- [ ] Clear button (X) when text entered
- [ ] Debounce search input (300ms)
- [ ] Dispatch setSearchQuery action
- [ ] Style with theme colors
- [ ] Add accessibility labels

### 4. FilterBar Component

**File:** `src/screens/Home/components/FilterBar.tsx`

- [ ] Create FilterBar component
- [ ] Display filter chips (All, Text, Drawing, Pinned)
- [ ] Show count for each filter
- [ ] Highlight active filter
- [ ] Dispatch setFilter action on chip press
- [ ] Horizontal scroll for filters
- [ ] Style with theme colors

### 5. FAB for Create Note

**File:** `src/screens/Home/components/CreateNoteFAB.tsx`

- [ ] Use FAB component from component library
- [ ] Position at bottom-right
- [ ] Show action sheet on press with options:
  - Create Text Note
  - Create Drawing Note
- [ ] Navigate to NoteEditor with appropriate noteType
- [ ] Add accessibility label

### 6. Empty State

**File:** `src/screens/Home/components/EmptyState.tsx`

- [ ] Create EmptyState component
- [ ] Show when no notes exist
- [ ] Display helpful message and icon
- [ ] Show "Create Note" button
- [ ] Style with theme colors

### 7. Note List Logic

**Hooks Implementation:**

**File:** `src/hooks/useNotes.ts`

- [ ] Create useNotes custom hook
- [ ] Wrap loadNotes, saveNote, deleteNote actions
- [ ] Return notes, loading state, error
- [ ] Return CRUD functions (create, update, delete, pin)
- [ ] Use typed Redux hooks

**File:** `src/hooks/useSearch.ts`

- [ ] Create useSearch custom hook
- [ ] Get searchQuery from Redux
- [ ] Return setSearchQuery function
- [ ] Debounce search updates

### 8. Sort & Filter Implementation

**In Home Screen:**

- [ ] Use selectSortedNotes selector
- [ ] Use selectFilteredNotes selector
- [ ] Display filtered and sorted notes in FlatList

### 9. Note Actions

**Delete Note:**

- [ ] Show ConfirmDialog before delete
- [ ] Dispatch deleteNote action
- [ ] Show success/error feedback

**Pin/Unpin Note:**

- [ ] Add pin/unpin button to NoteCard
- [ ] Dispatch togglePinNote action
- [ ] Visual feedback for pinned notes

**Change Note Color:**

- [ ] Add color picker to note card menu
- [ ] Dispatch updateNoteColor action
- [ ] Update UI immediately

### 10. Swipe Gestures

- [ ] Implement swipe-to-delete on NoteCard
- [ ] Use react-native-gesture-handler
- [ ] Animate swipe reveal
- [ ] Show delete button on swipe
- [ ] Confirm delete action

### 11. Performance Optimization

- [ ] Use FlatList with proper keyExtractor
- [ ] Memoize NoteCard component
- [ ] Use removeClippedSubviews
- [ ] Set maxToRenderPerBatch and windowSize
- [ ] Optimize re-renders with useMemo and useCallback

### 12. Styling

- [ ] Follow existing theme system
- [ ] Use styled-components with transient props
- [ ] Support light and dark modes
- [ ] Add proper spacing and layout
- [ ] Match design system

## Testing Checklist

- [ ] Load notes from storage on app start
- [ ] Display notes in list
- [ ] Search notes by title
- [ ] Search notes by content
- [ ] Filter notes by type
- [ ] Filter notes by pinned status
- [ ] Sort notes by updated date
- [ ] Sort notes by created date
- [ ] Sort notes by title
- [ ] Create new text note
- [ ] Create new drawing note
- [ ] Delete note with confirmation
- [ ] Pin/unpin note
- [ ] Change note color
- [ ] Swipe to delete
- [ ] Empty state displays correctly
- [ ] Pull to refresh works
- [ ] Performance with 100+ notes
- [ ] Light/dark theme support
- [ ] Accessibility labels work

## Definition of Done

- Home screen displays all notes
- Search functionality works
- Filter functionality works
- Sort functionality works
- Can create new notes
- Can delete notes
- Can pin/unpin notes
- Can change note colors
- Swipe gestures work smoothly
- Performance is acceptable
- No memory leaks
- Code follows patterns from CLAUDE.md
- All components have proper TypeScript types
- Accessibility implemented
