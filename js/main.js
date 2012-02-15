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
    data = _.filter(data, includePage);
    var topTen = _.first(data, 25);
    _.each(topTen, function(row) {
        $("#data").append('<li><a href="http://en.wikipedia.org/wiki/' + row.page + '">' + row.page +'</a> (' + row.count + ')</li>');  
    });
  }).complete(setTimeout(load, 2000, n));
}

function includePage(p) {
    return ! p.page.match(/:|(Main Page)|(main page)|(404)/);
}

