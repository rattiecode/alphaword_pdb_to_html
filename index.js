const fileInput = document.getElementById("file_input");

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

  let currentParagraph = [];
  let paragraphs = [];
  function processTextStyle(value) {
    let text = value.text;
    if (value.styleFlags.isItalic) {
      text = `<em>${text}</em>`;
    }
    if (value.styleFlags.isBold) {
      text = `<strong>${text}</strong>`;
    }
    if (value.styleFlags.isUnderlined) {
      text = `<u>${text}</u>`;
    }
    currentParagraph.push(text);
  }

  function processParagraph(value) {
    currentParagraph = [];
    paragraphs.push(currentParagraph);
  }

  parsedPDB.sequences.forEach(function (item) {
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
  const paragraphsAsStrings = paragraphs.map(function (paragraph) {
    return `<p>${paragraph.join("")}</p>`;
  });
  const output = paragraphsAsStrings.join("\n");
  console.log("What is output?", output);
  console.log("What is quill?", quill);
  quill.deleteText(0, quill.getLength());
  quill.pasteHTML(0, output);
}

fileInput.addEventListener("change", fileChangeHandler);
