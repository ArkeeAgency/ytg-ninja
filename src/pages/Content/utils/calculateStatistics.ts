import { TableRowData } from "./tableToObj";

const calculateStatistics = (
  data: TableRowData[],
  columnName: string,
): { median: number; average: number } => {
  const wordsColumn = data
    .map((row) => parseInt(row[columnName], 10))
    .filter((value) => !isNaN(value));

  const sortedWords = wordsColumn.sort((a, b) => a - b);
  const length = sortedWords.length;

  let median: number;
  if (length % 2 === 0) {
    // If the array has an even number of elements, return the average of the middle two
    const mid1 = sortedWords[length / 2 - 1];
    const mid2 = sortedWords[length / 2];
    median = (mid1 + mid2) / 2;
  } else {
    // If the array has an odd number of elements, return the middle element
    median = sortedWords[Math.floor(length / 2)];
  }

  const sum = wordsColumn.reduce((acc, value) => acc + value, 0);
  const average = sum / length;

  return { median, average };
};

export default calculateStatistics;
