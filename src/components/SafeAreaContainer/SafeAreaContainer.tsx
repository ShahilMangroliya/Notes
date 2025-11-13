import styled from 'styled-components/native';
import {SafeAreaView} from 'react-native-safe-area-context';

/**
 * Props for SafeAreaContainer component
 */
export interface SafeAreaContainerProps {
  /** Edges to apply safe area insets (default: all edges) */
  $edges?: ('top' | 'bottom' | 'left' | 'right')[];
  /** Padding value */
  $padding?: number;
}

/**
 * Themed SafeAreaContainer component that respects device safe areas
 *
 * @example
 * ```tsx
 * <SafeAreaContainer>
 *   <Text>Content with safe area</Text>
 * </SafeAreaContainer>
 * <SafeAreaContainer $edges={['top', 'bottom']}>
 *   <Text>Content with top and bottom safe area</Text>
 * </SafeAreaContainer>
 * ```
 */
export const SafeAreaContainer = styled(
  SafeAreaView,
).attrs<SafeAreaContainerProps>(props => ({
  edges: props.$edges || ['top', 'bottom', 'left', 'right'],
}))<SafeAreaContainerProps>`
  flex: 1;
  background-color: ${props => props.theme.background};
  ${props => props.$padding !== undefined && `padding: ${props.$padding}px;`}
`;

export default SafeAreaContainer;
