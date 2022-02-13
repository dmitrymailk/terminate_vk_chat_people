console.log("background running");

chrome.runtime.onMessage.addListener(receiver);

// A message is received
function receiver(request, sender, sendResponse) {
  // Grab every single DOM element

  console.log(request);
  // Change the background color and font-size
  // according to the messag
}
