wikitrends
----------

wikitrends is a simplistic view of the top 25 wikipedia page accesses from the
last hour. It is a pure HTML and JavaScript application that relies on stats
that are dumped by a shell script that runs from cron every hour, which fetches 
data dumps made available by the 
[Wikimedia Foundation](http://dumps.wikimedia.org/other/pagecounts-raw/).

Install
-------

If you are on Ubuntu or a similar Unix you will probably have them, but 
double check you have the following command line utilities available to you:

  * curl
  * gunzip
  * head
  * perl
  * python
  * sort

Put fetch.sh in your crontab:

  30 * * * * cd /home/ed/Projects/wikitrends/; ./fetch.sh

Make your wikitrends directory web accessible. For example w/ Apache:

    <Directory /var/www/inkdroid.org/wikitrends>
        Order allow,deny
        Allow from all
        Deny from none
        Options FollowSymLinks
        Options +Indexes
    </Directory>

License
-------

Public Domain
