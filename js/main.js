$(document).ready(main);

function main() {
  var now = new Date();
  var t = new Date(
    now.getFullYear(), 
    now.getMonth(), 
    now.getDate(), 
    now.getHours() - 12 
  );
  load(t);
}

function load(t) {
  var path = _.str.sprintf(
    "data/%d/%02d/%02d/%02d.json", 
    t.getUTCFullYear(), 
    t.getUTCMonth() + 1, 
    t.getUTCDate(), 
    t.getUTCHours()
  );

  $.getJSON(path, function(data) {
    // remove unwanted predictable pages
    data = _.filter(data, includePage);

    var topTen = _.first(data, 25);
    if (topTen.length != 25) return;

    var header = _.str.sprintf(
      "%d-%02d-%02d %02d:00",
      t.getFullYear(),
      t.getMonth() + 1,
      t.getDate(),
      t.getHours()
    );
    $("header").fadeOut(500, function() {
      $(this).empty();
      $(this).append("<h1>" + header + "</h1>");
      $(this).fadeIn(500);
    });

    $("#data").empty();
    _.each(topTen, function(row) {
        $("#data").append('<li><a href="http://en.wikipedia.org/wiki/' + row.page + '">' + row.page +'</a> (' + row.count + ')</li>');  
    });
  }).complete(function() {
      // increment hour
      t = new Date(
        t.getFullYear(), 
        t.getMonth(), 
        t.getDate(), 
        t.getHours() + 1
      );
      // if it's not in the future try to get stats for it
      if (t < new Date()) setTimeout(load, 5000, t);
  });
}

function includePage(p) {
  return ! p.page.match(/:|(Main Page)|(main page)|(404)|(.html)|(.php)|(Wiki)/);
}
