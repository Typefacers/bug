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
  }

  @font-face {
    font-family: 'ms_sans_serif';
    src: url(${msSansSerifBold}) format('woff2');
    font-weight: 700;
    font-style: normal;
  }

  body {
    background-color: #008080;
    font-family: 'ms_sans_serif', 'Microsoft Sans Serif', sans-serif;
    color: #000;
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
