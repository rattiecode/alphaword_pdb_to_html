// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["kaitai-struct/KaitaiStream"], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory(require("kaitai-struct/KaitaiStream"));
  } else {
    root.AlphawordPdb = factory(root.KaitaiStream);
  }
})(typeof self !== "undefined" ? self : this, function (KaitaiStream) {
  var AlphawordPdb = (function () {
    AlphawordPdb.Alignment = Object.freeze({
      LEFT: 0,
      CENTER: 1,
      RIGHT: 2,

      0: "LEFT",
      1: "CENTER",
      2: "RIGHT",
    });

    function AlphawordPdb(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    AlphawordPdb.prototype._read = function () {
      this.fileName = KaitaiStream.bytesToStr(
        KaitaiStream.bytesTerminate(this._io.readBytes(32), 0, false),
        "ISO-8859-1"
      );
      this.attributes = this._io.readU2be();
      this.version = this._io.readU2be();
      this.creationTime = this._io.readU4be();
      this.modificationTime = this._io.readU4be();
      this.backupTime = this._io.readU4be();
      this.modificationNumber = this._io.readU4be();
      this.appInfo = this._io.readU4be();
      this.sortInfo = this._io.readU4be();
      this.docType = KaitaiStream.bytesToStr(
        this._io.readBytes(4),
        "ISO-8859-1"
      );
      this.creatorApp = KaitaiStream.bytesToStr(
        this._io.readBytes(4),
        "ISO-8859-1"
      );
      this.uniqueIdSeed = this._io.readU4be();
      this.nextRecordList = this._io.readU4be();
      this.numRecords = this._io.readU2be();
      this.recordHeaders = [];
      for (var i = 0; i < this.numRecords; i++) {
        this.recordHeaders.push(new RecordHeader(this._io, this, this._root));
      }
      this.padding = this._io.readU2be();
      this.sectionIdType = this._io.readU2be();
      this.padding2 = this._io.readU2be();
      this.textDocRecordLength = this._io.readU4be();
      this.idkStatic299067162755072 = this._io.readU8be();
      this.sectionIdType2 = this._io.readU2be();
      this.paragraphCount = this._io.readU4be();
      this.textNodeCount = this._io.readU4be();
      this.textNodeCharacterCount = this._io.readU4be();
      this.fontLabelLength1 = this._io.readU4be();
      this.idk3Probably128 = this._io.readU1();
      this.fontLabelLength2 = this._io.readU2be();
      this.fontLabels = this._io.readBytes(this.fontLabelLength2);
      this.sequences = [];
      var i = 0;
      while (!this._io.isEof()) {
        this.sequences.push(new SequenceType(this._io, this, this._root));
        i++;
      }
    };

    var SequenceType = (AlphawordPdb.SequenceType = (function () {
      function SequenceType(_io, _parent, _root) {
        this._io = _io;
        this._parent = _parent;
        this._root = _root || this;

        this._read();
      }
      SequenceType.prototype._read = function () {
        this.typeIndicator = this._io.readU1();
        switch (this.typeIndicator) {
          case 1:
            this.innerType = new TextStyle(this._io, this, this._root);
            break;
          case 5:
            this.innerType = new ParagraphFormatting(
              this._io,
              this,
              this._root
            );
            break;
          default:
            this.innerType = this._io.readU1();
            break;
        }
      };

      return SequenceType;
    })());

    var StyleFlags = (AlphawordPdb.StyleFlags = (function () {
      function StyleFlags(_io, _parent, _root) {
        this._io = _io;
        this._parent = _parent;
        this._root = _root || this;

        this._read();
      }
      StyleFlags.prototype._read = function () {
        this.flags = this._io.readU1();
      };
      Object.defineProperty(StyleFlags.prototype, "isUnderlined", {
        get: function () {
          if (this._m_isUnderlined !== undefined) return this._m_isUnderlined;
          this._m_isUnderlined = (this.flags & 4) != 0;
          return this._m_isUnderlined;
        },
      });
      Object.defineProperty(StyleFlags.prototype, "isItalic", {
        get: function () {
          if (this._m_isItalic !== undefined) return this._m_isItalic;
          this._m_isItalic = (this.flags & 2) != 0;
          return this._m_isItalic;
        },
      });
      Object.defineProperty(StyleFlags.prototype, "isBold", {
        get: function () {
          if (this._m_isBold !== undefined) return this._m_isBold;
          this._m_isBold = (this.flags & 1) != 0;
          return this._m_isBold;
        },
      });

      return StyleFlags;
    })());

    var TextStyle = (AlphawordPdb.TextStyle = (function () {
      function TextStyle(_io, _parent, _root) {
        this._io = _io;
        this._parent = _parent;
        this._root = _root || this;

        this._read();
      }
      TextStyle.prototype._read = function () {
        this.length = this._io.readU2be();
        this.fontIndex = this._io.readU1();
        this.fontSize = this._io.readU1();
        this.idk = this._io.readU1();
        this.styleFlags = new StyleFlags(this._io, this, this._root);
        this.text = KaitaiStream.bytesToStr(
          this._io.readBytes(this.length),
          "ISO-8859-1"
        );
      };

      return TextStyle;
    })());

    var ParagraphFormatting = (AlphawordPdb.ParagraphFormatting = (function () {
      function ParagraphFormatting(_io, _parent, _root) {
        this._io = _io;
        this._parent = _parent;
        this._root = _root || this;

        this._read();
      }
      ParagraphFormatting.prototype._read = function () {
        this.idk = this._io.readBytes(5);
        this.alignment = this._io.readU1();
        this.idk2 = this._io.readBytes(6);
      };

      return ParagraphFormatting;
    })());

    var RecordHeader = (AlphawordPdb.RecordHeader = (function () {
      function RecordHeader(_io, _parent, _root) {
        this._io = _io;
        this._parent = _parent;
        this._root = _root || this;

        this._read();
      }
      RecordHeader.prototype._read = function () {
        this.offset = this._io.readU4be();
        this.attributes = this._io.readU1();
        this.uniqueId1 = this._io.readU1();
        this.uniqueId2 = this._io.readU1();
        this.uniqueId3 = this._io.readU1();
      };

      return RecordHeader;
    })());

    var FontLabel = (AlphawordPdb.FontLabel = (function () {
      function FontLabel(_io, _parent, _root) {
        this._io = _io;
        this._parent = _parent;
        this._root = _root || this;

        this._read();
      }
      FontLabel.prototype._read = function () {
        this.idk = this._io.readU2be();
        this.fileName = KaitaiStream.bytesToStr(
          this._io.readBytesTerm(0, false, true, true),
          "ISO-8859-1"
        );
      };

      return FontLabel;
    })());

    return AlphawordPdb;
  })();
  return AlphawordPdb;
});
