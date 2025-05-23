[Customer Portal](https://github.com/ioNihal/sims-retailer-front) |
[Backend Code](https://github.com/S488U/ims)

# Sims Dashboard Front

**Sims Dashboard Front**

This is the frontend repository for the Smart Inventory Management System (SIMS) Dashboard Application. It’s a React‑based web app that provides a comprehensive interface for visualizing and interacting with your inventory, orders, customers, suppliers, reports and more.

---

## 🚀 Key Features

- **Data Visualization**  
  Interactive charts built with `recharts` to give you clear insights into inventory levels, sales trends, low‑stock alerts, and more.  
- **Report Generation**  
  Export PDF reports on demand using `react-pdf` and `html2canvas`.  
- **Authentication & Authorization**  
  Secure login flow with JWT stored in `localStorage`, auto‑logout on token expiry, and protected routes.  
- **CRUD Management**  
  Full create/read/update/delete support for Inventory, Customers, Suppliers, Orders, Invoices, Feedbacks, and Admin profile.  
- **Real‑time Notifications**  
  Toast messages via `react-hot-toast` for success/error feedback.  
- **Theming**  
  Light/dark mode toggle.  
- **Icons & Styling**  
  Uses `react-icons` and CSS modules for a clean, modern UI.

---

**Project Structure:**

The project follows a standard React structure. Key components and functionalities are organized within the `src` directory. This includes components for:

*   Dashboard
*   Charts
*   Report generation

- **api/** holds your single `callApi` helper plus all CRUD modules.  
- **components/** contains both layout elements (Sidebar, Topbar) and generic widgets.  
- **contexts/** centralizes auth & theme state.  
- **hooks/** is where you keep reusable logic (login flow, storage sync).  
- **pages/** matches your route hierarchy—each feature gets its own folder.  
- **styles/** keeps CSS scoped via modules.  
- **utils/** houses pure functions (validation, date formatting, etc.). 

This structure ensures clear separation of concerns and easy navigation as your SIMS dashboard grows.

## Getting Started

### Prerequisites

-   Node.js (version 16 or higher)
-   npm (or yarn)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2.  Navigate to the project directory:

    ```bash
    cd sims-dashboard-front
    ```

3.  Install dependencies:

    ```bash
    npm install
    ```

### Development

1.  Start the development server:

    ```bash
    npm start
    ```

    This will start the application at `http://localhost:3000`.

### Build

1.  Build the application for production:

    ```bash
    npm run build
    ```

    This will create a `build` directory with the optimized production build.

## Technologies

-   React
-   react-router‑dom for routing & protected routes
-   recharts for charts
-   react-icons for iconography
-   react-hot-toast for notifications
-   react-pdf, html2canvas for PDF reports

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before getting started.

## License

[MIT](LICENSE)
