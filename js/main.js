$(document).ready(main);

var gettingArticle = false;

function main() {
  var now = new Date();
  var t = new Date(
    now.getFullYear(), 
    now.getMonth(), 
    now.getDate(), 
    now.getHours()
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

    var articles = _.first(data, 25);
    if (articles.length != 25) return;

    var header = _.str.sprintf(
      "%d-%02d-%02d %02d:00",
      t.getFullYear(),
      t.getMonth() + 1,
      t.getDate(),
      t.getHours()
    );
    $("header").append("<h2>" + header + "</h2>");

    $("#articles").empty();
    _.each(articles, function(row, i) {
        $("#articles").append('<tr><td>' + (i+1) + '</td><td><a class="article" href="http://en.wikipedia.org/wiki/' + row.page + '">' + row.page +'</a> (' + row.count + ')</td></tr>');  
    });
    $("a.article").mouseover(showArticle);
  });
}

function includePage(p) {
  return ! p.page.match(/:|(Main Page)|(main page)|(404)|(.html)|(.php)|(Wiki)/);
}

function showArticle(event) {
  hideArticle();
  var title = event.target.text;
  var x = 250;
  var y = event.pageY - 25;
  $('div#articleSummary').remove();
  $('<div id="articleSummary"></div>').appendTo("body");
  getArticleSummary(title, function(summary) {
    $('div#articleSummary').css({
      position: 'absolute', 
      "top": y - 25, 
      "opacity": 1.0,
      "left": x,
      "width": "500px",
      "padding-left": "10px",
      "padding-right": "10px",
      "border": "thin solid #eeeeee",
      "background-color": "white"
    });
    $('div#articleSummary').append(summary);
  });
}

function hideArticle(event) {
  $('div#articleSummary').remove();
}

function getArticleSummary(page, callback) {
  if (gettingArticle) return;
  gettingArticle = true;
  title = page.replace(' ','_');
  $.ajax({
    url: 'http://en.wikipedia.org/w/api.php',
    data: {
      action: 'parse',
      prop: 'text',
      page: title,
      format: 'json'
    },
    dataType: 'jsonp',
    success: function(data) {
      wikipage = $("<div>"+data.parse.text['*']+"<div>").children('p:first');
      wikipage.find('sup').remove();
      wikipage.find('a').each(function() {
        $(this)
          .attr('href', 'http://en.wikipedia.org'+$(this).attr('href'))
          .attr('target','wikipedia');
      });
      callback(wikipage);
      gettingArticle = false;
    }
  });
}

