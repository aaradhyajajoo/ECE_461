#!/usr/bin/ python3

import sys
import os 

# install function
def install():
    os.system("npm --silent --no-progress install")
    os.system("npm --silent --no-progress install -g typescript")
    os.system("npm --silent --no-progress install -g ts-node")
    os.system("npm --silent --no-progress install -g ts-node-dev")
    os.system("pip install -q -r requirements.txt > /dev/null 2>&1")
    os.system("ts-node src/install.ts > /dev/null 2>&1")
    os.system("node src/install.js")
    sys.exit(0)

def main(args, *kwargs):

    # no arguments provided
    if (len(args) == 0):
        sys.exit("No arguments provided")
    
    # check if the first argument is install or test
    if (args[0].strip() == "install"):
        install()

    elif (args[0].strip() == "test"):
        # test function to be called here
        print("test")
        sys.exit(0)

    # default test: check if the files exist
    else:
        check_files_exists(args, *kwargs)
        os.system(f"ts-node src/graph_api_call.ts {args[0]}")
        os.system(f"node src/graph_api_call.js {args[0]}")
        sys.exit(0)

# check if the files with the input path exist
def check_files_exists(args):

    # no files provided
    if (len(args) == 0):
        sys.exit("No files provided")

    # check if the files exist
    for arg in args:
        arg = arg.strip()
        if not os.path.exists(arg):
            sys.exit("File does not exist")
        else:
            continue
    
    
if __name__ == "__main__":
    main(sys.argv[1:])