import React, {useEffect, useMemo, useRef} from 'react';
import {Animated} from 'react-native';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components/native';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';

/**
 * Props for InlineFormattingToolbar component
 */
export interface InlineFormattingToolbarProps {
  /** Reference to the RichEditor */
  editorRef: React.RefObject<RichEditor | null>;
  /** Current keyboard height */
  keyboardHeight?: number;
}

const Container = styled(Animated.View)`
  position: absolute;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.surface};
  border-top-width: 1px;
  border-top-color: ${props => props.theme.border};
  padding: 8px 0 12px;
`;

const IconText = styled.Text<{
  $tintColor: string;
  $fontWeight?: string;
  $fontSize: number;
  $fontStyle?: string;
  $textDecorationLine?: string;
}>`
  color: ${props => props.$tintColor};
  font-weight: ${props => props.$fontWeight || 'normal'};
  font-size: ${props => props.$fontSize}px;
  font-style: ${props => props.$fontStyle || 'normal'};
  text-decoration-line: ${props => props.$textDecorationLine || 'none'};
`;

interface IconComponentProps {
  tintColor: string;
}

const BoldIcon: React.FC<IconComponentProps> = ({tintColor}) => (
  <IconText $tintColor={tintColor} $fontWeight="bold" $fontSize={18}>
    B
  </IconText>
);

const ItalicIcon: React.FC<IconComponentProps> = ({tintColor}) => (
  <IconText $tintColor={tintColor} $fontStyle="italic" $fontSize={18}>
    I
  </IconText>
);

const UnderlineIcon: React.FC<IconComponentProps> = ({tintColor}) => (
  <IconText
    $tintColor={tintColor}
    $fontSize={18}
    $textDecorationLine="underline"
  >
    U
  </IconText>
);

const StrikethroughIcon: React.FC<IconComponentProps> = ({tintColor}) => (
  <IconText
    $tintColor={tintColor}
    $fontSize={18}
    $textDecorationLine="line-through"
  >
    S
  </IconText>
);

const Heading1Icon: React.FC<IconComponentProps> = ({tintColor}) => (
  <IconText $tintColor={tintColor} $fontWeight="bold" $fontSize={20}>
    H1
  </IconText>
);

const Heading2Icon: React.FC<IconComponentProps> = ({tintColor}) => (
  <IconText $tintColor={tintColor} $fontWeight="bold" $fontSize={18}>
    H2
  </IconText>
);

// Icon map factory functions - defined outside component to avoid "components during render" warning
const createBoldIcon = (tintColor: string) => (
  <BoldIcon tintColor={tintColor} />
);
const createItalicIcon = (tintColor: string) => (
  <ItalicIcon tintColor={tintColor} />
);
const createUnderlineIcon = (tintColor: string) => (
  <UnderlineIcon tintColor={tintColor} />
);
const createStrikethroughIcon = (tintColor: string) => (
  <StrikethroughIcon tintColor={tintColor} />
);
const createHeading1Icon = (tintColor: string) => (
  <Heading1Icon tintColor={tintColor} />
);
const createHeading2Icon = (tintColor: string) => (
  <Heading2Icon tintColor={tintColor} />
);

/**
 * InlineFormattingToolbar - Formatting toolbar for inline rich text editor
 *
 * Provides formatting controls that work directly with the WebView-based editor.
 * Buttons stay enabled and work without dismissing the keyboard.
 *
 * Features:
 * - Bold, italic, underline, strikethrough
 * - Font size increase/decrease
 * - Integrated with react-native-pell-rich-editor
 * - Keyboard-friendly
 *
 * @example
 * ```tsx
 * const editorRef = useRef<RichEditor>(null);
 *
 * <InlineFormattingToolbar editorRef={editorRef} />
 * ```
 */
export const InlineFormattingToolbar: React.FC<
  InlineFormattingToolbarProps
> = ({editorRef, keyboardHeight = 0}) => {
  const theme = useTheme();
  const bottomAnim = useRef(new Animated.Value(0)).current;

  // Theme-aware colors
  const unselectedColor = theme.textSecondary; // Light grey in both themes
  const selectedColor = '#007AFF'; // iOS blue
  const disabledColor = theme.border; // Subtle grey

  useEffect(() => {
    Animated.timing(bottomAnim, {
      toValue: keyboardHeight,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [keyboardHeight, bottomAnim]);

  const toggleHeading1 = () => {
    // Toggle H1: if already H1, convert to paragraph
    editorRef.current?.injectJavascript(
      `(function() {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
          var node = selection.anchorNode;
          var element = node.nodeType === 3 ? node.parentElement : node;
          var h1 = element.closest('h1');
          if (h1) {
            document.execCommand('formatBlock', false, 'p');
          } else {
            document.execCommand('formatBlock', false, 'h1');
          }
        }
      })();`,
    );
  };

  const toggleHeading2 = () => {
    // Toggle H2: if already H2, convert to paragraph
    editorRef.current?.injectJavascript(
      `(function() {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
          var node = selection.anchorNode;
          var element = node.nodeType === 3 ? node.parentElement : node;
          var h2 = element.closest('h2');
          if (h2) {
            document.execCommand('formatBlock', false, 'p');
          } else {
            document.execCommand('formatBlock', false, 'h2');
          }
        }
      })();`,
    );
  };

  const buttonStyle = useMemo(
    () => ({
      backgroundColor: 'transparent' as const,
    }),
    [],
  );

  const toolbarStyle = useMemo(
    () => ({
      backgroundColor: 'transparent' as const,
      minHeight: 50,
    }),
    [],
  );

  const containerStyle = useMemo(
    () => ({
      bottom: bottomAnim,
    }),
    [bottomAnim],
  );

  const iconMap = useMemo(
    () => ({
      [actions.setBold]: ({tintColor}: {tintColor: string}) =>
        createBoldIcon(tintColor),
      [actions.setItalic]: ({tintColor}: {tintColor: string}) =>
        createItalicIcon(tintColor),
      [actions.setUnderline]: ({tintColor}: {tintColor: string}) =>
        createUnderlineIcon(tintColor),
      [actions.setStrikethrough]: ({tintColor}: {tintColor: string}) =>
        createStrikethroughIcon(tintColor),
      [actions.heading1]: ({tintColor}: {tintColor: string}) =>
        createHeading1Icon(tintColor),
      [actions.heading2]: ({tintColor}: {tintColor: string}) =>
        createHeading2Icon(tintColor),
    }),
    [],
  );

  return (
    <Container style={containerStyle}>
      <RichToolbar
        getEditor={() => editorRef.current}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.setStrikethrough,
          actions.heading1,
          actions.heading2,
          actions.insertBulletsList,
          actions.insertOrderedList,
        ]}
        onPressAddImage={() => {}}
        onInsertLink={() => {}}
        iconTint={unselectedColor}
        selectedIconTint={selectedColor}
        disabledIconTint={disabledColor}
        unselectedButtonStyle={buttonStyle}
        selectedButtonStyle={buttonStyle}
        heading1={toggleHeading1}
        heading2={toggleHeading2}
        iconMap={iconMap}
        style={toolbarStyle}
      />
    </Container>
  );
};

export default InlineFormattingToolbar;
