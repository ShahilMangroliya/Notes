# FormattingHelper Utilities

Pure functions for managing text formatting ranges in the Rich Text Editor.

## Overview

FormattingHelper provides a comprehensive set of utilities for working with formatting ranges, including:
- Applying and merging formatting
- Adjusting ranges after text changes
- Validating ranges
- Toggle operations

All functions are **pure** - they don't mutate input and have no side effects.

## Installation

Import the utilities you need:

```typescript
import {
  applyFormattingRange,
  toggleFormattingProperty,
  adjustRangesForTextChange,
  getFormattingAtPosition,
  validateRanges,
} from '@/util/FormattingHelper';
```

## Core Functions

### applyFormattingRange

Applies new formatting to a selection, handling overlapping ranges intelligently.

**Signature:**
```typescript
applyFormattingRange(
  existingRanges: FormattingRange[],
  newRange: FormattingRange
): FormattingRange[]
```

**Algorithm:**
1. Remove parts of existing ranges that overlap with new range
2. Split ranges that partially overlap
3. Add the new range
4. Merge adjacent ranges with identical formatting

**Example:**
```typescript
const existing = [
  { start: 0, end: 10, formatting: { bold: true } }
];

const newRange = {
  start: 5,
  end: 15,
  formatting: { italic: true }
};

const result = applyFormattingRange(existing, newRange);
// Result:
// [
//   { start: 0, end: 5, formatting: { bold: true } },
//   { start: 5, end: 15, formatting: { italic: true } }
// ]
```

**Use Cases:**
- User selects text and applies formatting
- Overwriting existing formatting in a range
- Building up complex formatted documents

### toggleFormattingProperty

Toggles a boolean formatting property (bold, italic, etc.).

**Signature:**
```typescript
toggleFormattingProperty(
  ranges: FormattingRange[],
  start: number,
  end: number,
  property: 'bold' | 'italic' | 'underline' | 'strikethrough'
): FormattingRange[]
```

**Logic:**
- If **any** part of the range has the property enabled → disable it
- Otherwise → enable it

**Example:**
```typescript
const ranges = [
  { start: 0, end: 5, formatting: { bold: true } }
];

// Toggle bold on 0-5 (currently bold) → remove bold
const result1 = toggleFormattingProperty(ranges, 0, 5, 'bold');
// Result: [] (bold removed)

// Toggle bold on 5-10 (currently not bold) → add bold
const result2 = toggleFormattingProperty(ranges, 5, 10, 'bold');
// Result: [
//   { start: 0, end: 5, formatting: { bold: true } },
//   { start: 5, end: 10, formatting: { bold: true } }
// ] (merged to one range)
```

**Use Cases:**
- Toolbar button clicks (toggle bold/italic)
- Keyboard shortcuts (Cmd+B)
- Context menu actions

### adjustRangesForTextChange

Adjusts formatting ranges after text insertion or deletion.

**Signature:**
```typescript
adjustRangesForTextChange(
  ranges: FormattingRange[],
  position: number,
  delta: number
): FormattingRange[]
```

**Parameters:**
- `position`: Where the change occurred
- `delta`: Change in text length (positive = insertion, negative = deletion)

**Logic:**
- Ranges **before** change: unchanged
- Ranges **after** change: shifted by delta
- Ranges **overlapping** change: adjusted appropriately

**Example - Insertion:**
```typescript
const ranges = [
  { start: 0, end: 5, formatting: { bold: true } }  // "Hello"
];

// Insert "Big " at position 0
const result = adjustRangesForTextChange(ranges, 0, 4);
// Result:
// [
//   { start: 4, end: 9, formatting: { bold: true } }  // "Big Hello"
// ]
```

**Example - Deletion:**
```typescript
const ranges = [
  { start: 0, end: 11, formatting: { bold: true } }  // "Hello World"
];

// Delete "Hello " (6 characters) at position 0
const result = adjustRangesForTextChange(ranges, 0, -6);
// Result:
// [
//   { start: 0, end: 5, formatting: { bold: true } }  // "World"
// ]
```

**Use Cases:**
- User types new text
- User deletes text
- Paste operations
- Undo/redo operations

### getFormattingAtPosition

Gets the effective formatting at a specific text position.

**Signature:**
```typescript
getFormattingAtPosition(
  ranges: FormattingRange[],
  position: number
): Partial<TextFormatting>
```

**Logic:**
When multiple ranges overlap at a position, later ranges override earlier ones for conflicting properties.

**Example:**
```typescript
const ranges = [
  { start: 0, end: 10, formatting: { bold: true } },
  { start: 5, end: 15, formatting: { italic: true, fontSize: 20 } }
];

const formatting = getFormattingAtPosition(ranges, 7);
// Result: { bold: true, italic: true, fontSize: 20 }
// (position 7 is in both ranges)
```

**Use Cases:**
- Showing current formatting in toolbar
- Determining formatting for new text
- Cursor position feedback

### validateRanges

Validates an array of formatting ranges.

**Signature:**
```typescript
validateRanges(
  ranges: FormattingRange[],
  textLength: number
): string[]
```

**Returns:** Array of error messages (empty if valid)

**Validation Rules:**
- `start >= 0`
- `end <= textLength`
- `start < end`
- `start` and `end` are integers

**Example:**
```typescript
const ranges = [
  { start: 0, end: 5, formatting: { bold: true } },
  { start: 10, end: 20, formatting: { italic: true } }
];

const errors = validateRanges(ranges, 15);
// Result: ['Range 1 is invalid: start=10, end=20, textLength=15']
```

**Use Cases:**
- Debugging formatting issues
- Data integrity checks
- Error reporting

## Helper Functions

### isValidRange

Checks if a single range is valid.

**Signature:**
```typescript
isValidRange(range: FormattingRange, textLength: number): boolean
```

**Example:**
```typescript
const range = { start: 0, end: 5, formatting: { bold: true } };
const isValid = isValidRange(range, 10);  // true
```

### rangesOverlap

Checks if two ranges overlap.

**Signature:**
```typescript
rangesOverlap(range1: FormattingRange, range2: FormattingRange): boolean
```

**Example:**
```typescript
const range1 = { start: 0, end: 5, formatting: {} };
const range2 = { start: 3, end: 8, formatting: {} };
const overlap = rangesOverlap(range1, range2);  // true
```

### mergeFormatting

Merges formatting from multiple ranges.

**Signature:**
```typescript
mergeFormatting(ranges: FormattingRange[]): Partial<TextFormatting>
```

**Example:**
```typescript
const ranges = [
  { start: 0, end: 5, formatting: { bold: true } },
  { start: 0, end: 5, formatting: { italic: true } }
];
const merged = mergeFormatting(ranges);
// Result: { bold: true, italic: true }
```

### mergeAdjacentRanges

Merges adjacent ranges with identical formatting.

**Signature:**
```typescript
mergeAdjacentRanges(ranges: FormattingRange[]): FormattingRange[]
```

**Example:**
```typescript
const ranges = [
  { start: 0, end: 5, formatting: { bold: true } },
  { start: 5, end: 10, formatting: { bold: true } }
];
const merged = mergeAdjacentRanges(ranges);
// Result: [{ start: 0, end: 10, formatting: { bold: true } }]
```

### areFormattingObjectsEqual

Checks if two formatting objects are equal.

**Signature:**
```typescript
areFormattingObjectsEqual(
  format1: Partial<TextFormatting>,
  format2: Partial<TextFormatting>
): boolean
```

**Example:**
```typescript
const format1 = { bold: true, italic: true };
const format2 = { bold: true, italic: true };
const equal = areFormattingObjectsEqual(format1, format2);  // true
```

### clearFormattingInRange

Removes all formatting from a specific range.

**Signature:**
```typescript
clearFormattingInRange(
  ranges: FormattingRange[],
  start: number,
  end: number
): FormattingRange[]
```

**Example:**
```typescript
const ranges = [
  { start: 0, end: 10, formatting: { bold: true } }
];
const result = clearFormattingInRange(ranges, 3, 7);
// Result:
// [
//   { start: 0, end: 3, formatting: { bold: true } },
//   { start: 7, end: 10, formatting: { bold: true } }
// ]
```

## Usage Patterns

### Pattern 1: Apply Formatting on Selection

```typescript
import {applyFormattingRange} from '@/util/FormattingHelper';

const handleApplyBold = (selection: {start: number, end: number}) => {
  const newRange = {
    start: selection.start,
    end: selection.end,
    formatting: { bold: true }
  };

  const updatedRanges = applyFormattingRange(existingRanges, newRange);
  setRanges(updatedRanges);
};
```

### Pattern 2: Handle Text Insertion

```typescript
import {adjustRangesForTextChange} from '@/util/FormattingHelper';

const handleTextChange = (newText: string, oldText: string, position: number) => {
  const delta = newText.length - oldText.length;
  const updatedRanges = adjustRangesForTextChange(ranges, position, delta);
  setRanges(updatedRanges);
  setText(newText);
};
```

### Pattern 3: Toggle Formatting

```typescript
import {toggleFormattingProperty} from '@/util/FormattingHelper';

const handleToggleBold = (selection: {start: number, end: number}) => {
  const updatedRanges = toggleFormattingProperty(
    ranges,
    selection.start,
    selection.end,
    'bold'
  );
  setRanges(updatedRanges);
};
```

### Pattern 4: Update Toolbar

```typescript
import {getFormattingAtPosition} from '@/util/FormattingHelper';

const updateToolbar = (cursorPosition: number) => {
  const formatting = getFormattingAtPosition(ranges, cursorPosition);
  setToolbarState({
    isBold: formatting.bold || false,
    isItalic: formatting.italic || false,
    fontSize: formatting.fontSize || 16
  });
};
```

### Pattern 5: Validate Before Save

```typescript
import {validateRanges} from '@/util/FormattingHelper';

const handleSave = (text: string, ranges: FormattingRange[]) => {
  const errors = validateRanges(ranges, text.length);

  if (errors.length > 0) {
    console.error('Invalid ranges:', errors);
    return;
  }

  // Save note
  saveNote({text, ranges});
};
```

## Best Practices

### 1. Always Validate After Operations

```typescript
const updatedRanges = applyFormattingRange(ranges, newRange);
const errors = validateRanges(updatedRanges, text.length);

if (errors.length > 0) {
  console.error('Invalid ranges after apply:', errors);
}
```

### 2. Use Memoization for Performance

```typescript
const formattingAtCursor = useMemo(
  () => getFormattingAtPosition(ranges, cursorPosition),
  [ranges, cursorPosition]
);
```

### 3. Sort Ranges After Modifications

Ranges should be sorted by start position:

```typescript
const sortedRanges = ranges.sort((a, b) => a.start - b.start);
```

### 4. Merge Adjacent Ranges

Reduce array size by merging identical adjacent ranges:

```typescript
const optimizedRanges = mergeAdjacentRanges(ranges);
```

### 5. Handle Edge Cases

```typescript
// Empty selection
if (selection.start === selection.end) {
  console.warn('No text selected');
  return;
}

// Invalid bounds
if (selection.start < 0 || selection.end > text.length) {
  console.error('Selection out of bounds');
  return;
}
```

## Performance Considerations

### Time Complexity

- `applyFormattingRange`: O(n) where n = number of ranges
- `toggleFormattingProperty`: O(n)
- `adjustRangesForTextChange`: O(n)
- `getFormattingAtPosition`: O(n)
- `mergeAdjacentRanges`: O(n)
- `validateRanges`: O(n)

### Space Complexity

All functions: O(n) - create new arrays, never mutate input

### Optimization Tips

1. **Batch Updates**: Apply multiple formatting changes at once
2. **Lazy Validation**: Validate only before save, not after every operation
3. **Memoize Results**: Cache formatting lookups for cursor position
4. **Debounce Adjustments**: When typing rapidly, debounce range adjustments

## Testing

### Unit Test Examples

```typescript
import {applyFormattingRange} from '@/util/FormattingHelper';

describe('applyFormattingRange', () => {
  it('should split overlapping range', () => {
    const existing = [
      { start: 0, end: 10, formatting: { bold: true } }
    ];
    const newRange = {
      start: 5,
      end: 15,
      formatting: { italic: true }
    };

    const result = applyFormattingRange(existing, newRange);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      start: 0,
      end: 5,
      formatting: { bold: true }
    });
    expect(result[1]).toEqual({
      start: 5,
      end: 15,
      formatting: { italic: true }
    });
  });

  it('should merge adjacent identical ranges', () => {
    const existing = [
      { start: 0, end: 5, formatting: { bold: true } }
    ];
    const newRange = {
      start: 5,
      end: 10,
      formatting: { bold: true }
    };

    const result = applyFormattingRange(existing, newRange);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      start: 0,
      end: 10,
      formatting: { bold: true }
    });
  });
});
```

## Troubleshooting

### Ranges Not Merging

**Problem**: Adjacent identical ranges not merging.

**Solution**: Call `mergeAdjacentRanges()` explicitly after operations.

### Incorrect Range Positions After Edit

**Problem**: Formatting appears in wrong position after text edit.

**Solution**: Ensure `adjustRangesForTextChange()` is called with correct position and delta.

### Overlapping Ranges Conflict

**Problem**: Multiple ranges at same position produce unexpected result.

**Solution**: Use `getFormattingAtPosition()` to see merged result. Later ranges override earlier ones.

### Performance Degradation

**Problem**: Slow operations with many ranges.

**Solution**: Merge adjacent ranges regularly. Consider range limits (e.g., max 1000 ranges).

## Related Documentation

- **RICH_TEXT_EDITOR.md**: Complete system documentation
- **RichTextEditor README**: Component usage
- **FormattedText README**: Rendering component

## Contributing

When modifying these utilities:

1. **Maintain Purity**: Functions must be pure (no mutations, side effects)
2. **Add Tests**: Unit test all edge cases
3. **Document Complexity**: Add time/space complexity notes
4. **Validate Input**: Check for invalid input and handle gracefully
5. **Update Examples**: Keep examples in sync with implementation
