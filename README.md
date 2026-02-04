# Vihara Avalokitesvara Pondok Cabe Website

![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7)

This repository contains the source code for the website of **Vihara Avalokitesvara Pondok Cabe**. The project is designed to serve the Buddhist community by providing up-to-date information on schedules, events, and affiliated organizations (**PMV** - Youth & **GABI** - Children).

## 📋 Project Overview

This website aims to:

1.  **Inform:** Provide clear information about routine activities, Dharma talks, and temple location.
2.  **Integrate:** Unified platform for the Temple, PMV (Youth), and GABI (Children).
3.  **Engage:** Foster community engagement through event updates and transparency.
4.  **Modernize:** Built using a modern **Jamstack** architecture for performance, security, and scalability.

## 🏗️ Tech Stack

### Frontend

- **Framework:** [Vue.js 3](https://vuejs.org/) (Composition API)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Routing:** Vue Router
- **Internationalization:** Vue I18n (Indonesian & English)
- **Icons:** Heroicons / Custom SVG

### Backend & Infrastructure

- **Serverless:** [Netlify Functions](https://docs.netlify.com/functions/overview/) (TypeScript)
- **Database:** **Git-based CMS** (Flat-file JSON). Data is stored in `public/data/*.json` and updated via GitHub API commits triggered by Netlify Functions.
- **Hosting:** Netlify

### Testing

- **Unit Testing:** [Vitest](https://vitest.dev/)
- **Utils:** Vue Test Utils

## 📂 Project Structure

```bash
├── public/              # Static assets and JSON data store
│   ├── data/            # JSON files acting as the database (events.json, etc.)
│   └── uploads/         # User uploaded images
├── netlify/
│   └── functions/       # Serverless backend logic (CRUD operations)
├── src/
│   ├── components/      # Reusable UI components (Cards, Navbar, Admin forms)
│   ├── layouts/         # Main layout templates
│   ├── pages/           # Application views (Home, Schedule, AdminDashboard)
│   ├── services/        # API wrappers and fetch logic
│   ├── store/           # Pinia state stores (Auth, etc.)
│   ├── utils/           # Helper functions (Formatters, RBAC, SEO)
│   └── i18n/            # Localization files (en.json, id.json)
├── tests/               # Unit and Integration tests
└── ...config files
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or pnpm
- Netlify CLI (for running backend functions locally)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/novenoandrewm/website-vihara-ponca.git](https://github.com/novenoandrewm/website-vihara-ponca.git)
    cd website-vihara-ponca
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Copy `.env.example` to `.env` and fill in the required credentials (required for Admin features).
    ```bash
    cp .env.example .env
    ```
    _Note: You need a GitHub Personal Access Token (PAT) with repo scope for the CMS features to work._

### Running Development Server

To run both the Vue frontend and Netlify Functions locally:

```bash
# Using Netlify CLI (Recommended to test API)
netlify dev

# Or just frontend (API calls might fail)
npm run dev
```

### Running Tests

Execute the Vitest suite to ensure integrity:

```bash
npm run test
```

## 🔐 Admin & RBAC

The application uses a customized Role-Based Access Control (RBAC) system. Authentication is handled via secure headers or environment variables mapping.

**Available Roles:**

- `superadmin`: Full access to all modules.
- `pmv_admin`: Manage Youth (PMV) events and content.
- `gabi_admin`: Manage Children (GABI) events and content.
- `schedule_admin`: Manage general routine schedules.
- `quotes_admin`: Update the weekly quote on the homepage.

_Configuration located in `src/utils/rbac.ts`_

## 📦 Deployment

This project is optimized for **Netlify**.

1.  Connect the repository to Netlify.
2.  Set the Build Command: `npm run build`.
3.  Set the Publish Directory: `dist`.
4.  **Crucial:** Add the Environment Variables from your `.env` to the Netlify Dashboard > Site settings > Environment variables.

## 📄 License

This project is proprietary to **Vihara Avalokitesvara Pondok Cabe**.
Unauthorized copying or distribution of these files is strictly prohibited without permission.
