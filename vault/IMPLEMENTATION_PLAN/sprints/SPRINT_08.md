# Sprint 8: Voice Features, Polish & Testing (Week 10-12)

## Goals

Implement voice features (STT/TTS), polish the app, add Settings screen, and comprehensive testing.

## Tasks

### 1. Voice Dependencies Setup

```bash
npm install @react-native-voice/voice
npm install react-native-tts
```

- [ ] Install voice dependencies
- [ ] Configure iOS permissions (Info.plist)
- [ ] Configure Android permissions (AndroidManifest.xml)
- [ ] Link native modules
- [ ] Test basic voice functionality

### 2. Permission Helper

**File:** `src/util/PermissionHelper.ts`

- [ ] Implement requestMicrophonePermission
- [ ] Implement checkMicrophonePermission
- [ ] Handle permission denied
- [ ] Show permission rationale
- [ ] Open settings if permanently denied

### 3. Speech-to-Text Hook

**File:** `src/hooks/useVoiceInput.ts`

- [ ] Create useVoiceInput hook
- [ ] Setup Voice recognition listeners
- [ ] Implement start function
- [ ] Implement stop function
- [ ] Implement cancel function
- [ ] Handle partial results
- [ ] Handle errors
- [ ] Update Redux state

### 4. VoiceInput Component

**File:** `src/components/VoiceInput/VoiceInput.tsx`

- [ ] Create VoiceInput modal component
- [ ] Show listening animation
- [ ] Display recognized text
- [ ] Add Done button
- [ ] Add Cancel button
- [ ] Handle result callback
- [ ] Style with theme

### 5. Integrate Voice Input in Text Editor

**In FormattingToolbar:**

- [ ] Add microphone button
- [ ] Request permission on first use
- [ ] Show VoiceInput modal
- [ ] Insert recognized text at cursor
- [ ] Handle voice input errors
- [ ] Visual feedback while listening

### 6. Text-to-Speech Hook

**File:** `src/hooks/useTextToSpeech.ts`

- [ ] Create useTextToSpeech hook
- [ ] Initialize TTS engine
- [ ] Implement speak function
- [ ] Implement pause function
- [ ] Implement resume function
- [ ] Handle progress updates
- [ ] Handle errors
- [ ] Update Redux state

### 7. ReadAloud Component

**File:** `src/components/TextToSpeech/ReadAloud.tsx`

- [ ] Create ReadAloud controls
- [ ] Play/Pause button (FAB)
- [ ] Progress indicator
- [ ] Speed control slider
- [ ] Pitch control slider
- [ ] Stop button
- [ ] Style with theme

### 8. Integrate Read Aloud in NoteView

**In NoteView screen:**

- [ ] Add read aloud FAB
- [ ] Show controls panel when playing
- [ ] Extract text from note
- [ ] Call TTS speak function
- [ ] Handle interruptions
- [ ] Clean up on unmount

### 9. Voice Settings

**In Settings screen:**

- [ ] Voice input language selector
- [ ] Default speech rate setting
- [ ] Default pitch setting
- [ ] Voice selector (if multiple available)
- [ ] Test voice button
- [ ] Save settings to storage

### 10. Settings Screen

**File:** `src/screens/Settings/Settings.tsx`

- [ ] Create Settings screen
- [ ] Theme selection (Light/Dark/System) - existing
- [ ] Voice settings section
- [ ] Export default format setting
- [ ] About section (version, etc.)
- [ ] Clear cache option (future)
- [ ] Style with theme

### 11. Voice Commands (Optional)

- [ ] Detect voice commands in recognized text
- [ ] Implement commands:
  - "New line" → insert line break
  - "New paragraph" → create new block
  - "Bold" → apply bold formatting
  - "Italic" → apply italic formatting
- [ ] Remove command text from output

### 12. Polish Home Screen

- [ ] Smooth animations
- [ ] Loading skeletons
- [ ] Empty state illustration
- [ ] Pull-to-refresh animation
- [ ] Haptic feedback on interactions
- [ ] Error state handling

### 13. Polish Note Editors

- [ ] Smooth toolbar animations
- [ ] Color picker animations
- [ ] Modal transitions
- [ ] Keyboard animations
- [ ] Haptic feedback
- [ ] Loading states

### 14. Polish NoteView

- [ ] Smooth transitions
- [ ] Menu animations
- [ ] Export progress indicator
- [ ] Share sheet integration
- [ ] Haptic feedback

### 15. Animations with Reanimated

- [ ] FAB scale animation
- [ ] Modal slide animations
- [ ] List item animations
- [ ] Swipe gestures
- [ ] Toolbar transitions

### 16. Error Handling

- [ ] Global error boundary
- [ ] Graceful degradation
- [ ] User-friendly error messages
- [ ] Retry mechanisms
- [ ] Logging (development only)

### 17. Accessibility Improvements

- [ ] All buttons have labels
- [ ] All inputs have labels
- [ ] Proper heading hierarchy
- [ ] Screen reader support
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Sufficient color contrast

### 18. Performance Optimization

- [ ] Optimize note list rendering
- [ ] Lazy load note content
- [ ] Memoize expensive computations
- [ ] Reduce re-renders
- [ ] Profile and fix bottlenecks
- [ ] Memory leak detection

### 19. Testing

**Unit Tests:**
- [ ] Utility functions (NoteHelper, ExportHelper)
- [ ] Redux reducers
- [ ] Selectors
- [ ] Hooks

**Integration Tests:**
- [ ] Note CRUD operations
- [ ] Search and filter
- [ ] Text editing
- [ ] Drawing
- [ ] Export
- [ ] Voice features

**E2E Tests:**
- [ ] Create note flow
- [ ] Edit note flow
- [ ] Delete note flow
- [ ] Export flow
- [ ] Voice input flow

**Manual Testing:**
- [ ] iOS device testing
- [ ] Android device testing
- [ ] Different screen sizes
- [ ] Accessibility testing
- [ ] Performance testing

### 20. Documentation

- [ ] Update README.md
- [ ] Code comments
- [ ] API documentation
- [ ] User guide (optional)

### 21. App Polish

- [ ] App icon
- [ ] Splash screen
- [ ] App name
- [ ] Version number
- [ ] Build configuration
- [ ] Release notes

## Testing Checklist

### Voice Features
- [ ] Request microphone permission
- [ ] Voice input works
- [ ] Recognized text inserted correctly
- [ ] Voice input errors handled
- [ ] TTS plays correctly
- [ ] TTS speed control works
- [ ] TTS pitch control works
- [ ] TTS stops on interruption
- [ ] Voice settings persist
- [ ] Multiple languages work

### Polish
- [ ] Animations smooth
- [ ] No janky scrolling
- [ ] No memory leaks
- [ ] App doesn't crash
- [ ] Fast app launch
- [ ] Responsive UI
- [ ] Theme switches smoothly
- [ ] No visual glitches

### Accessibility
- [ ] VoiceOver works (iOS)
- [ ] TalkBack works (Android)
- [ ] All interactive elements accessible
- [ ] Proper focus order
- [ ] Sufficient contrast
- [ ] Font scaling support

### Cross-Platform
- [ ] Works on iOS
- [ ] Works on Android
- [ ] Consistent behavior
- [ ] Consistent UI
- [ ] Platform-specific features work

## Definition of Done

- Voice input fully functional
- Text-to-speech fully functional
- Settings screen implemented
- All polish completed
- Animations implemented
- Error handling robust
- Accessibility implemented
- All tests passing
- Documentation updated
- Ready for release
- Follows CLAUDE.md patterns
- No critical bugs
- Performance acceptable
- Both platforms working
