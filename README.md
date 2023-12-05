# AlphaWord PDB to HTML Converter

## [Use the tool here!](https://rattiecode.github.io/alphaword_pdb_to_html/)

I have an AlphaSmart Dana, and wanted to be able to move text from the Dana to my computer for editing without losing text formatting like italization. Mostly italization.

This program was written to parse the Dana's AlphaWord PDB files and display them in formatted HTML so that it can be copied into a dektop computer's word processor.

My future goal is to convert text from a word processor _back_ to PDB format so that I can continue working on my file without losing formatting.

## Notes on the PDB Format

At `0x84` there seems to be a byte that tells us how many bytes to seek forward to get to the end of the list of fonts in the document.

The first byte after the `0x84` + value at `0x84` is probably a value `0x05`.

### `0x05` seems to be a paragraph formatting indicator.

`0x05` seems to be a 13-byte struct where `0x05` means "we're starting a new line" and then there's 12 bytes of something.

Somewhere in here, it stores the justification for the line.

```
05 00 00 00 00 00 02 00 00 00 00 00 00
|                  |
|                  |
|                  + - Alignment
+ - Paragraph formatting indicator
```

#### Alignment is at offset `0x06`

`0x00`: Left alignment
`0x01`: Centered
`0x02`: Right alignment

### `0x01` seems to be a text formatting indicator.

Then we're going to see a 7-byte struct starting with `0x01` followed by 6 bytes of formatting information.

The first two bytes are a Uint16 that is the number of text bytes that follow the 7-byte struct.

```
01 00 00 00 18 00 07
|  |---| |  |  |  |
|    |   |  |  |  +--- Text style
|    |   |  |  +------ ???
|    |   |  +--------- Font size
|    |   +------------ Font index (See font table)
|    +---------------- Number of incoming characters
+--------------------- Text formatting indicator
```

### Font size starts at offset at `0x03`

Seems to be Uint16 value where this number is double the font size that is specified in the Dana. (`0x30` with a value of 48 is actually font size 24.) The Dana can only render even-numbered font sizes from size 8 to 14.

#### Text style starts at offset `0x06`

- `0x01` - Bold
- `0x02` - Italic
- `0x03` - Bold and italic
- `0x04` - Underlined
- `0x05` - Bold and underlined
- `0x06` - Italic and underlined
- `0x07` - Bold and italic and underlined

### Goals

- Find and replace
  - ' to ’
  - ` "` and `\n"` to ` “`
  - `" ` to `” `
- Generate PDB file from HTML
- Create a PDB download button
