#!/usr/bin/env python3
import sys
from xml.etree.ElementTree import parse
from datetime import datetime
import subprocess
from time import sleep

class Geocache:
    def __init__(self,gccode,date,result,comment):
        self.gccode  = gccode
        self.date    = date
        self.result  = result
        if comment == None:
            comment = "TFTC!"
        self.comment = comment

def helper(log):
    gccode      = log[0].text
    date_string = log[1].text
    result      = log[2].text
    comment     = log[3].text

    date = date_string

    return Geocache(gccode,date,result,comment)


def main():
    logfile_filename = sys.argv[1] 
    logfile_xml = parse(logfile_filename)

    myfind_filename = sys.argv[2]
    myfind_xml = parse(myfind_filename)

    found_geocaches = set()

    for geocache in myfind_xml.getroot()[7:]:
        found_geocaches.add(geocache[1].text)


    logs_raw = [helper(log) for log in logfile_xml.getroot()]

    to_be_logged = [geocache for geocache in logs_raw if geocache.gccode not in found_geocaches ]
    
    to_be_logged = [geocache for geocache in to_be_logged if geocache.result == 'found it']

    for log in to_be_logged:
        string_url = "http://www.geocaching.com/geocache/%s?date=%s&type=%s&comment=%s"
        url = string_url % (log.gccode,log.date,log.result,log.comment)

        subprocess.check_output(['firefox','-new-tab',url])
        sleep(5)


if __name__ == "__main__":
    main()
