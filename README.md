# 🌌 Nikhil Kaundal — Portfolio V3

A premium, cinematic developer portfolio website showcasing professional work, selected projects, and full-stack developer skills. Designed with rich dark aesthetics, fluid routing animations, and smooth scrolling interactions.

---

## ✨ Key Features & Interactions

*   **🎬 Cinematic Preloader**: A custom split-curtain transition with a scramble-text loading effect that reveals the website beneath.
*   **🧭 Smooth SPA Routing**: A custom hash-based router (`#/work`, `#/projects`) that supports hardware-accelerated fade, blur, and slide-up page transitions.
*   **👤 Bento Grid About Layout**: A modern grid presenting educational details, experience metrics, and an interactive Three.js 3D torus knot.
*   **⚡ Dynamic Skills Filter**: A categorized tab grid allowing users to filter skills instantly on mount, complete with entrance scale animations.
*   **💼 Theatrical Experience Timeline**: A glowing vertical progress line that highlights timeline dots and experience cards as they scroll into view.
*   **🛠️ Canvas Network Animation**: Physics-based interactive project background nets that connect and warp dynamically.
*   **📧 Interactive Contact CTA**: A full-screen contact page featuring a mouse-reactive particle background and magnetic buttons that slide with the cursor.
*   **📱 Responsive Hamburger Drawer**: Collapsible sidebar navigation for mobile screens taking up 70% width with a blurred backdrop overlay.

---

## 🛠️ Core Tech Stack

*   **Framework**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animations**: [GSAP](https://gsap.com/) (GreenSock Animation Platform)
*   **3D Elements**: [Three.js](https://threejs.org/)
*   **Smooth Scroll**: [Lenis Scroll](https://lenis.darkroom.engineering/)

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation & Local Development

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/nikhilkaundal/Portfolio.git
    cd Portfolio
    ```

2.  **Install Dependencies**
    ```bash
    npm install --prefix portfolio_v3
    ```

3.  **Start Development Server**
    Run the dev script from the root directory to launch the hot-reloading development server:
    ```bash
    npm run dev
    ```
    Open your browser and navigate to `http://localhost:3000`.

4.  **Create Production Build**
    To generate an optimized build inside the `portfolio_v3/build` directory:
    ```bash
    npm run build
    ```

---

## 📁 Project Structure

```text
nikhil-portfolio-root/
├── portfolio_v3/                 # Main React Application
│   ├── public/                   # Static icons & manifest files
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/           # Navbar, Footer
│   │   │   ├── sections/         # Hero, About, Skills, Experience, Projects, Contact
│   │   │   └── ui/               # Preloader, Cursor, Marquee
│   │   ├── data/                 # Portfolio details (skills, experiences, links)
│   │   ├── hooks/                # useCursor, useLenis, useScrollReveal
│   │   ├── App.tsx               # Route wrapper and transitions
│   │   └── index.css             # Base CSS and keyframe animations
│   ├── tailwind.config.js        # Color tokens and keyframe extends
│   └── tsconfig.json             # TypeScript configuration
├── .gitignore                    # Root gitignore rules
└── package.json                  # Root runner scripts delegating to portfolio_v3
```

---

## 📬 Contact & Links

*   **Email**: [nikhilkaundal1257@gmail.com](mailto:nikhilkaundal1257@gmail.com)
*   **LinkedIn**: [linkedin.com/in/nikhilkaundal](https://linkedin.com/in/nikhilkaundal)
*   **GitHub**: [github.com/nikhilkaundal](https://github.com/nikhilkaundal)
