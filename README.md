# Room Booking App

A responsive, single-page React front-end that simulates a room-booking website. It lists rooms with infinite scroll, displays images/videos on demand, and lets users explore different room variants in a modal.  
**All styling now uses scoped SCSS modules alongside Tailwind via a global SCSS entrypoint.**

---

## 1. Project Overview & Features

- **Hero Banner**  
  - Full-width autoplaying slideshow of hotel videos first, then images.  
  - Manual navigation via arrows and pagination dots.  
  - Responsive heights (`h-64` on mobile, `md:h-96` on desktop).  

- **Room Listing**  
  - Infinite scroll through 100+ rooms from `rooms.json`.  
  - Uses `useInfiniteScroll` hook (IntersectionObserver) to load next pages.  
  - Shows a CSS-based spinner (`LoadingSpinner.jsx`) while fetching.  
  - Handles JSON import errors gracefully.  

- **Room Cards**  
  - **Media Carousel (`RoomCardMedia.jsx`)**:  
    1. Displays `variant.images` if available.  
    2. Falls back to `variant.properties.video_url`.  
    3. Otherwise uses hotel-level images/videos.  
    4. Manages current slide with `useState`, video autoplay with `useRef` & `useEffect`.  
    5. Lazy-loads images (`loading="lazy"`) and plays videos only when active, rendering only the current slide.  
    6. Prev/Next arrows and pagination dots.  

  - Shows room name and minimum discounted price across variants.  
  - “Select” and “Options” buttons for actions.  

- **Room Variants Modal (`RoomVariantsModal.jsx`)**  
  - Full-screen overlay (`fixed inset-0`) with `overflow-visible` for floating arrows.  
  - Outer arrows to switch between variants.  
  - Inner carousel for variant media (same as `RoomCardMedia`).  
  - Displays variant details: name, pricing, cancellation info.  
  - “Select” and “Close” buttons.  

- **Loading Spinner (`LoadingSpinner.jsx`)**  
  - Centered spinner with local `@keyframes spin` reproducing Tailwind’s `animate-spin`.  

- **Skeleton Shimmer Utility** (global `index.scss`)  
  - `.skeleton` class with `@keyframes shimmer` for placeholder loading states.  

- **Responsive Design**  
  - Single-column layout on small screens, two-column (`md:grid-cols-2`) on larger.  
  - Media and modals adapt to viewport size.  

---

## 2. Technical Details

### Framework & Tooling

- **React 18** (function components & hooks)  
- **Vite** for development server, HMR, and production build  
- **Tailwind CSS** for utility-first styling  
- **Sass** for SCSS-module compilation  
- **PostCSS** & **Autoprefixer** for CSS processing  

### Data Source

- Static JSON file at `src/data/rooms.json` containing:  
  - `hotel_details` (media, metadata)  
  - `rooms_by_serial_no` → arrays of room objects, each with `variants`  

---

## 3. Folder Structure

```text
src/
├─ data/
│  └─ rooms.json
├─ hooks/
│  ├─ useInfiniteScroll.js
│  └─ useIntersectionObserver.js
├─ components/
│  ├─ HeroBanner.jsx
│  ├─ HeroBanner.module.scss
│  ├─ RoomList.jsx
│  ├─ RoomList.module.scss
│  ├─ RoomCard.jsx
│  ├─ RoomCard.module.scss
│  ├─ RoomCardMedia.jsx
│  ├─ RoomCardMedia.module.scss
│  ├─ RoomVariantsModal.jsx
│  ├─ RoomVariantsModal.module.scss
│  ├─ LoadingSpinner.jsx
│  └─ LoadingSpinner.module.scss
├─ index.scss             ← global Tailwind directives + custom utilities
├─ index.jsx
└─ App.jsx
```

---

## 4. Getting Started

1. **Install dependencies**  
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Install Sass**  
   ```bash
   npm install --save-dev sass
   # or
   yarn add --dev sass
   ```

3. **Run development server**  
   ```bash
   npm run dev
   # or
   yarn dev
   ```  
   Opens at `http://localhost:5173` with HMR.

4. **Build & preview production**  
   ```bash
   npm run build
   npm run preview
   ```  
   Serves optimized build at `http://localhost:4173`.

5. **Serve static build** (optional)  
   ```bash
   npm install -g serve
   serve -s dist
   ```  
   Serves `dist/` at `http://localhost:3000`.

---

## 5. Styling Updates

- **Scoped SCSS modules** for every component under `src/components/`:
  - Named `<Component>.module.scss` and imported as:
    ```js
    import s from './Component.module.scss';
    ```
- **Global styles** in `src/index.scss` now include:
  - Tailwind directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`)
  - `.skeleton` shimmer keyframes and class.
- Ensure **`sass`** is installed so Vite can compile SCSS modules and global SCSS.

---

## 6. Contributing

1. Fork this repo  
2. Create feature branch:  
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:  
   ```bash
   git commit -m "feat: add your feature"
   ```
4. Push to branch:  
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request.

---

## 7. License

MIT © Your Name
