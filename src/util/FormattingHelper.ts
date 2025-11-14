import type {FormattingRange, TextFormatting} from '@/types/note';

/**
 * FormattingHelper - Utility functions for managing text formatting ranges
 *
 * This module provides pure functions for working with formatting ranges,
 * including merging, splitting, adjusting, and validating ranges.
 */

/**
 * Validates a formatting range
 *
 * @param range - Range to validate
 * @param textLength - Length of the text
 * @returns True if range is valid
 */
export const isValidRange = (
  range: FormattingRange,
  textLength: number,
): boolean => {
  return (
    range.start >= 0 &&
    range.end <= textLength &&
    range.start < range.end &&
    Number.isInteger(range.start) &&
    Number.isInteger(range.end)
  );
};

/**
 * Checks if two ranges overlap
 *
 * @param range1 - First range
 * @param range2 - Second range
 * @returns True if ranges overlap
 */
export const rangesOverlap = (
  range1: FormattingRange,
  range2: FormattingRange,
): boolean => {
  return range1.start < range2.end && range1.end > range2.start;
};

/**
 * Merges formatting from multiple ranges
 * Later ranges override earlier ones for conflicting properties
 *
 * @param ranges - Ranges to merge
 * @returns Merged formatting
 */
export const mergeFormatting = (
  ranges: FormattingRange[],
): Partial<TextFormatting> => {
  return ranges.reduce(
    (merged, range) => ({
      ...merged,
      ...range.formatting,
    }),
    {} as Partial<TextFormatting>,
  );
};

/**
 * Applies new formatting to a selection, handling overlapping ranges intelligently
 *
 * Strategy:
 * 1. Remove parts of existing ranges that overlap with the new range
 * 2. Split ranges that partially overlap
 * 3. Add the new range
 * 4. Merge adjacent ranges with identical formatting
 *
 * @param existingRanges - Current formatting ranges
 * @param newRange - New range to apply
 * @returns Updated array of formatting ranges
 */
export const applyFormattingRange = (
  existingRanges: FormattingRange[],
  newRange: FormattingRange,
): FormattingRange[] => {
  const result: FormattingRange[] = [];

  // Process existing ranges
  for (const range of existingRanges) {
    if (!rangesOverlap(range, newRange)) {
      // No overlap, keep the range as is
      result.push(range);
    } else {
      // Ranges overlap, need to split or remove
      if (range.start < newRange.start) {
        // Keep the part before the new range
        result.push({
          ...range,
          end: newRange.start,
        });
      }

      if (range.end > newRange.end) {
        // Keep the part after the new range
        result.push({
          ...range,
          start: newRange.end,
        });
      }
    }
  }

  // Add the new range
  result.push(newRange);

  // Sort by start position
  result.sort((a, b) => a.start - b.start);

  // Merge adjacent ranges with identical formatting
  return mergeAdjacentRanges(result);
};

/**
 * Merges adjacent ranges that have identical formatting
 *
 * @param ranges - Sorted array of ranges
 * @returns Array with adjacent identical ranges merged
 */
export const mergeAdjacentRanges = (
  ranges: FormattingRange[],
): FormattingRange[] => {
  if (ranges.length <= 1) {
    return ranges;
  }

  const result: FormattingRange[] = [];
  let current = ranges[0];

  for (let i = 1; i < ranges.length; i++) {
    const next = ranges[i];

    // Check if ranges are adjacent and have identical formatting
    if (
      current.end === next.start &&
      areFormattingObjectsEqual(current.formatting, next.formatting)
    ) {
      // Merge ranges
      current = {
        ...current,
        end: next.end,
      };
    } else {
      // Push current and move to next
      result.push(current);
      current = next;
    }
  }

  // Push the last range
  result.push(current);

  return result;
};

/**
 * Checks if two formatting objects are equal
 *
 * @param format1 - First formatting
 * @param format2 - Second formatting
 * @returns True if equal
 */
export const areFormattingObjectsEqual = (
  format1: Partial<TextFormatting>,
  format2: Partial<TextFormatting>,
): boolean => {
  const keys1 = Object.keys(format1) as (keyof TextFormatting)[];
  const keys2 = Object.keys(format2) as (keyof TextFormatting)[];

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every(key => format1[key] === format2[key]);
};

/**
 * Adjusts formatting ranges after text insertion or deletion
 *
 * @param ranges - Current formatting ranges
 * @param position - Position where text changed
 * @param delta - Change in text length (positive for insertion, negative for deletion)
 * @returns Adjusted formatting ranges
 */
export const adjustRangesForTextChange = (
  ranges: FormattingRange[],
  position: number,
  delta: number,
): FormattingRange[] => {
  if (delta === 0) {
    return ranges;
  }

  const result: FormattingRange[] = [];

  for (const range of ranges) {
    if (range.end <= position) {
      // Range is entirely before the change, keep as is
      result.push(range);
    } else if (range.start >= position) {
      // Range is entirely after the change, shift it
      result.push({
        ...range,
        start: Math.max(position, range.start + delta),
        end: Math.max(position, range.end + delta),
      });
    } else {
      // Range overlaps with the change position
      if (delta > 0) {
        // Insertion: extend the range
        result.push({
          ...range,
          end: range.end + delta,
        });
      } else {
        // Deletion: shrink or split the range
        const deletionEnd = position + Math.abs(delta);

        if (deletionEnd >= range.end) {
          // Deletion removes the end of the range
          const newEnd = position;
          if (newEnd > range.start) {
            result.push({
              ...range,
              end: newEnd,
            });
          }
        } else {
          // Deletion is within the range
          result.push({
            ...range,
            end: range.end + delta,
          });
        }
      }
    }
  }

  // Filter out invalid ranges (where start >= end)
  return result.filter(range => range.start < range.end);
};

/**
 * Removes all formatting from a specific range
 *
 * @param ranges - Current formatting ranges
 * @param start - Start of range to clear
 * @param end - End of range to clear
 * @returns Updated formatting ranges
 */
export const clearFormattingInRange = (
  ranges: FormattingRange[],
  start: number,
  end: number,
): FormattingRange[] => {
  const result: FormattingRange[] = [];

  for (const range of ranges) {
    if (range.end <= start || range.start >= end) {
      // No overlap, keep the range
      result.push(range);
    } else {
      // Overlaps, need to split or remove
      if (range.start < start) {
        // Keep the part before
        result.push({
          ...range,
          end: start,
        });
      }

      if (range.end > end) {
        // Keep the part after
        result.push({
          ...range,
          start: end,
        });
      }
    }
  }

  return result;
};

/**
 * Gets the effective formatting at a specific position
 * When multiple ranges overlap, later ranges override earlier ones
 *
 * @param ranges - Formatting ranges
 * @param position - Position in text
 * @returns Merged formatting at that position
 */
export const getFormattingAtPosition = (
  ranges: FormattingRange[],
  position: number,
): Partial<TextFormatting> => {
  const applicableRanges = ranges.filter(
    range => position >= range.start && position < range.end,
  );

  return mergeFormatting(applicableRanges);
};

/**
 * Toggles a boolean formatting property for a range
 * If any part of the range has the property enabled, it will be disabled
 * Otherwise, it will be enabled
 *
 * @param ranges - Current formatting ranges
 * @param start - Start of range to toggle
 * @param end - End of range to toggle
 * @param property - Property to toggle
 * @returns Updated formatting ranges
 */
export const toggleFormattingProperty = (
  ranges: FormattingRange[],
  start: number,
  end: number,
  property: 'bold' | 'italic' | 'underline' | 'strikethrough',
): FormattingRange[] => {
  // Check if the property is currently enabled in the range
  const overlappingRanges = ranges.filter(
    range => range.start < end && range.end > start,
  );

  const hasProperty = overlappingRanges.some(
    range => range.formatting[property] === true,
  );

  // Apply the opposite value
  const newRange: FormattingRange = {
    start,
    end,
    formatting: {
      [property]: !hasProperty,
    },
  };

  return applyFormattingRange(ranges, newRange);
};

/**
 * Validates all ranges in an array
 *
 * @param ranges - Ranges to validate
 * @param textLength - Length of the text
 * @returns Array of validation errors (empty if valid)
 */
export const validateRanges = (
  ranges: FormattingRange[],
  textLength: number,
): string[] => {
  const errors: string[] = [];

  ranges.forEach((range, index) => {
    if (!isValidRange(range, textLength)) {
      errors.push(
        `Range ${index} is invalid: start=${range.start}, end=${range.end}, textLength=${textLength}`,
      );
    }
  });

  return errors;
};
