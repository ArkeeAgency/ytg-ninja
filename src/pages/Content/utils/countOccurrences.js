function countOccurrences(text, key) {
  const regex = new RegExp(key, "gi");
  const matches = text.match(regex);

  return matches ? matches.length : 0;
}

export default countOccurrences;
