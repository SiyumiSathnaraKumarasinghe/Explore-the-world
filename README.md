# 🌍 Explore the World - Country Explorer App

Welcome to **Explore the World**, a beautifully designed React app that lets you explore countries from around the globe using the REST Countries API — now with themes, filters, maps, favorites, and **PDF export for selected countries**! ✨

---

## 🚀 Features

### 🔍 Search & Filters
- **Search** countries by name in real-time
- **Filter** by region (Asia, Europe, etc.)
- **Filter** by spoken language

### ❤️ Favorites System
- Add or remove countries from **favorites**
- Toggle to show only your **favorite** countries
- Favorite state is stored in **localStorage**

### 📄 Document List + PDF Export (**NEW**)
- Add countries to a **document list**
- Click **"Download PDF"** to export the list with country details

### 🕹️ Interactive UI
- Click a country card to view more info
- **Modal** popup with flag, detailed info, and **Google Maps embed**
- **Show/Hide Map** button

### 🌗 Dark Mode
- **Toggle** between light and dark themes
- Transitions are smooth and **state is saved** locally

### 🧠 Smart Design Choices
- **Responsive layout** across all devices
- Modern professional fonts like **Poppins & Roboto**
- Accessible UI components (ARIA-compliant)

---

## 📡 API Endpoints Used
- `GET /all` – fetch all countries
- `GET /name/{name}` – get country by name
- `GET /region/{region}` – filter by region
- `GET /alpha/{code}` – fetch country by alpha-3 code

Powered by: [REST Countries API](https://restcountries.com)

---

## 🧰 Technologies Used
- **React** with Hooks (functional components)
- **Material UI** for sleek components and icons
- **Axios** for API communication
- **Google Maps Embed API**
- **Responsive design** with custom CSS & MUI breakpoints
- **LocalStorage** for theme and favorites persistence
- **jsPDF** for PDF generation of selected country list

---

## 🔗 Live Demo

[![Live Site](https://img.shields.io/badge/🌐%20Explore%20the%20App-explore--the--worlds.netlify.app-brightgreen?style=for-the-badge)](https://explore-the-worlds.netlify.app/)

---

## 💻 Installation

Clone the repository
```bash
git clone https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-SiyumiSathnaraKumarasinghe


Install dependencies
```bash
npm install
```

Start the development server
```bash
npm start
```

The application will open in your browser at http://localhost:3000

## 🛠️ Usage

- **Browsing Countries**: Scroll through the country cards displayed on the main page
- **Search**: Use the search bar at the top to find specific countries
- **Filtering**: Use the region and language dropdowns to filter results
- **Country Details**: Click on any country card to view detailed information
- **Map View**: In the country details, click the map icon to see the country's location
- **Favorites**: Click the heart icon to add a country to favorites (requires login)
- **Theme Switching**: Toggle between light and dark mode using the theme icon

## 🧰 Technologies Used

- **Frontend Framework**: React (Functional Components & Hooks)
- **State Management**: React Hooks (useState, useEffect)
- **UI Framework**: Material-UI
- **HTTP Client**: Axios
- **Maps Integration**: Google Maps Embed API
- **Local Storage**: For user session and favorites persistence
- **CSS**: Custom styling with responsive design principles
- **API**: REST Countries API v3.1

## 📁 Project Structure
```
af-country-app/
├── public/
│   ├── images/
│   │   ├── background.jpg
│   │   └── darkBackground.png
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── CountryList.js
│   │   └── ...
│   ├── App.js
│   ├── index.js
│   ├── index.css
│   └── ...
├── package.json
└── README.md
```

## 🔧 Challenges and Solutions

**Challenge 1**: Responsive Design for Multiple Screen Sizes
- **Solution**: Implemented a dynamic layout with CSS Grid and Material-UI's responsive components. Added custom breakpoints for different device sizes to ensure optimal display.

**Challenge 2**: State Management Across Components
- **Solution**: Utilized React Hooks (useState, useEffect) for state management. Leveraged localStorage to persist user preferences and favorites across sessions.

**Challenge 3**: Performance Optimization
- **Solution**: Implemented lazy loading of country data and optimized API calls to reduce load times.

## 🧪 Testing

Unit tests are written using Jest and React Testing Library. Tests focus on component rendering, user interactions, and data fetching.

Run tests with:
```bash
npm test
```

## 👨‍💻 Contributors

- Name - Kumarasinghe S.S
- IT Number - IT22221414
- Email - it22221414@my.sliit.lk
- Batch - Y3S1.WE.SE.01.1

⭐ Don't forget to star this repo if you found it useful! ⭐
