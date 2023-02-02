#!/usr/bin/ python3

import sys
import os 
import contextlib
import requests

urls = set() # list of urls


# install function
# TODO: install the requirements TANVI change here
def install():
    # with open("/dev/null", "w") as f, redirect_stdout(f):
        # os.system("pip install -r requirements.txt")
        os.system("npm install")
        os.system("tsc src/index.ts")
        os.system("node src/index.js")
    # sys.stdout = open("/dev/null", "w")

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
    
    # default test: check if the files exist
    else:
        check_files_exists(args, *kwargs)
        graph_api_call()
    
def graph_api_call():
    # using the url set and the github api, get the data for the urls 
    # the get request format is https://api.github.com/repos/<owner>/<repo>
    # the owner is the username and the repo is the name of the repo
    # the response is a json file with the data
    for url in urls:
        if url.split("/")[2] == "github.com":
            owner = url.split("/")[3]
            repo = url.split("/")[4]
            request_url = "https://api.github.com/repos/{}/{}".format(owner, repo)
            data = requests.get(request_url)

            # just so the information is easier to see
            if repo == "nodist":
                print(data.json())

# read the file
def read_file(file):

    # check if the file is readable
    if not (os.access(file, os.R_OK)):
        sys.exit("File {} is not readable".format(file))

    with open(file, "r") as f:
        for line in f:
            urls.add(line.strip())
    

# check if the files with the input path exist
def check_files_exists(args):

    # no files provided
    if (len(args) == 0):
        sys.exit("No files provided")

    # check if the files exist
    for arg in args:
        if not os.path.exists(arg):
            sys.exit("File {} does not exist".format(arg))
        else:
            read_file(arg)
    
    
if __name__ == "__main__":
    main(sys.argv[1:])
    # print(urls)