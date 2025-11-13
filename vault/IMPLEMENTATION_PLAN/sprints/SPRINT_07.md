# Sprint 7: Export Functionality (Week 9-10)

## Goals

Implement comprehensive export functionality supporting PDF, text, image, and JSON formats.

## Tasks

### 1. Install Export Dependencies

```bash
npm install react-native-share
npm install react-native-html-to-pdf
npm install react-native-blob-util
npm install react-native-view-shot
```

- [ ] Install dependencies
- [ ] Link native modules
- [ ] Run pod install (iOS)
- [ ] Test basic functionality

### 2. ExportHelper Utility

**File:** `src/util/ExportHelper.ts`

- [ ] Create exportNote function
- [ ] Create exportToPDF function
- [ ] Create exportToText function
- [ ] Create exportToImage function
- [ ] Create exportToJSON function
- [ ] Create shareNote function
- [ ] Create sanitizeFilename helper
- [ ] Handle errors gracefully

### 3. PDF Export (Text Notes)

- [ ] Convert TextContent to HTML
- [ ] Apply formatting styles to HTML
- [ ] Generate PDF from HTML
- [ ] Save to device storage
- [ ] Return file path
- [ ] Handle special characters
- [ ] Support all formatting options

### 4. PDF Export (Drawing Notes)

- [ ] Export drawing as image first
- [ ] Embed image in PDF
- [ ] Add note title to PDF
- [ ] Generate PDF
- [ ] Save to device storage
- [ ] Return file path

### 5. Plain Text Export

- [ ] Extract text from TextContent
- [ ] Combine blocks with line breaks
- [ ] Add note title header
- [ ] Save as .txt file
- [ ] Return file path
- [ ] Handle empty notes

### 6. Markdown Export (Bonus)

- [ ] Convert TextContent to Markdown
- [ ] Apply Markdown formatting
- [ ] Convert block types to Markdown
- [ ] Save as .md file
- [ ] Return file path

### 7. Image Export (Text Notes)

- [ ] Use ViewShot to capture note view
- [ ] Render note content
- [ ] Capture as PNG
- [ ] Save to device storage
- [ ] Return file path
- [ ] Handle large notes

### 8. Image Export (Drawing Notes)

- [ ] Export canvas directly
- [ ] Use Skia image export
- [ ] Save as PNG
- [ ] Return file path
- [ ] Preserve drawing quality

### 9. JSON Export

- [ ] Serialize note to JSON
- [ ] Include all metadata
- [ ] Pretty-print JSON
- [ ] Save as .json file
- [ ] Return file path
- [ ] Useful for backup

### 10. Share Functionality

- [ ] Integrate react-native-share
- [ ] Open native share sheet
- [ ] Support file sharing
- [ ] Support text sharing
- [ ] Handle share cancellation
- [ ] Handle share errors

### 11. ExportModal Component

**File:** `src/components/ExportModal/ExportModal.tsx`

- [ ] Create ExportModal component
- [ ] Display export format options
- [ ] Show format icons and descriptions
- [ ] Handle format selection
- [ ] Show loading state while exporting
- [ ] Show success message
- [ ] Show error message
- [ ] Close modal after export

### 12. Export Actions in Redux

**exportSlice.ts:**

- [ ] exportNote async thunk
- [ ] Update isExporting state
- [ ] Handle success
- [ ] Handle errors
- [ ] Store last export path

### 13. File Management

- [ ] Create files in Documents directory
- [ ] Check available storage space
- [ ] Handle storage full errors
- [ ] Clean up temporary files
- [ ] List exported files (future)

### 14. Export Settings (Future)

- [ ] PDF page size (A4, Letter)
- [ ] Image quality setting
- [ ] Default export format
- [ ] Auto-delete after share

### 15. Batch Export (Future)

- [ ] Export multiple notes
- [ ] Create ZIP archive
- [ ] Progress indicator for batch
- [ ] Handle errors gracefully

## Testing Checklist

### Text Notes
- [ ] Export text note to PDF
- [ ] Export text note to plain text
- [ ] Export text note to Markdown
- [ ] Export text note to image
- [ ] Export text note to JSON
- [ ] Formatting preserved in PDF
- [ ] Formatting preserved in image

### Drawing Notes
- [ ] Export drawing to PDF
- [ ] Export drawing to image
- [ ] Export drawing to JSON
- [ ] Drawing quality preserved

### Sharing
- [ ] Share PDF file
- [ ] Share text file
- [ ] Share image file
- [ ] Share via email
- [ ] Share via messaging apps
- [ ] Handle share cancellation

### Error Handling
- [ ] Handle storage full
- [ ] Handle permission denied
- [ ] Handle corrupted notes
- [ ] Show error messages

### General
- [ ] Export modal works
- [ ] Loading states display
- [ ] Success messages shown
- [ ] Files saved correctly
- [ ] Filenames sanitized
- [ ] Works on iOS
- [ ] Works on Android

## Definition of Done

- All export formats implemented
- PDF export works for text and drawings
- Text/Markdown export works
- Image export works
- JSON export works
- Share functionality works
- Error handling robust
- Loading states implemented
- Success feedback provided
- Works on both platforms
- Follows CLAUDE.md patterns
- TypeScript strict mode
