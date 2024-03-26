const fileInput = document.getElementById("file_input");
const downloadLinkHolder = document.getElementById("download_link_holder");
const alignmentTypes = ["left", "center", "right", "justify"];

// This looks for a change in value: no file to yes file
async function fileChangeHandler(fileChangeEvent) {
  // Javascript's reference to the file that was dragged in
  const file = fileChangeEvent.target.files[0];
  console.log("What is file? ", file);
  // Reading the contents of the file and storing them in a byte array
  // We use await because this may take time to read from the file system.
  const arrayBuffer = await file.arrayBuffer();
  lastArrayBuffer = arrayBuffer;
  console.log("What is arrayBuffer? ", arrayBuffer);
  // Pass into Kaitai, which parses for us
  var parsedPDB = new AlphawordPdb(new KaitaiStream(arrayBuffer));
  console.log("What is parsedPDB?", parsedPDB);

  let currentParagraph = null;
  let paragraphs = [];
  // This uses the Kaitai structure file (styleFlags, isItalic, etc) to denote what HTML to apply
  function processTextStyle(textInnerType) {
    let text = textInnerType.text;
    if (textInnerType.styleFlags.isItalic) {
      text = `<em>${text}</em>`;
    }
    if (textInnerType.styleFlags.isBold) {
      text = `<strong>${text}</strong>`;
    }
    if (textInnerType.styleFlags.isUnderlined) {
      text = `<u>${text}</u>`;
    }
    currentParagraph.children.push(text);
  }

  //Receives the paragraph's innerType alignment attribute (which should be a 0, 1, 2, or 3) from the Kaitai struct and then uses it to set the object property to the corresponding item of the alignmentTypes array (left, center, right, justify)
  // Creates an array of children to contain all the formatted text that exists within the paragraph.
  function processParagraph(paragraphInnerType) {
    currentParagraph = {
      alignment: alignmentTypes[paragraphInnerType.alignment],
      children: [],
    };
    paragraphs.push(currentParagraph);
  }

  parsedPDB.sequences.forEach(function (item) {
    // This looks at the typeIndicator (the Kaitai struct dependency) to determine if the following formatting is for a paragraph, or a piece of text. It then sends the formatting to the next phase of processing.
    if (item.typeIndicator === 5) {
      processParagraph(item.innerType);
    } else if (item.typeIndicator === 1) {
      processTextStyle(item.innerType);
    } else {
      console.warn(
        `Unsupported sequence type: "${item.typeIndicator}".\n(The program didn't recognize this bit of your file for conversion.)\nIf you'd like us to add support for your PDB file, please send it to rattiecoding@gmail.com.`
      );
    }
  });

  //console.log("What is paragraphs after parsing?", paragraphs);
  // "paragraphs" is an array of objects with the properties:
  //   alignment: string, has the text "left", "right", or "center"
  //   children: string[], array of strings
  // This creates a new array of paragraphsAsStrings that have been formatted and joined together.
  const paragraphsAsStrings = paragraphs.map(function (paragraph) {
    return `<p style="text-align: ${
      paragraph.alignment
    };">${paragraph.children.join("")}</p>`;
  });
  const output = paragraphsAsStrings.join("\n");
  console.log("What is output?", output);
  console.log("What is quill?", quill);
  quill.deleteText(0, quill.getLength());
  quill.pasteHTML(0, output);
}

fileInput.addEventListener("change", fileChangeHandler);

const fileNameInput = document.getElementById("file_name");
const encodeButton = document.getElementById("encode_button");

const mergeArrayBuffers = function (a, b) {
  const result = new Uint8Array(a.byteLength + b.byteLength);
  result.set(new Uint8Array(a));
  result.set(new Uint8Array(b), a.byteLength);
  return result;
};

const convertDanaParagraphToArrayBuffer = function (danaParagraph) {
  /*
Shape of a danaParagraph:
{
  align: string, 
  children: [
    {
      text: "Sample text",
      isBold: true,
      isItalic: true,
      isUnderlined: true,
    },
  ]
}
*/
  const alignmentIndex = alignmentTypes.indexOf(danaParagraph.align);
  const alignmentByte = alignmentIndex === -1 ? 0 : alignmentIndex;
  let paragraphSoFar = new Uint8Array([
    0x05,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    alignmentByte,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
  ]);
  danaParagraph.children.forEach(function (node) {
    // Returns Uint8Array
    const latin1EncodedText = SingleByte.encode("iso-8859-2", node.text);
    const textNodeLength = latin1EncodedText.buffer.byteLength;
    const textNodeHeader = new ArrayBuffer(7 + textNodeLength);
    const dataView = new DataView(textNodeHeader);
    //console.log("What is dataView?", dataView);
    dataView.setUint8(0, 0x01); // Type indicator
    dataView.setUint16(1, textNodeLength); // Length of text node
    dataView.setUint8(3, 0x00); // fontIndex
    dataView.setUint8(4, 28); // set fontSize to 14 px
    dataView.setUint8(5, 0x00); // Idk

    let styleFlags = 0;
    if (node.isUnderlined) {
      styleFlags += 0b00000100;
    }
    if (node.isItalic) {
      styleFlags += 0b00000010;
    }
    if (node.isBold) {
      styleFlags += 0b00000001;
    }
    dataView.setUint8(6, styleFlags); // Style flags
    new Uint8Array(textNodeHeader).set(latin1EncodedText, 7);
    paragraphSoFar = mergeArrayBuffers(paragraphSoFar, textNodeHeader);
  });
  return paragraphSoFar;
};

function convertHtmlToPdb() {
  let fileSoFar = new ArrayBuffer(32);
  let nameBuffer = new Uint8Array(fileSoFar, 0, 31);
  const latinFileName = SingleByte.encode("iso-8859-2", fileNameInput.value);
  console.log("What is latinFileName?", latinFileName);
  nameBuffer.set(latinFileName.slice(0, 31));
  const donorDataForDana = new Uint8Array([
    // Offset 0x00000020 to 0x0000008C
    0x00, 0x08, 0x00, 0x00, 0xb6, 0x3f, 0x56, 0x44, 0xb6, 0x3f, 0x56, 0x46,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x42, 0x44, 0x4f, 0x43, 0x57, 0x72, 0x64, 0x53,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00,
    0x00, 0x60, 0x40, 0xf2, 0x10, 0x01, 0x00, 0x00, 0x00, 0x70, 0x40, 0xf2,
    0x10, 0x02, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x87,
    0x00, 0x01, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x04, 0x00, 0x00,
    0x00, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x2e, 0x00, 0x00,
    0x00, 0x08, 0x80, 0x00, 0x08, 0x00, 0x00, 0x50, 0x6c, 0x61, 0x69, 0x6e,
    0x00,
  ]);

  fileSoFar = mergeArrayBuffers(
    fileSoFar,
    Uint8Array.from(donorDataForDana).buffer
  );

  console.log("What is nameBuffer?", nameBuffer);

  const danaParagraphs = Array.from(quill.root.childNodes).map(
    getDanaPargraphFromDomNode
  );
  console.log("What is danaParagraphs?", danaParagraphs);
  // Getting the total count of paragraphs in the array to fulfill the PDB paragraphCount field.
  const paragraphCount = danaParagraphs.length;
  // Getting the total count of the text nodes from all paragraphs to fulfill the PDB textNodeCount field.
  const textNodeCount = danaParagraphs.reduce(function (
    accumulator,
    paragraph
  ) {
    return accumulator + paragraph.children.length;
  },
  0);
  // Getting the total count of text characters from all text nodes inside all paragraphs to fulfill the PDB textNodeCharacterCount field.
  const textNodeCharacterCount = danaParagraphs.reduce(function (
    allParagraphsTotal,
    paragraph
  ) {
    return (
      allParagraphsTotal +
      paragraph.children.reduce(function (paragraphTotal, textNode) {
        return paragraphTotal + textNode.text.length;
      }, 0)
    );
  },
  0);
  const encodedDanaParagraphs = danaParagraphs.map(
    convertDanaParagraphToArrayBuffer
  );
  encodedDanaParagraphs.forEach(function (encodedDanaParagraph) {
    fileSoFar = mergeArrayBuffers(fileSoFar, encodedDanaParagraph.buffer);
  });
  console.log("What is encodedDanaParagraphs?", encodedDanaParagraphs);
  console.log("What is totalTextNodes?", textNodeCount);
  console.log("What is fileSoFar?", fileSoFar);

  const headerDataView = new DataView(fileSoFar.buffer);
  // Set the count-related offsets with their proper values.
  headerDataView.setUint32(0x72, paragraphCount);
  headerDataView.setUint32(0x76, textNodeCount);
  headerDataView.setUint32(0x7a, textNodeCharacterCount);

  // application/octect-stream is MIME type to force a download
  const blob = new Blob([fileSoFar.buffer], {
    type: "application/octet-stream",
  });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileNameInput.value + ".pdb";
  link.innerText = 'Download "' + link.download + '" now?';
  downloadLinkHolder.innerHTML = "";
  downloadLinkHolder.appendChild(link);
  // TODO: Write totalParagraphNodes and totalTextNodes into correct offset in fileSoFar
  // TODO: Create download link that lets the user get the .pdb file
  // TODO: Replace quotes with smart quotes
}

encodeButton.addEventListener("click", convertHtmlToPdb);
