import ReactNativeBlobUtil from 'react-native-blob-util';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import type {Note, TextContent, BlockType} from '@/types/note';

/**
 * Export format options
 */
export type ExportFormat = 'pdf' | 'text' | 'markdown' | 'image' | 'json';

/**
 * MIME types for different export formats
 */
const MIME_TYPES = {
  pdf: 'application/pdf',
  text: 'text/plain',
  markdown: 'text/markdown',
  image: 'image/png',
  json: 'application/json',
} as const;

/**
 * Sanitizes filename by removing invalid characters
 * @param filename - Original filename
 * @returns Sanitized filename
 */
const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()
    .substring(0, 50);
};

/**
 * Gets HTML tag for block type
 * @param blockType - Block type
 * @returns HTML tag name
 */
const getHTMLTag = (blockType: BlockType): string => {
  switch (blockType) {
    case 'heading1':
      return 'h1';
    case 'heading2':
      return 'h2';
    case 'bullet':
      return 'li';
    case 'numbered':
      return 'li';
    default:
      return 'p';
  }
};

/**
 * Converts text note to HTML for PDF export
 * @param note - Text note to convert
 * @returns HTML string
 */
const convertTextNoteToHTML = (note: Note): string => {
  const content = note.content as TextContent;

  // Try to get blocks (legacy format)
  let blocks: Array<{text: string; formatting: any; blockType: BlockType}> = [];

  if (content.blocks && content.blocks.length > 0) {
    blocks = content.blocks;
  } else if (content.text) {
    // Convert plain text to blocks
    const lines = content.text.split('\n').filter(line => line.trim());
    blocks = lines.map(line => ({
      text: line,
      formatting: {
        bold: false,
        italic: false,
        underline: false,
        fontSize: 16,
        color: '#000000',
        backgroundColor: undefined,
      },
      blockType: 'paragraph' as BlockType,
    }));
  }

  const htmlBlocks = blocks
    .map(block => {
      const style = `
        font-weight: ${block.formatting.bold ? 'bold' : 'normal'};
        font-style: ${block.formatting.italic ? 'italic' : 'normal'};
        text-decoration: ${block.formatting.underline ? 'underline' : 'none'};
        font-size: ${block.formatting.fontSize || 16}px;
        color: ${block.formatting.color || '#000000'};
        background-color: ${block.formatting.backgroundColor || 'transparent'};
      `;

      const tag = getHTMLTag(block.blockType);
      const escapedText = block.text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

      return `<${tag} style="${style}">${escapedText}</${tag}>`;
    })
    .join('\n');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${note.title}</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          padding: 20px;
          color: #000000;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 16px;
        }
        ul {
          list-style-type: disc;
          padding-left: 20px;
        }
        ol {
          list-style-type: decimal;
          padding-left: 20px;
        }
      </style>
    </head>
    <body>
      <h1>${note.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h1>
      ${htmlBlocks}
    </body>
    </html>
  `;
};

/**
 * Exports text note to PDF
 * @param note - Note to export
 * @returns File path of exported PDF
 */
export const exportToPDF = async (note: Note): Promise<string> => {
  if (note.type === 'text') {
    return exportTextNoteToPDF(note);
  } else {
    return exportDrawingNoteToPDF(note);
  }
};

/**
 * Exports text note to PDF
 * @param note - Text note to export
 * @returns File path of exported PDF
 */
const exportTextNoteToPDF = async (note: Note): Promise<string> => {
  const htmlContent = convertTextNoteToHTML(note);

  const options = {
    html: htmlContent,
    fileName: sanitizeFilename(note.title),
    directory: 'Documents',
  };

  const file = await RNHTMLtoPDF.convert(options);
  return file.filePath;
};

/**
 * Exports drawing note to PDF (rasterizes as image first)
 * @param note - Drawing note to export
 * @returns File path of exported PDF
 */
const exportDrawingNoteToPDF = async (_note: Note): Promise<string> => {
  // For drawing notes, we'll need to capture the canvas first
  // This will be handled by the component that has the canvas ref
  throw new Error(
    'Drawing PDF export requires canvas reference. Use exportDrawingToPDF instead.',
  );
};

/**
 * Exports note to plain text
 * @param note - Note to export
 * @returns File path of exported text file
 */
export const exportToText = async (note: Note): Promise<string> => {
  if (note.type !== 'text') {
    throw new Error('Can only export text notes to plain text');
  }

  const content = note.content as TextContent;
  let textContent = '';

  // Try to get blocks (legacy format)
  if (content.blocks && content.blocks.length > 0) {
    textContent = content.blocks.map(block => block.text).join('\n\n');
  } else if (content.text) {
    textContent = content.text;
  }

  const fullText = `${note.title}\n${'='.repeat(
    note.title.length,
  )}\n\n${textContent}`;

  const filePath = `${
    ReactNativeBlobUtil.fs.dirs.DocumentDir
  }/${sanitizeFilename(note.title)}.txt`;
  await ReactNativeBlobUtil.fs.writeFile(filePath, fullText, 'utf8');

  return filePath;
};

/**
 * Exports note to Markdown
 * @param note - Note to export
 * @returns File path of exported markdown file
 */
export const exportToMarkdown = async (note: Note): Promise<string> => {
  if (note.type !== 'text') {
    throw new Error('Can only export text notes to markdown');
  }

  const content = note.content as TextContent;
  let blocks: Array<{text: string; formatting: any; blockType: BlockType}> = [];

  // Try to get blocks (legacy format)
  if (content.blocks && content.blocks.length > 0) {
    blocks = content.blocks;
  } else if (content.text) {
    // Convert plain text to blocks
    const lines = content.text.split('\n').filter(line => line.trim());
    blocks = lines.map(line => ({
      text: line,
      formatting: {
        bold: false,
        italic: false,
        underline: false,
      },
      blockType: 'paragraph' as BlockType,
    }));
  }

  const markdown = blocks
    .map(block => {
      let text = block.text;

      // Apply formatting
      if (block.formatting.bold) text = `**${text}**`;
      if (block.formatting.italic) text = `*${text}*`;
      if (block.formatting.underline) text = `<u>${text}</u>`;

      // Apply block type
      switch (block.blockType) {
        case 'heading1':
          return `# ${text}`;
        case 'heading2':
          return `## ${text}`;
        case 'bullet':
          return `- ${text}`;
        case 'numbered':
          return `1. ${text}`;
        default:
          return text;
      }
    })
    .join('\n\n');

  const fullMarkdown = `# ${note.title}\n\n${markdown}`;

  const filePath = `${
    ReactNativeBlobUtil.fs.dirs.DocumentDir
  }/${sanitizeFilename(note.title)}.md`;
  await ReactNativeBlobUtil.fs.writeFile(filePath, fullMarkdown, 'utf8');

  return filePath;
};

/**
 * Exports note to JSON (backup format)
 * @param note - Note to export
 * @returns File path of exported JSON file
 */
export const exportToJSON = async (note: Note): Promise<string> => {
  const jsonContent = JSON.stringify(note, null, 2);

  const filePath = `${
    ReactNativeBlobUtil.fs.dirs.DocumentDir
  }/${sanitizeFilename(note.title)}.json`;
  await ReactNativeBlobUtil.fs.writeFile(filePath, jsonContent, 'utf8');

  return filePath;
};

/**
 * Exports drawing to image (requires canvas reference)
 * @param imageUri - URI of captured image
 * @param note - Drawing note
 * @returns File path of exported image
 */
export const exportDrawingToImage = async (
  imageUri: string,
  note: Note,
): Promise<string> => {
  const filePath = `${
    ReactNativeBlobUtil.fs.dirs.DocumentDir
  }/${sanitizeFilename(note.title)}.png`;
  await ReactNativeBlobUtil.fs.mv(imageUri, filePath);

  return filePath;
};

/**
 * Exports drawing to PDF (rasterizes as image first)
 * @param imageUri - URI of captured image
 * @param note - Drawing note
 * @returns File path of exported PDF
 */
export const exportDrawingToPDF = async (
  imageUri: string,
  note: Note,
): Promise<string> => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${note.title}</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          padding: 20px;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 16px;
        }
        img {
          max-width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body>
      <h1>${note.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h1>
      <img src="file://${imageUri}" alt="Drawing" />
    </body>
    </html>
  `;

  const options = {
    html: htmlContent,
    fileName: sanitizeFilename(note.title),
    directory: 'Documents',
  };

  const file = await RNHTMLtoPDF.convert(options);
  return file.filePath;
};

/**
 * Shares exported file
 * @param filePath - Path to file to share
 * @param mimeType - MIME type of file
 */
export const shareNote = async (
  filePath: string,
  mimeType: string,
): Promise<void> => {
  try {
    await Share.open({
      url: `file://${filePath}`,
      type: mimeType,
    });
  } catch (error: any) {
    if (error.message !== 'User did not share') {
      throw error;
    }
  }
};

/**
 * Exports note to specified format
 * @param note - Note to export
 * @param format - Export format
 * @returns File path of exported file
 */
export const exportNote = async (
  note: Note,
  format: ExportFormat,
): Promise<string> => {
  switch (format) {
    case 'pdf':
      return exportToPDF(note);
    case 'text':
      return exportToText(note);
    case 'markdown':
      return exportToMarkdown(note);
    case 'image':
      throw new Error('Image export requires a view reference');
    case 'json':
      return exportToJSON(note);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

/**
 * Exports note and shares it
 * @param note - Note to export
 * @param format - Export format
 * @returns File path of exported file
 */
export const exportAndShare = async (
  note: Note,
  format: ExportFormat,
): Promise<string> => {
  const filePath = await exportNote(note, format);
  const mimeType = MIME_TYPES[format];

  await shareNote(filePath, mimeType);

  return filePath;
};

/**
 * Checks if file exists
 * @param filePath - File path to check
 * @returns True if file exists
 */
export const fileExists = async (filePath: string): Promise<boolean> => {
  return ReactNativeBlobUtil.fs.exists(filePath);
};

/**
 * Deletes exported file
 * @param filePath - File path to delete
 */
export const deleteExportedFile = async (filePath: string): Promise<void> => {
  if (await fileExists(filePath)) {
    await ReactNativeBlobUtil.fs.unlink(filePath);
  }
};

/**
 * Gets file size in bytes
 * @param filePath - File path
 * @returns File size in bytes
 */
export const getFileSize = async (filePath: string): Promise<number> => {
  const stats = await ReactNativeBlobUtil.fs.stat(filePath);
  return parseInt(stats.size, 10);
};

/**
 * Lists all exported files
 * @returns Array of file paths
 */
export const listExportedFiles = async (): Promise<string[]> => {
  const files = await ReactNativeBlobUtil.fs.ls(
    ReactNativeBlobUtil.fs.dirs.DocumentDir,
  );
  return files.map(
    file => `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${file}`,
  );
};

/**
 * Exports multiple notes
 * @param notes - Notes to export
 * @param format - Export format
 * @returns Array of file paths
 */
export const exportMultipleNotes = async (
  notes: Note[],
  format: ExportFormat,
): Promise<string[]> => {
  const exportPromises = notes.map(note => exportNote(note, format));
  return Promise.all(exportPromises);
};

export default {
  exportNote,
  exportAndShare,
  exportToPDF,
  exportToText,
  exportToMarkdown,
  exportToJSON,
  exportDrawingToImage,
  exportDrawingToPDF,
  shareNote,
  fileExists,
  deleteExportedFile,
  getFileSize,
  listExportedFiles,
  exportMultipleNotes,
};
