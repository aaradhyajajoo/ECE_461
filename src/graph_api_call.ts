import * as fs from 'fs';
import axios from 'axios';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; 

    query = query.replace(prev_owner, owner);
    query = query.replace(prev_repo, repo);       

    // make the request to the github graphql api
    try {
      await axios({
        url: requestUrl,
        method: 'post',
        headers: {
          Authorization: `Token ${github_token}`,
          Accept: 'application/vnd.github+json; application/vnd.github.hellcat-preview+json; application/vnd.github.squirrel-girl-preview+json'
        },
        data: {
          query: query
        }
      }).then((response) => {

        // get the data from the response
        repo_URL = response.data.data.repository.url;
        issuesCount = response.data.data.repository.issues.totalCount;
        forksCount = response.data.data.repository.forks.totalCount;
        watchersCount = response.data.data.repository.watchers.totalCount;
        stargazerCount = response.data.data.repository.stargazerCount;
        if (response.data.data.repository.licenseInfo == null)
        {
          licenseName = "None";
        }
        else
        {
          licenseName = response.data.data.repository.licenseInfo.name;
        }

        // call the function to calculate the scores
        calculate_scores(issuesCount, forksCount, watchersCount, stargazerCount, licenseName, net_score);
    });
  } catch (error) {
    console.log(query)
    console.log(owner, repo)
    console.error("There was a problem with the fetch operation with ", requestUrl);
    console.error(error);
  }
}
//add bus_factor function

async function getBusFactor(filePath: string): Promise<any> {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const response = JSON.parse(data);
    const contributors = response.contributors;
    const commits = response.commits;
    const busFactor = contributors.length ? (commits.length / contributors.length) : 0;

    return {
      busFactor };
  } catch (error: any) {
    console.error(error);
    throw error;
  }
}

// Add correctness function 
async function get_correctness(url: string): Promise<number> {
  // Make the REST API call to the provided URL
  const response = await axios.get(url);
  // Extract the relevant data from the response
  const data = response.data;
  // Your operationalization of the correctness aspect goes here, e.g.:
  let correctness = 0;
  // Example operationalization:
  // Check the number of bugs reported and the number of bug fixes
  const numBugs = data.numBugs;
  const numBugFixes = data.numBugFixes;
  // Calculate the correctness score
  correctness = numBugFixes / (numBugs + numBugFixes);
  // Make sure the score is between 0 and 1
  correctness = Math.min(Math.max(correctness, 0), 1);
  // Return the final correctness score
  return correctness;
}





// Function to request APIs
async function getData_npms(requestUrl: string)
{
    var response = await axios.get(requestUrl);
    const Console = new console.Console(fs.createWriteStream('./NPMJS_API_data_repsonse.txt'));
    Console.log(response.data);
}

function calculate_scores(issuesCount: number, forksCount : number, watchersCount : number, stargazerCount : number, licenseName : string, net_score: number)
{
  // check what license the repo has
  if (licenseName.includes('MIT')) 
  {
    license_compatibility = 1;
  }
  else
  {
    license_compatibility = 0;
  }

  // calculate the bus_factor time
  if (license_compatibility == 0)
  {
    bus_factor = 0;
  }
  else
  {
    var bus_factor_str = ((issuesCount / (issuesCount + forksCount + watchersCount + stargazerCount)) * license_compatibility).toFixed(2);
    bus_factor = Number(bus_factor_str);
  }

  // calculate the responsiveness time
  responsiveness = (Math.abs(1 - (1 / issuesCount))).toFixed(2);

async function calculate_scores(filePath: string, registryURL: string): Promise<number> { // taking the url and filepath as arguments
    // 2 from GitHub API
  // 1 from GraphQL
  // 1 from REST
  // 1 from source code

  let bus_factor: number = await getBusFactor(filePath); //// using github api here
  const responsiveness =  getResponsivenessScore(filePath); // Aaradhya // using GraphQL here
  var correctness = await get_correctness(registryURL);//  Ilan // using rest api here
  const license_compatibility = getLicenseCompatibilityScore(filePath); // GitHub API
  const ramp_up_time = getRampUpTimeScore(); // Eshaan  // Using source code here
  
  const net_score = (0.4 * responsiveness + 0.1 * bus_factor + 0.2 * license_compatibility + 0.1 * ramp_up_time + 0.2 * correctness) / 5;
  return net_score;
  // calculate the ramp_upTime
  ramp_upTime = Number(ramp_upTime_calc())
  
  // calculate the net_score time
  var net_score = (0.4 * Number(responsiveness) + 0.1 * bus_factor + 0.2 * license_compatibility + 0.1 * ramp_upTime + 0.2 * correctness)/ 5
  write(license_compatibility, bus_factor, ramp_upTime,  Number(responsiveness), correctness, net_score);
}

function write(license_compatibility: number, bus_factor : number, ramp_upTime : number, responsiveness : number, correctness : number, net_score : number) 
{  
  // write to the console
  write_to_log_file()
  var line_to_print = "{\"URL\":\"" + repo_URL + "\", \"NET_SCORE\":" + net_score + ", \"RAMP_UP_SCORE\":" + ramp_upTime + ", \"CORRECTNESS_SCORE\":" + correctness + ", \"BUS_FACTOR_SCORE\":" + bus_factor + ", \"RESPONSIVE_MAINTAINER_SCORE\":" + responsiveness + ", \"LICENSE_SCORE\":" + license_compatibility + "}"
  console.log(line_to_print);
}




// Main function
function main() {

  // get the arguments from the command line
  var args = process.argv;

  // get the filename from the command line
  var filename = args[2]
  filename = filename.replace(/\r/g, '');

  // read the file
  const string_urls = fs.readFileSync(filename, 'utf-8');
  var arr_urls = string_urls.split(/\r?\n/);

  // Stack Overflow Citation 
  // https://stackoverflow.com/questions/30016773/javascript-filter-true-booleans
  arr_urls = arr_urls.filter(Boolean);


  arr_urls.forEach((url) => {
    // get the owner and repo name from the url
    var owner = url.split('/')[3]
    var repo = url.split('/')[4]

    // GitHub URLs 
    if (url.includes('github')) {
      var request_url = "https://api.github.com/repos/" + owner + "/" + repo
      getData(request_url, 'github api');
      const filePath = // the file path or text file name here

      calculate_scores(filePath, request_url)
    if (url.includes('github')) 
    {
      var request_url = "https://api.github.com/graphql"
      getData_github(request_url, owner, repo);
    }

    // NPM URLs
    else if (url.includes('npm'))
    {
      var request_url = "https://api.npms.io/v2/" + owner + "/" + repo
      getData_npms(request_url);
    }
    
    // Invalid URL
    else
    {
      console.log("Invalid URL: ");
      console.log(url);
    }
  });
}

// write a graphql query to get the data from the github api
function graphql_query() {

}

main(); // Main 

