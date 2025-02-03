# Knowledge Worker

A powerful Angular-based application for managing and scheduling automated queries across multiple data sources. This application helps users create, monitor, and analyze scheduled queries with a modern, user-friendly interface.

## Features

### Query Management

- **Create Custom Queries**: Design queries with customizable parameters and attributes
- **Schedule Execution**: Set intervals for automatic query execution (1 minute to 1 hour)
- **Multiple Data Sources**: Support for various APIs including books and movies databases
- **Parameter Configuration**: Flexible parameter system with required and optional fields
- **Attribute Selection**: Choose specific attributes to include in query results

### User Interface

- **Modern Design**: Clean and intuitive Material Design interface
- **Interactive Dialogs**: User-friendly forms for query creation and result viewing
- **Dynamic Updates**: Real-time updates of query status and results

## Technical Stack

- **Framework**: Angular 19.0.6
- **UI Components**: Angular Material
- **State Management**: RxJS for reactive programming
- **Testing**: Jest for unit testing
- **Styling**: SCSS for advanced styling capabilities

## Getting Started

1. **Prerequisites**:

   - Node.js (Latest LTS version)
   - npm (comes with Node.js)

2. **Installation**:

   ```bash
   # Clone the repository
   git clone https://github.com/aabi01/knowledge-worker

   # Install dependencies
   npm install
   ```

3. **Development Server**:
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/`.

### Testing

Run unit tests:

```bash
npm test
```

## Project Structure

- `src/app/components/`: UI components

  - `add-query-dialog/`: Query creation dialog
  - `scheduled-queries/`: Main query management dashboard
  - `show-query-result-dialog/`: Query results viewer
  - `confirm-action-dialog/`: Confirmation dialogs

- `src/app/core/`:
  - `models/`: TypeScript interfaces
  - `services/`: Business logic and API communication
    - `query.service`: Query management
    - `query-scheduler.service`: Query scheduling
    - `query-results.service`: Results handling
    - `api-repository.service`: API management
  - `http/`: HTTP services for external API communication
    - `books.service`: Mocked Books API
    - `movies.service`: Mocked Movies API
    - `api-repository.service`: Mocked API Repository
