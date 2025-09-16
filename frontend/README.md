# TwinGrid Frontend

This is the frontend for the TwinGrid Industrial Platform, built with Next.js, TypeScript, and Tailwind CSS.

## Prerequisites

- Node.js 16+
- pnpm (recommended) or npm
- Backend server running (see backend README for setup instructions)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/twingrid.git
   cd twingrid/frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env.local` and update the values:
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Available Scripts

- `dev` - Start the development server
- `build` - Build the application for production
- `start` - Start the production server
- `lint` - Run ESLint
- `format` - Format code with Prettier
- `test` - Run tests
- `test:watch` - Run tests in watch mode
- `test:coverage` - Generate test coverage report

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── app/             # App router
│   ├── components/      # Reusable components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and API client
│   ├── styles/          # Global styles
│   └── types/           # TypeScript type definitions
├── .eslintrc.json       # ESLint configuration
├── .prettierrc         # Prettier configuration
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies
└── tsconfig.json       # TypeScript configuration
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL for API requests | `http://localhost:8000/api` |
| `NEXT_PUBLIC_SITE_URL` | Base URL for the frontend | `http://localhost:3000` |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics | `false` |

## Contributing

1. Create a new branch for your feature or bugfix
2. Make your changes and commit them
3. Push your branch and open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
