meta:
  id: alphaword_pdb
  file-extension: pdb
  endian: be
seq:
  - id: file_name
    type: strz
    encoding: ISO-8859-1
    size: 32
  - id: attributes
    type: u2
  - id: version
    type: u2
  - id: creation_time
    type: u4
  - id: modification_time
    type: u4
  - id: backup_time
    type: u4
  - id: modification_number
    type: u4
  - id: app_info
    type: u4
  - id: sort_info
    type: u4
  - id: doc_type
    type: str
    encoding: ISO-8859-1
    size: 4
  - id: creator_app
    type: str
    encoding: ISO-8859-1
    size: 4
  - id: unique_id_seed
    type: u4
  - id: next_record_list
    type: u4
  - id: num_records
    type: u2
  - id: record_headers
    type: record_header
    repeat: expr
    repeat-expr: num_records
  - id: idk2
    size: 20
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
  - id: sequences
    type: sequence_type
    repeat: eos

types:
  record_header:
    seq:
      - id: offset
        type: u4
      - id: attributes
        type: u1
      - id: unique_id1
        type: u1
      - id: unique_id2
        type: u1
      - id: unique_id3
        type: u1

  font_label:
    seq:
      - id: idk
        type: u2
      - id: file_name
        type: strz
        encoding: ISO-8859-1
  sequence_type:
    seq:
      - id: type_indicator
        type: u1
      - id: inner_type
        type:
          switch-on: type_indicator
          cases:
            1: text_style
            5: paragraph_formatting
            _: u1
  paragraph_formatting:
    seq:
      - id: idk
        size: 5
      - id: alignment
        type: u1
        enum: alignment
      - id: idk2
        size: 6
  text_style:
    seq:
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
