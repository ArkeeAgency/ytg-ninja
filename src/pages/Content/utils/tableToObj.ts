/* eslint-disable @typescript-eslint/no-non-null-assertion */
export type TableRowData = {
  [key: string]: string;
};

const tableToObj = (tableElement: HTMLTableElement): TableRowData[] => {
  const table = tableElement;
  const headers = Array.from(table.querySelectorAll("th")).map((header) =>
    header.textContent!.trim(),
  );

  const rows = Array.from(table.querySelectorAll("tbody tr"));

  const data: TableRowData[] = rows.map((row: Element) => {
    const rowData: TableRowData = {};
    const cells = Array.from((row as HTMLTableRowElement).cells);

    cells.forEach((cell, index) => {
      rowData[headers[index]] = (cell as HTMLElement).textContent!.trim();
    });

    return rowData;
  });

  return data;
};

export default tableToObj;
