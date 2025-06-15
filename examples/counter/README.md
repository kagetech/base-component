# Counter Example

A simple counter application built using the [`@kagetech/base-component`](../..) library. This example demonstrates the implementation of a basic counter with increment and decrement functionality using the BLoC (Business Logic Component) pattern.

## Features

- Increment counter
- Decrement counter (with minimum value of 0)
- Real-time state updates
- Clean architecture implementation

## Project Structure

```
counter/
├── src/
│   ├── boundary/     # UI components
│   ├── control/      # Business logic
│   ├── entity/       # Domain models
│   └── main.js       # Application entry point
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

This example follows a clean architecture pattern:

- **Boundary Layer**: Contains the UI components ([`CounterApp`](src/boundary/counter_app.js))
- **Control Layer**: Implements the business logic ([`CounterBloc`](src/control/counter_bloc.js))
- **Entity Layer**: Defines the domain models ([`CounterState`](src/entity/counter_state.js), [`CounterEvent`](src/entity/counter_event.js))

## Usage

The counter application provides a simple interface with:
- A display showing the current counter value
- An increment button to increase the counter
- A decrement button to decrease the counter (won't go below 0)

## Dependencies

- [`@kagetech/base-component`](../..): Core library for building web components
- `vite`: Development server and build tool
