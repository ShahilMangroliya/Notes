# Sprint 1: Foundation (Week 1-2)

## Goals

Establish the foundational architecture, data models, Redux state management, and base components for the Notes app.

## Tasks

### 1. Setup Type Definitions

**File:** `src/types/note.ts`

- [ ] Create `Note` interface
- [ ] Create `TextContent` and `TextBlock` interfaces
- [ ] Create `DrawingContent` and `DrawingStroke` interfaces
- [ ] Create `TextFormatting` interface
- [ ] Create `Point` interface
- [ ] Create type guards (isTextContent, isDrawingContent)
- [ ] Export default values and constants

**File:** `src/types/navigation.ts`

- [ ] Create `RootStackParamList` type
- [ ] Create screen props types (HomeScreenProps, etc.)
- [ ] Export navigation helpers

### 2. Redux Slices

**File:** `src/redux/notesSlice.ts`

- [ ] Create `NotesState` interface
- [ ] Implement `loadNotes` async thunk
- [ ] Implement `saveNote` async thunk
- [ ] Implement `deleteNote` async thunk
- [ ] Implement synchronous actions (setCurrentNote, setFilter, etc.)
- [ ] Add extra reducers for async actions
- [ ] Export actions and reducer

**File:** `src/redux/editorSlice.ts`

- [ ] Create `EditorState` interface
- [ ] Create `TextEditorState` interface
- [ ] Create `DrawingEditorState` interface
- [ ] Implement text formatting actions
- [ ] Implement history management actions (undo/redo)
- [ ] Implement drawing tool actions
- [ ] Export actions and reducer

**File:** `src/redux/exportSlice.ts`

- [ ] Create `ExportState` interface
- [ ] Implement `exportNote` async thunk
- [ ] Implement format selection actions
- [ ] Export actions and reducer

**File:** `src/redux/voiceSlice.ts`

- [ ] Create `VoiceState` interface
- [ ] Implement STT actions (startListening, stopListening, etc.)
- [ ] Implement TTS actions (startSpeaking, setRate, etc.)
- [ ] Export actions and reducer

**File:** `src/redux/store.ts`

- [ ] Add all new reducers to store
- [ ] Configure middleware for non-serializable values
- [ ] Export store types

**File:** `src/redux/selectors.ts`

- [ ] Create memoized selectors for notes
- [ ] Create filtered notes selector
- [ ] Create sorted notes selector
- [ ] Create editor state selectors
- [ ] Create voice state selectors

### 3. Extend StorageHelper

**File:** `src/util/StorageHelper.ts`

- [ ] Add new storage key constants
  - `NOTES_LIST_KEY = 'notes.list'`
  - `NOTE_PREFIX = 'notes.'`
  - `VOICE_LANGUAGE_KEY = 'notes.voice.language'`
  - `TTS_RATE_KEY = 'notes.tts.rate'`
  - `TTS_PITCH_KEY = 'notes.tts.pitch'`

### 4. Create Utility Helpers

**File:** `src/util/NoteHelper.ts`

- [ ] `createTextNote(title: string): Note`
- [ ] `createDrawingNote(title: string): Note`
- [ ] `updateNoteTimestamp(note: Note): Note`
- [ ] `validateNote(note: Note): ValidationResult`

**File:** `src/util/uuid.ts`

- [ ] Install `uuid` package
- [ ] Create UUID wrapper function
- [ ] Export as default

**File:** `src/util/PermissionHelper.ts`

- [ ] `requestMicrophonePermission(): Promise<boolean>`
- [ ] `checkMicrophonePermission(): Promise<boolean>`

### 5. Create Base Components

**File:** `src/components/IconButton/IconButton.tsx`

- [ ] Create IconButton component with transient props
- [ ] Support variants (primary, secondary, ghost)
- [ ] Support sizes (small, medium, large)
- [ ] Support active state
- [ ] Add accessibility props
- [ ] Export component and types

**File:** `src/components/ColorPicker/ColorPicker.tsx`

- [ ] Create ColorPicker component
- [ ] Support color palette
- [ ] Support custom colors
- [ ] Support variants (compact, full)
- [ ] Export component and types

**File:** `src/components/Slider/Slider.tsx`

- [ ] Create Slider component with transient props
- [ ] Support min/max/step values
- [ ] Support label and value display
- [ ] Style with theme colors
- [ ] Export component and types

**File:** `src/components/FAB/FAB.tsx`

- [ ] Create Floating Action Button component
- [ ] Support positions (bottom-right, bottom-center, bottom-left)
- [ ] Support sizes
- [ ] Add elevation/shadow
- [ ] Export component and types

**File:** `src/components/Modal/Modal.tsx`

- [ ] Create Modal component
- [ ] Support variants (center, bottom-sheet)
- [ ] Support backdrop dismiss
- [ ] Add animations
- [ ] Export component and types

**File:** `src/components/ConfirmDialog/ConfirmDialog.tsx`

- [ ] Create ConfirmDialog component
- [ ] Support title, message, buttons
- [ ] Support destructive variant
- [ ] Export component and types

**File:** `src/components/index.ts`

- [ ] Export all new components

### 6. Update Navigation

**File:** `src/navigation/Navigation.tsx`

- [ ] Update `RootStackParamList` with new routes
- [ ] Keep Home screen
- [ ] Add NoteEditor route (replace CreateNote)
- [ ] Add NoteView route
- [ ] Add Settings route

### 7. Install Dependencies

```bash
npm install @shopify/react-native-skia
npm install react-native-svg
npm install react-native-share
npm install @react-native-voice/voice
npm install react-native-tts
npm install uuid
npm install --save-dev @types/uuid
```

### 8. Platform Configuration

**iOS:** `ios/Notes/Info.plist`

- [ ] Add NSMicrophoneUsageDescription
- [ ] Add NSSpeechRecognitionUsageDescription

**Android:** `android/app/src/main/AndroidManifest.xml`

- [ ] Add RECORD_AUDIO permission
- [ ] Add INTERNET permission

### 9. Run iOS Setup

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

## Testing Checklist

- [ ] Store configuration compiles
- [ ] All slices export correctly
- [ ] Type definitions have no errors
- [ ] Components render without errors
- [ ] Theme integration works
- [ ] Navigation compiles
- [ ] iOS build succeeds
- [ ] Android build succeeds

## Definition of Done

- All TypeScript types defined without `any`
- All Redux slices implemented and tested
- All base components created with proper styling
- All dependencies installed and configured
- iOS and Android builds succeed
- No TypeScript errors
- No ESLint errors
- Code follows CLAUDE.md patterns
