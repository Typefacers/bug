import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { styleReset } from 'react95'
import original from 'react95/dist/themes/original'
import App from './App'
import './index.css'

const GlobalStyles = createGlobalStyle`
  ${styleReset}

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    background-color: #008080;
    background-image:
      radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px),
      radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px);
    background-size: 8px 8px;
    background-position: 0 0, 4px 4px;
    color: #000;
    font-family: 'ms_sans_serif', 'Tahoma', sans-serif;
  }

  a {
    color: inherit;
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
