import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { styleReset } from 'react95'
import original from 'react95/dist/themes/original'
import msSansSerif from 'react95/dist/fonts/ms_sans_serif.woff2'
import msSansSerifBold from 'react95/dist/fonts/ms_sans_serif_bold.woff2'
import App from './App'
import './index.css'

const GlobalStyles = createGlobalStyle`
  ${styleReset}

  @font-face {
    font-family: 'ms_sans_serif';
    src: url(${msSansSerif}) format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'ms_sans_serif';
    src: url(${msSansSerifBold}) format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  body {
    font-family: 'ms_sans_serif', 'Tahoma', system-ui, -apple-system, sans-serif;
    background-color: #008080;
    background-image:
      linear-gradient(90deg, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
      linear-gradient(180deg, rgba(0, 0, 0, 0.08) 1px, transparent 1px);
    background-size: 32px 32px;
    color: #000;
    line-height: 1.4;
    cursor: url('https://cur.cursors-4u.net/cursors/cur-2/cur109.cur'), default;
  }

  button,
  [role='button'] {
    cursor: url('https://cur.cursors-4u.net/cursors/cur-2/cur109.cur'), pointer;
  }

  input,
  textarea {
    cursor: text;
  }
`

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={original}>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
