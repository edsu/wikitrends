$(document).ready(function() {
  $.getJSON("2012/02/14/19.json", function(data) {
    _.each(data, function(row) {
      $("#data").append("<li>" + row.page + " (" + row.count + ")</li>");  
    });
  });
});
