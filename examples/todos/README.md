# Todos Example

A todo list application built using the [`@kagetech/base-component`](../..) library. This example demonstrates the implementation of a todo list with CRUD operations using the BLoC (Business Logic Component) pattern and a service layer for data management.

## Features

- View list of todos
- Add new todos
- Edit existing todos
- Remove todos
- Real-time state updates
- Clean architecture implementation with service layer

## Project Structure

```
todos/
├── src/
│   ├── services/     # Service layer for data management
│   ├── todo/         # Todo item components and logic
│   ├── todo_list/    # Todo list components and logic
│   └── todos_app.js  # Application entry point
├── index.html
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Architecture

This example follows a clean architecture pattern with an additional service layer:

- **Boundary Layer**: Contains the UI components
  - [`TodosApp`](src/todos_app.js) - Root application component
  - [`TodoListScreen`](src/todo_list/boundary/todo_list_screen.js) - Todo list screen
  - [`TodoList`](src/todo_list/boundary/todo_list.js) - Todo list component
  - [`TodoTile`](src/todo_list/boundary/todo_tile.js) - Individual todo item component

- **Control Layer**: Implements the business logic
  - [`TodoListBloc`](src/todo_list/control/todo_list_bloc.js) - Manages todo list state
  - [`TodoBloc`](src/todo/control/todo_bloc.js) - Manages individual todo state

- **Entity Layer**: Defines the domain models
  - [`TodoListState`](src/todo_list/entity/todo_list_state.js) - Todo list states
  - [`TodoListEvent`](src/todo_list/entity/todo_list_event.js) - Todo list events
  - [`TodoState`](src/todo/entity/todo_state.js) - Todo item states
  - [`TodoEvent`](src/todo/entity/todo_event.js) - Todo item events

- **Service Layer**: Handles data persistence
  - [`TodoService`](src/services/todo_service/boundary/todo_service.js) - Service interface
  - [`MockTodoService`](src/services/todo_service/control/mock_todo_service.js) - In-memory implementation

## Usage

The todo application provides a simple interface with:
- A list view showing all todos
- An "Add Todo" button to create new todos
- Edit and remove actions for each todo
- Confirmation dialog for todo removal

## Dependencies

- [`@kagetech/base-component`](../..): Core library for building web components
- [`@shoelace-style/shoelace`](https://shoelace.style/): UI component library
- [`vite`](https://vite.dev/): Development server and build tool
