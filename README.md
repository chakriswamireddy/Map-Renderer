# Map-Renderer
React app to render maps from KML files.


# Map Renderer

A powerful React application to render and analyze maps from KML files. This project utilizes **React 19**, **Leaflet**, **Turf.js**, and **Loaders.gl** to parse, visualize, and compute geospatial data, including lengths of LineStrings and counts of Points.

## 🚀 Features

- **Load & Parse KML Files** – Uses `@loaders.gl/kml` to extract geographic features.
- **Render Maps with React-Leaflet** – Displays parsed KML data on an interactive map.
- **Geospatial Computation** – Calculates line lengths, point counts using Turf.js.
- **Dynamic UI with TailwindCSS** – Custom styling and effects for an intuitive user experience.
- **Lottie Animations** – Enhances UI with smooth animations.

## 🛠️ Tech Stack

- **Frontend**: React 19, React-Leaflet, TailwindCSS
- **Geospatial Processing**: Turf.js, Loaders.gl (KML parser)
- **Animations**: Lottie React, dotLottie React
- **Build & Dev**: Vite, ESLint

## 📦 Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/chakriswamireddy/Map-Renderer.git
   cd map-renderer
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Run the development server**
   ```sh
   npm run dev
   ```

## 📜 Usage

1. Upload a KML file.
2. View the parsed data on an interactive map.
3. Click **Summary** to see feature counts.
4. Click **Detailed** to compute geospatial statistics (lengths, counts).



## 📜 License
MIT License

---
Made with ❤️ by Chakradhar Swamireddy

