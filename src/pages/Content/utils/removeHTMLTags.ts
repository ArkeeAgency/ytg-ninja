const removeHTMLTags = (input: string) => {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = input;
  return tempElement.textContent || tempElement.innerText || "";
};

export default removeHTMLTags;
