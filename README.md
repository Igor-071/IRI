# MOP Foundation Next.js Project

A modern, well-structured Next.js application using the App Router, following atomic design principles and best practices for component organization.

## 🏗 Architecture Overview

This project is built with a focus on maintainability, scalability, and developer experience, utilizing Next.js 14+ with the new App Router architecture.

### 📁 Project Structure

```
src/
├── app/                 # App Router pages and layouts
├── components/         
│   ├── ui/             # UI components following atomic design
│   │   ├── atoms/      # Basic UI elements
│   │   ├── molecules/  # Composite components
│   │   └── organisms/ # Large UI sections
│   └── views/          # Page-specific view components
├── lib/                # Shared utilities and business logic
└── providers/          # Global state and context providers
```

### 🧱 Key Architectural Decisions

1. **App Router**: Using Next.js App Router (`/src/app`) for modern routing and layouts
2. **Atomic Design**: UI components are organized following atomic design principles
3. **Global State**: Centralized state management via Context API
4. **Type Safety**: Full TypeScript implementation
5. **Styling**: Tailwind CSS + shadcn/ui for consistent, accessible UI

## 🔍 Component Architecture

### Atomic Design Implementation

1. **Atoms** (`/src/components/ui/atoms/`)
   - Fundamental UI building blocks
   - Examples: buttons, inputs, labels
   - Stateless and reusable
   - Built on top of shadcn/ui primitives

2. **Molecules** (`/src/components/ui/molecules/`)
   - Combinations of atoms
   - Contains business logic and state
   - Examples: forms, interactive components
   - Mix of client and server components

3. **Organisms** (`/src/components/ui/organisms/`)
   - Complex UI sections
   - Composed of multiple molecules and atoms
   - Page-section level components

4. **Views** (`/src/components/views/`)
   - Page-level components
   - Organized by route/feature
   - Maps 1:1 with App Router pages

## 🛠 Technical Stack

- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Font Loading**: next/font with Geist font

## 📂 Directory Structure Details

### `/src/app`
- Root layout and global styles
- Page routes and layouts
- API routes (when needed)

### `/src/components`
- **UI Components** (`/ui`)
  - Atomic design structure
  - Reusable component library
- **View Components** (`/views`)
  - Page-specific components
  - Organized by feature/route

### `/src/lib`
- `actions.ts`: Business logic and data operations
- `schemas.ts`: Data validation schemas
- `utils.ts`: Shared utility functions

### `/src/providers`
- `global-state-provider.tsx`: Application-wide state management
- Additional context providers as needed

## 🚀 Getting Started

1. **Clone and Install**
   ```bash
   git clone https://github.com/ministryofprogramming/mop-foundation-nextjs.git
   cd mop-foundation-nextjs
   npm install
   ```

2. **Development**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 🔧 Development Practices

1. **Component Creation**
   - Place UI components in appropriate atomic design folders
   - Follow naming conventions for consistency
   - Include TypeScript types and documentation

2. **State Management**
   - Use global state for app-wide state
   - Prefer local state for component-specific state
   - Implement context providers as needed

3. **Styling**
   - Use Tailwind CSS utility classes
   - Extend shadcn/ui components when needed
   - Maintain consistent design tokens

## 📚 Best Practices

1. **Code Organization**
   - Follow atomic design principles strictly
   - Keep components focused and single-responsibility
   - Use TypeScript for type safety

2. **Performance**
   - Implement proper code splitting
   - Use Next.js image optimization
   - Optimize for Core Web Vitals

3. **Accessibility**
   - Utilize shadcn/ui's accessible components
   - Follow WCAG guidelines
   - Implement proper ARIA attributes

## 🔄 Project Conventions

1. **Imports**
   - Use `@/` alias for imports from `/src`
   - Group imports logically
   - Maintain consistent import ordering

2. **Component Structure**
   - One component per file
   - Clear component responsibilities
   - Proper TypeScript interfaces

3. **File Naming**
   - Kebab-case for files
   - PascalCase for components
   - Descriptive, purpose-indicating names

## 🚀 Deployment

Deploy on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) for optimal Next.js performance and features.

## 📖 Documentation Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 🤝 Contributing

1. Follow the existing architecture
2. Maintain atomic design principles
3. Include proper TypeScript types
4. Write clear commit messages
5. Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
