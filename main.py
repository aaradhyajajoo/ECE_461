#!/usr/bin/ python3
import sys
import subprocess
import os

def main(*args, **kwargs):


    if (args[0] == "install"):
     os.system("pip install -r requirements.txt")
     sys.stdout = open("/dev/null", "w")



    
    

