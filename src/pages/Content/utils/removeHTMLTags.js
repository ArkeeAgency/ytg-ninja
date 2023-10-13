const removeHTMLTags = (input) => {
  var tempElement = document.createElement('div');
  tempElement.innerHTML = input;
  return tempElement.textContent || tempElement.innerText || '';
}

export default removeHTMLTags;
