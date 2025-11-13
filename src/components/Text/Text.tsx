import styled from 'styled-components/native';

/**
 * Props for StyledText component
 */
export interface StyledTextProps {
  /** Use secondary text color (lighter/muted) */
  $secondary?: boolean;
  /** Text alignment */
  $align?: 'left' | 'center' | 'right';
  /** Font weight */
  $weight?: 'normal' | 'bold' | '600' | '700';
}

/**
 * Themed Text component with support for secondary text and styling options
 *
 * @example
 * ```tsx
 * <StyledText>Primary text</StyledText>
 * <StyledText $secondary>Secondary text</StyledText>
 * <StyledText $align="center" $weight="bold">Bold centered text</StyledText>
 * ```
 */
export const StyledText = styled.Text<StyledTextProps>`
  color: ${props =>
    props.$secondary ? props.theme.textSecondary : props.theme.text};
  text-align: ${props => props.$align || 'left'};
  font-weight: ${props => props.$weight || 'normal'};
`;

export default StyledText;
