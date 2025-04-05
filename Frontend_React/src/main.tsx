
import { createRoot } from 'react-dom/client'

import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/authProvider.tsx'
import { ConfigProvider } from 'antd'
import App from './App.tsx'
import './index.css'


export const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <HashRouter>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Poppins",
          },
        }}
      >
        <App />
      </ConfigProvider>
    </AuthProvider>
  </QueryClientProvider>
</HashRouter>,
)
