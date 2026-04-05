// src/emotionCache.ts
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import modernPrefixer from './modernPrefixer';

const cache = createCache({
	key: 'css',
	stylisPlugins: [prefixer, modernPrefixer],
});

export default cache;