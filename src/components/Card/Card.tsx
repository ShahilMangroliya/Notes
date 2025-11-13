import styled from 'styled-components/native';

/**
 * Props for Card component
 */
export interface CardProps {
  /** Padding value (default: 16) */
  $padding?: number;
  /** Margin value (default: 8) */
  $margin?: number;
  /** Border radius (default: 12) */
  $radius?: number;
  /** Show shadow/elevation */
  $elevated?: boolean;
}

/**
 * Themed Card component with customizable spacing and elevation
 *
 * @example
 * ```tsx
 * <Card>
 *   <StyledText>Card content</StyledText>
 * </Card>
 * <Card $elevated $padding={24}>
 *   <StyledText>Elevated card with custom padding</StyledText>
 * </Card>
 * ```
 */
export const Card = styled.View<CardProps>`
  background-color: ${props => props.theme.surface};
  border-radius: ${props => props.$radius || 12}px;
  padding: ${props => (props.$padding !== undefined ? props.$padding : 16)}px;
  margin: ${props => (props.$margin !== undefined ? props.$margin : 8)}px;
  border: 1px solid ${props => props.theme.border};
  ${props =>
    props.$elevated &&
    `
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    elevation: 3;
  `}
`;

export default Card;
