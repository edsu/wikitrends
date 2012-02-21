wikitrends
----------

wikitrends is a simplistic view of the top 25 wikipedia page accesses from the
last hour. It is a pure HTML and JavaScript application which relies on stats
that are dumped by a shell script that can run from cron every hour to a web 
accessible JSON file. The script is entirely dependent on statistical data 
made available by the 
[Wikimedia Foundation](http://dumps.wikimedia.org/other/pagecounts-raw/).

fetch.sh is a somewhat gnarly shell script that takes advantage of unix 
command line goodness to pull down the big compressed files from Wikimedia 
and sort them. jsonify.py is a simple python script that reformats the output
of fetch.sh as JSON.

You should be able to put this in your crontab to have the JSON files 
generated every hour:

`30 * * * * cd /home/ed/Projects/wikitrends/; ./fetch.sh`

Install
-------

If you are on Ubuntu or a similar Unix you will probably have them, but 
double check you have the following command line utilities available to you:

- curl
- gunzip
- head
- perl
- python
- sort

License
-------

Public Domain
