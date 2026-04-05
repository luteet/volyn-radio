import { CssBaseline, GlobalStyles } from '@mui/material';
import { createTheme, css, ThemeProvider } from '@mui/material/styles';
import { type FC, type ReactNode } from 'react';

const globalTheme = createTheme();

interface Props {
	children: ReactNode;
}

export const GlobalThemeProvider: FC<Props> = ({ children }) => {
	return (
		<ThemeProvider theme={globalTheme}>
			<CssBaseline />
			<GlobalStyles styles={css`
				:root {
					--text: #e5e7eb;
					--muted: #9ca3af;
					--bg: #101a30;
					--card: #132641;
					--border: rgba(148, 163, 184, 0.18);
					--accent: #14b8a6;
					--accent-2: #2dd4bf;
					--mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
						"Courier New", monospace;
					--sans: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
					
					--aside-width: 64px;
					--aside-inset: 24px;
					--aside-popup-width: 500px;
					--aside-popup-gap: calc(var(--aside-inset) + var(--aside-width) + var(--aside-inset)); /* 112px */

				}

				@keyframes loading {
					to {
						rotate: 360deg;
					}
				}

				html {
					scrollbar-width: thin;
					scrollbar-color: var(--card) var(--bg);

					&::-webkit-scrollbar {
						width: 8px;
					}

					&::-webkit-scrollbar-track {
						background: var(--bg);
					}

					&::-webkit-scrollbar-thumb {
						background: var(--card);
						border-radius: 4px;
					}
				}

				body {
					font-family: var(--sans);
					color: var(--text);
					background: var(--bg);
					text-rendering: optimizeLegibility;
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
				}

				.wrapper {
					position: relative;
					min-height: 100vh;
				}

				#root {
					min-height: 100vh;
				}

				a {
					color: var(--accent-2);
				}

				h1 {
					font-size: 28px;
					margin: 0;
				}

				h2 {
					font-size: 16px;
					margin: 0 0 8px;
				}

				p {
					margin: 0;
					color: var(--muted);
				}

				input,
				button {
					font-family: inherit;
				}

				/* Small global utilities used across cards */
				.muted {
					color: var(--muted);
					opacity: 0.85;
					margin: 8px 0 0;
				}

				.mono {
					font-family: var(--mono);
					font-size: 13px;
				}

				/* Generic card container used across sections */
				.card {
					border: 1px solid var(--border);
					border-radius: 12px;
					padding: 16px;
					background: var(--card);
					text-align: left;

					&:not(:first-of-type) {
						margin-top: 14px;
					}

					h2 span:nth-of-type(2) {
						display: inline-flex;
						align-items: center;
						gap: .25rem;

						transform: translateY(5px);

						padding-left: 0.5rem;
					}
				}

				.error {
					margin: 10px 0 0;

					font-family: var(--mono);
					font-size: 13px;
					color: #f87171;
				}

				.Toastify__toast {
					&.Toastify__toast--success {
						border: 1px solid green;
					}

					&.Toastify__toast--error {
						border: 1px solid tomato;
					}
				}
			`} />
			{children}
		</ThemeProvider>
	);
};