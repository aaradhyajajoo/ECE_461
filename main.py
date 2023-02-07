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
        os.system("ts-node src/install.ts")
        os.system("node src/install.js")
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
        # os.system(f"ts-node src/graph_api_call.ts {args[0]}")
        # os.system(f"node src/graph_api_call.js {args[0]}")
        graph_api_call()
    
def graph_api_call():
    # the query to get the data
    query = """ 
    query {
          repository(owner: "owner1", name: "repo1") {
            name
            url
            description
            watchers {
            totalCount
            }
            forks {
                totalCount
            }
            issues {
                totalCount
            }
            stargazerCount
            }
            licenses {
                name
            }
            }
    """

    prev_owner = "owner1"
    prev_repo = "repo1"
    username = "aaradhyajajoo"
    token = os.getenv('GITHUB_TOKEN')

    for url in urls:
        if url.split("/")[2] == "github.com":

            # get the repository owner and name
            owner = url.split("/")[3]
            repo = url.split("/")[4]

            # the url to make the request to
            request_url = "https://api.github.com/graphql"
            
            # replace the owner and repo in the query
            query = query.replace(prev_owner, owner, 1)
            query = query.replace(prev_repo, repo, 1)

            prev_owner = owner
            prev_repo = repo

            # username = "aaradhyajajoo"
            # token = "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"

            # make the request
            data = requests.post(request_url, json={"query": query}, auth=(username, token))

            # print the response
            if data.status_code == 200:
                print(data.json())

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
        arg = arg.strip()
        if not os.path.exists(arg):
            sys.exit("File does not exist")
        else:
            read_file(arg)
    
    
if __name__ == "__main__":
    main(sys.argv[1:])