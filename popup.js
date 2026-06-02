const output = document.getElementById("output");
const empty = document.getElementById("empty");

function show(text) {
  if (text) {
    output.textContent = text;
  } else {
    output.innerHTML = '<span id="empty">Nothing captured yet.</span>';
  }
}

chrome.storage.local.get("markedText", ({ markedText }) => show(markedText));

chrome.storage.onChanged.addListener(({ markedText }) => {
  if (markedText) show(markedText.newValue);
});
