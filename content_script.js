//----------------------
$(function () {
  if (!isGooglePage()) {
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
      if (!isGooglePage()) {
        highlight();
      }
    } else {
      $("body").removeHighlight();
    }
  }
);

function isGooglePage() {
  const google_hosts = [
    "www.google.co.jp",
    "www.google.com"
  ];
  if (google_hosts.indexOf(location.host) == -1) {
    return false;
  }
  return true;
}

function highlight() {
  chrome.storage.local.get(function(obj) {
    if (("q" in obj) == false) { return }
    $("body").removeHighlight();

    if ("disable" in obj) {
      if (obj.disable == "on") { return }
    }

    let color = "#ffff00";
    if ("color" in obj) { color = obj.color }

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
    setHighlightColor(color);
  });
}

function setHighlightColor(background_color) {
  let font_color = "#ffffff";

  if (background_color.length == 4) {
    let code_arr = background_color.split('');
    color_code = "#" + code_arr[1] + code_arr[1] + code_arr[2] + code_arr[2] + code_arr[3] + code_arr[3];
  }
  // set font color
  if (background_color.length === 7) {
    let r = parseInt(background_color.substring(1, 3), 16);
    let g = parseInt(background_color.substring(3, 5), 16);
    let b = parseInt(background_color.substring(5, 7), 16);

    let intensity = 0.3 * r + 0.59 * g + 0.11 * b;
    let k = 1;
    r = 255 - Math.floor(intensity * k + r * (1 - k));
    g = 255 - Math.floor(intensity * k + g * (1 - k));
    b = 255 - Math.floor(intensity * k + b * (1 - k));
    if ((r + g + b) < (255 * 1.5)) {
      font_color = "#000000";
    }
  }

  $(".highlight-ext").css("background-color", background_color);
  $(".highlight-ext").css("color", font_color);
}
