import React, {useMemo, useEffect} from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';
import type {FormattingRange, TextFormatting} from '@/types/note';
import logger from '@/util/DebugLogger';

/**
 * Props for FormattedText component
 */
export interface FormattedTextProps {
  /** Plain text content */
  text: string;
  /** Formatting ranges to apply */
  formattingRanges: FormattingRange[];
  /** Base font size (default: 16) */
  baseFontSize?: number;
  /** Base text color (from theme) */
  baseColor?: string;
}

/**
 * Represents a text segment with its formatting
 */
interface TextSegment {
  /** Text content of the segment */
  text: string;
  /** Start position in original text */
  start: number;
  /** End position in original text */
  end: number;
  /** Formatting to apply */
  formatting: Partial<TextFormatting>;
}

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const BaseText = styled.Text`
  color: ${props => props.theme.text};
  font-size: 16px;
  line-height: 24px;
`;

/**
 * Merges overlapping formatting ranges for a specific position
 *
 * @param ranges - Array of formatting ranges
 * @param position - Position in text
 * @returns Merged formatting for that position
 */
const getMergedFormattingAtPosition = (
  ranges: FormattingRange[],
  position: number,
): Partial<TextFormatting> => {
  const applicableRanges = ranges.filter(
    range => position >= range.start && position < range.end,
  );

  if (applicableRanges.length === 0) {
    return {};
  }

  // Merge formatting from all applicable ranges
  // Later ranges override earlier ones for conflicting properties
  return applicableRanges.reduce(
    (merged, range) => ({
      ...merged,
      ...range.formatting,
    }),
    {} as Partial<TextFormatting>,
  );
};

/**
 * Splits text into segments based on formatting ranges
 *
 * @param text - Plain text to split
 * @param ranges - Formatting ranges to apply
 * @returns Array of text segments with formatting
 */
const splitTextIntoSegments = (
  text: string,
  ranges: FormattingRange[],
): TextSegment[] => {
  if (text.length === 0) {
    return [];
  }

  if (ranges.length === 0) {
    return [{text, start: 0, end: text.length, formatting: {}}];
  }

  // Get all boundary points (start and end of each range)
  const boundaries = new Set<number>([0, text.length]);
  ranges.forEach(range => {
    boundaries.add(Math.max(0, range.start));
    boundaries.add(Math.min(text.length, range.end));
  });

  // Sort boundaries
  const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b);

  // Create segments between boundaries
  const segments: TextSegment[] = [];
  for (let i = 0; i < sortedBoundaries.length - 1; i++) {
    const start = sortedBoundaries[i];
    const end = sortedBoundaries[i + 1];
    const segmentText = text.slice(start, end);

    if (segmentText.length > 0) {
      const formatting = getMergedFormattingAtPosition(ranges, start);
      segments.push({text: segmentText, start, end, formatting});
    }
  }

  return segments;
};

/**
 * Applies formatting to a Text style object
 *
 * @param formatting - Formatting to apply
 * @param baseColor - Base text color
 * @returns Style object for Text component
 */
const applyFormattingToStyle = (
  formatting: Partial<TextFormatting>,
  baseColor: string,
): Record<string, unknown> => {
  const style: Record<string, unknown> = {};

  if (formatting.bold) {
    style.fontWeight = 'bold';
  }

  if (formatting.italic) {
    style.fontStyle = 'italic';
  }

  if (formatting.underline || formatting.strikethrough) {
    const decorations: string[] = [];
    if (formatting.underline) {
      decorations.push('underline');
    }
    if (formatting.strikethrough) {
      decorations.push('line-through');
    }
    style.textDecorationLine = decorations.join(' ');
  }

  if (formatting.fontSize) {
    style.fontSize = formatting.fontSize;
  }

  if (formatting.color) {
    style.color = formatting.color;
  } else {
    style.color = baseColor;
  }

  if (formatting.backgroundColor) {
    style.backgroundColor = formatting.backgroundColor;
  }

  return style;
};

/**
 * FormattedText component - Renders text with applied formatting ranges
 *
 * This component takes plain text and formatting ranges, then renders the text
 * with proper styling applied. It handles overlapping ranges by merging them
 * and splits text into segments at formatting boundaries.
 *
 * @example
 * ```tsx
 * <FormattedText
 *   text="Hello World"
 *   formattingRanges={[
 *     { start: 0, end: 5, formatting: { bold: true } },
 *     { start: 6, end: 11, formatting: { italic: true } }
 *   ]}
 * />
 * ```
 */
export const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  formattingRanges,
  baseFontSize = 16,
  baseColor,
}) => {
  // Memoize segments to avoid recalculation on every render
  const segments = useMemo(
    () => splitTextIntoSegments(text, formattingRanges),
    [text, formattingRanges],
  );

  useEffect(() => {
    logger.component('FormattedText', 'render', {
      textLength: text.length,
      rangeCount: formattingRanges.length,
      segmentCount: segments.length,
      ranges: formattingRanges,
    });
  }, [text, formattingRanges, segments]);

  // If no text, show nothing
  if (text.length === 0) {
    return null;
  }

  return (
    <Container>
      <BaseText>
        {segments.map((segment, index) => {
          const style = applyFormattingToStyle(
            segment.formatting,
            baseColor || '#000000',
          );

          return (
            <Text key={`segment-${index}-${segment.start}`} style={style}>
              {segment.text}
            </Text>
          );
        })}
      </BaseText>
    </Container>
  );
};

export default FormattedText;
