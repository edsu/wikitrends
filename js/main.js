$(document).ready(main);

function main() {
  var now = new Date();
  var t  = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 8);
  load(t);
}

function load(t) {
  var n = new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours() + 1);
  if (n >= new Date()) return;

  var path = _.str.sprintf("%d/%02d/%02d/%02d.json", n.getUTCFullYear(), n.getUTCMonth() + 1, n.getUTCDate(), n.getUTCHours());

  $.getJSON(path, function(data) {
    $("#data").empty().append("<h1>" + path +  "</h1>");
    _.each(data, function(row) {
      if (! row.page.match(/:|(Main Page)|(main page)|(404)/)) {
        $("#data").append("<li>" + row.page + " (" + row.count + ")</li>");  
      }
    });
  }).complete(setTimeout(load, 2000, n));
}
