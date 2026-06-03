document.addEventListener("keydown", (event) => {
  if (
    event.shiftKey &&

    event.code === "Digit2"
  ) {
    const el = document.activeElement;

    const isTextField =
      el &&
      (el.tagName === "INPUT" || el.tagName === "TEXTAREA") &&
      el.selectionStart != null;
    const isEditable = isTextField || (el && el.isContentEditable);

    // Is there actually something selected to wrap?
    const hasSelection = isTextField
      ? el.selectionStart !== el.selectionEnd
      : !window.getSelection().isCollapsed;

    // Nothing selected → don't hijack the key; let "@" type normally.
    if (!hasSelection) return;

    // Selection exists but target isn't editable → can't insert.
    if (!isEditable) {
      showToast("Can't insert here");
      return;
    }

    event.preventDefault();

    if (isTextField) {
      // input/textarea use a different selection API than the rest of the page
      const start = el.selectionStart;
      const end = el.selectionEnd;

      const selected = el.value.substring(start, end);
      const wrapped = wrap_text_with_quotes(selected);

      el.setRangeText(wrapped, start, end, "select");
      el.dispatchEvent(new Event("input", { bubbles: true }));

      chrome.storage.local.set({ markedText: wrapped });
      showToast(`Inserted: ${wrapped}`);
    } else {
      // contentEditable: operate on the live DOM selection
      const sel = window.getSelection();
      const selected = sel.toString();
      const wrapped = wrap_text_with_quotes(selected);

      const range = sel.getRangeAt(0);
      range.deleteContents();
      const node = document.createTextNode(wrapped);
      range.insertNode(node);

      // Keep the inserted text selected
      range.selectNode(node);
      sel.removeAllRanges();
      sel.addRange(range);

      el.dispatchEvent(new Event("input", { bubbles: true }));

      chrome.storage.local.set({ markedText: wrapped });
      showToast(`Inserted: ${wrapped}`);
    }
  }
});

function showToast(msg) {
  const toast = document.createElement("div");
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    background: "#333",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    zIndex: "2147483647",
    opacity: "1",
    transition: "opacity 0.4s ease",
    maxWidth: "300px",
    wordBreak: "break-word",
  });
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = "0"; }, 1800);
  setTimeout(() => { toast.remove(); }, 2200);
}
