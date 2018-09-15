//----------------------
$(function () {
    let host = location.host;

    if (host != "www.google.co.jp") {
      highlight();
      return;
    }
    let params = location.search.substring(1).split('&');
    let q = "";
    for (let i = 0; i < params.length; i++) {
      let kv = params[i].split("=");
      if (kv[0] == "q") {
        q = kv[1];
        break;
      }
    }
    if (q.length == 0) { return }

    let obj = {};
    obj.q = q;
    chrome.storage.local.set(obj, null);
});

chrome.runtime.onMessage.addListener(
  function(req, sender, res) {
    if (req.type == "update") {
      highlight();
    } else {
      $("body").removeHighlight();
    }
  }
);

function highlight() {
  chrome.storage.local.get(function(obj) {
    if (("q" in obj) == false) { return }
    //if (Object.keys(obj.q).length == 0) { return }
    $("body").removeHighlight();

    let color = "#ffff00";
    if (Object.keys(obj.color).length > 0) { color = obj.color }

    let words = obj.q.split('+');
    for (let i = 0; i < words.length; i++) {
      let word = decodeURIComponent(words[i]);
      $("body").highlight(word);
    }
    $(".highlight-ext").css("background-color", color);
  });
}
