#!/usr/bin/env python

import json
import urllib
import fileinput

stats = []

for line in fileinput.input():
    line = line.strip()
    cols = line.split(" ")
    page = urllib.unquote(cols[1]).replace('_', ' ')
    stats.append({"page": page, "count": cols[0]})

print json.dumps(stats, indent=2)




