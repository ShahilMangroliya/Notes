import React, {useEffect, useRef} from 'react';
import {Text, Animated} from 'react-native';
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

  return (
    <Container style={{bottom: bottomAnim}}>
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
        unselectedButtonStyle={{backgroundColor: 'transparent'}}
        selectedButtonStyle={{backgroundColor: 'transparent'}}
        heading1={toggleHeading1}
        heading2={toggleHeading2}
        iconMap={{
          [actions.setBold]: ({tintColor}: {tintColor: string}) => (
            <Text style={{color: tintColor, fontWeight: 'bold', fontSize: 18}}>
              B
            </Text>
          ),
          [actions.setItalic]: ({tintColor}: {tintColor: string}) => (
            <Text style={{color: tintColor, fontStyle: 'italic', fontSize: 18}}>
              I
            </Text>
          ),
          [actions.setUnderline]: ({tintColor}: {tintColor: string}) => (
            <Text
              style={{
                color: tintColor,
                fontSize: 18,
                textDecorationLine: 'underline',
              }}>
              U
            </Text>
          ),
          [actions.setStrikethrough]: ({tintColor}: {tintColor: string}) => (
            <Text
              style={{
                color: tintColor,
                fontSize: 18,
                textDecorationLine: 'line-through',
              }}>
              S
            </Text>
          ),
          [actions.heading1]: ({tintColor}: {tintColor: string}) => (
            <Text style={{color: tintColor, fontWeight: 'bold', fontSize: 20}}>
              H1
            </Text>
          ),
          [actions.heading2]: ({tintColor}: {tintColor: string}) => (
            <Text style={{color: tintColor, fontWeight: 'bold', fontSize: 18}}>
              H2
            </Text>
          ),
        }}
        style={{
          backgroundColor: 'transparent',
          minHeight: 50,
        }}
      />
    </Container>
  );
};

export default InlineFormattingToolbar;
