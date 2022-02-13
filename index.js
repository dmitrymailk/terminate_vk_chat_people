class ListItem {
  constructor(name) {
    let element = document.createElement("div");
    element.classList.add("fuck-off-vk-people-item");

    let elementName = document.createElement("a");
    elementName.classList.add("fuck-off-vk-people-person");
    elementName.textContent = name;
    elementName.target = "_blank";
    elementName.href = `https://vk.com/${name}`;

    let elementButton = document.createElement("button");
    elementButton.classList.add("fuck-off-vk-people-button");
    elementButton.textContent = "delete";

    elementButton.addEventListener("click", () => {
      // sendMessage();
      chrome.storage.sync.get("people", function (result) {
        let people = result["people"];
        let index = people
          .map((item) => item.linkVkId.slice(15))
          .indexOf(`${name}`);
        let peerId = people[index].peerId;

        people.splice(index, 1);
        chrome.storage.sync.set({ people: [...people] }, function () {
          element.remove();
          sendMessage({ type: "show", peerId });
        });
      });
    });
    element.appendChild(elementName);
    element.appendChild(elementButton);

    return element;
  }
}

function sendMessage(msg) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, msg); //, messageBack);
    }
  );
}

document.querySelector("#banPerson").addEventListener("click", () => {
  chrome.storage.sync.get("current", function (result) {
    console.log("Current is ", result);
    if (result["current"]) {
      let { peerId, linkVkId } = result["current"];
      let personObj = result["current"];
      let pureeVkId = linkVkId.slice(15);

      chrome.storage.sync.get("people", function (result) {
        let people = result["people"];
        if (people) {
          let isExists =
            people.map((item) => item.linkVkId.slice(15)).indexOf(pureeVkId) ==
            -1;

          if (isExists) {
            people.push(personObj);
            chrome.storage.sync.set({ people: [...people] }, function () {
              addPerson(pureeVkId);
              sendMessage({ type: "hide", peerId });
            });
          }
        }
      });
    }
  });
});

function drawPersons() {
  chrome.storage.sync.get("people", function (result) {
    // console.log("All persons ", result["people"]);
    let people = result["people"];
    if (typeof people !== "undefined") {
      people.forEach((personObj) => {
        let list = document.querySelector("#list");
        list.appendChild(new ListItem(personObj.linkVkId.slice(15)));
      });
    } else {
      chrome.storage.sync.set({ people: [] });
    }
  });
}

function showCurrent() {
  chrome.storage.sync.get("current", function (result) {
    // console.log("Current is ", result);
  });
}
drawPersons();

chrome.storage.sync.get("current", function (result) {
  if (result) showCurrent();
});

function addPerson(nameId) {
  let list = document.querySelector("#list");
  list.appendChild(new ListItem(nameId));
}

chrome.runtime.onMessage.addListener(receiver);

// A message is received
function receiver(request, sender, sendResponse) {
  // Grab every single DOM element
  // console.log("Message from main window", request);
  // Change the background color and font-size
  // according to the messag
}
