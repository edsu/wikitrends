#!/usr/bin/env python

import json
import urllib
import fileinput

stats = []

for line in fileinput.input():
    line = line.strip()
    cols = line.split(" ")
    stats.append({"page": urllib.unquote(cols[1]), "count": cols[0]})

print json.dumps(stats, indent=2)




