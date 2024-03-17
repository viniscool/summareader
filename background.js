chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ model: "mistralai/Mistral-7B-Instruct-v0.2" });
});
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ voice: "Samantha (en-US)" });
});

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      if (changeInfo.status === "complete" && tab.url.includes("comments")) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ["content.js"],
        });
      }
    });