const fileInput = document.getElementById("file_input");
console.log("fileInput: ", fileInput);
const utf8decoder = new TextDecoder(); // default 'utf-8' or 'utf8'
let lastArrayBuffer = null;

async function fileChangeHandler(fileChangeEvent) {
  const file = fileChangeEvent.target.files[0];
  console.log("What is file? ", file);
  const arrayBuffer = await file.arrayBuffer();
  lastArrayBuffer = arrayBuffer;
  console.log("What is arrayBuffer? ", arrayBuffer);

  let nameBuffer = new Uint8Array(arrayBuffer, 0, 32);
  console.log("What is nameBuffer?", nameBuffer);

  const indexOfFirstNullByte = nameBuffer.indexOf(0);
  nameBuffer = nameBuffer.slice(0, indexOfFirstNullByte);

  const documentName = utf8decoder.decode(nameBuffer);
  console.log("What is documentName?", documentName);
}

fileInput.addEventListener("change", fileChangeHandler);
