// console.log("Chrome extension is runghning!");

// Listen for messages
chrome.runtime.onMessage.addListener(receiver);

// A message is received
function receiver(request, sender, sendResponse) {
  // Grab every single DOM element

  // console.log(request);
  if (request.type === "hide") {
    updateHideStyles();
  } else if (request.type === "show") {
    let allStyles = document.querySelectorAll(`.id${request.peerId}`);
    // console.log("SHOW", allStyles);
    for (let i = 0; i < allStyles.length; i++) {
      allStyles[i].remove();
    }
  }
}

function updateHideStyles() {
  chrome.storage.sync.get("people", function (result) {
    if (result["people"]) {
      // console.log("All persons ", result["people"]);
      let people = result["people"];

      people.forEach((element) => {
        let style = document.createElement("style");
        let peerId = element.peerId;
        style.innerHTML = `
        div[data-peer='${peerId}'] {
          display: none !important;
        }`;
        // console.log(style);
        style.setAttribute("class", `id${peerId}`);
        document.head.appendChild(style);
      });
    }
  });
}

updateHideStyles();

window.onload = () => {
  // console.log("load");
  let messages = document.querySelector(
    "._im_peer_history.im-page-chat-contain"
  );
  // console.log(messages);
  messages.addEventListener("click", (e) => {
    // console.log(e);
    let target = e.target;
    // console.log(target.classList.value);
    while (target.classList != "im-mess-stack _im_mess_stack ") {
      target = target.parentElement;
    }
    // console.log(target.dataset.peer);
    // console.log(target.querySelectorAll("a")[1].href);
    let peerId = target.dataset.peer;
    let linkVkId = target.querySelectorAll("a")[1].href;
    chrome.storage.sync.set({ current: { peerId, linkVkId } }, function () {
      // console.log("choose current");
    });
  });
};
