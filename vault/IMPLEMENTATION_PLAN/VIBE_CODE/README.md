# Vibe Code Implementation Guides

## 🎯 Purpose

These guides are specifically designed for **AI-assisted code generation** (vibe coding). Each file contains detailed, step-by-step instructions that can be fed to AI models like Claude, Cursor, GitHub Copilot, or other code generation tools.

## 📋 Guide Structure

Each guide follows this pattern:
1. **Clear task description** - What needs to be built
2. **Required imports** - Exact import statements to use
3. **Critical rules** - Non-negotiable patterns (e.g., `@/` alias, `$` prefix)
4. **Complete code examples** - Copy-paste-ready implementations
5. **Verification checklist** - What to test after implementation

## 📚 Implementation Order

**Follow these guides IN ORDER:**

### Phase 1: Foundation
1. **[00_SETUP.md](./00_SETUP.md)** - Project setup, dependencies, configuration
2. **[01_TYPES.md](./01_TYPES.md)** - TypeScript type definitions
3. **[02_REDUX.md](./02_REDUX.md)** - Redux slices and state management
4. **[03_UTILITIES.md](./03_UTILITIES.md)** - Utility helper functions

### Phase 2: UI Components
5. **[04_BASE_COMPONENTS.md](./04_BASE_COMPONENTS.md)** - Base UI components

### Phase 3: Features
6. **[05_HOME_SCREEN.md](./05_HOME_SCREEN.md)** - Home screen and note list
7. **[06_TEXT_EDITOR.md](./06_TEXT_EDITOR.md)** - Rich text editor
8. **[07_DRAWING_VOICE.md](./07_DRAWING_VOICE.md)** - Drawing canvas and voice features

## 🤖 How to Use with AI Models

### Method 1: Copy-Paste to AI Chat

1. Open the guide file you need
2. Copy the entire content
3. Paste into your AI chat (Claude, ChatGPT, etc.)
4. Add: "Please implement this following all the rules and patterns"

### Method 2: Use with Cursor/Copilot

1. Open the guide in your IDE
2. Use Cursor's "Cmd/Ctrl + K" to reference the file
3. Say: "Implement the code from this guide"

### Method 3: Use with Claude Code CLI

1. Open the guide in the IDE
2. Select the relevant section
3. Ask Claude Code to implement it

### Example Prompt

```
I'm building a React Native Notes app. Please implement the code from this guide exactly as specified. Critical rules:

1. Always use @/ path alias (never relative paths)
2. Always use $ prefix for styled-components props
3. Never use 'any' type - always explicit types
4. Always use typed Redux hooks from @/hooks/hooks
5. Always add accessibility props

[Paste guide content here]
```

## 🎨 Critical Patterns (MUST FOLLOW)

### ✅ Correct Import Pattern
```typescript
import SafeAreaContainer from '@/components/SafeAreaContainer';
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';
import type {Note} from '@/types/note';
```

### ❌ Wrong Import Pattern
```typescript
import SafeAreaContainer from '../../components/SafeAreaContainer';
import {useDispatch, useSelector} from 'react-redux';
```

### ✅ Correct Styled Component
```typescript
interface ButtonProps {
  $variant?: 'primary' | 'secondary';  // $ prefix!
  $disabled?: boolean;
}

const Button = styled.TouchableOpacity<ButtonProps>`
  background-color: ${props => props.theme.background};  // theme colors!
  opacity: ${props => props.$disabled ? 0.5 : 1};
`;

<Button $variant="primary" />  // $ prefix in usage!
```

### ❌ Wrong Styled Component
```typescript
interface ButtonProps {
  variant: string;  // No $ prefix
}

const Button = styled.TouchableOpacity`
  background-color: #fff;  // Hardcoded color
`;

<Button variant="primary" />  // No $ prefix
```

### ✅ Correct Redux Usage
```typescript
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';

const dispatch = useAppDispatch();
const notes = useAppSelector(state => state.notes.notes);
```

### ❌ Wrong Redux Usage
```typescript
import {useDispatch, useSelector} from 'react-redux';

const dispatch = useDispatch();
const notes = useSelector(state => state.notes.notes);
```

## 📦 What Each Guide Contains

### 00_SETUP.md
- Dependencies to install
- iOS/Android configuration
- Platform permissions
- Existing patterns to follow
- Theme system overview

### 01_TYPES.md
- All TypeScript type definitions
- Note, TextContent, DrawingContent types
- Navigation types
- Type guards and validators
- Default values and constants

### 02_REDUX.md
- Redux store configuration
- Notes slice (CRUD operations)
- Editor slice (text/drawing state)
- Voice slice (STT/TTS state)
- Memoized selectors

### 03_UTILITIES.md
- NoteHelper (create, validate notes)
- UUID generation wrapper
- Permission helpers (microphone)
- Storage key constants

### 04_BASE_COMPONENTS.md
- IconButton
- Slider
- ColorPicker
- FAB (Floating Action Button)
- Modal
- ConfirmDialog

### 05_HOME_SCREEN.md
- Home screen with note list
- NoteCard component
- SearchBar with debounce
- FilterBar with chips
- EmptyState
- Custom useNotes hook

### 06_TEXT_EDITOR.md
- TextBlock component (core!)
- FormattingToolbar
- TextEditor container
- Auto-save hook
- NoteEditor screen

### 07_DRAWING_VOICE.md
- DrawingEditor with Skia
- DrawingToolbar
- Voice input hook and component
- Text-to-speech hook and component

## 🔍 Verification After Implementation

After implementing each guide, check:

1. **No TypeScript errors** - Run `tsc --noEmit`
2. **No ESLint errors** - Run `npm run lint`
3. **Imports use @/ alias** - Search for `../` and fix
4. **Styled props use $ prefix** - Search for props without $
5. **No any types** - Search for `: any` and fix
6. **Build succeeds** - Run `npm run android` or `npm run ios`
7. **Features work** - Manual testing

## 🚀 Quick Start Workflow

```bash
# 1. Setup (00_SETUP.md)
npm install @shopify/react-native-skia react-native-svg [etc...]
cd ios && bundle exec pod install && cd ..

# 2. Types (01_TYPES.md)
# Create src/types/note.ts with all types

# 3. Redux (02_REDUX.md)
# Create slices and update store

# 4. Utilities (03_UTILITIES.md)
# Create helper functions

# 5. Components (04_BASE_COMPONENTS.md)
# Build reusable components

# 6. Home Screen (05_HOME_SCREEN.md)
# Implement main screen

# 7. Editors (06_TEXT_EDITOR.md + 07_DRAWING_VOICE.md)
# Build text and drawing editors with voice features

# 8. Test
npm run android
npm run ios
```

## 💡 Pro Tips for Vibe Coding

1. **One guide at a time** - Don't skip ahead
2. **Verify after each step** - Don't accumulate errors
3. **Reference main CLAUDE.md** - For additional context
4. **Copy exact code** - Don't paraphrase the examples
5. **Test frequently** - Run the app after major changes
6. **Use TypeScript strict mode** - Catch errors early
7. **Follow accessibility** - Always add labels
8. **Check theme integration** - All colors from theme
9. **Verify auto-complete** - Confirm @/ alias works
10. **Ask for clarification** - If AI generates wrong pattern

## 🎯 Common Mistakes to Avoid

❌ **Don't:**
- Use relative imports (`../`)
- Use props without `$` prefix in styled-components
- Use `any` type
- Hardcode colors (use theme)
- Use untyped Redux hooks
- Skip accessibility props
- Ignore TypeScript errors
- Mix patterns from different frameworks

✅ **Do:**
- Use `@/` imports everywhere
- Use `$` prefix for all styled props
- Define explicit types
- Use theme colors
- Use typed Redux hooks
- Add accessibility to all interactive elements
- Fix TypeScript errors immediately
- Follow existing codebase patterns

## 📞 Troubleshooting

### TypeScript Errors
- Check all imports use `@/` alias
- Verify no `any` types
- Ensure all interfaces exported
- Check Redux types match state

### Build Errors (iOS)
- Run `cd ios && bundle exec pod install`
- Check Info.plist has required permissions
- Clean build: `cd ios && xcodebuild clean`

### Build Errors (Android)
- Check AndroidManifest.xml has permissions
- Run `cd android && ./gradlew clean`
- Sync gradle: `cd android && ./gradlew --refresh-dependencies`

### Runtime Errors
- Check all dependencies installed
- Verify native modules linked
- Check permissions granted
- Look for console errors

## 📚 Additional Resources

- **Main Guidelines**: `/CLAUDE.md`
- **Best Practices**: `/vault/BEST_PRACTICES.md`
- **Component Library**: `/vault/COMPONENTS.md`
- **Theme System**: `/vault/THEME_SYSTEM.md`
- **Detailed Sprints**: `/vault/IMPLEMENTATION_PLAN/sprints/`
- **Technical Docs**: `/vault/IMPLEMENTATION_PLAN/01_ARCHITECTURE.md` etc.

## ✨ Final Notes

These guides are designed to make AI-assisted development as smooth as possible. By following them exactly and maintaining the patterns, you'll build a robust, maintainable Notes app with:

- ✅ Rich text editing with full formatting
- ✅ Drawing with pencil and eraser
- ✅ Voice input (speech-to-text)
- ✅ Text-to-speech (read aloud)
- ✅ Search, filter, and sort
- ✅ Auto-save
- ✅ Export to multiple formats
- ✅ Light/dark theme support
- ✅ Full accessibility
- ✅ TypeScript strict mode
- ✅ Clean architecture

**Happy vibe coding! 🚀**
