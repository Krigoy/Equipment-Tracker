# Equipment Tracker

A local full-stack web application for managing and tracking equipment, including operational status and cleaning history.
The application also includes a small amount of assistive automation to reduce manual data entry when adding new equipment.

---

## Tech Stack

Frontend: React (Create React App), plain CSS  
Backend: Node.js, Express.js  
Database: PostgreSQL

---

## Prerequisites

Before running the project locally, make sure you have:

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm (or yarn)

---

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```bash
createdb equipment_tracker
```

Or using psql:

```bash
psql postgres
```

```sql
CREATE DATABASE equipment_tracker;
\q
```

Run the schema file to create the required tables:

```bash
psql equipment_tracker < database/schema.sql
```

---

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend directory:

```env
DATABASE_URL=postgresql://localhost:5432/equipment_tracker
PORT=3001
```

Start the backend server:

```bash
npm start
```

The backend will run at: http://localhost:3001

---

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The frontend will be available at: http://localhost:3000

---

## Application Overview

### Viewing Equipment

- All equipment records are displayed in a table on the landing page.
- The table supports:
  - Searching by equipment name
  - Filtering by equipment type
  - Sorting by last cleaned date

### Adding Equipment

- Click "Add Equipment" to open the add/edit form in a modal.
- The equipment type may be auto-suggested based on the name entered.
- All required fields must be filled before submission.

### Editing and Deleting

- Existing equipment can be edited using the "Edit" button.
- Equipment can be removed using the "Delete" button.

---

## Assistive Type Inference

When adding new equipment, the application attempts to suggest an appropriate equipment type based on the name entered.
This is intended to reduce repetitive manual selection, not to replace user input.

The inference is deterministic, local, and fully overrideable.

### How Inference Works

The inference runs in two ordered stages.

Stage 1: Explicit Heuristic (First Pass)

Certain well-known equipment terms are handled explicitly to restore commonly expected behavior.

| Term detected | Suggested type | Confidence | Reason                  |
| ------------- | -------------- | ---------- | ----------------------- |
| press         | Machine        | Medium     | Detected equipment term |

If this stage produces a result, it is used immediately.

Stage 2: General Inference Rules (Fallback)

**High confidence** (exact type keyword present):

- `machine` → Machine
- `vessel` → Vessel
- `tank` → Tank
- `mixer` → Mixer

**Medium confidence** (related equipment terms):

- `agitator`, `stirrer`, `blender` → Mixer
- `reactor`, `kettle`, `boiler` → Vessel
- `pump`, `compressor`, `motor` → Machine
- `storage`, `container`, `reservoir` → Tank
- `chamber`, `autoclave` → Vessel

**Low confidence:**

- If no rules match, no type is suggested and the user must select one manually.

### Manual Override

The suggested type is always editable.
The final submitted value is fully controlled by the user.

---

## Assumptions

- PostgreSQL is running locally on the default port (5432)
- The database schema has been applied before starting the backend
- Equipment names are entered in English
- This is a single-user local application with no authentication

---

## What Could Be Improved With More Time

- More detailed error messages and user feedback
- Improved client-side validation
- Automated tests (unit and integration)
- Pagination for large datasets
- Bulk operations such as import or batch edit
- Audit history for equipment changes
- Additional filters (status, date ranges)

---

## Future Extensibility

The inference logic is abstracted behind a provider interface.
This makes it possible to replace the current deterministic implementation with a more advanced classifier in the future without changing API routes, controllers, or frontend logic.

At present, the system intentionally uses a simple, explainable approach suitable for local execution.

---

## Notes for Reviewers

- This project is implemented as a true single-page application with no routing.
- Backend and frontend are intentionally kept separate.
- The focus was on correctness, clarity, and maintainability rather than visual complexity or advanced automation.
