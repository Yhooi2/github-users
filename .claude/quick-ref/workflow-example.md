# Workflow Example - Quick Reference

> **Purpose**: Example of Component → Story → Test

**Example Workflow:**

```bash
# 1. Create component
touch src/components/MyComponent.tsx
# 2. Create story
touch src/components/MyComponent.stories.tsx
# 3. Build Storybook (required for MCP)
npm run build-storybook
# 4. Create test based on stories
touch src/components/MyComponent.test.tsx
# 5. Run tests
npm test MyComponent.test.tsx
```
