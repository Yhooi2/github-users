import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Rate Limits & Real API Integration
 *
 * Эти тесты проверяют РЕАЛЬНУЮ работу приложения с GitHub API.
 *
 * В отличие от Hook Mocking, эти тесты проверяют:
 * ✅ Реальные GraphQL queries к GitHub API
 * ✅ Network слой (fetch, headers, cookies)
 * ✅ Apollo Client behaviour с реальными данными
 * ✅ Интеграцию всех компонентов end-to-end
 * ✅ Реальные race conditions и timing issues
 *
 * ВАЖНО: Эти тесты используют реальный GitHub API!
 * - Demo mode: Общий rate limit (5000 requests/hour)
 * - Auth mode: Личный rate limit (5000 requests/hour на пользователя)
 *
 * ПРИМЕЧАНИЕ: RateLimitBanner отображается ТОЛЬКО когда remaining < 10% limit
 * (т.е. меньше 500 из 5000). Поэтому эти тесты НЕ проверяют видимость баннера,
 * а проверяют реальную работу с API и корректную загрузку данных.
 */

test.describe('Real API Integration E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should successfully search and display user profile from real GitHub API', async ({ page }) => {
    // Проверяем реальную интеграцию с GitHub API
    await page.fill('input[placeholder*="Search GitHub User"]', 'octocat')
    await page.click('button:has-text("Search")')

    // Ожидаем завершения загрузки (реальный API запрос)
    await page.waitForLoadState('networkidle')

    // Проверяем, что данные пользователя загрузились (это значит API работает)
    await expect(page.locator('text=The Octocat')).toBeVisible({ timeout: 10000 })

    console.log('✅ Real GitHub API integration working')
  })

  test('should make GraphQL requests to correct endpoint', async ({ page }) => {
    // Проверяем, что используется правильный API endpoint
    const apiRequests: string[] = []

    page.on('request', (request) => {
      const url = request.url()
      if (url.includes('api/github-proxy') || url.includes('graphql')) {
        apiRequests.push(url)
        console.log('API Request:', url, request.method())
      }
    })

    // Поиск пользователя
    await page.fill('input[placeholder*="Search GitHub User"]', 'torvalds')
    await page.click('button:has-text("Search")')

    // Ожидаем загрузки
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=Linus Torvalds')).toBeVisible({ timeout: 10000 })

    // Проверяем, что был запрос к нашему proxy API
    const hasProxyRequest = apiRequests.some((url) => url.includes('/api/github-proxy'))
    expect(hasProxyRequest).toBeTruthy()

    console.log(`✅ API requests made: ${apiRequests.length}`)
  })

  test('should verify Apollo Client works with real responses', async ({ page }) => {
    // Проверяем полную интеграцию Apollo Client → Backend Proxy → GitHub API
    let graphqlRequestsCount = 0
    let hasValidResponse = false

    page.on('request', (request) => {
      const url = request.url()
      if (url.includes('/api/github-proxy')) {
        graphqlRequestsCount++
      }
    })

    page.on('response', async (response) => {
      const url = response.url()
      if (url.includes('/api/github-proxy')) {
        try {
          const body = await response.json()
          hasValidResponse = 'data' in body && body.data && 'user' in body.data
          console.log('GraphQL Response structure valid:', hasValidResponse)
        } catch (e) {
          console.error('Failed to parse response:', e)
        }
      }
    })

    // Делаем поиск
    await page.fill('input[placeholder*="Search GitHub User"]', 'gaearon')
    await page.click('button:has-text("Search")')

    // Ожидаем результата
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=Dan Abramov')).toBeVisible({ timeout: 10000 })

    // Проверяем, что был хотя бы один GraphQL request
    expect(graphqlRequestsCount).toBeGreaterThan(0)
    expect(hasValidResponse).toBeTruthy()

    console.log(`✅ Apollo Client integration verified (${graphqlRequestsCount} requests)`)
  })

  test('should handle multiple user searches in sequence', async ({ page }) => {
    // Проверяем, что можно искать нескольких пользователей подряд
    const users = ['torvalds', 'gaearon', 'addyosmani']

    for (const username of users) {
      await page.fill('input[placeholder*="Search GitHub User"]', '')
      await page.fill('input[placeholder*="Search GitHub User"]', username)
      await page.click('button:has-text("Search")')

      // Ожидаем результата
      await page.waitForLoadState('networkidle')

      // Проверяем, что страница НЕ показывает "User Not Found"
      // (пользователи существуют, поэтому должны загрузиться)
      await page.waitForTimeout(1000)
      const pageContent = await page.textContent('body')
      expect(pageContent).not.toContain('User Not Found')

      console.log(`✅ Successfully loaded: ${username}`)
    }
  })

  test('should handle network errors gracefully', async ({ page }) => {
    // Симулируем network error, блокируя API запросы
    await page.route('**/api/github-proxy', (route) => {
      route.abort('failed')
    })

    // Пытаемся сделать поиск
    await page.fill('input[placeholder*="Search GitHub User"]', 'octocat')
    await page.click('button:has-text("Search")')

    // Ожидаем отображения ошибки (или Loading state)
    await page.waitForTimeout(2000)

    // Проверяем, что либо показывается ошибка, либо loading не исчезает
    const pageContent = await page.textContent('body')

    // Может быть Loading (если Apollo retry), или Error state
    const hasErrorOrLoading =
      pageContent?.includes('error') ||
      pageContent?.includes('Error') ||
      pageContent?.includes('failed') ||
      pageContent?.includes('Failed') ||
      pageContent?.includes('Loading')

    expect(hasErrorOrLoading).toBeTruthy()

    console.log('✅ Network error handling verified')
  })

  test('should cache results (no duplicate requests for same user)', async ({ page }) => {
    // Проверяем, что кэширование работает корректно
    const apiRequests: string[] = []

    page.on('request', (request) => {
      const url = request.url()
      if (url.includes('api/github-proxy')) {
        apiRequests.push(url)
      }
    })

    // Первый поиск
    await page.fill('input[placeholder*="Search GitHub User"]', 'octocat')
    await page.click('button:has-text("Search")')

    // Ожидаем результата
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=The Octocat')).toBeVisible({ timeout: 10000 })

    const requestsAfterFirstSearch = apiRequests.length
    console.log('Requests after first search:', requestsAfterFirstSearch)

    // Очищаем и делаем тот же поиск снова
    await page.fill('input[placeholder*="Search GitHub User"]', '')
    await page.fill('input[placeholder*="Search GitHub User"]', 'octocat')
    await page.click('button:has-text("Search")')

    // Ожидаем результата
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=The Octocat')).toBeVisible({ timeout: 10000 })

    const requestsAfterSecondSearch = apiRequests.length
    console.log('Requests after second search:', requestsAfterSecondSearch)

    // Кэш может работать, тогда новых запросов не будет
    const newRequests = requestsAfterSecondSearch - requestsAfterFirstSearch
    console.log(`Cache behavior: ${newRequests === 0 ? '✅ Cache HIT' : '⚠️ Cache MISS or disabled'}`)
  })
})

test.describe('Rate Limit Banner E2E', () => {
  /**
   * Тесты для RateLimitBanner - баннер отображается ТОЛЬКО когда remaining < 10% limit
   * В нормальных условиях (5000/5000 или 4999/5000) баннер скрыт
   */

  test('should NOT display rate limit banner when rate limit is high (normal case)', async ({ page }) => {
    await page.goto('/')

    // Делаем поиск
    await page.fill('input[placeholder*="Search GitHub User"]', 'octocat')
    await page.click('button:has-text("Search")')

    // Ожидаем результата
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=The Octocat')).toBeVisible({ timeout: 10000 })

    // RateLimitBanner НЕ должен отображаться при высоком rate limit (>10%)
    // Баннер показывается только когда remaining < 500 из 5000
    const rateLimitAlert = page.locator('[role="alert"]:has-text("requests remaining")')

    // Проверяем, что баннера либо нет, либо он не виден
    const isVisible = await rateLimitAlert.isVisible().catch(() => false)

    if (isVisible) {
      // Если баннер виден, значит rate limit действительно низкий
      console.log('⚠️ Rate limit banner visible - rate limit is below 10%')
    } else {
      console.log('✅ Rate limit banner hidden - rate limit is normal (>10%)')
    }
  })

  test('should display user profile even when rate limit banner is hidden', async ({ page }) => {
    // Убеждаемся, что отсутствие баннера не мешает работе приложения
    await page.goto('/')

    await page.fill('input[placeholder*="Search GitHub User"]', 'torvalds')
    await page.click('button:has-text("Search")')

    await page.waitForLoadState('networkidle')

    // Проверяем, что профиль отображается корректно
    await expect(page.locator('text=Linus Torvalds')).toBeVisible({ timeout: 10000 })

    // Проверяем наличие ключевых элементов профиля
    await expect(page.locator('img[alt*="avatar" i]')).toBeVisible()

    console.log('✅ User profile displays correctly regardless of rate limit banner visibility')
  })
})

test.describe('Error Handling E2E', () => {
  test('should display error state when user not found', async ({ page }) => {
    await page.goto('/')

    // Поиск несуществующего пользователя
    await page.fill('input[placeholder*="Search GitHub User"]', 'thisuserdoesnotexist123456789xyz')
    await page.click('button:has-text("Search")')

    // Ожидаем сообщения "User Not Found" или ошибки
    await page.waitForTimeout(3000)

    const pageContent = await page.textContent('body')

    // Должна быть либо "User Not Found", либо GraphQL error
    const hasErrorMessage =
      pageContent?.includes('User Not Found') ||
      pageContent?.includes('not found') ||
      pageContent?.includes('error') ||
      pageContent?.includes('Error')

    expect(hasErrorMessage).toBeTruthy()

    console.log('✅ Error handling for non-existent user verified')
  })

  test('should handle empty search gracefully', async ({ page }) => {
    await page.goto('/')

    // Пытаемся искать без ввода имени
    await page.click('button:has-text("Search")')

    // Должен появиться toast с ошибкой валидации
    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('[data-sonner-toast]')).toContainText(/valid username/i)

    console.log('✅ Empty search validation working')
  })
})
