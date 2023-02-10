#!/usr/bin/ python3

import sys
import os 
import time
import git

def ramp_Up():
    # Clone the repository
    os.system("mkdir Useless")
    repo = git.Repo.clone_from("https://github.com/aaradhyajajoo/ECE_461.git","./Useless")
    repo.remote().pull()

    i = 0
    for commit in repo.iter_commits(): # iter_commits starts from the latest commit
        first_commit = commit
        i+=1

    print(i)
    current_commit = repo.commit()

    start_time = int(first_commit.committed_datetime.timestamp())
    end_time = int(current_commit.committed_datetime.timestamp())

    # Calculate the ramp-up time
    ramp_up_time = end_time - start_time
    total_time = time.time() - start_time
    normalized_ramp_up_time = ramp_up_time / total_time
    print("Ramp-up time:", ramp_up_time, "seconds")
    print('Total time:', total_time, "seconds")
    print('Normalized Ramp-up time:', normalized_ramp_up_time)

    with open('ramp_up.txt', 'w') as f:
        f.write(normalized_ramp_up_time)

    os.system("rm -rf Useless")

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
        print("No arguments provided")
        sys.exit("1")
    
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
        ramp_Up()
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
            print(f"File {arg} does not exist")
            sys.exit(1)
        else:
            continue
    
    
if __name__ == "__main__":
    main(sys.argv[1:])