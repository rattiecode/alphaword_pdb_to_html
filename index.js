const fileInput = document.getElementById("file_input");

async function fileChangeHandler(fileChangeEvent) {
  const file = fileChangeEvent.target.files[0];
  console.log("What is file? ", file);
  const arrayBuffer = await file.arrayBuffer();
  lastArrayBuffer = arrayBuffer;
  console.log("What is arrayBuffer? ", arrayBuffer);

  var parsedPDB = new AlphawordPdb(new KaitaiStream(arrayBuffer));
  console.log("What is parsedPDB?", parsedPDB);

  let currentParagraph = [];
  let paragraphs = [];
  function processTextStyle(value) {
    let text = value.text;
    if (value.styleFlags.isItalic) {
      text = `_${text}_`;
    }
    if (value.styleFlags.isBold) {
      text = `**${text}**`;
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
    return paragraph.join("");
  });
  const output = paragraphsAsStrings.join("\n\n");
  editor.setValue(output);
}

fileInput.addEventListener("change", fileChangeHandler);
