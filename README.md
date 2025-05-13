# RAYA NOVIN

This project is a **Social Media Management** tool. It consists of two main applications:

- `landing` → Public site
- `dashboard` → Admin dashboard (authenticated app)

## Project Structure (Monorepo)

This project uses a monorepo structure, where all applications and shared code are organized in the following way:

```
novinhub-clone/
├── apps/
│   ├── landing/        # Public site
│   └── dashboard/      # Admin dashboard
├── packages/
│   └── shared/         # Shared code (components, hooks, utils)
└── package.json        # Top-level workspace and dependencies
```

## Technologies

- React
- Vite
- Yarn / npm Workspaces
- ESLint + Prettier (optional)

## Getting Started

### 1. Install dependencies (in the root directory)

```bash
npm install
```

### 2. Run the Landing app

```bash
cd apps/landing
npm run dev
```

### 3. Run the Dashboard app

```bash
cd apps/dashboard
npm run dev
```

### 4. Using shared code

You can import shared components or functions like this:

```js
import { MyButton } from "@shared/components/MyButton";
```

---

## License

MIT
