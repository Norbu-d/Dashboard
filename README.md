# Collaro Bespoke Clothing Management System

A feature-rich, interactive dashboard for managing bespoke clothing customers, orders, and measurements built with Next.js, TypeScript, and Material-UI.

## 🚀 Features

### ✅ Completed Features
- **Interactive Customer Dashboard** with server-side pagination and sorting
- **Expandable Row Details** showing customer order history
- **Inline Editing** for customer status and order item measurements
- **Advanced Search** functionality across customer name and email
- **Real-time Statistics** dashboard with key business metrics
- **Responsive Design** optimized for desktop and mobile devices
- **Loading States** and error handling throughout the application
- **Mock API Backend** with realistic data generation

### 🎯 Key Functionalities

#### Customer Management
- View all customers with pagination (5, 10, 25, 50 items per page)
- Sort by Name, Order Count, or Total Revenue
- Search customers by name or email
- Edit customer status (Active, Churned, Prospect) with inline editing
- Expandable rows showing detailed order history

#### Order Management
- View detailed order information for each customer
- Display order items with custom measurements
- Edit custom measurements (Chest, Waist, Hips) inline
- Real-time calculation of totals and statistics

#### Dashboard Analytics
- Total customers count with active customer breakdown
- Total orders across all customers
- Total revenue with formatted currency display
- Average order value calculations

## 🛠 Technology Stack

- **Frontend**: Next.js 14, TypeScript, Material-UI (MUI)
- **Backend**: Next.js API Routes
- **Styling**: Material-UI with custom dark theme
- **State Management**: React useState and useEffect hooks
- **Data**: Mock data generation with realistic business scenarios

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd collaro-bespoke-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Project Structure
```
src/
├── app/
│   ├── api/
│   │   └── customers/
│   │       ├── customers.ts              # Main customers API
│   │       └── [id]/
│   │           └── orders/
│   │               └── orders.ts        # Orders API for specific customer
│   ├── page.tsx                          # Main dashboard page
│   └── _app.tsx                          # App initialization (Next.js custom App)
│
├── components/
│   ├── CustomerTable.tsx                # Displays customer data in a table
│   ├── OrdersTable.tsx                  # Displays order details for a customer
│   ├── DashboardStats.tsx               # Dashboard overview metrics
│   ├── Welcome.tsx                      # Welcome banner or message
│   └── Layout.tsx                       # Page layout wrapper
│
├── lib/
│   ├── mockData.ts                      # Mock data generation and helper functions
│   └── theme.ts                         # Material-UI theme configuration
│
└── types/
    └── theme.ts                         # Custom TypeScript types for theming

```

## 🎮 Usage Guide

### Customer Table Features

1. **Viewing Customers**
   - The main table displays customers with Name, Status, Email, Order Count, and Total Revenue
   - Use pagination controls at the bottom to navigate through pages
   - Change items per page using the dropdown (5, 10, 25, 50)

2. **Searching Customers**
   - Use the search bar at the top to filter customers by name or email
   - Search is case-insensitive and updates results in real-time

3. **Sorting Data**
   - Click on column headers (Name, Order Count, Total Revenue) to sort
   - Click again to reverse sort order
   - Active sort column shows an arrow indicator

4. **Editing Customer Status**
   - Click the edit icon next to any customer's status chip
   - Select new status from dropdown (Active, Churned, Prospect)
   - Save or cancel changes using the action buttons

5. **Viewing Order Details**
   - Click the arrow icon in the first column to expand customer details
   - First expansion triggers API call to load order history
   - View all orders with items, dates, and totals

6. **Editing Measurements**
   - In the expanded order view, click edit icon next to any item
   - Modify Chest, Waist, and Hips measurements
   - Save changes or cancel to revert

### Dashboard Statistics

The top section shows key business metrics:
- **Total Customers**: Count with active customers breakdown
- **Total Orders**: Aggregate across all customers
- **Total Revenue**: Sum of all order values
- **Average Order Value**: Revenue divided by order count

## 🏗 Architecture & Design Decisions

### State Management Strategy

**Component-Level State**: Used React's built-in `useState` for:
- Pagination parameters (page, rowsPerPage)
- Sorting parameters (sortBy, sortOrder)
- Search queries
- Editing states for inline editing
- Loading and error states

**Why this approach:**
- Simpler than external state management for this scope
- Direct component ownership of relevant state
- Easy to debug and maintain
- Sufficient for the current feature set

### API Design Philosophy

**Separation of Concerns**: Split into two main endpoints:
- `GET /api/customers` - Returns customer summaries without full order details
- `GET /api/
