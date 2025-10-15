# React.js Code Standardization

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Naming Conventions](#naming-conventions)
- [Component Structure](#component-structure)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Forms & Validation](#forms--validation)
- [Animation](#animation)
- [Styling](#styling)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Overview

This document defines the standardization rules for the **React.js Code Standardization** project to ensure consistency and code quality.

## Project Structure

```
src/
├── api/               # Generated API client from Swagger
├── components/        # React components
│   ├── common/        # Shared components
│   └── [page]/        # Page-specific components
├── pages/             # Page components (routes)
├── hooks/             # Custom hooks
├── services/          # Business logic services
├── interface/         # TypeScript interfaces (legacy)
├── config/            # Configuration files
├── context/           # React Context providers
├── lib/               # Library configurations
├── theme/             # Styling and theme
├── utils/             # Utility functions
├── router/            # Router configuration
└── @types/            # Global type definitions
```

## Tech Stack

### Core Framework

- **React 19** with TypeScript
- **Vite** for build tooling and development server
- **React Compiler** (Babel plugin) for performance optimization

### State Management & Data Fetching

- **TanStack React Query** (`@tanstack/react-query`) for server state management
- **Context API** for client-side state management

### Routing & Navigation

- **React Router DOM** for client-side routing

### UI & Styling

- **Material-UI** (`@mui/material`) for component library
- **Emotion** (`@emotion/react`, `@emotion/styled`) for styled components
- **Roboto Font** (`@fontsource/roboto`) for typography

### Forms & Validation

- **React Hook Form** for form state management and performance
- **Yup** for schema validation
- **Hookform Resolvers** for validation resolver integration

### HTTP Client & API

- **Axios** for HTTP requests
- **Swagger TypeScript API** for generated API client
- **Custom HttpClient** wrapper for type-safe API calls

### Utilities & Animation

- **Day.js** for date/time manipulation and formatting
- **Framer Motion** for animations and gestures

### Development Tools

- **ESLint** with React and TypeScript plugins for code linting
- **TypeScript** for static type checking

## Naming Conventions

### Files and Folders

```typescript
// ✅ Good
components / Navbar.tsx;
hooks / useAuth.ts;
services / postService.ts;
pages / PostDetail.tsx;

// ❌ Avoid
components / navbar.tsx;
hooks / use - auth.ts;
services / api - service.ts;
```

### Components and Variables

```typescript
// ✅ PascalCase for components
function PostCard() {}

// ✅ camelCase for variables
const [isLoading, setIsLoading] = useState(false);
const [userProfile, setUserProfile] = useState(null);

// ✅ UPPER_CASE for constants
const ITEMS_PER_PAGE = 10;
const API_BASE_URL = "/api/v1";
```

## Component Structure

### Functional Components

```typescript
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  postId: string;
  onClose?: () => void;
}

const PostDetail: React.FC<Props> = ({ postId, onClose }) => {
  const { user } = useAuth();

  // Early returns for loading/error states
  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  if (!post) return <NotFound />;

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {onClose && <button onClick={onClose}>Close</button>}
    </div>
  );
};

export default PostDetail;
```

## API Integration

### Generated API Client (Swagger TypeScript API)

```typescript
// lib/axios.ts
import { Api, HttpClient } from "@/api/api";

export const httpClient = new HttpClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
});

export const api = new Api(httpClient);
```

### Using API Client

```typescript
// services/authService.ts
import type { LoginDto, RegisterDto, AuthResponseDto } from "@/api/api";
import { api } from "@/lib/axios";

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponseDto> => {
    const response = await api.api.authControllerLogin(data);
    return response;
  },

  register: async (data: RegisterDto): Promise<AuthResponseDto> => {
    const response = await api.api.authControllerRegister(data);
    return response;
  },
};
```

### React Query with API Client

```typescript
// hooks/usePosts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const usePosts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["posts", page, limit],
    queryFn: () => api.api.postsControllerGetAllPosts({ page, limit }),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostDto) =>
      api.api.postsControllerCreatePost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
```

## State Management

### Context API with React Query Pattern (Current Project Implementation)

```typescript
// context/AuthContext.tsx
import {
  clearTokens,
  getAccessToken,
  getUser,
  isTokenExpired,
  setAccessToken,
  setUserLocalStorage,
} from "@/lib/tokenService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useMemo, type ReactNode } from "react";
import type { LoginRequest, RegisterRequest, User } from "../interface/userInterface";
import { authService } from "../services/authService";

interface AuthContextType {
  user: Partial<User> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest, redirectTo?: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // Load user on app start with React Query
  const { data: authUser, isFetching } = useQuery<Partial<User> | null>({
    queryKey: ["auth"],
    queryFn: async () => {
      const token = getAccessToken();
      const storedUser = getUser();
      if (!token || !storedUser) return null;
      if (isTokenExpired(token)) {
        clearTokens();
        return null;
      }
      return JSON.parse(storedUser);
    },
    staleTime: Infinity,
    gcTime: 2 * 60 * 1000,
  });

  // Login handler
  const handleLogin = useCallback(
    async (data: LoginRequest) => {
      const res = await authService.login(data);
      setAccessToken(res.accessToken);
      setUserLocalStorage(JSON.stringify(res.user));

      // Update React Query cache
      queryClient.setQueryData(["auth"], res.user);
      queryClient.invalidateQueries({
        queryKey: ["auth"],
        refetchType: "none",
      });
    },
    [queryClient]
  );

  // Register handler
  const handleRegister = useCallback(
    async (data: RegisterRequest) => {
      const res = await authService.register(data);
      setAccessToken(res.accessToken);
      setUserLocalStorage(JSON.stringify(res.user));

      queryClient.setQueryData(["auth"], res.user);
      queryClient.invalidateQueries({
        queryKey: ["auth"],
        refetchType: "none",
      });
    },
    [queryClient]
  );

  // Logout handler
  const handleLogout = useCallback(() => {
    clearTokens();
    queryClient.setQueryData(["auth"], null);
    queryClient.invalidateQueries({
      queryKey: ["auth"],
      refetchType: "active",
    });
  }, [queryClient]);

  // Auto update authentication state
  const currentUser = useMemo(() => authUser ?? null, [authUser]);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isAuthenticated: !!currentUser,
        isLoading: isFetching,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { AuthContext };
```

### Using useAuth Hook

```typescript
// hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Usage in components
const MyComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <span>Welcome, {user?.name}!</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login(credentials)}>Login</button>
      )}
    </div>
  );
};
```

### Authentication Best Practices

- ✅ **React Query Integration**: Use React Query to manage auth state
- ✅ **Token Management**: Separate token logic into service
- ✅ **Auto Refresh**: Automatically check token expiration
- ✅ **Optimistic Updates**: Update UI immediately when login/logout
- ✅ **Error Handling**: Handle authentication errors gracefully

## Animation

### Framer Motion Basics

```typescript
// components/common/AnimatedCard.tsx
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedCard = ({ children, delay = 0 }: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Usage with stagger animation
const CardList = ({ items }: { items: any[] }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <AnimatedCard key={item.id} delay={index * 0.1}>
          <Card content={item} />
        </AnimatedCard>
      ))}
    </motion.div>
  );
};
```

### Animation Best Practices

- ✅ **Page Transitions**: Use for transitions between routes
- ✅ **Loading States**: Animate skeleton loaders and spinners
- ✅ **Micro-interactions**: Hover effects and button animations
- ✅ **Performance**: Only animate when necessary to avoid layout thrashing

## Error Handling

### Error Boundaries

```typescript
// components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

### React Query Error Handling

```typescript
export const usePosts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["posts", page, limit],
    queryFn: () => api.api.postsControllerGetAllPosts({ page, limit }),
    retry: 3,
    onError: (error) => {
      console.error("Failed to fetch posts:", error);
    },
  });
};
```

## Best Practices

### Code Organization

- **Single Responsibility**: Each component/hook should do only one thing
- **Composition over Inheritance**: Prefer composition over inheritance
- **Custom Hooks**: Extract complex logic into custom hooks
- **Service Layer**: Keep business logic in services

### Performance

- **React Query**: Use for server state management
- **Memoization**: Use React.memo, useMemo, useCallback when needed
- **Code Splitting**: Lazy load pages and components
- **Bundle Optimization**: Enable tree shaking

### TypeScript

- **Strict Mode**: Enable strict type checking
- **Interface Segregation**: Separate interfaces by domain
- **Generic Types**: Use generics for reusable components

### Forms & Validation

- **React Hook Form**: Use for better performance and UX
- **Yup Schemas**: Define centralized validation rules
- **Error States**: Display errors in a user-friendly way
- **Loading States**: Disable forms when submitting

### Animation

- **Framer Motion**: Primary library for animations
- **Purposeful Animation**: Only animate what is necessary
- **Performance**: Use `AnimatePresence` and `layoutId` properly
- **Accessibility**: Respect `prefers-reduced-motion`

### Authentication

- **React Query Integration**: Use React Query to manage auth state
- **Token Management**: Separate token logic into dedicated service
- **Auto Refresh**: Automatically check token expiration
- **Optimistic Updates**: Update UI immediately on login/logout
- **Error Handling**: Handle authentication errors gracefully

### API Integration

- **Generated Client**: Use swagger-typescript-api
- **Type Safety**: Fully typed API calls
- **Error Handling**: Proper error management

### UI & Styling

- **Material-UI**: Primary component library for UI
- **Emotion**: Styling solution with CSS-in-JS
- **Theme Consistency**: Use theme provider pattern
- **Responsive Design**: Mobile-first approach

### Development Workflow

````bash
# Generate API client from Swagger spec
npm run generate:api

# Install new dependencies
npm install @mui/material @emotion/react @emotion/styled react-hook-form yup @hookform/resolvers dayjs framer-motion

# Development
npm run dev

# Build
npm run build

```bash
# Generate API client from Swagger spec
npm run generate:api

# Install new dependencies
npm install @mui/material @emotion/react @emotion/styled react-hook-form yup @hookform/resolvers dayjs framer-motion

# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
````

---

This document reflects the current structure and conventions of the project and will be updated when there are changes to the tech stack or architecture.
