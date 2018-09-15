//----------------------
$(function () {
  chrome.storage.local.get(function(obj) {
    if (("q" in obj) == false) { return }
    let words = obj.q.split('+');
    let text = "";

    for (let i = 0; i < words.length; i++) {
      let word = decodeURIComponent(words[i]);
      word = escapeHtml(word);
      text += word + " ";
    }
    $("#word").html(text);
    if ("color" in obj) {
      $("input[name='color']").val(obj.color);
    }

    if ("exact_match" in obj) {
      if (obj.exact_match == "on") {
        $("input[name='exact_match']").prop("checked", true);
      }
    }
  });
  $("#clear").on("click", function() {
    clear();
  });
  $("#save").on("click", function() {
    updateSettings();
  });
});

function clear() {
  chrome.storage.local.remove("q", null);
  $("#word").html("");

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "clear"}, function(res) {
    });
  });
}

function updateSettings() {
  let obj = {};
  obj.color = $("input[name='color']").val();
  obj.exact_match = $("input[name='exact_match']:checked").val();
  if (typeof obj.exact_match === "undefined") {
    obj.exact_match = "off";
  }

  chrome.storage.local.set(obj, function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: "update"}, null);
    });
  });
}

function escapeHtml(str){
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/"/g, '&quot;');
  str = str.replace(/'/g, '&#x27;');
  str = str.replace(/`/g, '&#x60;');
  return str;
}
