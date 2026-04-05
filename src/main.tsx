import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { CacheProvider } from '@emotion/react'
import cache from './emotionCache.ts'
import './i18n/config.ts';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<CacheProvider value={cache}>
			<App />
		</CacheProvider>
	</StrictMode>,
)
