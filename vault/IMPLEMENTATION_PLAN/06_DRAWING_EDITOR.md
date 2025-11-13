# Drawing Editor Implementation

## Overview

High-performance drawing canvas using @shopify/react-native-skia for GPU-accelerated rendering.

## Dependencies

```bash
npm install @shopify/react-native-skia
```

## Core Architecture

```
DrawingEditor (Container)
    ├── Canvas (Skia Canvas)
    │   └── Path[] (Rendered strokes)
    ├── DrawingToolbar (Tools, colors, sizes)
    └── GestureHandler (Touch events)
```

## DrawingEditor Component

**File:** `src/screens/NoteEditor/DrawingEditor/DrawingEditor.tsx`

```typescript
import React, {useCallback, useRef} from 'react';
import {Canvas, Path, Skia, useDrawCallback} from '@shopify/react-native-skia';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import type {DrawingContent, DrawingStroke, Point} from '@/types/note';

export interface DrawingEditorProps {
  content: DrawingContent;
  onChange: (content: DrawingContent) => void;
}

export const DrawingEditor: React.FC<DrawingEditorProps> = ({content, onChange}) => {
  const {selectedTool, brushSize, brushColor} = useAppSelector(selectDrawingEditor);
  const currentStroke = useRef<Point[]>([]);

  const handleTouchStart = useCallback((x: number, y: number) => {
    currentStroke.current = [{x, y}];
  }, []);

  const handleTouchMove = useCallback((x: number, y: number) => {
    currentStroke.current.push({x, y});
    // Trigger re-render with current stroke
  }, []);

  const handleTouchEnd = useCallback(() => {
    const newStroke: DrawingStroke = {
      id: uuid(),
      points: currentStroke.current,
      color: brushColor,
      width: brushSize,
      tool: selectedTool,
      timestamp: Date.now(),
    };

    onChange({
      ...content,
      strokes: [...content.strokes, newStroke],
    });

    currentStroke.current = [];
  }, [content, brushColor, brushSize, selectedTool]);

  const gesture = Gesture.Pan()
    .onStart((e) => {
      handleTouchStart(e.x, e.y);
    })
    .onUpdate((e) => {
      handleTouchMove(e.x, e.y);
    })
    .onEnd(() => {
      handleTouchEnd();
    });

  return (
    <Container>
      <DrawingToolbar />

      <GestureDetector gesture={gesture}>
        <Canvas
          style={{flex: 1}}
          onDraw={(canvas) => {
            canvas.clear();

            // Draw all completed strokes
            content.strokes.forEach(stroke => {
              const path = createPathFromStroke(stroke);
              const paint = Skia.Paint();
              paint.setColor(Skia.Color(stroke.color));
              paint.setStrokeWidth(stroke.width);
              paint.setStyle(Skia.PaintStyle.Stroke);
              paint.setStrokeCap(Skia.StrokeCap.Round);
              paint.setStrokeJoin(Skia.StrokeJoin.Round);

              canvas.drawPath(path, paint);
            });

            // Draw current stroke in progress
            if (currentStroke.current.length > 0) {
              const path = createPathFromPoints(currentStroke.current);
              const paint = Skia.Paint();
              paint.setColor(Skia.Color(brushColor));
              paint.setStrokeWidth(brushSize);
              paint.setStyle(Skia.PaintStyle.Stroke);
              paint.setStrokeCap(Skia.StrokeCap.Round);
              paint.setStrokeJoin(Skia.StrokeJoin.Round);

              canvas.drawPath(path, paint);
            }
          }}
        />
      </GestureDetector>
    </Container>
  );
};

const createPathFromStroke = (stroke: DrawingStroke) => {
  return createPathFromPoints(stroke.points);
};

const createPathFromPoints = (points: Point[]) => {
  const path = Skia.Path.Make();

  if (points.length === 0) return path;

  path.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    path.lineTo(points[i].x, points[i].y);
  }

  return path;
};
```

## Drawing Toolbar

**File:** `src/screens/NoteEditor/DrawingEditor/DrawingToolbar.tsx`

```typescript
export const DrawingToolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const {selectedTool, brushSize, brushColor} = useAppSelector(selectDrawingEditor);

  return (
    <ToolbarContainer>
      {/* Tool Selection */}
      <ToolGroup>
        <IconButton
          icon="pencil"
          onPress={() => dispatch(setDrawingTool('pencil'))}
          $active={selectedTool === 'pencil'}
          accessibilityLabel="Pencil tool"
        />
        <IconButton
          icon="eraser"
          onPress={() => dispatch(setDrawingTool('eraser'))}
          $active={selectedTool === 'eraser'}
          accessibilityLabel="Eraser tool"
        />
      </ToolGroup>

      {/* Brush Size */}
      <BrushSizeSlider
        $value={brushSize}
        onValueChange={(size) => dispatch(setBrushSize(size))}
      />

      {/* Color Picker */}
      <ColorPicker
        $selectedColor={brushColor}
        onColorSelect={(color) => dispatch(setBrushColor(color))}
      />

      {/* Undo/Redo */}
      <ToolGroup>
        <IconButton
          icon="undo"
          onPress={() => dispatch(undoDrawing())}
          $disabled={!canUndo}
          accessibilityLabel="Undo"
        />
        <IconButton
          icon="redo"
          onPress={() => dispatch(redoDrawing())}
          $disabled={!canRedo}
          accessibilityLabel="Redo"
        />
      </ToolGroup>

      {/* Clear Canvas */}
      <IconButton
        icon="trash"
        onPress={handleClearCanvas}
        accessibilityLabel="Clear canvas"
      />
    </ToolbarContainer>
  );
};
```

## Brush Size Slider

**File:** `src/components/Slider/Slider.tsx`

```typescript
export interface SliderProps {
  $value: number;
  onValueChange: (value: number) => void;
  $min?: number;
  $max?: number;
  $step?: number;
  label?: string;
}

export const Slider: React.FC<SliderProps> = ({
  $value,
  onValueChange,
  $min = 1,
  $max = 50,
  $step = 1,
  label,
}) => {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <RNSlider
        value={$value}
        onValueChange={onValueChange}
        minimumValue={$min}
        maximumValue={$max}
        step={$step}
        minimumTrackTintColor={theme => theme.primary}
        maximumTrackTintColor={theme => theme.border}
      />
      <ValueLabel>{$value}</ValueLabel>
    </Container>
  );
};
```

## Eraser Implementation

```typescript
const handleEraserTouch = useCallback((x: number, y: number) => {
  // Find strokes that intersect with eraser position
  const eraserRadius = brushSize / 2;

  const remainingStrokes = content.strokes.filter(stroke => {
    return !isStrokeIntersecting(stroke, {x, y}, eraserRadius);
  });

  if (remainingStrokes.length !== content.strokes.length) {
    onChange({
      ...content,
      strokes: remainingStrokes,
    });
  }
}, [content, brushSize]);

const isStrokeIntersecting = (
  stroke: DrawingStroke,
  point: Point,
  radius: number
): boolean => {
  // Check if any point in stroke is within eraser radius
  return stroke.points.some(p => {
    const distance = Math.sqrt(
      Math.pow(p.x - point.x, 2) + Math.pow(p.y - point.y, 2)
    );
    return distance <= radius;
  });
};
```

## Path Smoothing (Optional)

```typescript
// Smooth path using Catmull-Rom spline
const smoothPath = (points: Point[]): Point[] => {
  if (points.length < 3) return points;

  const smoothed: Point[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Interpolate between p1 and p2
    for (let t = 0; t < 1; t += 0.1) {
      smoothed.push(catmullRom(p0, p1, p2, p3, t));
    }
  }

  return smoothed;
};

const catmullRom = (p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point => {
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x: 0.5 * (
      2 * p1.x +
      (-p0.x + p2.x) * t +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
    ),
    y: 0.5 * (
      2 * p1.y +
      (-p0.y + p2.y) * t +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
    ),
  };
};
```

## Performance Optimization

### Throttle Touch Events

```typescript
const throttledMove = useRef(
  throttle((x: number, y: number) => {
    handleTouchMove(x, y);
  }, 16) // 60 FPS
).current;
```

### Limit Points per Stroke

```typescript
const MAX_POINTS_PER_STROKE = 1000;

const handleTouchMove = useCallback((x: number, y: number) => {
  if (currentStroke.current.length < MAX_POINTS_PER_STROKE) {
    currentStroke.current.push({x, y});
  }
}, []);
```

### Simplify Path

```typescript
// Douglas-Peucker algorithm to reduce points
const simplifyPath = (points: Point[], tolerance: number = 2): Point[] => {
  if (points.length < 3) return points;

  // Find point with maximum distance
  let maxDistance = 0;
  let index = 0;

  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(
      points[i],
      points[0],
      points[points.length - 1]
    );

    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }

  // If max distance is greater than tolerance, recursively simplify
  if (maxDistance > tolerance) {
    const left = simplifyPath(points.slice(0, index + 1), tolerance);
    const right = simplifyPath(points.slice(index), tolerance);

    return [...left.slice(0, -1), ...right];
  } else {
    return [points[0], points[points.length - 1]];
  }
};
```

## Undo/Redo for Drawing

```typescript
// src/hooks/useDrawingHistory.ts
export const useDrawingHistory = () => {
  const dispatch = useAppDispatch();
  const {history, historyIndex} = useAppSelector(
    state => state.editor.drawingEditor
  );

  const pushHistory = useCallback((strokes: DrawingStroke[]) => {
    const historyState: DrawingHistoryState = {
      strokes: [...strokes],
      timestamp: Date.now(),
      description: 'Drawing',
    };
    dispatch(pushDrawingHistory(historyState));
  }, [dispatch]);

  const undo = useCallback(() => {
    dispatch(undoDrawing());
  }, [dispatch]);

  const redo = useCallback(() => {
    dispatch(redoDrawing());
  }, [dispatch]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {pushHistory, undo, redo, canUndo, canRedo};
};
```

## Pressure Sensitivity (Optional)

```typescript
// If device supports pressure
interface PressurePoint extends Point {
  pressure: number; // 0-1
}

const handleTouchMove = (x: number, y: number, pressure?: number) => {
  currentStroke.current.push({
    x,
    y,
    pressure: pressure || 1,
  });
};

// Adjust brush size based on pressure
const effectiveBrushSize = brushSize * (point.pressure || 1);
```

## Color Palettes

```typescript
export const DRAWING_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#FFC0CB', // Pink
  '#A52A2A', // Brown
  '#808080', // Gray
] as const;
```

## Testing Checklist

- [ ] Draw with pencil tool
- [ ] Erase with eraser tool
- [ ] Change brush size
- [ ] Change brush color
- [ ] Undo drawing
- [ ] Redo drawing
- [ ] Clear canvas
- [ ] Save drawing
- [ ] Load drawing
- [ ] Performance with 100+ strokes
- [ ] Smooth drawing at 60 FPS
- [ ] Memory usage
- [ ] Accessibility
