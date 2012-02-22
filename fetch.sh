#!/bin/bash

# fetch.sh is a shell script to run from cron that will download the latest 
# hour's page view statistics and write out the top 1000 to a JSON file
# you will probably want to run it sufficiently after the top of the hour
# so that the file is likely to be there, e.g.
#
# 30 * * * * cd /home/ed/Projects/wikitrends/; ./fetch.sh

# first, get some date info

year=`date -u +%Y`
month=`date -u +%m`
day=`date -u +%d`
hour=`date -u +%H`

# this is the expected URL for the pagecount dump file

url="http://dumps.wikimedia.org/other/pagecounts-raw/$year/$year-$month/pagecounts-$year$month$day-${hour}0000.gz" 

# sometimes the filenames have a timestamp of 1 second instead of 0 
# so if 0000.gz isn't there try using 0001.gz instead

curl -f -s -I $url > /dev/null
retval=$?
if [ $retval -ne 0 ]; then
    url="http://dumps.wikimedia.org/other/pagecounts-raw/$year/$year-$month/pagecounts-$year$month$day-${hour}0001.gz" 
fi

# create a directory and filename for the JSON

json_dir="data/$year/$month/$day"
json_file="$json_dir/$hour.json"
mkdir -p $json_dir

# fetch the data and write out the stats!

curl --silent $url | \
    gunzip -c | \
    egrep '^en ' | \
    perl -ne '@cols=split/ /; print "$cols[2] $cols[1]\n";' | \
    sort -rn | \
    head -n 1000 | \
    ./jsonify.py > $json_file 
