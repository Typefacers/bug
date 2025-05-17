# Bug Basher

[![Vercel](https://img.shields.io/badge/Vercel-black?logo=vercel)](https://vercel.com)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=white)](https://www.netlify.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)

Bug Basher is a playful bug bounty simulation built with **React**, **TypeScript** and **Vite**.  Hunt down crawling bugs, file new issues and climb the leaderboard.

![screenshot of the Bug Basher interface](public/vite.svg)

## Features

- Arcade style bug squashing game with mouse, keyboard or gamepad controls
- Dashboard with statistics and animated charts
- Leaderboard showing top hunters and bounty totals
- Windows 95 inspired interface built with Tailwind CSS and Radix UI
- File new bugs and track their bounty value
- Lightweight state management using zustand

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Other useful commands:

```bash
npm run build     # create a production build
npm run preview   # preview the build
npm run lint      # run ESLint
npm test          # run unit tests
```

## Project structure

```
src/
  assets/        static images for bugs and avatars
  components/    reusable UI and game components
  context/       React contexts such as ThemeProvider
  mock/          sample bug and user data
  routes/        route components (Bugs, Dashboard, Leaderboard, ...)
  store.ts       zustand store for global state
  utils/         shared utilities and helpers
```

## License

This project is provided for demonstration purposes only.
