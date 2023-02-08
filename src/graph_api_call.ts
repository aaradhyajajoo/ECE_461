import * as fs from 'fs';
import axios from 'axios';

// Function to request APIs
async function getData(requestUrl: string, api: string) {
    // 'Authorization': 'Token ${GITHUB_TOKEN}' -> Add to 'headers'

    // Flushing data to an output file in root folder
    if (api == 'github api') {
      graphql_query(requestUrl);
      
    var response = await axios.get(requestUrl);
    if (api == 'npmjs api') {
      const Console = new console.Console(fs.createWriteStream('./NPMJS_API_data_repsonse.txt'));
      Console.log(response.data);
    }
}

function calculate_scores() {

  // 2 from GitHub API
  // 1 from GraphQL
  // 1 from REST
  // 1 from source code

  var license_compatibility: number = 0; // GitHub API
  var bus_factor = 0; // Tanvi
  var ramp_upTime = 0; // Eshaan 
  var responsiveness = 0; // Aaradhya
  var correctness = 0; //  Ilan

  var net_score = (0.4 * responsiveness + 0.1 * bus_factor + 0.2 * license_compatibility + 0.1 * ramp_upTime + 0.2 * correctness)/ 5
}

// Main function
function main() {

  var args = process.argv;

  var filename = args[2]
  // replace carriage return with empty string
  filename = filename.replace(/\r/g, '');

  const string_urls = fs.readFileSync(filename, 'utf-8');
  const arr_urls = string_urls.split(/\r?\n/);

  arr_urls.forEach((url) => {
    var owner = url.split('/')[3]
    var repo = url.split('/')[4]

    // GitHub URLs 
    if (url.includes('github')) {
      var request_url = "https://api.github.com/graphql"
      getData(request_url, 'github api');
    }

    // NPM URLs
    else if (url.includes('npm')) {
      var request_url = "https://api.npms.io/v2/" + owner + "/" + repo
      getData(request_url, 'npmjs api');
    }
  });
}

// write a graphql query to get the data from the github api
async function graphql_query() {
  var query = `
  query {
    repository(owner: "owner1", name: "repo1") {
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
	
	  
  // add auth token to headers
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
      const Console = new console.Console(fs.createWriteStream('./GitHub_API_data_repsonse.txt'));
      Console.log(response.data);
      Console.log(response.data.data.repository.issues.totalCount)
      Console.log(response.data.data.repository.forks.totalCount)
      Console.log(response.data.data.repository.watchers.totalCount)
      Console.log(response.data.data.repository.stargazerCount)
      // iterate through licenses
      Console.log(response.data.data.repository.licenseInfo.name)
    });
} catch (error) {
  console.error("There was a problem with the fetch operation with ", requestUrl);
}
}

main(); // Main 
calculate_scores(); // Subscores and Net Score