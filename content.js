document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.shiftKey && event.code === "KeyU") {
    event.preventDefault();

    const el = document.activeElement;
    let selected = "";

    // input/textarea use a different selection API than the rest of the page
    if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
      selected = el.value.substring(el.selectionStart, el.selectionEnd);
    } else {
      selected = window.getSelection().toString();
    }

    chrome.storage.local.set({ markedText: selected });
    showToast(selected ? `Captured: "${selected}"` : "Nothing selected");
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
