# Rich Text Editor - User Guide

## Important: How Formatting Works

⚠️ **CRITICAL**: You cannot see formatting in **Edit Mode**. You must switch to **Preview Mode** to see your formatted text.

This is a limitation of React Native - the native TextInput component doesn't support rich text rendering. Apps like Google Keep and Samsung Notes use the same approach.

## How to Use the Rich Text Editor

### Step-by-Step Instructions

1. **Type Your Text** (in Edit mode)
   - Type normally in the text input
   - You'll see plain text

2. **Select Text to Format**
   - Tap and drag to select the text you want to format
   - You'll see the selection handles
   - The selection info bar shows how many characters are selected

3. **Apply Formatting**
   - Once text is selected, formatting buttons become active (not grayed out)
   - Tap any formatting button:
     - **B** - Bold
     - **I** - Italic
     - **U** - Underline
     - **S** - Strikethrough
     - **−/+** - Decrease/Increase font size
   - The button will be highlighted when applied
   - You'll see a message: "💡 1 format applied - Tap Preview to see"

4. **View Formatted Text** (Switch to Preview)
   - **Tap the "Preview" button** at the top
   - You'll now see your text with formatting applied
   - Bold text appears **bold**
   - Italic text appears *italic*
   - Underlined text has a line under it
   - Etc.

5. **Continue Editing**
   - Tap "Edit" to go back to editing mode
   - Add more text or apply more formatting
   - Switch to Preview again to see updates

## Visual Indicators

### In Edit Mode
- **No formatting applied**: "Select text and use toolbar to apply formatting"
- **Formatting applied**: "💡 X formats applied - Tap Preview to see"
- Formatting buttons are **grayed out** when no text is selected
- Formatting buttons are **active** when text is selected

### In Preview Mode
- **No formatting**: "No formatting applied yet"
- **With formatting**: "Showing X formatted ranges"
- You'll see the visual formatting applied to your text

## Example Workflow

```
1. Type: "Hello World"
   → You see: Hello World (plain text)

2. Select "Hello" (tap and drag)
   → Selection bar shows: "Selected: 5 characters 'Hello'"
   → Bold button becomes active (not grayed)

3. Tap Bold button (B)
   → Button highlights
   → Message: "💡 1 format applied - Tap Preview to see"
   → Text still looks plain (this is normal!)

4. Tap "Preview" button
   → You now see: **Hello** World
   → Message: "Showing 1 formatted range"

5. Tap "Edit" to continue
   → Back to editing mode
   → Message: "💡 1 format applied - Tap Preview to see"

6. Select "World"
   → Italic button becomes active

7. Tap Italic button (I)
   → Message updates: "💡 2 formats applied - Tap Preview to see"

8. Tap "Preview"
   → You now see: **Hello** *World*
   → Message: "Showing 2 formatted ranges"
```

## Why Can't I See Formatting in Edit Mode?

### Technical Explanation
React Native's `TextInput` component (the native text input) doesn't support rendering styled text. It can only show plain text with a single font/size/color.

### Solutions Used by Popular Apps

**Google Keep**: Same approach - edit mode shows plain text, you see formatting in read mode

**Samsung Notes**: Uses a WebView or custom native implementation (very complex)

**Apple Notes (iOS)**: Uses native iOS rich text APIs (not available in React Native)

**Our Implementation**: Hybrid approach with Edit/Preview modes (most practical for React Native)

## Troubleshooting

### "I applied formatting but nothing changed"
✅ **Solution**: Tap the **Preview** button to see your formatting

### "All formatting buttons are grayed out"
✅ **Solution**: Select some text first (tap and drag on the text)

### "I selected text but buttons are still gray"
❌ **Possible Issue**: Selection might not have registered
✅ **Solution**: Try selecting again, make sure you see the selection handles

### "Formatting disappeared after I edited text"
❌ **Possible Issue**: If you delete formatted text, the formatting goes with it
✅ **Solution**: This is expected behavior - formatting is tied to text positions

### "How do I remove formatting?"
Currently, you need to delete the formatted text and retype it. A "Clear Formatting" button could be added in a future update.

## Debug Information

When testing, check the console logs:

### Successful Formatting Flow
```
[LOG] [useRichTextEditor] applyFormatting: start=0, end=5, formatting={bold: true}
[LOG] [useRichTextEditor] applyFormatting.result: rangeCount=1
[LOG] [FormattedText] render: textLength=11, rangeCount=1, segmentCount=2
```

### Expected Logs When Selecting Text
```
[LOG] [RichTextEditor] handleSelectionChange: start=0, end=5, hasSelection=true
[LOG] [useRichTextEditor] handleSelectionChange: start=0, end=5
```

### Expected Logs When Clicking Format Button
```
[LOG] [CreateNote] handleToggleBold
[LOG] [useRichTextEditor] toggleFormatting: property=bold, start=0, end=5
```

If you don't see these logs, there might be an issue with the data flow.

## Limitations

### Current Limitations
1. ❌ **No inline formatting in edit mode** - must switch to Preview
2. ❌ **No color picker** - only default colors
3. ❌ **No font family selector** - system font only
4. ❌ **No block-level formatting** - no headings, lists, etc.
5. ❌ **No clear formatting button** - must delete and retype

### Future Enhancements (Planned)
1. ✅ Color picker for text and background colors
2. ✅ Font family selection
3. ✅ Clear formatting button
4. ✅ Undo/redo support
5. ✅ Keyboard shortcuts (Cmd+B for bold, etc.)
6. ⚠️ WebView-based inline editing (complex, may impact performance)

## Tips for Best Experience

1. **Write first, format later** - Type all your content, then go back and apply formatting
2. **Use Preview frequently** - Switch to Preview mode to check your formatting looks right
3. **Select carefully** - Make sure you've selected exactly the text you want to format
4. **One format at a time** - Apply bold, check in Preview, then apply more formatting
5. **Save often** - Tap the Save button to persist your formatted notes

## Common Use Cases

### Making a Title Bold
1. Type your title
2. Select the entire title
3. Tap Bold button
4. Tap Preview to see it bold
5. Tap Edit to continue

### Highlighting Important Words
1. Type your note
2. Select an important word
3. Tap Bold button
4. Select another important word
5. Tap Italic button
6. Tap Preview to see both formats

### Creating Formatted Lists (Manual)
Since there's no auto-list feature, you can:
1. Type your list with manual bullets (•, -, etc.)
2. Make each bullet point bold
3. Keep the text after each bullet normal weight

Example:
```
• Item One - description here
• Item Two - description here
```

Select "• Item One" → Bold
Select "• Item Two" → Bold
Preview → See formatted list

## Support

If formatting still isn't working after following this guide:

1. **Check logs** - Look in the console for error messages
2. **Verify selection** - Make sure text is actually selected (you see handles)
3. **Try Preview mode** - Always check Preview mode, not just Edit mode
4. **Restart app** - Close and reopen the app
5. **Report issue** - If problem persists, report with console logs

## Quick Reference Card

| Action | Steps | Result |
|--------|-------|--------|
| Apply Bold | Select text → Tap **B** → Tap Preview | **Bold text** |
| Apply Italic | Select text → Tap *I* → Tap Preview | *Italic text* |
| Apply Underline | Select text → Tap **U** → Tap Preview | <u>Underlined</u> |
| Apply Strikethrough | Select text → Tap **S** → Tap Preview | ~~Strikethrough~~ |
| Increase Font Size | Select text → Tap **+** → Tap Preview | Larger text |
| Decrease Font Size | Select text → Tap **−** → Tap Preview | Smaller text |
| View Formatting | Tap **Preview** button | See all formatting |
| Edit Again | Tap **Edit** button | Return to editing |

---

**Remember**: The key is to **switch to Preview mode** to see your formatting! 💡
