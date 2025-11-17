import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import { ApolloAppProvider } from './apollo/ApolloAppProvider.tsx'
import App from './App.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import './index.css'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ApolloAppProvider>
        <App />
        <Toaster richColors closeButton />
      </ApolloAppProvider>
    </ThemeProvider>
  </StrictMode>,
)
