import { describe, it, expect } from 'vitest';
import { createDynamicUserQuery } from './queriers';

describe('createDynamicUserQuery', () => {
  it('should create a query with correct structure for single year', () => {
    const query = createDynamicUserQuery(2020, 2020);
    const queryString = query.loc?.source.body || '';
    
    // Check that the query includes the basic structure
    expect(queryString).toContain('query GetUserDynamic');
    expect(queryString).toContain('$login: String!');
    expect(queryString).toContain('$from: DateTime!');
    expect(queryString).toContain('$to: DateTime!');
    expect(queryString).toContain('$year2020From: DateTime!');
    expect(queryString).toContain('$year2020To: DateTime!');
    
    // Check for user fields
    expect(queryString).toContain('...UserBasicInfo');
    expect(queryString).toContain('...UserConnections');
    
    // Check for yearly contributions with commit contributions by repository
    expect(queryString).toContain('contrib2020: contributionsCollection(from: $year2020From, to: $year2020To)');
    expect(queryString).toContain('totalCommitContributions');
    expect(queryString).toContain('commitContributionsByRepository');
    expect(queryString).toContain('repository {');
    expect(queryString).toContain('name');
    expect(queryString).toContain('isFork');
    expect(queryString).toContain('contributions');
    expect(queryString).toContain('{');
    expect(queryString).toContain('totalCount');
    expect(queryString).toContain('}');
    
    // Check for overall contributions collection
    expect(queryString).toContain('contributionsCollection(from: $from, to: $to)');
    expect(queryString).toContain('...ContributionsCollection');
    
    // Check for repositories
    expect(queryString).toContain('repositories(first: 100, ownerAffiliations: [OWNER])');
  });

  it('should create a query with correct structure for multiple years', () => {
    const query = createDynamicUserQuery(2018, 2020);
    const queryString = query.loc?.source.body || '';
    
    // Check for all three years
    expect(queryString).toContain('$year2018From: DateTime!');
    expect(queryString).toContain('$year2018To: DateTime!');
    expect(queryString).toContain('$year2019From: DateTime!');
    expect(queryString).toContain('$year2019To: DateTime!');
    expect(queryString).toContain('$year2020From: DateTime!');
    expect(queryString).toContain('$year2020To: DateTime!');
    
    // Check for yearly contributions fields
    expect(queryString).toContain('contrib2018: contributionsCollection(from: $year2018From, to: $year2018To)');
    expect(queryString).toContain('contrib2019: contributionsCollection(from: $year2019From, to: $year2019To)');
    expect(queryString).toContain('contrib2020: contributionsCollection(from: $year2020From, to: $year2020To)');
    
    // Check that each yearly contribution includes commit contributions by repository
    const contrib2018 = queryString.substring(
      queryString.indexOf('contrib2018: contributionsCollection'),
      queryString.indexOf('contrib2019: contributionsCollection')
    );
    expect(contrib2018).toContain('commitContributionsByRepository');
    expect(contrib2018).toContain('repository {');
    expect(contrib2018).toContain('name');
    expect(contrib2018).toContain('isFork');
    expect(contrib2018).toContain('contributions');
    expect(contrib2018).toContain('{');
    expect(contrib2018).toContain('totalCount');
    expect(contrib2018).toContain('}');
    
    const contrib2019 = queryString.substring(
      queryString.indexOf('contrib2019: contributionsCollection'),
      queryString.indexOf('contrib2020: contributionsCollection')
    );
    expect(contrib2019).toContain('commitContributionsByRepository');
    expect(contrib2019).toContain('repository {');
    expect(contrib2019).toContain('name');
    expect(contrib2019).toContain('isFork');
    expect(contrib2019).toContain('contributions');
    expect(contrib2019).toContain('{');
    expect(contrib2019).toContain('totalCount');
    expect(contrib2019).toContain('}');
    
    const contrib2020 = queryString.substring(
      queryString.indexOf('contrib2020: contributionsCollection'),
      queryString.indexOf('contributionsCollection(from: $from, to: $to)')
    );
    expect(contrib2020).toContain('commitContributionsByRepository');
    expect(contrib2020).toContain('repository {');
    expect(contrib2020).toContain('name');
    expect(contrib2020).toContain('isFork');
    expect(contrib2020).toContain('contributions');
    expect(contrib2020).toContain('{');
    expect(contrib2020).toContain('totalCount');
    expect(contrib2020).toContain('}');
  });
});