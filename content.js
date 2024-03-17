setTimeout(function () {
voices = window.speechSynthesis.getVoices();
chrome.storage.sync.get(["model"], function (result) {
  var model = result.model;
  chrome.storage.sync.get(["voice"], function (result) {
    var selectedVoice = result.voice;
    fetch(
      "https://v7kdtm1uf9.execute-api.us-east-2.amazonaws.com/default/apiSecureKeys",
      {
        method: "post",
      }
    )
      .then((response) => response.text())
      .then((apiKey) => {
        async function query(data) {
          const response = await fetch(
            "https://api-inference.huggingface.co/models/" + model,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + apiKey,
              },
              method: "POST",
              body: JSON.stringify(data),
            }
          );
          const result = await response.json();
          return result;
        }

        var comments = document.getElementsByClassName(
          "_1qeIAgB0cPwnLhDF9XSiJM"
        );
        var text = "";
        for (var i = 0; i < comments.length; i++) {
          if (comments[i].textContent.includes("bot")) {
            continue;
          } else {
            text += comments[i].textContent + " ";
            text += "###";
          }
        }
        var shredditComments = document.querySelectorAll(
          "#-post-rtjson-content"
        );
        for (var i = 0; i < shredditComments.length; i++) {
          if (
            shredditComments[i].textContent.includes("bot") ||
            shredditComments[i].textContent.includes("comment") ||
            shredditComments[i].textContent.includes("comments") ||
            shredditComments[i].textContent.includes("posts") ||
            shredditComments[i].textContent.includes("link") ||
            shredditComments[i].textContent.includes("rules")
          ) {
            continue;
          } else {
            text += shredditComments[i].textContent + " ";
            text += "###";
          }
        }

        if (text == "") {
          return;
        }

        query({
          inputs:
            `Your task is to write a summary of Reddit comments. Combine all the information and write a single comment. DO NOT copy the Reddit comments. Instead, use them to help you write the summary. Write in first person, not in third person. You can use slang if necessary. Do not includeDo not include personal opinions. Do not include examples. Do not include new information. Do not include quotes. Do not include questions. Don't stop in the middle of a sentence. Ignore comments about a serious nature of discussion or about posts or comments being removed. Don't write a bunch, only 2-3 sentences is necessary. ### is used to separate the comments.
      # Reddit comments:
      ` +
            text.trim() +
            "Start writing here: ",
          parameters: { return_full_text: false, max_new_tokens: 250 },
        }).then((response) => {
          const summary = JSON.stringify(response).substring(
            20,
            JSON.stringify(response).length - 3
          );
          const summaryWithoutBackslashes = summary.replace(/\\n|\\/g, "");
          const summaryElement = document.createElement("div");
          summaryElement.innerHTML = `
                <div id="bigdiv" class="bigdiv" style="border: 2px solid black;padding: 10px;margin: auto;">
                    <p id="summary" >${summaryWithoutBackslashes}</p>
                    <button id="playPauseButton" style="width: 200px;" class="_1LHxa-yaHJwrPK8kuyv_Y4 _2iuoyPiKHN3kfOoeIQalDT _2tU8R9NTqhvBrhoNAXWWcP HNozj_dKjQZ59ZsfEegz8 _34mIRHpFtnJ0Sk97S2Z3D9">Read Aloud</button>
                </div>
                <br>
            `;
          summaryElement.classList.add("_292iotee39Lmt0MkQZ2hPV");
          summaryElement.classList.add("full");
          var existingSummaries = document.getElementsByClassName("full");
          while (existingSummaries.length > 0) {
            existingSummaries[0].parentNode.removeChild(existingSummaries[0]);
          }
          var place = document.getElementsByClassName(
            "_2ulKn_zs7Y3LWsOqoFLHPo"
          );
          for (var n = 0; n < place.length; n++) {
            place[n].prepend(summaryElement);
            place[n].style.display = "block";
          }
          var shredditPlace = document.querySelectorAll("comment-body-header");
          for (var n = 0; n < shredditPlace.length; n++) {
            shredditPlace[n].append(summaryElement);
            shredditPlace[n].style.display = "block";
          }
          var isPlaying = true;
          var firstTime = true;
          document
            .getElementById("playPauseButton")
            .addEventListener("click", () => {
              if (firstTime) {
                window.speechSynthesis.cancel();
                const speech = new SpeechSynthesisUtterance(
                  summaryWithoutBackslashes
                );
                if (selectedVoice == 2) {
                  speech.voice = voices[15];
                } else if (selectedVoice == 3) {
                  speech.voice = voices[158];
                } else if (selectedVoice == 4) {
                  speech.voice = voices[159];
                } else if (selectedVoice == 5) {
                  speech.voice = voices[160];
                } else {
                  speech.voice = voices[selectedVoice];
                }
                speech.volume = 1;
                speech.rate = 1;
                speech.pitch = 1;
                window.speechSynthesis.speak(speech);
                firstTime = false;
              } else {
                var button = document.getElementById("playPauseButton");

                if (isPlaying) {
                  pause();
                  button.innerHTML = "Read Aloud ▶";
                } else {
                  play();
                  button.innerHTML = "Read Aloud ▐▐";
                }

                function play() {
                  window.speechSynthesis.resume();
                  isPlaying = true;
                }

                function pause() {
                  window.speechSynthesis.pause();
                  isPlaying = false;
                }
              }
            });
        });
      });
  });
});
}, 500);