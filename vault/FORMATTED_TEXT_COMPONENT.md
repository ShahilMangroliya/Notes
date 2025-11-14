# FormattedText Component

A component for rendering plain text with formatting ranges applied as visual styles.

## Overview

FormattedText takes plain text and an array of formatting ranges, then renders the text with proper styling applied. It handles overlapping ranges, merges formatting, and splits text into styled segments.

## Features

- Render text with multiple formatting styles
- Handle overlapping formatting ranges
- Support for bold, italic, underline, strikethrough
- Custom font sizes and colors
- Automatic text segmentation at formatting boundaries
- Performance optimized with memoization

## Installation

The component is already integrated into the app. Import from the components directory:

```typescript
import FormattedText from '@/components/FormattedText';
```

## Basic Usage

```tsx
import React from 'react';
import FormattedText from '@/components/FormattedText';

const MyComponent: React.FC = () => {
  return (
    <FormattedText
      text="Hello World"
      formattingRanges={[
        { start: 0, end: 5, formatting: { bold: true } }
      ]}
    />
  );
};
```

This renders "Hello" in bold and "World" in normal weight.

## Props

### Required Props

#### `text: string`
The plain text content to render.

```tsx
<FormattedText text="Hello World" />
```

#### `formattingRanges: FormattingRange[]`
Array of formatting ranges to apply.

```tsx
<FormattedText
  text="Hello World"
  formattingRanges={[
    { start: 0, end: 5, formatting: { bold: true } },
    { start: 6, end: 11, formatting: { italic: true } }
  ]}
/>
```

### Optional Props

#### `baseFontSize?: number`
Base font size in pixels. Default: `16`

```tsx
<FormattedText
  text="Hello"
  formattingRanges={[]}
  baseFontSize={18}
/>
```

#### `baseColor?: string`
Base text color (hex). Default: `#000000`

```tsx
<FormattedText
  text="Hello"
  formattingRanges={[]}
  baseColor="#333333"
/>
```

## FormattingRange Structure

```typescript
interface FormattingRange {
  start: number;      // Start position (inclusive)
  end: number;        // End position (exclusive)
  formatting: Partial<TextFormatting>;
}

interface TextFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  fontFamily?: 'system' | 'serif' | 'monospace';
}
```

## Examples

### Single Formatting

```tsx
// Bold text
<FormattedText
  text="Hello World"
  formattingRanges={[
    { start: 0, end: 5, formatting: { bold: true } }
  ]}
/>
// Renders: **Hello** World
```

### Multiple Non-Overlapping Ranges

```tsx
// Bold "Hello", italic "World"
<FormattedText
  text="Hello World"
  formattingRanges={[
    { start: 0, end: 5, formatting: { bold: true } },
    { start: 6, end: 11, formatting: { italic: true } }
  ]}
/>
// Renders: **Hello** *World*
```

### Overlapping Ranges

```tsx
// "Hello" with both bold and italic
<FormattedText
  text="Hello World"
  formattingRanges={[
    { start: 0, end: 5, formatting: { bold: true } },
    { start: 0, end: 5, formatting: { italic: true } }
  ]}
/>
// Renders: **_Hello_** World (bold + italic)
```

### Font Size

```tsx
// Large "Hello"
<FormattedText
  text="Hello World"
  formattingRanges={[
    { start: 0, end: 5, formatting: { fontSize: 24 } }
  ]}
/>
```

### Text Color

```tsx
// Red "Hello"
<FormattedText
  text="Hello World"
  formattingRanges={[
    { start: 0, end: 5, formatting: { color: '#FF0000' } }
  ]}
/>
```

### Background Color (Highlight)

```tsx
// Highlighted "Hello"
<FormattedText
  text="Hello World"
  formattingRanges={[
    { start: 0, end: 5, formatting: { backgroundColor: '#FFFF00' } }
  ]}
/>
```

### Combined Formatting

```tsx
// Bold, italic, underlined, large, red "Hello"
<FormattedText
  text="Hello World"
  formattingRanges={[
    {
      start: 0,
      end: 5,
      formatting: {
        bold: true,
        italic: true,
        underline: true,
        fontSize: 20,
        color: '#FF0000'
      }
    }
  ]}
/>
```

### Complex Example

```tsx
// "The quick brown fox jumps over the lazy dog"
// - "quick brown" is bold
// - "fox" is italic
// - "jumps over" is underlined
// - "lazy dog" is strikethrough
<FormattedText
  text="The quick brown fox jumps over the lazy dog"
  formattingRanges={[
    { start: 4, end: 15, formatting: { bold: true } },
    { start: 16, end: 19, formatting: { italic: true } },
    { start: 20, end: 30, formatting: { underline: true } },
    { start: 35, end: 43, formatting: { strikethrough: true } }
  ]}
/>
```

## How It Works

### Text Segmentation

FormattedText splits text into segments at formatting boundaries:

```typescript
// Input
text: "Hello World"
ranges: [
  { start: 0, end: 5, formatting: { bold: true } }
]

// Output segments
[
  { text: "Hello", formatting: { bold: true } },
  { text: " World", formatting: {} }
]
```

### Overlapping Range Handling

When ranges overlap, formatting is merged:

```typescript
// Input
text: "Hello"
ranges: [
  { start: 0, end: 5, formatting: { bold: true } },
  { start: 0, end: 5, formatting: { italic: true } }
]

// Merged formatting
{ bold: true, italic: true }
```

### Rendering

Each segment is rendered as a React Native `Text` component with appropriate styles:

```tsx
<Text style={{ fontWeight: 'bold' }}>Hello</Text>
<Text> World</Text>
```

## Performance

### Memoization

The component uses `useMemo` to avoid recalculating segments:

```typescript
const segments = useMemo(
  () => splitTextIntoSegments(text, formattingRanges),
  [text, formattingRanges]
);
```

### Optimization Tips

1. **Minimize Ranges**: Merge adjacent identical ranges
2. **Avoid Deep Nesting**: Keep formatting structure flat
3. **Use Keys**: Each segment has a unique key for React reconciliation

## Edge Cases

### Empty Text

```tsx
<FormattedText text="" formattingRanges={[]} />
// Renders: nothing (returns null)
```

### No Formatting

```tsx
<FormattedText text="Hello World" formattingRanges={[]} />
// Renders: "Hello World" (plain text)
```

### Invalid Ranges

Invalid ranges (out of bounds, start >= end) are handled gracefully:

```typescript
// Range extends beyond text length
{ start: 0, end: 100, formatting: { bold: true } }
// Clamped to text length
```

## Styling

The component uses styled-components with theme support:

```typescript
const BaseText = styled.Text`
  color: ${props => props.theme.text};
  font-size: 16px;
  line-height: 24px;
`;
```

### Customizing Styles

To customize base styles, modify the styled components:

```typescript
const BaseText = styled.Text`
  color: ${props => props.theme.text};
  font-size: 18px;        // Larger base font
  line-height: 28px;      // More line height
  letter-spacing: 0.5px;  // Add letter spacing
`;
```

## Integration with RichTextEditor

FormattedText is used by RichTextEditor in Preview mode:

```tsx
// Inside RichTextEditor
{mode === 'preview' && (
  <FormattedText
    text={text}
    formattingRanges={formattingRanges}
    baseColor={theme.text}
  />
)}
```

## Accessibility

The component automatically inherits text accessibility from React Native's `Text` component. For additional accessibility:

```tsx
<View accessible={true} accessibilityLabel="Formatted note content">
  <FormattedText text={text} formattingRanges={ranges} />
</View>
```

## Limitations

### No Interactive Formatting

FormattedText is read-only. It only displays formatted text, not edit it.

### Platform Differences

Some text styles may render differently on iOS vs Android:
- Font weights may vary
- Text decoration rendering differences
- Line height calculations

## Troubleshooting

### Formatting Not Applied

**Problem**: Text renders without formatting.

**Solution**: Check that formatting ranges are valid (start < end, within text bounds).

### Wrong Colors

**Problem**: Text colors don't match expected values.

**Solution**: Ensure `baseColor` prop matches theme or provide explicit color in formatting range.

### Performance Issues

**Problem**: Slow rendering with many ranges.

**Solution**: Merge adjacent identical ranges using `FormattingHelper.mergeAdjacentRanges()`.

### Text Cut Off

**Problem**: Text appears truncated.

**Solution**: Wrap FormattedText in a container with proper flex/height settings.

## Testing

### Unit Test Example

```typescript
import {render} from '@testing-library/react-native';
import FormattedText from './FormattedText';

describe('FormattedText', () => {
  it('renders plain text without formatting', () => {
    const {getByText} = render(
      <FormattedText text="Hello" formattingRanges={[]} />
    );
    expect(getByText('Hello')).toBeTruthy();
  });

  it('renders bold text', () => {
    const {getByText} = render(
      <FormattedText
        text="Hello"
        formattingRanges={[
          { start: 0, end: 5, formatting: { bold: true } }
        ]}
      />
    );
    const text = getByText('Hello');
    expect(text.props.style).toContain({ fontWeight: 'bold' });
  });
});
```

## Related Components

- **RichTextEditor**: Uses FormattedText for preview mode
- **FormattingToolbar**: Creates formatting ranges applied by FormattedText

## Related Utilities

- **FormattingHelper**: Utilities for managing formatting ranges
- **splitTextIntoSegments**: Internal function for text segmentation

## API Reference

See the main documentation in `/vault/RICH_TEXT_EDITOR.md` for complete system reference.

## Contributing

When modifying this component:

1. Update this README
2. Add tests for new formatting types
3. Ensure performance optimization
4. Update TypeScript types
5. Test on both iOS and Android
