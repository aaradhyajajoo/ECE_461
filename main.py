#!/usr/bin/ python3

import sys
import os 

def main(*args, **kwargs):

    # no arguments provided
    if (len(args) == 0):
        sys.exit("No arguments provided")
    
    # check if the first argument is install or test
    if (args[0] == "install"):
        # install function to be called here
        print("install")
    elif (args[0] == "test"):
        # test function to be called here
        print("test")
    
    # default test: check if the files exist
    else:
        check_files_exists(*args, **kwargs)

def check_files_exists(*args, **kwargs):
    for arg in args:
        if not os.path.exists(str(arg)):
            sys.exit("File {} does not exist".format(arg))
    
if __name__ == "__main__":
    main(sys.argv[1:])