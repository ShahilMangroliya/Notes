import React, {useRef, useCallback, useEffect, forwardRef, useImperativeHandle} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components/native';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import type {FormattingRange, TextFormatting} from '@/types/note';
import logger from '@/util/DebugLogger';

/**
 * Props for InlineRichTextEditor component
 */
export interface InlineRichTextEditorProps {
  /** Initial HTML content */
  initialContent?: string;
  /** Content change handler (returns HTML) */
  onContentChange?: (html: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Formatting change handler (called when selection changes) */
  onFormattingChange?: (formatting: Partial<TextFormatting>) => void;
}

const EditorContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
`;

/**
 * InlineRichTextEditor - Rich text editor with inline formatting
 *
 * Uses WebView-based editor for true WYSIWYG editing like Google Docs/Word.
 * Shows formatting as you type without needing to switch modes.
 *
 * Features:
 * - Bold, italic, underline, strikethrough
 * - Font size adjustment
 * - Real-time formatting preview
 * - Keyboard-friendly (doesn't dismiss on button tap)
 *
 * @example
 * ```tsx
 * <InlineRichTextEditor
 *   initialContent="<p>Hello <b>World</b></p>"
 *   onContentChange={(html) => saveNote(html)}
 *   placeholder="Start typing..."
 * />
 * ```
 */
export const InlineRichTextEditor = forwardRef<RichEditor, InlineRichTextEditorProps>(({
  initialContent = '',
  onContentChange,
  placeholder = 'Start typing...',
  onFormattingChange,
}, ref) => {
  const theme = useTheme();
  const editorRef = useRef<RichEditor>(null);

  // Forward the ref - RichToolbar needs direct access to RichEditor
  useImperativeHandle(ref, () => editorRef.current as RichEditor, []);

  /**
   * Handles content changes in the editor
   */
  const handleChange = useCallback(
    (html: string) => {
      logger.callback('InlineRichTextEditor', 'handleChange', {
        length: html.length,
      });

      if (onContentChange) {
        onContentChange(html);
      }
    },
    [onContentChange],
  );

  /**
   * Handles editor initialization
   */
  const handleEditorInitialized = useCallback(() => {
    logger.component('InlineRichTextEditor', 'initialized', {
      hasContent: !!initialContent,
      hasEditorRef: !!editorRef.current,
    });

    // Set initial content if provided (only if not empty)
    if (initialContent && initialContent.trim() && editorRef.current) {
      logger.component(
        'InlineRichTextEditor',
        'setting-initial-content',
        initialContent,
      );
      editorRef.current.setContentHTML(initialContent);
    }
  }, [initialContent]);

  /**
   * Handles focus event
   */
  const handleFocus = useCallback(() => {
    logger.callback('InlineRichTextEditor', 'focus');
  }, []);

  /**
   * Handles blur event
   */
  const handleBlur = useCallback(() => {
    logger.callback('InlineRichTextEditor', 'blur');
  }, []);

  /**
   * Sets up editor theme colors
   */
  useEffect(() => {
    // Theme is applied via editorStyle prop, no need to update content here
  }, [theme]);

  return (
    <EditorContainer>
      <RichEditor
        ref={editorRef}
        placeholder={placeholder}
        onChange={handleChange}
        editorInitializedCallback={handleEditorInitialized}
        onFocus={handleFocus}
        onBlur={handleBlur}
        initialContentHTML={initialContent || ''}
        useContainer={false}
        disabled={false}
        style={{
          flex: 1,
          backgroundColor: theme.background,
        }}
        editorStyle={{
          backgroundColor: theme.background,
          color: theme.text,
          caretColor: theme.text,
          placeholderColor: theme.textSecondary,
          contentCSSText: `
            * {
              direction: ltr !important;
              text-align: left !important;
            }
            body {
              font-size: 16px;
              line-height: 24px;
              padding: 20px;
              color: ${theme.text};
              background-color: ${theme.background};
              direction: ltr;
              text-align: left;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            p, div, span {
              direction: ltr !important;
              text-align: left !important;
            }
          `,
        }}
      />
    </EditorContainer>
  );
});

InlineRichTextEditor.displayName = 'InlineRichTextEditor';

export default InlineRichTextEditor;
