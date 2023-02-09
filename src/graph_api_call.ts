console.log('GitHub API call')
import * as fs from 'fs';
import axios from 'axios';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; 


// Function to request APIs
async function getData(requestUrl: string, api: string) {
  // 'Authorization': 'Token ${GITHUB_TOKEN}' -> Add to 'headers'
  try {
    const response = await axios.get(requestUrl, {
      headers: {
        Accept: 'application/vnd.github+json; application/vnd.github.hellcat-preview+json; application/vnd.github.squirrel-girl-preview+json'
      }
    }); // include 'header' when GITHUB token working
    console.log('Getting data from url... - ', requestUrl)

    // Flushing data to an output file in root folder
    if (api == 'github api') {
      const Console = new console.Console(fs.createWriteStream('./GitHub_API_data_repsonse.txt'));
      Console.log(response.data);
      // calculating sub scores - directly use response.data to get sub scores
    }
    else if (api == 'npmjs api') {
      const Console = new console.Console(fs.createWriteStream('./NPMJS_API_data_repsonse.txt'));
      Console.log(response.data);
    }

    console.log('Data type: ', typeof (response.data))
  } catch (error) {
    console.error("There was a problem with the fetch operation with ", requestUrl);
    // console.log('Token instantiated = ' + process.env.GITHUB_TOKEN)
    // console.log(error)
    // Bad credential error message - GITHUB TOKEN
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




async function calculate_scores(filePath: string): Promise<number> {
    // 2 from GitHub API
  // 1 from GraphQL
  // 1 from REST
  // 1 from source code

  let bus_factor: number = await getBusFactor(filePath); //// using github api here
  const responsiveness = getResponsivenessScore(filePath); // Aaradhya // using GraphQL here
  const correctness = getCorrectnessScore(filePath); //  Ilan // using rest api here
  const license_compatibility = getLicenseCompatibilityScore(filePath); // GitHub API
  const ramp_up_time = getRampUpTimeScore(); // Eshaan  // Using source code here
  
  const net_score = (0.4 * responsiveness + 0.1 * bus_factor + 0.2 * license_compatibility + 0.1 * ramp_up_time + 0.2 * correctness) / 5;
  return net_score;
}




// Main function
function main() {

  var args = process.argv;
  console.log('.txt file is: ' + args[2])

  var filename = args[2]
  const string_urls = fs.readFileSync(filename, 'utf-8');
  const arr_urls = string_urls.split(/\r?\n/);

  arr_urls.forEach((url) => {
    var owner = url.split('/')[3]
    var repo = url.split('/')[4]

    // GitHub URLs 
    if (url.includes('github')) {
      var request_url = "https://api.github.com/repos/" + owner + "/" + repo
      getData(request_url, 'github api');
      const filePath = // the file path or text file name here

      calculate_scores(filePath)
    }

    // query {
    // repository(owner: "facebook", name: "react") {
    //   name
    //   description
    //   url
    //   createdAt
    //   updatedAt
    //   pushedAt
    //   homepageUrl
    //   licenseInfo {
    //     name
    //     }
    //   }
    // }








    else if (url.includes('npm')) {
      var request_url = "https://api.npms.io/v2/" + owner + "/" + repo
      getData(request_url, 'npmjs api');
    }
  });
  //calculate_scores(response)
}

// write a graphql query to get the data from the github api
function graphql_query() {

}

main(); // Main 
