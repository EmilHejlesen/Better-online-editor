const input = document.getElementById("userInput");
const status = document.getElementById("status");

let currentText = "";

// 1. MONITOR: fires on every keystroke, so currentText is always up to date.
input.addEventListener("input", () => {
  currentText = input.value;
  status.textContent = `${currentText.length} characters`;
});

// 2. SHORTCUT: detect Shift + 2.
// event.code === "Digit2" checks the physical key, so it works regardless
// of keyboard layout (event.key would give "@" only on a US layout).
input.addEventListener("keydown", (event) => {
  if (event.shiftKey && event.code === "Digit2") {
    event.preventDefault(); // stop "@" from being typed; remove if you want it typed

    // --- Replace this block with whatever you actually want to do ---
    console.log("Shortcut triggered with:", currentText);
    chrome.storage.local.set({ savedText: currentText });
    status.textContent = "Saved via Shift + 2!";
    // ----------------------------------------------------------------
  }
});
