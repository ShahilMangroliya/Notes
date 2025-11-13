# System Architecture

## Overview

The Notes app follows a layered architecture pattern with clear separation of concerns.

## Architecture Layers

```
┌─────────────────────────────────────────────┐
│           Presentation Layer                │
│  (Screens, Components, Navigation)          │
├─────────────────────────────────────────────┤
│           Business Logic Layer              │
│     (Hooks, Redux Slices, Utilities)        │
├─────────────────────────────────────────────┤
│           Data Layer                        │
│  (Storage, Types, State Management)         │
└─────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── types/
│   ├── note.ts                      # Note data types
│   ├── navigation.ts                # Navigation types
│   └── styled-components.d.ts       # Theme types
│
├── redux/
│   ├── store.ts                     # Redux store configuration
│   ├── themeSlice.ts                # Theme state (existing)
│   ├── notesSlice.ts                # Notes management state
│   ├── editorSlice.ts               # Editor state (text/drawing)
│   └── exportSlice.ts               # Export state
│
├── util/
│   ├── StorageHelper.ts             # MMKV wrapper (extend existing)
│   ├── themeColors.ts               # Theme colors (existing)
│   ├── ExportHelper.ts              # Export utilities
│   ├── NoteHelper.ts                # Note operations
│   ├── PermissionHelper.ts          # Permission handling
│   └── uuid.ts                      # UUID generation wrapper
│
├── hooks/
│   ├── hooks.ts                     # Redux typed hooks (existing)
│   ├── useThemeStore.ts             # Theme hook (existing)
│   ├── useNotes.ts                  # Notes management hook
│   ├── useEditor.ts                 # Editor operations hook
│   ├── useAutoSave.ts               # Auto-save hook
│   ├── useSearch.ts                 # Search functionality hook
│   ├── useVoiceInput.ts             # Speech-to-text hook
│   └── useTextToSpeech.ts           # Text-to-speech hook
│
├── components/
│   ├── [existing components]        # Button, Card, Text, etc.
│   ├── ColorPicker/                 # Color selection component
│   ├── IconButton/                  # Icon button component
│   ├── Slider/                      # Slider component
│   ├── FAB/                         # Floating Action Button
│   ├── Modal/                       # Modal component
│   ├── ConfirmDialog/               # Confirmation dialog
│   ├── VoiceInput/                  # Voice input component
│   └── TextToSpeech/                # Text-to-speech controls
│
├── screens/
│   ├── Home/
│   │   ├── Home.tsx                 # Main note list screen
│   │   └── components/
│   │       ├── NoteCard.tsx         # Note preview card
│   │       ├── SearchBar.tsx        # Search input
│   │       ├── FilterBar.tsx        # Filter chips
│   │       └── FAB.tsx              # Create note button
│   │
│   ├── NoteEditor/
│   │   ├── NoteEditor.tsx           # Main editor screen
│   │   ├── TextEditor/
│   │   │   ├── TextEditor.tsx       # Rich text editor
│   │   │   ├── FormattingToolbar.tsx
│   │   │   ├── TextBlock.tsx
│   │   │   └── BlockTypeSelector.tsx
│   │   ├── DrawingEditor/
│   │   │   ├── DrawingEditor.tsx    # Canvas component
│   │   │   ├── DrawingToolbar.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   └── BrushSizeSlider.tsx
│   │   └── EditorHeader.tsx         # Title, save, back
│   │
│   ├── NoteView/
│   │   ├── NoteView.tsx             # Read-only view
│   │   └── components/
│   │       ├── TextRenderer.tsx
│   │       └── DrawingRenderer.tsx
│   │
│   └── Settings/
│       └── Settings.tsx             # App settings
│
├── navigation/
│   └── Navigation.tsx               # Navigation config (extend)
│
├── providers/
│   └── ThemeProvider.tsx            # Theme provider (existing)
│
└── assets/
    └── icons/                       # Icon assets
```

## Data Flow

### Creating a New Note

```
User Action (FAB Press)
    ↓
Navigation (navigate to NoteEditor)
    ↓
NoteEditor Screen
    ↓
useNotes Hook (createNote)
    ↓
Redux Action (notesSlice.createNote)
    ↓
StorageHelper (persist to MMKV)
    ↓
State Update
    ↓
UI Re-render
```

### Editing Text

```
User Input (TextInput change)
    ↓
TextBlock Component
    ↓
useEditor Hook
    ↓
Redux Action (editorSlice.updateFormatting)
    ↓
useAutoSave Hook (debounced 500ms)
    ↓
Redux Action (notesSlice.updateNote)
    ↓
StorageHelper (persist)
    ↓
State Update
```

### Voice Input Flow

```
User Action (Microphone button)
    ↓
useVoiceInput Hook (startListening)
    ↓
@react-native-voice/voice
    ↓
Voice Recognition
    ↓
onResult callback
    ↓
Insert text at cursor position
    ↓
Auto-save triggered
```

## State Management Strategy

### Redux Store Structure

```typescript
{
  theme: {
    mode: 'light' | 'dark' | 'system',  // Existing
  },
  notes: {
    notes: Note[],
    currentNote: Note | null,
    filter: 'all' | 'text' | 'drawing' | 'pinned',
    searchQuery: string,
    sortBy: 'updatedAt' | 'createdAt' | 'title',
    isLoading: boolean,
  },
  editor: {
    // Text editor state
    selectedBlockId: string | null,
    currentFormatting: TextFormatting,
    history: HistoryState[],
    historyIndex: number,

    // Drawing editor state
    selectedTool: 'pencil' | 'eraser',
    brushSize: number,
    brushColor: string,
    isDrawing: boolean,
  },
  export: {
    format: 'pdf' | 'text' | 'image' | 'json',
    isExporting: boolean,
    lastExportPath: string | null,
  },
}
```

## Storage Strategy

### MMKV Storage Keys

```typescript
'notes.theme'              // Theme mode (existing)
'notes.list'               // Array of note IDs (for quick loading)
'notes.${id}'              // Individual note content
'notes.settings'           // App settings
'notes.voice.language'     // Preferred voice input language
'notes.tts.rate'           // Text-to-speech rate
'notes.tts.pitch'          // Text-to-speech pitch
'notes.tts.voice'          // Preferred TTS voice
```

### Storage Organization

- **Metadata:** Store note list with minimal data (id, title, type, updatedAt)
- **Content:** Store full note content separately by ID
- **Lazy Loading:** Load note content only when viewing/editing
- **Auto-save:** Debounced writes to prevent excessive disk I/O

## Performance Optimization Strategies

### Rendering Optimization

1. **React.memo** for note cards in list
2. **useMemo** for filtered/sorted note lists
3. **useCallback** for event handlers
4. **FlatList** with proper keyExtractor for note list
5. **Lazy loading** for note content

### Drawing Optimization

1. **Throttle** touch events to 60 FPS
2. **Path simplification** to reduce point count
3. **GPU acceleration** via @shopify/react-native-skia
4. **Limit strokes** to 1000 per drawing
5. **Offscreen rendering** for complex drawings

### Text Editor Optimization

1. **Debounce** auto-save (500ms)
2. **Virtualize** long documents (future enhancement)
3. **Limit history** to 50 snapshots
4. **Compress history** (store diffs, not full copies)

### Voice Features Optimization

1. **Background processing** for TTS
2. **Cancel pending requests** on unmount
3. **Debounce** voice input results
4. **Cache** TTS audio (platform-dependent)

## Navigation Architecture

### Route Structure

```typescript
type RootStackParamList = {
  Home: undefined;
  NoteEditor: {
    noteId?: string;              // undefined = create new
    noteType: 'text' | 'drawing';
  };
  NoteView: {
    noteId: string;
  };
  Settings: undefined;
};
```

### Navigation Flow

```
Home Screen
    ├─→ NoteEditor (create new text)
    ├─→ NoteEditor (create new drawing)
    ├─→ NoteEditor (edit existing)
    ├─→ NoteView (view existing)
    └─→ Settings

NoteEditor
    ├─→ Back to Home (save on back)
    └─→ NoteView (switch to read-only)

NoteView
    ├─→ NoteEditor (switch to edit mode)
    └─→ Back to Home
```

## Component Composition Pattern

### Example: FormattingToolbar

```typescript
<FormattingToolbar>
  <ToolbarGroup label="Text Style">
    <IconButton icon="bold" onPress={toggleBold} $active={isBold} />
    <IconButton icon="italic" onPress={toggleItalic} $active={isItalic} />
    <IconButton icon="underline" onPress={toggleUnderline} $active={isUnderline} />
  </ToolbarGroup>

  <ToolbarGroup label="Font">
    <FontSizePicker value={fontSize} onChange={setFontSize} />
    <FontFamilyPicker value={fontFamily} onChange={setFontFamily} />
  </ToolbarGroup>

  <ToolbarGroup label="Color">
    <ColorPicker value={textColor} onChange={setTextColor} />
    <ColorPicker value={bgColor} onChange={setBgColor} label="Highlight" />
  </ToolbarGroup>

  <ToolbarGroup label="Voice">
    <IconButton icon="microphone" onPress={startVoiceInput} $active={isListening} />
  </ToolbarGroup>
</FormattingToolbar>
```

## Error Handling Strategy

### Levels of Error Handling

1. **Component Level:** Try-catch in async operations
2. **Hook Level:** Error state management
3. **Redux Level:** Error actions and state
4. **Global Level:** Error boundary for catastrophic failures

### Error Categories

- **Storage Errors:** Failed to save/load note
- **Permission Errors:** Microphone access denied
- **Network Errors:** TTS/STT service unavailable
- **Validation Errors:** Invalid note data
- **Export Errors:** Failed to generate export file

### Error Recovery

- **Auto-retry:** For transient failures (storage, network)
- **User notification:** For permission/validation errors
- **Fallback:** Graceful degradation (e.g., disable voice if unavailable)
- **Logging:** Debug mode for development

## Security Considerations

1. **Input Validation:** Sanitize user input
2. **Storage Encryption:** MMKV supports encryption (optional)
3. **Permission Handling:** Request only necessary permissions
4. **Export Safety:** Validate file paths before writing
5. **Voice Data:** No voice data stored/transmitted (processed on-device)

## Accessibility Architecture

### ARIA Roles and Labels

All interactive components must include:
- `accessibilityRole`
- `accessibilityLabel`
- `accessibilityState`
- `accessibilityHint` (where helpful)

### Keyboard Navigation

- Tab order follows logical flow
- All actions accessible via keyboard
- Visual focus indicators

### Screen Reader Support

- Semantic HTML/component structure
- Descriptive labels for all actions
- Announce state changes (e.g., "Note saved")

## Testing Strategy

### Unit Tests
- Utility functions (NoteHelper, ExportHelper)
- Redux reducers and actions
- Custom hooks

### Integration Tests
- Note creation flow
- Text editing flow
- Drawing flow
- Export flow

### E2E Tests
- Full user journeys
- Cross-platform testing (iOS/Android)

## Deployment Architecture

### Build Variants

- **Development:** Debug mode, all logs
- **Staging:** Release mode, verbose logs
- **Production:** Release mode, error logs only

### Platform-Specific Considerations

#### iOS
- CocoaPods for native dependencies
- Info.plist permissions configuration
- Bundle size optimization

#### Android
- Gradle configuration
- AndroidManifest.xml permissions
- ProGuard for code obfuscation

## Future Enhancement Considerations

### Scalability
- Cloud sync (future)
- Collaborative editing (future)
- Attachments support (images, files)
- Rich media embeds (links, videos)

### Performance
- Background sync
- Incremental save (store diffs)
- Database migration (SQLite for large datasets)

### Features
- Templates
- Note linking
- Tags and categories
- Handwriting recognition
- OCR for images
