importScripts(
  "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"
);

const asuLogo =
  "data:image/png;base64,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";
const ITEM_MARGIN_DEFAULT = 5;
const ITEM_MARGIN_LARGE = 20;
const PAGE_MARGIN_LEFT_RIGHT = 40;
const PAGE_MARGIN_TOP_BOTTOM = 10;

// takes an array of content, uses global styles etc.
const createPDF = (content) => {
  return {
    images: {
      asuLogo,
    },
    pageMargins: [
      PAGE_MARGIN_LEFT_RIGHT,
      PAGE_MARGIN_TOP_BOTTOM,
      PAGE_MARGIN_LEFT_RIGHT,
      PAGE_MARGIN_TOP_BOTTOM,
    ],
    content,
    styles: {
      font6: {
        fontSize: 6,
      },
      font7: {
        fontSize: 7,
      },
      font10: {
        fontSize: 10,
      },
      font12: {
        fontSize: 12,
      },
      font15: {
        fontSize: 15,
      },
      font20: {
        fontSize: 20,
      },
      center: {
        alignment: "center",
      },
      coursesTable: {
        margin: [20, 15, 20, 0],
        bold: true,
      },
      yearHeaders: {
        margin: [20, 10, 20, 0],
      },
    },
    defaultStyle: {
      columnGap: ITEM_MARGIN_LARGE,
      margin: [0, 0, 0, 0],
      fontSize: 9,
    },
  };
};

const makePDF = (
  {
    colors,
    user,
    profile,
    myInformation,
    myProgram,
    mySchools,
    myHighSchoolGrades,
    arizonaResidency,
    azCommunityCollegeConsent,
    affidavit,
  },
  pageBreak = false
) => {
  const black = colors["dark-3"];
  const grey = colors["dark-1"];

  const unbreakableSection = (...stack) => ({
    stack,
    unbreakable: true,
  });
  const striped = {
    hLineWidth: (i) => (i === 0 ? 0 : 0.2),
    vLineWidth: () => 0,
    hLineColor: () => colors["dark-1"],
    paddingTop: () => ITEM_MARGIN_DEFAULT,
    paddingRight: () => ITEM_MARGIN_DEFAULT,
    paddingBottom: () => ITEM_MARGIN_DEFAULT,
    paddingLeft: () => ITEM_MARGIN_DEFAULT,
  };
  const displayBanner = (text, widths = ["auto"]) => ({
    table: {
      widths,
      body: [text],
    },
    layout: {
      paddingLeft: () => PAGE_MARGIN_LEFT_RIGHT,
      paddingTop: () => 2,
      paddingBottom: () => 2,
      vLineColor: () => colors.primary,
      hLineColor: () => colors.primary,
      fillColor: (i, node, j) =>
        i !== 0 && j % 2 !== 0 ? colors.primary : null,
    },
    color: "white",
    fillColor: colors.primary,
    bold: true,
    margin: [-PAGE_MARGIN_LEFT_RIGHT, 10, 0, 5],
  });

  // CONTENT

  const header = [
    {
      table: {
        widths: ["*", "auto"],
        body: [
          [
            {
              text: "",
            },
            {
              text: "",
            },
          ],
          [
            {
              text: "",
            },
            {
              text: "",
            },
          ],
          [
            {
              text: "ASU Undergraduate Application",
              color: black,
            },
            {
              image: "asuLogo",
              width: 50,
              height: 20,
            },
          ],
          [
            {
              text: "",
            },
            {
              text: "",
            },
          ],
          [
            {
              text: "",
            },
            {
              text: "",
            },
          ],
        ],
      },
      layout: {
        paddingTop: (i, node) => verticallyAlign(i, node, "center"),
        hLineWidth: () => 0,
        vLineWidth: () => 0,
      },
      style: ["font20"],
      bold: true,
      pageBreak: pageBreak ? "before" : undefined,
    },
    {
      table: {
        widths: ["*", "*", "*"],
        body: [
          [
            [
              {
                text: `Name\n`,
                color: grey,
              },
              {
                text: user.legalFullName,
                style: ["font10"],
                color: black,
              },
            ],
            [
              {
                text: `Application ID:\n`,
                color: grey,
              },
              {
                text: user.appId,
                style: ["font10"],
                color: black,
              },
            ],
            [
              {
                text: `Date of appliaction\n`,
                color: grey,
              },
              {
                text: user.appSubmitDate,
                style: ["font10"],
                color: black,
              },
            ],
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0,
        hLineColor: () => colors["light-4"],
        paddingTop: () => ITEM_MARGIN_DEFAULT,
        paddingRight: () => ITEM_MARGIN_DEFAULT,
        paddingBottom: () => ITEM_MARGIN_DEFAULT,
        paddingLeft: () => ITEM_MARGIN_DEFAULT,
      },
    },
  ];

  const profileTable = [
    {
      table: {
        widths: ["45%", "*"],
        body: pdfBodyGenerator(profile?.data),
      },
      style: ["font7", "right"],
      layout: striped,
    },
  ];

  const myInfoTable = [
    {
      table: {
        widths: ["45%", "*"],
        body: pdfBodyGenerator(myInformation?.data),
      },
      style: ["font7", "right"],
      layout: striped,
    },
  ];

  const myProgramTable = [
    {
      table: {
        widths: ["45%", "*"],
        body: pdfBodyGenerator(myProgram?.data),
      },
      style: ["font7", "right"],
      layout: striped,
    },
  ];

  const mySchoolsTable = [
    {
      table: {
        widths: ["45%", "*"],
        body: pdfBodyGenerator(mySchools?.data),
      },
      style: ["font7", "right"],
      layout: striped,
    },
  ];

  const myHighSchoolGradesTable = [
    {
      table: {
        widths: ["45%", "*"],
        body: pdfBodyGenerator(myHighSchoolGrades?.data),
      },
      style: ["font7", "right"],
      layout: striped,
    },
  ];

  const arizonaResidencyTable = [
    {
      table: {
        widths: ["45%", "*"],
        body: pdfBodyGenerator(arizonaResidency?.data),
      },
      style: ["font7", "right"],
      layout: striped,
    },
  ];

  const azCommunityCollegeConsentTable = [
    {
      table: {
        widths: ["45%", "*"],
        body: pdfBodyGenerator(azCommunityCollegeConsent?.data),
      },
      style: ["font7", "right"],
      layout: striped,
    },
  ];

  const affidavitTable = [
    {
      table: {
        widths: ["45%", "*"],
        body: pdfBodyGenerator(affidavit?.data),
      },
      style: ["font7", "right"],
      layout: striped,
    },
  ];

  // DOC
  const pdfTableData = [
    unbreakableSection(header),
    unbreakableSection(displayBanner([profile.title]), ...profileTable),
    displayBanner([myInformation.title]),
    ...myInfoTable,
    displayBanner([myProgram.title]),
    ...myProgramTable,
    displayBanner([mySchools.title]),
    ...mySchoolsTable,
  ];
  // Checking if the myhighschool grades and arizona residency table has any values if not its not populated in the PDF
  if (Object.keys(myHighSchoolGrades.data).length > 0) {
    pdfTableData.push(
      displayBanner([myHighSchoolGrades.title]),
      ...myHighSchoolGradesTable
    );
  }
  if (Object.keys(arizonaResidency.data).length > 0) {
    pdfTableData.push(
      displayBanner([arizonaResidency.title]),
      ...arizonaResidencyTable
    );
  }
  if (azCommunityCollegeConsent?.data) {
    pdfTableData.push(
      displayBanner([azCommunityCollegeConsent.title]),
      ...azCommunityCollegeConsentTable
    );
  }
  if (affidavit?.data) {
    pdfTableData.push(displayBanner([affidavit.title]), ...affidavitTable);
  }

  return pdfTableData;
};
const verticallyAlign = (rowIndex, node, align) => {
  if (!["center", "bottom"].includes(align))
    throw new Error("Invalid alignment");

  const allCellHeights = node.table.body[rowIndex].map(
    (innerNode, columnIndex) => {
      const mFindInlineHeight = findInlineHeight(
        innerNode,
        node.table.widths[columnIndex]._calcWidth
      );

      return mFindInlineHeight.height;
    }
  );

  const maxRowHeight = Math.max(...allCellHeights);

  node.table.body[rowIndex].forEach((cell, ci) => {
    if (allCellHeights[ci] && maxRowHeight > allCellHeights[ci]) {
      let topMargin;

      if (align === "bottom") {
        topMargin = maxRowHeight - allCellHeights[ci];
      } else if (align === "center") {
        topMargin = (maxRowHeight - allCellHeights[ci]) / 2;
      }

      if (cell._margin) {
        cell._margin[1] = topMargin;
      } else {
        cell._margin = [0, topMargin, 0, 0];
      }
    }
  });

  return 0;
};

const findInlineHeight = (cell, maxWidth, usedWidth = 0) => {
  const calcLines = (inlines) => {
    if (inlines === undefined) return { height: 0, width: 0 };

    let currentMaxHeight = 0;

    for (const currentNode of inlines) {
      usedWidth += currentNode.width;

      if (usedWidth > maxWidth) {
        currentMaxHeight += currentNode.height;
        usedWidth = currentNode.width;
      } else {
        currentMaxHeight = Math.max(currentNode.height, currentMaxHeight);
      }
    }

    return {
      height: currentMaxHeight,
      width: usedWidth,
    };
  };

  if (cell._offsets) {
    usedWidth += cell._offsets.total;
  }

  if (cell._inlines && cell._inlines.length) {
    return calcLines(cell._inlines);
  }
  if (cell.stack && cell.stack[0]) {
    return cell.stack
      .map((item) => calcLines(item._inlines))
      .reduce((prev, next) => ({
        height: prev.height + next.height,
        width: Math.max(prev.width + next.width),
      }));
  }
  if (cell.table) {
    let currentMaxHeight = 0;

    for (const currentTableBodies of cell.table.body) {
      const innerTableHeights = currentTableBodies.map((innerTableCell) => {
        const findInlineHeight = this.findInlineHeight(
          innerTableCell,
          maxWidth,
          usedWidth
        );

        usedWidth = findInlineHeight.width;

        return findInlineHeight.height;
      });

      currentMaxHeight = Math.max(...innerTableHeights, currentMaxHeight);
    }

    return {
      height: currentMaxHeight,
      width: usedWidth,
    };
  }
  if (cell._height) {
    usedWidth += cell._width;

    return {
      height: cell._height,
      width: usedWidth,
    };
  }

  return {
    height: null,
    width: usedWidth,
  };
};

/**
 * Processes a single row of data and returns an array of objects containing the text and value.
 * @param {Object} rowData - The data for a single row.
 * @returns {Array} An array of objects containing the text and value.
 */
function processValue(rowData) {
  const isTitle = rowData.type === "title";
  const text = { text: rowData.text, bold: isTitle };
  const value = {
    text: rowData.value?.replaceAll("</br>", "\n"),
    alignment: "right",
  };
  return [text, value];
}

function pdfBodyGenerator(data) {
  const result = [];
  if (data) {
    for (const [, value] of Object.entries(data)) {
      if (value?.length > 1) {
        value.forEach((rowData) => result.push(processValue(rowData)));
      } else result.push(processValue(value[0]));
    }
  }
  return result;
}

/**
 * Event listener for receiving messages from the main thread.
 * @param {MessageEvent} event - The event object containing the data sent from the main thread.
 */
self.addEventListener("message", (event) => {
  const pdfData = event.data;
  const pdf = makePDF(pdfData);
  const docDefinition = createPDF(pdf);

  pdfMake
    .createPdf(docDefinition)
    .getBlob((blob) => self.postMessage({ blob }));
});
