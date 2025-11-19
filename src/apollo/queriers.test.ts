import { describe, it, expect } from 'vitest';
import { GET_USER_INFO } from './queriers';

describe('GET_USER_INFO GraphQL Query', () => {
  it('should be a valid GraphQL query', () => {
    expect(GET_USER_INFO).toBeDefined();
    expect(GET_USER_INFO.kind).toBe('Document');
  });

  it('should have correct query name', () => {
    const query = GET_USER_INFO.loc?.source.body || '';
    expect(query).toContain('query GetUser');
  });

  it('should include all required variables', () => {
    const query = GET_USER_INFO.loc?.source.body || '';

    // Main date range variables
    expect(query).toContain('$login: String!');
    expect(query).toContain('$from: DateTime!');
    expect(query).toContain('$to: DateTime!');

    // Year range variables
    expect(query).toContain('$year1From: DateTime!');
    expect(query).toContain('$year1To: DateTime!');
    expect(query).toContain('$year2From: DateTime!');
    expect(query).toContain('$year2To: DateTime!');
    expect(query).toContain('$year3From: DateTime!');
    expect(query).toContain('$year3To: DateTime!');
  });

  it('should query basic user profile fields', () => {
    const query = GET_USER_INFO.loc?.source.body || '';

    expect(query).toContain('user(login: $login)');
    expect(query).toContain('id');
    expect(query).toContain('login');
    expect(query).toContain('name');
    expect(query).toContain('avatarUrl');
    expect(query).toContain('bio');
    expect(query).toContain('url');
    expect(query).toContain('location');
    expect(query).toContain('createdAt');
  });

  it('should query connection counts', () => {
    const query = GET_USER_INFO.loc?.source.body || '';

    expect(query).toContain('followers');
    expect(query).toContain('following');
    expect(query).toContain('gists');
  });

  it('should query yearly contribution statistics', () => {
    const query = GET_USER_INFO.loc?.source.body || '';

    expect(query).toContain('year1: contributionsCollection(from: $year1From, to: $year1To)');
    expect(query).toContain('year2: contributionsCollection(from: $year2From, to: $year2To)');
    expect(query).toContain('year3: contributionsCollection(from: $year3From, to: $year3To)');
    expect(query).toContain('totalCommitContributions');
  });

  it('should query contribution collection with commit details', () => {
    const query = GET_USER_INFO.loc?.source.body || '';

    expect(query).toContain('contributionsCollection(from: $from, to: $to)');
    expect(query).toContain('commitContributionsByRepository');
  });

  it('should query repository list with pagination', () => {
    const query = GET_USER_INFO.loc?.source.body || '';

    expect(query).toContain('repositories(first: 100, ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER])');
    expect(query).toContain('totalCount');
    expect(query).toContain('pageInfo');
    expect(query).toContain('endCursor');
    expect(query).toContain('hasNextPage');
  });

  it('should query basic repository fields', () => {
    const query = GET_USER_INFO.loc?.source.body || '';

    expect(query).toContain('nodes');
    expect(query).toContain('name');
    expect(query).toContain('description');
    expect(query).toContain('forkCount');
    expect(query).toContain('stargazerCount');
    expect(query).toContain('url');
  });

  it('should query authenticity detection fields', () => {
    const query = GET_USER_INFO.loc?.source.body || '';

    // Fork detection
    expect(query).toContain('isFork');
    expect(query).toContain('isTemplate');
    expect(query).toContain('parent');

    // Activity timestamps
    expect(query).toContain('createdAt');
    expect(query).toContain('updatedAt');
    expect(query).toContain('pushedAt');
  });

  it('should query engagement metrics', () => {
    const query = GET_USER_INFO.loc?.source.body || '';

    expect(query).toContain('watchers');
    expect(query).toContain('issues');
  });

  it('should query repository topics', () => {
    const query = GET_USER_INFO.loc?.source.body || '';

    expect(query).toContain('repositoryTopics');
    expect(query).toContain('topic');
  });

  it('should query license information', () => {
    const query = GET_USER_INFO.loc?.source.body || '';

    expect(query).toContain('licenseInfo');
  });

  it('should query additional statistics', () => {
    const query = GET_USER_INFO.loc?.source.body || '';

    expect(query).toContain('diskUsage');
    expect(query).toContain('isArchived');
    expect(query).toContain('homepageUrl');
  });

  it('should query language statistics', () => {
    const query = GET_USER_INFO.loc?.source.body || '';

    expect(query).toContain('primaryLanguage');
    expect(query).toContain('languages');
    expect(query).toContain('totalSize');
  });

  it('should query commit history', () => {
    const query = GET_USER_INFO.loc?.source.body || '';

    expect(query).toContain('defaultBranchRef');
    expect(query).toContain('history');
  });

  it('should query parent repository details for forks', () => {
    const query = GET_USER_INFO.loc?.source.body || '';

    expect(query).toContain('parent');
    expect(query).toContain('owner');
  });
});
