const tests = [
  {
    input: "<p></p>",
    output: {
      children: [],
    },
  },
  {
    input: "<p>0 - plain</p>",
    output: {
      children: [{ text: "0 - plain" }],
    },
  },
  {
    input: "<h1>Header 1</h1>",
    output: {
      children: [
        {
          text: "Header 1",
          isBold: true,
          isUnderlined: true,
        },
      ],
    },
  },
  {
    input: "<p><strong>1 - bold</strong></p>",
    output: {
      children: [
        {
          text: "1 - bold",
          isBold: true,
        },
      ],
    },
  },
  {
    input:
      "<p>5 - this text is normal, <strong>this text is bold</strong> , <em>this text is italic</em> , <u>this is underlined</u></p>",
    output: {
      children: [
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
  },
  {
    input:
      "<p><strong>15 - this text is bold with <em>italic in the middle with <u>underline</u> in the middle</em> of that.</strong></p>",
    output: {
      children: [
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
  },
  {
    input:
      "<p><u>16 - this text is underlined with</u> <strong><u>bold in the middle with</u> <em><u>italic</u></em> <u>in the middle</u></strong> <u>of that.</u></p>",
    output: {
      children: [
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
  },
  {
    input:
      "<p><em>17 - this text is italic with <u>underline in the middle with</u></em> <strong><em><u>bold</u></em></strong> <em><u>in the middle</u> of that.</em></p>",
    output: {
      children: [
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
  },
  {
    input:
      "<p>The following is an empty em: <em></em>. <span>This is a span.</span> <b>This is bold (b).</b> <i>This is italic (i).</i></p>",
    output: {
      children: [
        {
          text: "The following is an empty em: ",
        },
        {
          text: ". This is a span. ",
        },
        {
          text: "This is bold (b).",
          isBold: true,
        },
        {
          text: "This is italic (i).",
          isItalic: true,
        },
      ],
    },
  },
  {
    input: "<h2>This is an H2 header.</h2>",
    output: {
      children: [
        {
          text: "This is an H2 header.",
          isUnderlined: true,
        },
      ],
    },
  },
  {
    input: "<h3>This is an H3 header.</h3>",
    output: {
      children: [
        {
          text: "This is an H3 header.",
        },
      ],
    },
  },

  {
    input: "<p>This text is left-aligned.</p>",
    output: {
      children: [
        {
          text: "This text is left-aligned.",
        },
      ],
    },
  },
  {
    input: '<p class="ql-align-center">This text is centered by Quill.</p>',
    output: {
      align: "center",
      children: [
        {
          text: "This text is centered by Quill.",
        },
      ],
    },
  },
  {
    input: '<p style="text-align: center;">This text is centered by style.</p>',
    output: {
      align: "center",
      children: [
        {
          text: "This text is centered by style.",
        },
      ],
    },
  },
  {
    input: '<p class="ql-align-right">This text is right-aligned by Quill.</p>',
    output: {
      align: "right",
      children: [
        {
          text: "This text is right-aligned by Quill.",
        },
      ],
    },
  },
  {
    input:
      '<p style="text-align: right;">This text is right-aligned by style.</p>',
    output: {
      align: "right",
      children: [
        {
          text: "This text is right-aligned by style.",
        },
      ],
    },
  },
  {
    input: '<p class="ql-align-justify">This text is justified by Quill.</p>',
    output: {
      align: "justify",
      children: [
        {
          text: "This text is justified by Quill.",
        },
      ],
    },
  },
  {
    input:
      '<p style="text-align: justify;">This text is justified by style.</p>',
    output: {
      align: "justify",
      children: [
        {
          text: "This text is justified by style.",
        },
      ],
    },
  },
  {
    input:
      "<p><span>This text is a span.</span> The span is closed. <span>Then open again.</span></p>",
    output: {
      children: [
        {
          text: "This text is a span. The span is closed. Then open again.",
        },
      ],
    },
  },
  {
    input:
      "<p><em>This text is italic.</em><em>This text is also italic.</em></p>",
    output: {
      children: [
        {
          text: "This text is italic.This text is also italic.",
          isItalic: true,
        },
      ],
    },
  },
  {
    input:
      "<p><em>This text is italic.</em><em>This text is also italic.</em></p>",
    output: {
      children: [
        {
          text: "This text is italic.This text is also italic.",
          isItalic: true,
        },
      ],
    },
  },
  {
    input:
      "<p><em>This text is italic.</em><em>This text is also italic.</em><em>And one more!</em></p>",
    output: {
      children: [
        {
          text: "This text is italic.This text is also italic.And one more!",
          isItalic: true,
        },
      ],
    },
  },
  // TODO: Take spans with no style properties and merge with text nodes with no properties
];

const getDanaStyledTextNodesFromDomNode = function (
  topLevelNode,
  parentStatuses
) {
  let result = [];
  // Receives parentStatuses and copies their properties to a new Object
  // parentStatuses can be undefined, it will not give the empty Object additional properties, and will remain empty
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

const getAlignmentFromNode = function (domNode) {
  // console.log("What is domNode.style?", domNode.style);
  const quillAlignmentRegex = /ql-align-(justify|right|center|left)/;
  const regexMatch = quillAlignmentRegex.exec(domNode.className);
  // This is a Javascript ternary expression, an in-line if condition. Is regexMatch truthy?
  // Pre question mark is the test, post question mark is truthy branch, post is falsey
  const quillClassName = regexMatch ? regexMatch[1] : undefined;

  return quillClassName || domNode.style.textAlign || undefined;
};

const getWholeEnchilada = function (topLevelNode) {
  return {
    align: getAlignmentFromNode(topLevelNode),
    children: getDanaStyledTextNodesFromDomNode(topLevelNode),
  };
};

tests.forEach(function (test) {
  // Creates an empty div element
  const testDomNode = document.createElement("div");
  // Fills div with string of HTML from each test's input property
  // Hydrate the HTML from the text of the input
  testDomNode.innerHTML = test.input;
  // Gets a handle on the first child node in hydrated contents
  const topLevelNode = testDomNode.children[0];
  // Enter it into the test function
  const output = getWholeEnchilada(topLevelNode);

  const outputAsJson = JSON.stringify(output);
  const expectedOutputAsJson = JSON.stringify(test.output);
  // Use stringify to compare the equivalency of the objects by comparing their internal properties in the form of string
  if (expectedOutputAsJson !== outputAsJson) {
    const errorMessage = `Test failed: ${test.input}\n\tExpected: ${expectedOutputAsJson}\n\tActual:   ${outputAsJson}`;
    console.error(errorMessage);
  }
});
