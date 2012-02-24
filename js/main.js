$(document).ready(main);

var gettingArticle = false;

function main() {
  loadStats();
}

function loadStats() {
  var now = new Date()
  var t = new Date();
  var hours = [];
  t.setHours(t.getHours() - 2);
  while (t < now) {
    hours.push(new Date(t));
    t.setHours(t.getHours() + 1);
  }
  async.map(hours, load, display);

  // check back in 5 minutes for more latest stats
  setTimeout(loadStats, 5 * 1000);
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
  var prevHour = _.pluck(stats[stats.length - 2], "page");
  var articles = _.first(lastHour, 25);
  if (articles.length != 25) return;

  $("tr.article").remove();
  _.each(articles, function(row, i) {
      var prevHourRank = prevHour.indexOf(row.page) + 1;
      // if it wasn't in the top 25 in the last hour forgetaboutit
      if (prevHourRank > 25 || prevHourRank == 0) {
          prevHourRank = "&nbsp;";
      }
      var viewsPerSec = _.str.sprintf("%0.2f", (row.count / 60 / 60));
      // yeah, maybe this should be a template of some kind eh? /me shrugs
      $("#articles").append('<tr class="article"><td class="rank">' + (i+1) + '</td><td class="prevRank">' + prevHourRank + '</td><td class="views" title="that\'s ' + viewsPerSec + ' views per second">' + row.count + '</td><td><a target="_blank" class="article" href="http://en.wikipedia.org/wiki/' + row.page + '">' + row.page +'</a></td><td class="social"><a title="View Wikipedia Article" target="_blank" href="http://en.wikipedia.org/wiki/' + row.page + '"><img class="icon" src="images/wikipedia.jpg"></a><a title="Twitter Real Time Search" target="_blank" href="https://twitter.com/#!/search/realtime/' + row.page + '"><img class="icon" src="images/twitter.jpg"></a><a title="Google Real Time Search" target="_blank" href="https://www.google.com/search?tbs=qdr:h&q=' + row.page + '"><img class="icon" src="images/google.jpg"></a><a title="Facebook Search" target="_blank" href="https://www.facebook.com/search/results.php?type=web&q=' + row.page + '"><img class="icon" src="images/facebook.jpg"></a></td></tr>');  
  });
  $("a.article").mouseover(showArticle);
  $("a.article").mouseout(hideArticle);
  $("td.viewCount").hover(function() { 
    alert($(this).text());
  });
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
    if (! gettingArticle) return;
    var s = $('div#articleSummary');
    s.empty();
    s.append(summary);
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
