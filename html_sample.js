var htmlSample =
  "<h1>Header 1</h1><h2>Header 2</h2><h3>Header 3</h3><p>0 - plain</p><p><strong>1 - bold</strong></p><p><em>2 - italic</em></p><p><u>3 - underline</u></p><p>4 - this text is normal, <strong>this text is bold</strong></p><p>5 - this text is normal, <strong>this text is bold</strong> , <em>this text is italic</em> , <u>this is underlined</u></p><p><strong><em>6 - this text is bold and italic</em></strong></p><p><strong><u>7 - this text is bold and underlined</u></strong></p><p><em><u>8 - this text is italic and underlined</u></em></p><p><strong><em><u>9 - this text is bold, italic, and underlined</u></em></strong></p><p><strong>10 - this text is bold with <em>italic</em> in the middle</strong></p><p><em>11 - this text is italic with</em> <strong><em>bold</em></strong> <em>in the middle</em></p><p><strong>12 - this text is bold with <u>underline</u> in the middle</strong></p><p><u>13 - this text is underlined with</u> <strong><u>bold</u></strong> <u>in the middle</u></p><p><u>14 - this text is underlined with</u> <em><u>italic</u></em> <u>in the middle</u></p><p><strong>15 - this text is bold with <em>italic in the middle with <u>underline</u> in the middle</em> of that.</strong></p><p><u>16 - this text is underlined with</u> <strong><u>bold in the middle with</u> <em><u>italic</u></em> <u>in the middle</u></strong> <u>of that.</u></p><p><em>17 - this text is italic with <u>underline in the middle with</u></em> <strong><em><u>bold</u></em></strong> <em><u>in the middle</u> of that.</em></p>";

const sampleImportButton = document.getElementById("sample_import_button");

var sampleImportClickHandler = function () {
  quill.deleteText(0, quill.getLength());
  quill.pasteHTML(0, htmlSample);
};

sampleImportButton.addEventListener("click", sampleImportClickHandler);
