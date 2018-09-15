//----------------------
$(function () {
    const google_hosts = [
      "www.google.co.jp",
      "www.google.com"
    ];

    if (google_hosts.indexOf(location.host) == -1) {
      highlight();
      return;
    }
    let params = location.search.substring(1).split('&');
    let q = "";
    for (let i = 0; i < params.length; i++) {
      let kv = params[i].split("=");
      if (kv[0] == "q") {
        // remove double-quotation
        q = kv[1].replace(/%22/g, '').trim();
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
    $("body").removeHighlight();

    let color = "#ffff00";
    if (Object.keys(obj.color).length > 0) { color = obj.color }

    let words = [];
    if (obj.exact_match == "on") {
      words[0] = obj.q.replace(/\+/g, ' ').trim();
    } else {
      words = obj.q.split('+');
      // Deduplication
      words = words.filter((x, i, self) => self.indexOf(x) === i);
    }
    
    for (let i = 0; i < words.length; i++) {
      let word = decodeURIComponent(words[i]);
      $("body").highlight(word);
    }
    $(".highlight-ext").css("background-color", color);
  });
}
