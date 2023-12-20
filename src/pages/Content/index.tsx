import React from "react";
import { createRoot } from "react-dom/client";

import Content from "./Guide";
import calculateStatistics from "./utils/calculateStatistics";
import tableToObj from "./utils/tableToObj";

const initGuide = () => {
  const colElement = document.querySelector("div#col-comments");
  const container = document.createElement("div");
  container.className = "flex-column w-100";
  container.id = "ytg-ninja-guide";
  colElement?.prepend(container);
  const root = createRoot(container);
  root.render(<Content />);
};

if (window.location.href.startsWith("https://yourtext.guru/guide/")) {
  initGuide();
}

const copy = (text: string) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const handleCopyAsCSV = async () => {
  const table = document.querySelector("#list-guides");
  // exemple of selected row <div class="card card_table row-guide row_table selected">
  const rowsSelected = Array.from(
    table?.querySelectorAll("div.card.card_table.row-guide.selected") || [],
  );

  // eslint-disable-next-line quotes
  const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
  const csrfToken = csrfTokenElement?.getAttribute("content") as string;

  const resultPromises = rowsSelected.map(async (row) => {
    const keyword = row.querySelector(".guide-title")?.textContent;
    const guideId = row
      .querySelector(".guide-displayId")
      ?.textContent?.replace("#", "");

    const response = await fetch(`https://yourtext.guru/guide/${guideId}`);
    const data = await response.text();

    const dataElement = document.createElement("div");
    dataElement.innerHTML = data;

    const contentElement = dataElement.querySelector<
      HTMLTextAreaElement | HTMLInputElement
    >("textarea#contenu");
    const content = contentElement?.value as string;

    const serpDataTable = dataElement.querySelector<HTMLTableElement>(
      "#tab-compare table.table.table-striped",
    );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const serpData = tableToObj(serpDataTable!);
    const statistics = calculateStatistics(serpData, "Mots");

    const matchMinValue = data.match(/var\s+min\s*=\s*(\d+);/);
    const reco = matchMinValue ? matchMinValue[1] : undefined;
    console.log("reco", reco);

    const textpositionResponse = await fetch(
      `https://yourtext.guru/guide/${guideId}/textposition`,
      {
        method: "POST",
        headers: {
          "X-Csrf-Token": csrfToken,
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `text=${encodeURIComponent(content)}&save=false`,
      },
    );

    const textpositionData = await textpositionResponse.json();

    const keywords = Object.entries(textpositionData.result.corpus)
      .sort(([, a]: [string, any], [, b]: [string, any]) => b.score - a.score)
      .map(([key], _i) => key)
      .join(", ");

    return [keyword, statistics.median, reco, keywords].join("	");
  });

  const result = await Promise.all(resultPromises);

  const resultString = result.join("\n");
  copy(resultString);
};

const initGuides = () => {
  const dropdownMenu = document.querySelector(
    "div.dropdown-menu-sm:nth-child(3)",
  );
  const container = document.createElement("a");
  container.className = "dropdown-item link-multiple";
  container.id = "ytg-ninja-guides";
  container.textContent = "Copy as CSV";
  container.href = "#";
  container.onclick = () => {
    handleCopyAsCSV();
  };
  dropdownMenu?.prepend(container);
};

if (window.location.href.startsWith("https://yourtext.guru/guides")) {
  initGuides();
}
