function countOccurrences(text, key) {
  // Escape special characters in the key and use word boundaries with consideration for apostrophes
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(?:\\b|\\s|['])${escapedKey}(?:\\b|\\s|['])`, "gi");
  const matches = text.match(regex);

  return matches ? matches.length : 0;
}

export default countOccurrences;
