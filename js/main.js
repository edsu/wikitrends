$(document).ready(main);

var gettingArticle = false;

function main() {
  var t = new Date();
  t.setHours(t.getHours() - 1);
  loadStats(t);
}

function loadStats() {
  var now = new Date()
  var t = new Date();
  var hours = [];
  t.setHours(t.getHours() - 24);
  while (t < now) {
    hours.push(new Date(t));
    t.setHours(t.getHours() + 1);
  }
  async.map(hours, load, display);
}

function load(t, callback) {
  var path = statsFile(t);
  $.getJSON(path, function(data) {
    // remove unwanted predictable pages
    data = _.filter(data, includePage);
    callback(null, data);
  });
}

function display(err, stats) {
  var lastHour = stats[stats.length - 1];
  var articles = _.first(lastHour, 25);
  if (articles.length != 25) return;

  $("#articles").empty();
  _.each(articles, function(row, i) {
      $("#articles").append('<tr><td>' + (i+1) + '</td><td><a class="article" href="http://en.wikipedia.org/wiki/' + row.page + '">' + row.page +'</a> (' + row.count + ') </td><td><a href="http://en.wikipedia.org/wiki/' + row.page + '"><img class="icon" src="images/wikipedia.jpg"></a><a href="https://www.google.com/search?tbm=nws&q=' + row.page + '"><img class="icon" src="images/google.jpg"></a><a href="https://www.facebook.com/search/results.php?type=web&q=' + row.page + '"><img class="icon" src="images/facebook.jpg"></a><a href="https://twitter.com/#!/search/' + row.page + '"><img class="icon" src="images/twitter.jpg"></a></td></tr>');  
  });
  $("a.article").mouseover(showArticle);
  $("a.article").mouseout(hideArticle);
}

function statsFile(t) {
  return _.str.sprintf(
    "data/%d/%02d/%02d/%02d.json", 
    t.getUTCFullYear(), 
    t.getUTCMonth() + 1, 
    t.getUTCDate(), 
    t.getUTCHours()
  );
}

function includePage(p) {
  return ! p.page.match(/:|(Main Page)|(main page)|(404)|(.html)|(.php)|(Wiki)/);
}

function showArticle(event) {
  var link = $(event.target);
  var title = event.target.text;
  var pos = link.position();
  var y = pos.top - 25;
  var x = pos.left + link.width() + 25;
  getArticleSummary(title, function(summary) {
    var s = $('div#articleSummary');
    s.empty().append(summary);
    s.css(
      {
        "position": "absolute",
        "top": y, 
        "left": x,
        "border": "thin solid #eeeeee",
        "background-color": "#fdfdfd"
      }
    );
    s.show();
  });
}

function hideArticle(event) {
  $('div#articleSummary').hide();
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
