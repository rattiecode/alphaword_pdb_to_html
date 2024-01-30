const tests = [
  {
    input: "<p></p>",
    output: [],
  },
  {
    input: "<p>0 - plain</p>",
    output: [{ text: "0 - plain" }],
  },
  {
    input: "<h1>Header 1</h1>",
    output: [
      {
        text: "Header 1",
        isBold: true,
        isUnderlined: true,
      },
    ],
  },
  {
    input: "<p><strong>1 - bold</strong></p>",
    output: [
      {
        text: "1 - bold",
        isBold: true,
      },
    ],
  },
  {
    input:
      "<p>5 - this text is normal, <strong>this text is bold</strong> , <em>this text is italic</em> , <u>this is underlined</u></p>",
    output: [
      {
        text: "5 - this text is normal, ",
      },
      {
        text: "this text is bold",
        isBold: true,
      },
      {
        text: " , ",
      },
      {
        text: "this text is italic",
        isItalic: true,
      },
      {
        text: " , ",
      },
      {
        text: "this is underlined",
        isUnderlined: true,
      },
    ],
  },
  {
    input:
      "<p><strong>15 - this text is bold with <em>italic in the middle with <u>underline</u> in the middle</em> of that.</strong></p>",
    output: [
      {
        text: "15 - this text is bold with ",
        isBold: true,
      },
      {
        text: "italic in the middle with ",
        isBold: true,
        isItalic: true,
      },
      {
        text: "underline",
        isBold: true,
        isItalic: true,
        isUnderlined: true,
      },
      {
        text: " in the middle",
        isBold: true,
        isItalic: true,
      },
      {
        text: " of that.",
        isBold: true,
      },
    ],
  },
  {
    input:
      "<p><u>16 - this text is underlined with</u> <strong><u>bold in the middle with</u> <em><u>italic</u></em> <u>in the middle</u></strong> <u>of that.</u></p>",
    output: [
      {
        text: "16 - this text is underlined with",
        isUnderlined: true,
      },
      {
        text: " ",
      },
      {
        text: "bold in the middle with",
        isBold: true,
        isUnderlined: true,
      },
      {
        text: " ",
        isBold: true,
      },
      {
        text: "italic",
        isBold: true,
        isItalic: true,
        isUnderlined: true,
      },
      {
        text: " ",
        isBold: true,
      },
      {
        text: "in the middle",
        isBold: true,
        isUnderlined: true,
      },
      {
        text: " ",
      },
      {
        text: "of that.",
        isUnderlined: true,
      },
    ],
  },
  {
    input:
      "<p><em>17 - this text is italic with <u>underline in the middle with</u></em> <strong><em><u>bold</u></em></strong> <em><u>in the middle</u> of that.</em></p>",
    output: [
      {
        text: "17 - this text is italic with ",
        isItalic: true,
      },
      {
        text: "underline in the middle with",
        isItalic: true,
        isUnderlined: true,
      },
      {
        text: " ",
      },
      {
        text: "bold",
        isBold: true,
        isItalic: true,
        isUnderlined: true,
      },
      {
        text: " ",
      },
      {
        text: "in the middle",
        isItalic: true,
        isUnderlined: true,
      },
      {
        text: " of that.",
        isItalic: true,
      },
    ],
  },
];

const getDanaStyledTextNodesFromDomNode = function (
  topLevelNode,
  parentStatuses
) {
  let result = [];
  const statuses = Object.assign({}, parentStatuses);
  const nodes = topLevelNode.childNodes;

  if (topLevelNode.nodeName === "H1") {
    statuses.isBold = true;
    statuses.isUnderlined = true;
  } else if (topLevelNode.nodeName === "STRONG") {
    statuses.isBold = true;
  } else if (topLevelNode.nodeName === "EM") {
    statuses.isItalic = true;
  } else if (topLevelNode.nodeName === "U") {
    statuses.isUnderlined = true;
  }

  for (let index = 0; index < nodes.length; index++) {
    // Nodes can be elements or text nodes or comment nodes, etc.
    const node = nodes[index];
    // Begin testing what sort of node it is
    if (node.nodeName === "#text") {
      result.push(Object.assign({ text: node.textContent }, statuses));
    } else {
      const childNodeResult = getDanaStyledTextNodesFromDomNode(node, statuses);
      result = result.concat(childNodeResult);
    }
  }
  return result;
};

tests.forEach(function (test) {
  const testDomNode = document.createElement("div");
  testDomNode.innerHTML = test.input;
  const topLevelNode = testDomNode.children[0];
  const output = getDanaStyledTextNodesFromDomNode(topLevelNode);

  const outputAsJson = JSON.stringify(output);
  const expectedOutputAsJson = JSON.stringify(test.output);
  console.assert(expectedOutputAsJson === outputAsJson, test.input);
});
