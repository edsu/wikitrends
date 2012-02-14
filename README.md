wikitrends
----------

wikitrends dumps the top 1000 most accessed English Wikipedia articles every 
hour to a JSON file. It's a gnarly shell script to take advantage of curl, 
gunzip, cut, sort unixy goodness to pull down the big compressed files and 
sort them ... and then a simplistic python script to write out the data as 
JSON.

`30 * * * * cd /home/ed/Projects/wikitrends/; ./fetch.sh`

