import styled from 'styled-components/native';

/**
 * Props for Container component
 */
export interface ContainerProps {
  /** Padding value */
  $padding?: number;
  /** Margin value */
  $margin?: number;
}

/**
 * Themed Container component with full flex and theme background
 *
 * @example
 * ```tsx
 * <Container>
 *   <Text>Content</Text>
 * </Container>
 * ```
 */
export const Container = styled.View<ContainerProps>`
  flex: 1;
  background-color: ${props => props.theme.background};
  ${props => props.$padding !== undefined && `padding: ${props.$padding}px;`}
  ${props => props.$margin !== undefined && `margin: ${props.$margin}px;`}
`;

export default Container;
