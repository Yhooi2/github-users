import { type GitHubUser, type Repository } from "@/apollo/github-api.types";

// Helper function to create a lookup object for contributions by repository name
export function createContributionsLookup(user: GitHubUser): Record<string, number> {
  const contributions: Record<string, number> = {};
  
  // Add contributions from overall collection
  user.contributionsCollection.commitContributionsByRepository.forEach((repoContrib) => {
    contributions[repoContrib.repository.name] = repoContrib.contributions.totalCount;
  });
  
  // Add contributions from yearly collections
  const currentYear = new Date().getFullYear();
  const createdAtDate = new Date(user.createdAt);
  const accountCreatedYear = isNaN(createdAtDate.getTime())
    ? currentYear
    : createdAtDate.getFullYear();
  
  for (let year = accountCreatedYear; year <= currentYear; year++) {
    const contribKey = `contrib${year}` as keyof GitHubUser;
    const contribData = user[contribKey];
    
    if (contribData && typeof contribData === 'object' && contribData.hasOwnProperty('commitContributionsByRepository')) {
      contribData.commitContributionsByRepository.forEach((repoContrib) => {
        const repoName = repoContrib.repository.name;
        const commitCount = repoContrib.contributions.totalCount;
        
        if (contributions[repoName]) {
          contributions[repoName] += commitCount;
        } else {
          contributions[repoName] = commitCount;
        }
      });
    }
  }
  
  return contributions;
}

// Helper function to filter repositories - exclude forks without user contributions
export function filterRepositoriesWithUserContributions(
  repositories: Repository[],
  contributions: Record<string, number>
): Repository[] {
  return repositories.filter(
    repo => !repo.isFork || (contributions[repo.name] || 0) > 0
  );
}