function executeContentScript(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["content.js"],
  });
}

function populateVoiceList() {
  if (typeof speechSynthesis === "undefined") {
    return;
  }

  const voices = speechSynthesis.getVoices();

  for (let i = 0; i < voices.length; i++) {
    if (i == 0 || i == 1 || i == 15 || i == 158 || i == 159 || i == 160) {
      const option = document.createElement("option");
      option.textContent = `${voices[i].name} (${voices[i].lang})`;

      option.setAttribute("data-lang", voices[i].lang);
      option.setAttribute("data-name", voices[i].name);
      document.getElementById("voiceSelect").appendChild(option);
    }
  }
}

populateVoiceList();
if (
  typeof speechSynthesis !== "undefined" &&
  speechSynthesis.onvoiceschanged !== undefined
) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

document.addEventListener("DOMContentLoaded", function () {
  var modelSelect = document.getElementById("modelSelect");
  var voiceSelect = document.getElementById("voiceSelect");

  chrome.storage.sync.get(["model"], function (result) {
    var modelSavedValue = result.model;
    if (modelSavedValue) {
      modelSelect.value = modelSavedValue;
    }
  });

  chrome.storage.sync.get(["voice"], function (result) {
    var voiceSavedIndex = result.voice;
    if (voiceSavedIndex) {
      voiceSelect.selectedIndex = voiceSavedIndex;
    }
  });

  modelSelect.addEventListener("change", function () {
    var modelSelectedValue = modelSelect.value;
    var voiceSelectedIndex = voiceSelect.selectedIndex;
    chrome.storage.sync.set({ model: modelSelectedValue }, function () {

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tabId = tabs[0].id;
        executeContentScript(tabId);
      });
    });
    chrome.storage.sync.set({ voice: voiceSelectedIndex }, function () {

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tabId = tabs[0].id;
        executeContentScript(tabId);
      });
    });
  });

  voiceSelect.addEventListener("change", function () {
    var modelSelectedValue = modelSelect.value;
    var voiceSelectedIndex = voiceSelect.selectedIndex;
    chrome.storage.sync.set({ model: modelSelectedValue }, function () {

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tabId = tabs[0].id;
        executeContentScript(tabId);
      });
    });
    chrome.storage.sync.set({ voice: voiceSelectedIndex }, function () {

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tabId = tabs[0].id;
        executeContentScript(tabId);
      });
    });
  });
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var url = tabs[0].url;
  if (!url.includes("reddit")) {
    document.getElementById("modelSelect").style.display = "none";
    document.getElementById("voiceSelect").style.display = "none";
    document.querySelectorAll("label").forEach(function (label) {
      label.style.display = "none";
    });
    document.getElementById("notice").style.display = "block";
  }
});
