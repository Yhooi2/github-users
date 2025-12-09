import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { analyzeProjectHealth } from './project-health';

describe('project-health', () => {
  // Mock Date.now() for consistent tests
  const NOW = new Date('2025-06-15T12:00:00Z').getTime();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('analyzeProjectHealth', () => {
    it('should identify archived projects', () => {
      const result = analyzeProjectHealth({
        isArchived: true,
        pushedAt: '2025-06-01T00:00:00Z'
      });

      expect(result.status).toBe('archived');
      expect(result.label).toBe('Archived');
      expect(result.labelRu).toBe('Архивирован');
      expect(result.color).toBe('text-muted-foreground');
      expect(result.reason).toBe('Project is archived');
    });

    it('should identify healthy projects (updated in last 30 days)', () => {
      const result = analyzeProjectHealth({
        isArchived: false,
        pushedAt: '2025-06-10T00:00:00Z' // 5 days ago
      });

      expect(result.status).toBe('healthy');
      expect(result.label).toBe('Active');
      expect(result.labelRu).toBe('Активный');
      expect(result.color).toBe('text-success');
      expect(result.reason).toBe('Updated in last 30 days');
    });

    it('should identify healthy projects at 30-day boundary', () => {
      const result = analyzeProjectHealth({
        isArchived: false,
        pushedAt: '2025-05-16T12:00:00Z' // exactly 30 days ago
      });

      expect(result.status).toBe('healthy');
      expect(result.label).toBe('Active');
    });

    it('should identify maintenance projects (31-180 days)', () => {
      const result = analyzeProjectHealth({
        isArchived: false,
        pushedAt: '2025-04-01T00:00:00Z' // ~75 days ago
      });

      expect(result.status).toBe('maintenance');
      expect(result.label).toBe('Maintenance');
      expect(result.labelRu).toBe('На поддержке');
      expect(result.color).toBe('text-warning');
      expect(result.reason).toBe('Updated in last 6 months');
    });

    it('should identify maintenance projects at 180-day boundary', () => {
      const result = analyzeProjectHealth({
        isArchived: false,
        pushedAt: '2024-12-17T12:00:00Z' // exactly 180 days ago
      });

      expect(result.status).toBe('maintenance');
      expect(result.label).toBe('Maintenance');
    });

    it('should identify stale projects (>180 days)', () => {
      const result = analyzeProjectHealth({
        isArchived: false,
        pushedAt: '2024-01-01T00:00:00Z' // ~530 days ago
      });

      expect(result.status).toBe('stale');
      expect(result.label).toBe('Stale');
      expect(result.labelRu).toBe('Устарел');
      expect(result.color).toBe('text-muted-foreground');
      expect(result.reason).toBe('No updates for 6+ months');
    });

    it('should treat null pushedAt as stale', () => {
      const result = analyzeProjectHealth({
        isArchived: false,
        pushedAt: null
      });

      expect(result.status).toBe('stale');
      expect(result.label).toBe('Stale');
    });

    it('should prioritize archived status over date', () => {
      const result = analyzeProjectHealth({
        isArchived: true,
        pushedAt: '2025-06-14T00:00:00Z' // 1 day ago, would be healthy
      });

      expect(result.status).toBe('archived');
    });

    it('should handle recent push (today)', () => {
      const result = analyzeProjectHealth({
        isArchived: false,
        pushedAt: '2025-06-15T10:00:00Z' // 2 hours ago
      });

      expect(result.status).toBe('healthy');
    });

    it('should handle edge case at 31 days (start of maintenance)', () => {
      const result = analyzeProjectHealth({
        isArchived: false,
        pushedAt: '2025-05-15T12:00:00Z' // 31 days ago
      });

      expect(result.status).toBe('maintenance');
    });

    it('should handle edge case at 181 days (start of stale)', () => {
      const result = analyzeProjectHealth({
        isArchived: false,
        pushedAt: '2024-12-16T12:00:00Z' // 181 days ago
      });

      expect(result.status).toBe('stale');
    });
  });
});
