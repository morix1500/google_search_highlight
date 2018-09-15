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
  });
  $("#reset").on("click", function() {
    reset();
  });
  $("#save").on("click", function() {
    updateHighLightColor();
  });
});

function reset() {
  chrome.storage.local.remove("q", null);
  $("#word").html("");

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "reset"}, function(res) {
    });
  });
}

function updateHighLightColor() {
  let obj = {};
  obj.color = $("input[name='color']").val();

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
