# Export Features Implementation

## Overview

Export notes to multiple formats: PDF, plain text, image, and JSON for backup/sharing.

## Dependencies

```bash
npm install react-native-share
npm install react-native-blob-util
npm install react-native-view-shot
# For PDF generation (choose one):
npm install react-native-html-to-pdf
# OR
npm install @react-pdf/renderer
```

## Import Statement

```typescript
import ReactNativeBlobUtil from 'react-native-blob-util';
```

## Export Formats

### 1. PDF Export

**Use Case:** Professional document sharing, printing

```typescript
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export const exportToPDF = async (note: Note): Promise<string> => {
  if (note.type === 'text') {
    return exportTextNoteToPDF(note);
  } else {
    return exportDrawingNoteToPDF(note);
  }
};

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

const convertTextNoteToHTML = (note: Note): string => {
  const blocks = (note.content as TextContent).blocks;

  const htmlBlocks = blocks.map(block => {
    const style = `
      font-weight: ${block.formatting.bold ? 'bold' : 'normal'};
      font-style: ${block.formatting.italic ? 'italic' : 'normal'};
      text-decoration: ${block.formatting.underline ? 'underline' : 'none'};
      font-size: ${block.formatting.fontSize}px;
      color: ${block.formatting.color};
      background-color: ${block.formatting.backgroundColor || 'transparent'};
    `;

    const tag = getHTMLTag(block.blockType);
    return `<${tag} style="${style}">${block.text}</${tag}>`;
  }).join('\n');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${note.title}</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
      </style>
    </head>
    <body>
      <h1>${note.title}</h1>
      ${htmlBlocks}
    </body>
    </html>
  `;
};

const getHTMLTag = (blockType: BlockType): string => {
  switch (blockType) {
    case 'heading1': return 'h1';
    case 'heading2': return 'h2';
    case 'bullet': return 'li';
    case 'numbered': return 'li';
    default: return 'p';
  }
};
```

### 2. Plain Text Export

**Use Case:** Simple text sharing, copy-paste

```typescript
export const exportToText = async (note: Note): Promise<string> => {
  if (note.type !== 'text') {
    throw new Error('Can only export text notes to plain text');
  }

  const content = note.content as TextContent;
  const textContent = content.blocks.map(block => block.text).join('\n\n');

  const fullText = `${note.title}\n${'='.repeat(note.title.length)}\n\n${textContent}`;

  const filePath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${sanitizeFilename(note.title)}.txt`;
  await ReactNativeBlobUtil.fs.writeFile(filePath, fullText, 'utf8');

  return filePath;
};
```

### 3. Markdown Export (Bonus)

```typescript
export const exportToMarkdown = async (note: Note): Promise<string> => {
  if (note.type !== 'text') {
    throw new Error('Can only export text notes to markdown');
  }

  const content = note.content as TextContent;

  const markdown = content.blocks.map(block => {
    let text = block.text;

    // Apply formatting
    if (block.formatting.bold) text = `**${text}**`;
    if (block.formatting.italic) text = `*${text}*`;
    if (block.formatting.underline) text = `<u>${text}</u>`;

    // Apply block type
    switch (block.blockType) {
      case 'heading1': return `# ${text}`;
      case 'heading2': return `## ${text}`;
      case 'bullet': return `- ${text}`;
      case 'numbered': return `1. ${text}`;
      default: return text;
    }
  }).join('\n\n');

  const fullMarkdown = `# ${note.title}\n\n${markdown}`;

  const filePath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${sanitizeFilename(note.title)}.md`;
  await ReactNativeBlobUtil.fs.writeFile(filePath, fullMarkdown, 'utf8');

  return filePath;
};
```

### 4. Image Export

**Use Case:** Visual sharing, social media

```typescript
import {captureRef} from 'react-native-view-shot';

export const exportToImage = async (
  noteRef: React.RefObject<View>,
  note: Note,
): Promise<string> => {
  const uri = await captureRef(noteRef, {
    format: 'png',
    quality: 1,
  });

  const filePath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${sanitizeFilename(note.title)}.png`;
  await ReactNativeBlobUtil.fs.mv(uri, filePath);

  return filePath;
};

// Usage in component
const noteRef = useRef<View>(null);

const handleExportImage = async () => {
  const filePath = await exportToImage(noteRef, note);
  // Share or save
};

return (
  <ViewShot ref={noteRef}>
    <NoteContent note={note} />
  </ViewShot>
);
```

### 5. JSON Export (Backup)

**Use Case:** Backup, data transfer, debugging

```typescript
export const exportToJSON = async (note: Note): Promise<string> => {
  const jsonContent = JSON.stringify(note, null, 2);

  const filePath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${sanitizeFilename(note.title)}.json`;
  await ReactNativeBlobUtil.fs.writeFile(filePath, jsonContent, 'utf8');

  return filePath;
};
```

## Share Functionality

```typescript
import Share from 'react-native-share';

export const shareNote = async (filePath: string, mimeType: string) => {
  try {
    await Share.open({
      url: `file://${filePath}`,
      type: mimeType,
    });
  } catch (error) {
    if (error.message !== 'User did not share') {
      throw error;
    }
  }
};

// MIME types
const MIME_TYPES = {
  pdf: 'application/pdf',
  text: 'text/plain',
  markdown: 'text/markdown',
  image: 'image/png',
  json: 'application/json',
} as const;
```

## ExportHelper Utility

**File:** `src/util/ExportHelper.ts`

```typescript
import type {Note, ExportFormat} from '@/types/note';

export const exportNote = async (
  note: Note,
  format: ExportFormat,
): Promise<string> => {
  switch (format) {
    case 'pdf':
      return exportToPDF(note);
    case 'text':
      return exportToText(note);
    case 'image':
      throw new Error('Image export requires a view reference');
    case 'json':
      return exportToJSON(note);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

export const exportAndShare = async (
  note: Note,
  format: ExportFormat,
) => {
  const filePath = await exportNote(note, format);
  const mimeType = MIME_TYPES[format];

  await shareNote(filePath, mimeType);

  return filePath;
};

const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()
    .substring(0, 50);
};
```

## Export Modal UI

**File:** `src/screens/NoteView/components/ExportModal.tsx`

```typescript
export interface ExportModalProps {
  $visible: boolean;
  note: Note;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  $visible,
  note,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const {isExporting} = useAppSelector(state => state.export);

  const handleExport = async (format: ExportFormat) => {
    try {
      await dispatch(exportNote({note, format})).unwrap();
      onClose();
    } catch (error) {
      Alert.alert('Export Failed', error.message);
    }
  };

  return (
    <Modal $visible={$visible} onClose={onClose}>
      <ModalContent>
        <Title>Export Note</Title>

        <ExportOption onPress={() => handleExport('pdf')}>
          <Icon name="file-pdf" />
          <OptionText>Export as PDF</OptionText>
        </ExportOption>

        <ExportOption onPress={() => handleExport('text')}>
          <Icon name="file-text" />
          <OptionText>Export as Text</OptionText>
        </ExportOption>

        <ExportOption onPress={() => handleExport('image')}>
          <Icon name="image" />
          <OptionText>Export as Image</OptionText>
        </ExportOption>

        <ExportOption onPress={() => handleExport('json')}>
          <Icon name="code" />
          <OptionText>Export as JSON</OptionText>
        </ExportOption>

        {isExporting && <LoadingIndicator />}
      </ModalContent>
    </Modal>
  );
};
```

## Drawing Export

```typescript
// Export drawing as image using Skia
import {makeImageFromView} from '@shopify/react-native-skia';

export const exportDrawingToImage = async (
  canvasRef: React.RefObject<Canvas>,
  note: Note,
): Promise<string> => {
  const image = await makeImageFromView(canvasRef);
  const base64 = image.encodeToBase64();

  const filePath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${sanitizeFilename(note.title)}.png`;
  await ReactNativeBlobUtil.fs.writeFile(filePath, base64, 'base64');

  return filePath;
};

// Export drawing as PDF (rasterize first)
export const exportDrawingToPDF = async (
  canvasRef: React.RefObject<Canvas>,
  note: Note,
): Promise<string> => {
  const imagePath = await exportDrawingToImage(canvasRef, note);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><title>${note.title}</title></head>
    <body>
      <h1>${note.title}</h1>
      <img src="file://${imagePath}" style="max-width: 100%;" />
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
```

## File Management

```typescript
// Check if file exists
export const fileExists = async (filePath: string): Promise<boolean> => {
  return ReactNativeBlobUtil.fs.exists(filePath);
};

// Delete exported file
export const deleteExportedFile = async (filePath: string): Promise<void> => {
  if (await fileExists(filePath)) {
    await ReactNativeBlobUtil.fs.unlink(filePath);
  }
};

// Get file size
export const getFileSize = async (filePath: string): Promise<number> => {
  const stats = await ReactNativeBlobUtil.fs.stat(filePath);
  return parseInt(stats.size, 10);
};

// List all exported files
export const listExportedFiles = async (): Promise<string[]> => {
  const files = await ReactNativeBlobUtil.fs.ls(ReactNativeBlobUtil.fs.dirs.DocumentDir);
  return files.map(file => `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${file}`);
};
```

## Batch Export

```typescript
// Export multiple notes
export const exportMultipleNotes = async (
  notes: Note[],
  format: ExportFormat,
): Promise<string[]> => {
  const exportPromises = notes.map(note => exportNote(note, format));
  return Promise.all(exportPromises);
};

// Create ZIP archive (requires additional library)
export const exportAsZip = async (
  notes: Note[],
  format: ExportFormat,
): Promise<string> => {
  const filePaths = await exportMultipleNotes(notes, format);

  // Use react-native-zip-archive
  const zipPath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/notes_export.zip`;
  await zip(filePaths, zipPath);

  return zipPath;
};
```

## Error Handling

```typescript
try {
  const filePath = await exportNote(note, format);
  Alert.alert('Success', `Note exported to ${filePath}`);
} catch (error) {
  if (error.code === 'ENOSPC') {
    Alert.alert('Export Failed', 'Not enough storage space');
  } else if (error.code === 'EACCES') {
    Alert.alert('Export Failed', 'Permission denied');
  } else {
    Alert.alert('Export Failed', error.message);
  }
}
```

## Testing Checklist

- [ ] Export text note to PDF
- [ ] Export text note to plain text
- [ ] Export text note to markdown
- [ ] Export drawing to image
- [ ] Export drawing to PDF
- [ ] Export to JSON
- [ ] Share exported file
- [ ] Handle large notes (performance)
- [ ] Handle special characters in filename
- [ ] Handle storage full error
- [ ] Handle permission errors
- [ ] Clean up temporary files
- [ ] Batch export multiple notes
- [ ] Preserve formatting in exports
- [ ] Test on iOS and Android
