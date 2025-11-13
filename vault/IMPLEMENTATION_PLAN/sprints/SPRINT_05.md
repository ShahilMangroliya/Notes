# Sprint 5: Drawing Editor (Week 6-8)

## Goals

Implement high-performance drawing canvas with pencil, eraser, and advanced drawing features using Skia.

## Tasks

### 1. Skia Setup

- [ ] Verify @shopify/react-native-skia installation
- [ ] Test basic Skia canvas rendering
- [ ] Configure iOS native modules
- [ ] Configure Android native modules
- [ ] Run pod install for iOS

### 2. DrawingEditor Component

**File:** `src/screens/NoteEditor/DrawingEditor/DrawingEditor.tsx`

- [ ] Create DrawingEditor container
- [ ] Setup Skia Canvas component
- [ ] Initialize canvas size
- [ ] Get drawing content from note
- [ ] Render existing strokes
- [ ] Setup gesture handling
- [ ] Implement touch event handlers
- [ ] Update Redux state on changes

### 3. Gesture Handling

- [ ] Setup Gesture.Pan from react-native-gesture-handler
- [ ] Handle onStart (begin stroke)
- [ ] Handle onUpdate (add points to stroke)
- [ ] Handle onEnd (complete stroke)
- [ ] Track current stroke in component state
- [ ] Throttle touch events to 60 FPS

### 4. Stroke Rendering

- [ ] Create path from stroke points
- [ ] Apply stroke color
- [ ] Apply stroke width
- [ ] Set stroke cap to round
- [ ] Set stroke join to round
- [ ] Render completed strokes
- [ ] Render current stroke in progress
- [ ] Optimize rendering performance

### 5. DrawingToolbar Component

**File:** `src/screens/NoteEditor/DrawingEditor/DrawingToolbar.tsx`

- [ ] Create DrawingToolbar component
- [ ] Tool selector (Pencil/Eraser buttons)
- [ ] Brush size slider
- [ ] Color picker
- [ ] Undo/Redo buttons
- [ ] Clear canvas button
- [ ] Get tool state from Redux
- [ ] Dispatch tool change actions
- [ ] Style with theme

### 6. Pencil Tool

- [ ] Select pencil tool
- [ ] Use brush size from Redux
- [ ] Use brush color from Redux
- [ ] Create new stroke on touch
- [ ] Add points as user draws
- [ ] Store stroke on touch end
- [ ] Visual cursor indicator

### 7. Eraser Tool

- [ ] Select eraser tool
- [ ] Detect strokes intersecting eraser position
- [ ] Remove intersecting strokes
- [ ] Use brush size as eraser radius
- [ ] Visual eraser cursor
- [ ] Smooth erasing performance

### 8. Brush Size Control

**File:** `src/components/Slider/Slider.tsx` (reuse)

- [ ] Add brush size slider to toolbar
- [ ] Range: 1-50 px
- [ ] Display current size value
- [ ] Update Redux on change
- [ ] Visual preview of size

### 9. Color Picker

**File:** `src/components/ColorPicker/ColorPicker.tsx` (reuse)

- [ ] Add color picker to toolbar
- [ ] Predefined color palette
- [ ] Display selected color
- [ ] Update Redux on selection
- [ ] Support custom colors (future)

### 10. Clear Canvas

- [ ] Add clear button to toolbar
- [ ] Show confirmation dialog
- [ ] Clear all strokes on confirm
- [ ] Push to history before clearing
- [ ] Update Redux state

### 11. Drawing History Integration

- [ ] Push history after each stroke
- [ ] Implement undo (remove last stroke)
- [ ] Implement redo (restore removed stroke)
- [ ] Update canvas on undo/redo
- [ ] Clear history on canvas clear

### 12. Performance Optimization

- [ ] Throttle touch events (16ms = 60 FPS)
- [ ] Limit points per stroke (max 1000)
- [ ] Simplify paths (Douglas-Peucker algorithm - optional)
- [ ] Offscreen canvas for complex drawings (optional)
- [ ] Lazy rendering for large stroke count

### 13. Canvas Background

- [ ] Support background color
- [ ] Default to white
- [ ] Changeable via settings (future)
- [ ] Render background in canvas

### 14. Path Smoothing (Optional)

- [ ] Implement Catmull-Rom spline smoothing
- [ ] Apply to completed strokes
- [ ] Toggle smoothing option (future)

### 15. Pressure Sensitivity (Optional)

- [ ] Detect pressure from touch events
- [ ] Vary stroke width based on pressure
- [ ] Store pressure data in points
- [ ] Render with variable width

### 16. Save Drawing

- [ ] Auto-save drawing on stroke completion
- [ ] Serialize strokes to JSON
- [ ] Store in MMKV
- [ ] Handle large drawings

### 17. Load Drawing

- [ ] Load strokes from storage
- [ ] Deserialize JSON to stroke objects
- [ ] Render all strokes on canvas
- [ ] Handle missing/corrupted data

## Testing Checklist

- [ ] Canvas renders correctly
- [ ] Can draw with pencil
- [ ] Can erase strokes
- [ ] Brush size changes work
- [ ] Color changes work
- [ ] Undo removes last stroke
- [ ] Redo restores stroke
- [ ] Clear canvas works
- [ ] Drawing saves automatically
- [ ] Drawing loads correctly
- [ ] Performance at 60 FPS
- [ ] Performance with 100+ strokes
- [ ] No memory leaks
- [ ] Works on iOS
- [ ] Works on Android
- [ ] Theme colors applied

## Definition of Done

- Drawing editor fully functional
- Pencil and eraser tools work
- Brush size and color selectable
- Undo/redo implemented
- Clear canvas works
- Auto-save implemented
- Performance 60 FPS
- No memory leaks
- Works on both platforms
- Follows CLAUDE.md patterns
- TypeScript strict mode
