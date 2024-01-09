const fileInput = document.getElementById("file_input");
const alignmentTypes = ["left", "center", "right"];

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

  //Receives the paragraph's innerType alignment attribute (which should be a 0, 1, or 2) from the Kaitai struct and then uses it to set the object property to the corresponding item of the alignmentTypes array (left, center, right)
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

function convertHtmlToPdb() {
  let fileSoFar = new ArrayBuffer(32);
  let nameBuffer = new Uint8Array(fileSoFar, 0, 31);
  const latinFileName = SingleByte.encode("iso-8859-2", fileNameInput.value);
  console.log("What is latinFileName?", latinFileName);
  nameBuffer.set(latinFileName.slice(0, 31));
  console.log("What is nameBuffer?", nameBuffer);
  console.log("What is fileSoFar?", fileSoFar);
  alert(
    "This feature is a work in progress! Check back in a few weeks. 2023-12-18"
  );
}

encodeButton.addEventListener("click", convertHtmlToPdb);
