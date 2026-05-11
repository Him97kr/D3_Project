# 🌍 World Population Dashboard

An interactive data visualization dashboard built with **React JS** and **D3.js**, showcasing global population trends through dynamic charts and real-time API integration.

## 🔴 Live Demo
👉 [View Live Project](https://him97kr.github.io/world-population-dashboard/)

![Demo](./public/project_gif.gif)

---

## 📊 Features

- **Real-time Data** — Population data fetched from [Restcountries API](https://restcountries.com/) on initial load
- **Historical Data** — Year-wise population data loaded from CSV files
- **Line Chart** — Visualizes population growth trends over time
- **Scatter Plot** — Displays Population Growth vs Density Correlation
- **Interactive Tooltips** — Hover over any data point to view detailed country information
- **Year Selection** — Dynamic year filter to explore historical population data
- **Responsive Design** — Fully optimized for mobile screens (width < 700px) and desktops

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React JS | Frontend framework |
| D3.js | Data visualization library |
| JavaScript (ES6+) | Core programming language |
| HTML5 & CSS3 | Structure and styling |
| Restcountries API | Real-time population data |
| GitHub Actions | CI/CD pipeline |
| GitHub Pages | Live deployment |

---

## 📈 Charts

### Population Growth Chart (Line Chart)
- Displays population trends across selected years
- Interactive hover showing country-specific data points
- Dynamic data updates based on year selection

### Population Growth vs Density Correlation (Scatter Plot)
- Visualizes relationship between population growth and density
- Country level granularity with interactive tooltips
- Color coded data points for better readability

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or above)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Him97kr/world-population-dashboard.git

# Navigate to project directory
cd world-population-dashboard

# Install dependencies
npm i

# Start the application
npm start
```

The app will run at `http://localhost:3000`

---

## 📁 Project Structure

```
world-population-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/       # React components
│   ├── data/            # CSV data files
│   └── App.js           # Main application
├── .github/
│   └── workflows/       # GitHub Actions CI/CD
├── package.json
└── README.md
```

---

## 🌐 Data Sources

- **[Restcountries API](https://restcountries.com/)** — Real-time country population data
- **CSV Files** — Historical population data by year

---

## 🔮 Future Improvements

- [ ] Add more chart types (Bar, Choropleth Map)
- [ ] Add country search/filter functionality

---

## 👨‍💻 Author

**Himanshu**
- GitHub: [@Him97kr](https://github.com/Him97kr)
- LinkedIn: [Himanshu Kumar](https://in.linkedin.com/in/himanshu-kumar-518b71192)

