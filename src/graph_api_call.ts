import * as fs from 'fs';
import axios from 'axios';

// declare global {
var license_compatibility: number // done 
var bus_factor: number // Tanvi - done
var ramp_upTime: number // Eshaan 
var responsiveness: string // Aaradhya - done
var correctness: number //  Ilan
var net_score: number 
var licenseName: string
var issuesCount: number
var forksCount: number
var watchersCount: number
var stargazerCount: number
var repo_URL : string
// }

async function getData_github(requestUrl: string, owner: string, repo: string) {
    var query = `
    query {
      repository(owner: "owner123", name: "repo1") {
        name
        url
        description
        watchers {
        totalCount
        }
        forks{
          totalCount
        }
        issues {
            totalCount
        }
        stargazerCount
        licenseInfo{
          name
        }
        }
        }
      `;
    var github_token = process.env.GITHUB_TOKEN

    var prev_owner = "owner123";
    var prev_repo = "repo1";

    query = query.replace(prev_owner, owner);
    query = query.replace(prev_repo, repo);       

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
        repo_URL = response.data.data.repository.url;
        issuesCount = response.data.data.repository.issues.totalCount;
        forksCount = response.data.data.repository.forks.totalCount;
        watchersCount = response.data.data.repository.watchers.totalCount;
        stargazerCount = response.data.data.repository.stargazerCount;
        licenseName = response.data.data.repository.licenseInfo.name;
        calculate_scores(issuesCount, forksCount, watchersCount, stargazerCount, licenseName, net_score);
    });
  } catch (error) {
    console.error("There was a problem with the fetch operation with ", requestUrl);
    console.error(error);
  }
}

// Function to request APIs
async function getData_npms(requestUrl: string)
{
    var response = await axios.get(requestUrl);
    const Console = new console.Console(fs.createWriteStream('./NPMJS_API_data_repsonse.txt'));
    Console.log(response.data);
}

function calculate_scores(issuesCount: number, forksCount : number, watchersCount : number, stargazerCount : number, licenseName : string, net_score: number) {

  if (licenseName.includes('MIT')) 
  {
    license_compatibility = 1;
  }
  else
  {
    license_compatibility = 0;
  }

  if (license_compatibility == 0)
  {
    bus_factor = 0;
  }
  else
  {
    var bus_factor_str = ((issuesCount / (issuesCount + forksCount + watchersCount + stargazerCount)) * license_compatibility).toFixed(2);
    bus_factor = Number(bus_factor_str);
  }

  responsiveness = (Math.abs(1 - (1 / issuesCount))).toFixed(2);

  var net_score = (0.4 * Number(responsiveness) + 0.1 * bus_factor + 0.2 * license_compatibility + 0.1 * ramp_upTime + 0.2 * correctness)/ 5
  write_to_file(license_compatibility, bus_factor, ramp_upTime,  Number(responsiveness), correctness, net_score);
}

function write_to_file(license_compatibility: number, bus_factor : number, ramp_upTime : number, responsiveness : number, correctness : number, net_score : number) {
  
  // write to a file
  var filename = process.env.LOG_FILE;
  var verbosity = process.env.LOG_LEVEL;

  // {"URL":"https://github.com/nullivex/nodist", "NET_SCORE":0.9, "RAMP_UP_SCORE":0.5, "CORRECTNESS_SCORE":0.7, "BUS_FACTOR_SCORE":0.3, "RESPONSIVE_MAINTAINER_SCORE":0.4, "LICENSE_SCORE":1}
  var line_to_print = "{\"URL\":\"" + repo_URL + "\", \"NET_SCORE\":" + net_score + ", \"RAMP_UP_SCORE\":" + ramp_upTime + ", \"CORRECTNESS_SCORE\":" + correctness + ", \"BUS_FACTOR_SCORE\":" + bus_factor + ", \"RESPONSIVE_MAINTAINER_SCORE\":" + responsiveness + ", \"LICENSE_SCORE\":" + license_compatibility + "}"
  console.log(line_to_print);
}

// Main function
function main() {

  var args = process.argv;

  var filename = args[2]
  filename = filename.replace(/\r/g, '');

  const string_urls = fs.readFileSync(filename, 'utf-8');
  const arr_urls = string_urls.split(/\r?\n/);

  arr_urls.forEach((url) => {
    var owner = url.split('/')[3]
    var repo = url.split('/')[4]

    // GitHub URLs 
    if (url.includes('github')) {
      var request_url = "https://api.github.com/graphql"
      getData_github(request_url, owner, repo);
    }

    // NPM URLs
    else if (url.includes('npm')) {
      var request_url = "https://api.npms.io/v2/" + owner + "/" + repo
      getData_npms(request_url);
    }
  });
}

main(); // Main 