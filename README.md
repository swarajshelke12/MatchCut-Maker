# MatchCut Maker

[![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.x-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-teal?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MatchCut Maker is an advanced web application designed to optimize the process of creating seamless visual transitions (match cuts) for video editors and content creators. It provides an intuitive interface and precision control tools to align composition across different frames seamlessly, ensuring cinematic continuity.

---

## Table of Contents
- [Features](#features)
- [Architecture & Technologies](#architecture--technologies)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [License](#license)
- [Author](#author)

---

## Features

- **Precision Alignment Control**: Fine-tune frame overlays with granular input controls to achieve pixel-perfect match cuts.
- **Interactive Canvas**: Real-time visual feedback and overlay matching prior to final rendering.
- **Credit Management System**: Built-in quota and credit management functionality, including an admin dashboard for user oversight.
- **Responsive Interface**: Engineered with a premium, accessible UI that adapts to various screen sizes.
- **High-Fidelity Export**: Export aligned configurations and frames with precise rendering settings.

## Architecture & Technologies

The application is built upon a modern, high-performance web stack:

- **Core Framework**: React (with React Hooks for state management)
- **Language**: TypeScript for end-to-end type safety
- **Build Tool**: Vite for optimized development and production builds
- **Styling**: Tailwind CSS for utility-first styling
- **Component Library**: shadcn/ui for accessible, unstyled UI primitives

## Prerequisites

Ensure the following dependencies are installed on your local environment before proceeding:
- [Node.js](https://nodejs.org/en/) (v16.0.0 or higher)
- [npm](https://www.npmjs.com/) (v8.0.0 or higher) or [Bun](https://bun.sh/)
- Git

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/swarajshelke12/MatchCut-Maker.git
   cd MatchCut-Maker
   ```

2. **Install dependencies**
   Using npm:
   ```bash
   npm install
   ```
   *Alternatively, if using Bun:*
   ```bash
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will run locally at `http://localhost:5173`.

## Project Structure

```text
matchcut-maker/
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Reusable presentation components
│   ├── features/           # Domain-specific modules (canvas, editor, credits)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility modules and configuration
│   ├── pages/              # Application views/pages
│   ├── stores/             # Global state management
│   ├── styles/             # Global stylesheets
│   └── types/              # TypeScript interface definitions
├── package.json            # Project metadata and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

## Usage

1. Launch the application and navigate to the editor interface.
2. Upload or import the initial and target video frames.
3. Utilize the **Interactive Canvas** to overlay and adjust the opacity of the frames.
4. Adjust the alignment variables (scale, position, rotation) via the **Control Panel**.
5. Once aligned, proceed to export the settings or frames for your video editing suite.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Author

**Swaraj Shelke**  
*Automation Enthusiast & AI Workflow Architect*

- GitHub: [@swaraj-shelke](https://github.com/swaraj-shelke)
- LinkedIn: [Swaraj Shelke](https://linkedin.com/in/swarajshelke)