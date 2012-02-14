#!/bin/sh

year=`date -u +%Y`
month=`date -u +%m`
day=`date -u +%d`
hour=`date -u +%H`

url="http://dumps.wikimedia.org/other/pagecounts-raw/$year/$year-$month/pagecounts-$year$month$day-${hour}0000.gz" 

json_dir="$year/$month/$day"
json_file="$json_dir/$hour.json"
mkdir -p $json_dir

curl --silent $url | \
    gunzip -c | \
    egrep '^en ' | \
    perl -npe '@cols=split/ /; print "$cols[2] $cols[1]\n";' | \
    sort -rn | \
    head -n 1000 | \
    ./jsonify.py > $json_file 
