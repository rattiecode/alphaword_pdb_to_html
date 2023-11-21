meta:
  id: alphaword_pdb
  file-extension: pdb
  endian: be
seq:
  - id: file_name
    type: strz
    encoding: ISO-8859-1
    size: 32
  - id: idk
    size: 28
  - id: doc_type
    type: str
    encoding: ISO-8859-1
    size: 4
  - id: creator_app
    type: str
    encoding: ISO-8859-1
    size: 4
  - id: idk2
    size: 46
  - id: paragraph_count_1
    type: u4
  - id: paragraph_count_2
    type: u4
  - id: character_count_idk
    type: u4
  - id: seriously_idk
    type: u4
  - id: idk3
    type: u1
  - id: font_label_length
    type: u2
  - id: font_labels
    size: font_label_length
  - id: paragraph_indicator
    type: paragraph_formatting
    repeat: expr
    repeat-expr: paragraph_count_1

types:
  font_label:
    seq:
      - id: idk
        type: u2
      - id: file_name
        type: strz
        encoding: ISO-8859-1
  paragraph_formatting:
    seq:
      - id: paragraph_indicator
        type: u1
        valid: 0x05
      - id: idk
        size: 5
      - id: alignment
        type: u1
        enum: alignment
      - id: idk2
        size: 6
      - id: formatted_text
        type: text_style
  text_style:
    seq:
      - id: text_style_indicator
        type: u1
        valid: 0x01
      - id: length
        type: u2
      - id: font_index
        type: u1
      - id: font_size
        type: u1
      - id: idk
        type: u1
      - id: style_flags
        type: style_flags
      - id: text
        type: str
        size: length
        encoding: ISO-8859-1
  style_flags:
    seq:
      - id: flags
        type: u1
    instances:
      is_underlined:
        value: (flags & 0b00000100) != 0
      is_italic:
        value: (flags & 0b00000010) != 0
      is_bold:
        value: (flags & 0b00000001) != 0

enums:
  alignment:
    0: left
    1: center
    2: right
