import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
    auth: "your_github_access_token"
  });
  

async function calculateBusFactor(owner: string, repo: string) {
    // Retrieve the list of contributors to the repository
    const contributors = await octokit.repos.listContributors({
      owner,
      repo
    });
  
    // Retrieve the list of commits to the repository
    const commits = await octokit.repos.listCommits({
      owner,
      repo
    });
  
    // Create a map to store the number of contributions made by each contributor
    const contributionsMap: Map<string, number> = new Map();
  
    // Populate the map with the number of contributions made by each contributor
    contributors.data.forEach(contributor => {
      contributionsMap.set(contributor.login, contributor.contributions);
    });
  
    // Create a map to store the number of unique commits made by each contributor
    const commitsMap: Map<string, Set<string>> = new Map();
  
    // Populate the map with the number of unique commits made by each contributor
    commits.data.forEach(commit => {
      if (!commitsMap.has(commit.commit.committer.name)) {
        commitsMap.set(commit.commit.committer.name, new Set());
      }
      commitsMap.get(commit.commit.committer.name)!.add(commit.sha);
    });
  
    // Calculate the number of unique commits made by each contributor
    const uniqueCommitsMap: Map<string, number> = new Map();
    for (const [contributor, shas] of commitsMap) {
      uniqueCommitsMap.set(contributor, shas.size);
    }
  
    // Sort the contributors by the number of contributions and unique commits
    const sortedContributors = Array.from(contributionsMap.keys())
      .sort((a, b) => {
        const contributionsA = contributionsMap.get(a)!;
        const contributionsB = contributionsMap.get(b)!;
        if (contributionsA !== contributionsB) {
          return contributionsB - contributionsA;
        }
        const uniqueCommitsA = uniqueCommitsMap.get(a)!;
        const uniqueCommitsB = uniqueCommitsMap.get(b)!;
        return uniqueCommitsB - uniqueCommitsA;
      });
  
    // Estimate the bus factor based on the sorted list of contributors
    let busFactor = 0;
    for (const contributor of sortedContributors) {
      busFactor += 1;
      if (
        contributionsMap.get(contributor)! < contributionsMap.get(sortedContributors[0])! / 2 &&
        uniqueCommitsMap.get(contributor)! < uniqueCommitsMap.get(sortedContributors[0])! / 2
      ) {
        break;
      }
    }
  
    return busFactor;
  }
  
  (async () => {
    const busFactor