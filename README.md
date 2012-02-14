wikitrends
----------

wikitrends dumps the top 1000 most accessed English Wikipedia articles every 
hour to a JSON file. It is a gnarly shell script that takes advantage of curl, 
gunzip, cut, sort unixy goodness to pull down the big compressed files and 
sort them ... and then a simplistic python script to write out the data as 
JSON.

`30 * * * * cd /home/ed/Projects/wikitrends/; ./fetch.sh`

If you are on Ubuntu or a similar Unix you will probably have them, but 
double check you have the following command line utilities available to you:

* curl
* gunzip
* head
* perl
* python
* sort

License:

Public Domain
