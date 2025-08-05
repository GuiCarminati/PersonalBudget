# PersonalBudget

PersonalBudget is a simple Express.js API application for tracking personal finances, built as a portfolio project for the Codecademy Back-End Engineer Path. The project allows users to manage a budget by creating, updating, and viewing budget categories and transactions.

It follows the principles of [Envelope Budgeting](https://www.thebalancemoney.com/what-is-envelope-budgeting-1293682) — a simple and effective method where your spending is divided into budget "envelopes" for different categories. This approach gives users granular control over their budget and helps prevent overspending by ensuring that each expense is planned for in advance.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## About

This project is part of my learning journey on Codecademy’s Back-End Engineer Career Path. It provides a hands-on introduction to designing RESTful APIs with **Node.js** and **Express**. The application can be used to perform CRUD (Create, Read, Update, Delete) operations for budgets and transactions, laying the groundwork for future expansions like database integration, authentication, or front-end interfaces.

## Features

- Manage budget categories (add, update, delete)
- Track expenses and income with transactions
- Simple REST API design for practice and expansion
- Uses in-memory data storage (upgradeable)
- Modular architecture suitable for new backend engineers

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/GuiCarminati/PersonalBudget.git
cd PersonalBudget
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the server:**

```bash
node server.js
```

The server will start on `http://localhost:4001` (or the port specified in your `server.js`).

## Usage

You can interact with the API using tools like Postman or `curl`. Example requests are provided below.

## API Endpoints

All routes are prefixed with `/api/envelopes`.

### List All Envelopes
- **GET /api/envelopes/**
  - Returns all non-archived envelopes.

### List Archived Envelopes
- **GET /api/envelopes/archived**
  - Returns all archived envelopes.

### Get Envelope by ID
- **GET /api/envelopes/:id**
  - Returns the envelope with the specified `id`.

### Create a New Envelope
- **POST /api/envelopes/**
  - Creates a new envelope.
  - **Request body:**
    ```
    {
      "name": "Groceries",
      "budget": 300,
      "balance": 300
    }
    ```

### Update an Envelope
- **PUT /api/envelopes/:id**
  - Updates an envelope’s details (name, budget, balance).
  - **Request body:** (fields optional; omitted fields retain previous value)
    ```
    {
      "name": "Groceries",
      "budget": 350,
      "balance": 200
    }
    ```

### Update Envelope Balance
- **PUT /api/envelopes/:id/balance**
  - Performs a transaction on the envelope’s balance (e.g., add or subtract funds).
  - **Request body:**
    ```
    {
      "transactionValue": -50
    }
    ```
  - Returns the updated envelope.

### Archive or Unarchive Envelope

- **PUT /api/envelopes/:id/archive**
- Toggles the `archived` status of an envelope (archived → unarchived or vice versa).
- **No request body needed.**
- Returns status 204 (no content) and a message.

### Delete Envelope

- **DELETE /api/envelopes/:id**
- Deletes the specified envelope.
- Returns status 204 (no content) and a message.

---

**Example: Create an envelope**

```bash
curl -X POST http://localhost:3000/api/envelopes/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Groceries","budget":300,"balance":300}'
```

**Example: Update balance**

```bash
curl -X PUT http://localhost:3000/api/envelopes/1/balance \
  -H "Content-Type: application/json" \
  -d '{"transactionValue":-50}'
```

Tip: All responses are in JSON. Errors will return a JSON error object.

## Project Structure

```bash
PersonalBudget/
├── public/ # (front-end or static files)
├── server/ # (route/controllers)
├── server.js
├── package.json
└── objectives.md
```

- `server.js`: Entry point; configures Express and routes.
- `package.json`: Dependency and script definitions.
- `objectives.md`: Project goals and milestones.

## Contributing

Contributions are welcome for educational purposes! Please fork this repository and submit a pull request. For ideas, see the `objectives.md` or use the project to experiment with new backend features.

## License

This project is open source and free to use.
