# SiteScout - Website Marketplace Platform

## Overview
SiteScout is a comprehensive online marketplace for buying, selling, and renting websites. The platform features secure authentication, real-time messaging, currency conversion, and a network of verified website handlers.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend**: Convex (serverless backend with real-time database)
- **Authentication**: Convex Auth with Email OTP and Guest Login
- **Routing**: React Router v7
- **State Management**: Zustand (for client-side state)

## Key Features

### 1. Authentication System
- Email OTP authentication with form validation
- Guest login support
- Secure session management
- No automatic redirects - users control navigation

### 2. Marketplace
- Browse active listings with filters (search, category, listing type, price range)
- Real-time listing updates
- Detailed listing pages with metrics (revenue, traffic, domain age, authority)
- Image galleries for listings
- Favorites system (localStorage-based)

### 3. Messaging System
- Real-time buyer-seller chat via Convex
- Message read status tracking
- Conversation history
- Floating chat interface

### 4. Handler Network
- Handler registration with validation
- Service types: Transfer, Maintenance, Optimization
- Admin approval workflow
- Handler profiles with skills, rates, and experience

### 5. Currency Support
- 16 global currencies supported
- Real-time price conversion
- Persistent currency selection (localStorage)

### 6. Admin Panel
- Platform statistics dashboard
- User management
- Listing moderation
- Transaction oversight
- Handler approval system
- Analytics tracking

### 7. Analytics
- Event tracking (views, registrations, transactions)
- Platform-wide metrics
- User activity monitoring

## Backend Functions (Convex)

### Listings (`src/convex/listings.ts`)
- `createListing` - Create new listing (authenticated)
- `getListings` - Get filtered listings
- `getListingById` - Get single listing with user info
- `incrementViews` - Track listing views
- `updateListing` - Update own listing
- `deleteListing` - Delete own listing
- `getUserListings` - Get user's listings

### Handlers (`src/convex/handlers.ts`)
- `registerHandler` - Submit handler application
- `getApprovedHandlers` - Get approved handlers by service type

### Transactions (`src/convex/transactions.ts`)
- `createTransaction` - Initiate transaction
- `getBuyerTransactions` - Get purchases
- `getSellerTransactions` - Get sales
- `updateTransactionStatus` - Update transaction state

### Messages (`src/convex/messages.ts`)
- `sendMessage` - Send message in conversation
- `getConversation` - Get messages between users
- `markAsRead` - Mark messages as read
- `getUnreadCount` - Get unread message count

### Admin (`src/convex/admin.ts`)
- `getAllUsers` - Get all users (admin only)
- `getAllListings` - Get all listings (admin only)
- `getAllTransactions` - Get all transactions (admin only)
- `getAllHandlerRegistrations` - Get handler applications (admin only)
- `updateHandlerStatus` - Approve/reject handlers (admin only)
- `getPlatformStats` - Get platform statistics (admin only)

### Analytics (`src/convex/analytics.ts`)
- `trackEvent` - Track platform events
- `getAnalyticsSummary` - Get analytics summary
- `getEventsByType` - Get events by type

### Users (`src/convex/users.ts`)
- `currentUser` - Get current authenticated user

## Database Schema

### Tables
- **users** - User accounts with roles (admin, user, member)
- **listings** - Website listings with metrics and status
- **handlerRegistrations** - Handler applications with approval status
- **transactions** - Purchase/rental transactions
- **emailNotifications** - Email queue for notifications
- **analytics** - Event tracking data
- **messages** - Real-time messaging between users

## Pages

### Landing (`/`)
- Hero section with platform stats
- Category browsing
- Pricing plans (Free & Pro)
- Handler services showcase
- Feature highlights
- Newsletter signup

### Marketplace (`/marketplace`)
- Listing grid/list view
- Search and filters
- Listing type toggle (All/Sale/Rent)
- Currency selector
- Responsive design

### Listing Detail (`/listing/:id`)
- Image gallery
- Detailed metrics
- Seller information
- Contact seller (opens chat)
- Make offer functionality
- Favorite/share actions

### Auth (`/auth`)
- Email OTP flow with validation
- Guest login option
- Error handling
- Redirect after successful auth

### Admin Panel (`/admin`)
- Platform statistics
- User management
- Listing moderation
- Transaction monitoring
- Handler approval
- Analytics dashboard

## Current Status

### ✅ Completed
- Authentication system with validation
- Backend functions for listings, handlers, transactions, messages
- Real-time messaging system
- Currency conversion
- Admin panel with full CRUD
- Analytics tracking
- Handler registration flow
- Responsive UI design

### 🚧 In Progress
- Integration of Convex backend with frontend stores
- Transaction payment processing
- Email notification system
- File upload for listing images

### 📋 TODO
- Replace mock data with Convex queries/mutations
- Implement listing creation form
- Add payment gateway integration
- Build user dashboard
- Implement offer system
- Add search indexing
- Set up email service integration
- Add image upload to Convex storage

## Development Notes

### Authentication
- Auth redirects only occur after successful sign-in
- Users can access auth page even when authenticated
- Form validation prevents invalid submissions

### Data Flow
- Frontend currently uses Zustand stores with mock data
- Backend Convex functions are ready for integration
- Need to replace store calls with Convex hooks (useQuery, useMutation)

### Security
- All mutations check authentication
- Admin functions verify admin role
- Users can only modify their own resources
- Input validation on both frontend and backend

## Environment Variables
- `VITE_CONVEX_URL` - Convex deployment URL
- `CONVEX_SITE_URL` - Site URL for auth
- `VLY_APP_NAME` - Application name for emails

## Getting Started

This project is set up already and running on a cloud environment, as well as a convex development in the sandbox.

The project is set up with project specific CONVEX_DEPLOYMENT and VITE_CONVEX_URL environment variables on the client side.

The convex server has a separate set of environment variables that are accessible by the convex backend.

Currently, these variables include auth-specific keys: JWKS, JWT_PRIVATE_KEY, and SITE_URL.

# Using Authentication (Important!)

You must follow these conventions when using authentication.

## Auth is already set up.

All convex authentication functions are already set up. The auth currently uses email OTP and anonymous users, but can support more.

The email OTP configuration is defined in `src/convex/auth/emailOtp.ts`. DO NOT MODIFY THIS FILE.

Also, DO NOT MODIFY THESE AUTH FILES: `src/convex/auth.config.ts` and `src/convex/auth.ts`.

## Using Convex Auth on the backend

On the `src/convex/users.ts` file, you can use the `getCurrentUser` function to get the current user's data.

## Using Convex Auth on the frontend

The `/auth` page is already set up to use auth. Navigate to `/auth` for all log in / sign up sequences.

You MUST use this hook to get user data. Never do this yourself without the hook:
```typescript
import { useAuth } from "@/hooks/use-auth";

const { isLoading, isAuthenticated, user, signIn, signOut } = useAuth();
```

## Protected Routes

When protecting a page, use the auth hooks to check for authentication and redirect to /auth.

## Auth Page

The auth page is defined in `src/pages/Auth.tsx`. Redirect authenticated pages and sign in / sign up to /auth.

## Authorization

You can perform authorization checks on the frontend and backend.

On the frontend, you can use the `useAuth` hook to get the current user's data and authentication state.

You should also be protecting queries, mutations, and actions at the base level, checking for authorization securely.

## Adding a redirect after auth

In `src/main.tsx`, you must add a redirect after auth URL to redirect to the correct dashboard/profile/page that should be created after authentication.

# Frontend Conventions

You will be using the Vite frontend with React 19, Tailwind v4, and Shadcn UI.

Generally, pages should be in the `src/pages` folder, and components should be in the `src/components` folder.

Shadcn primitives are located in the `src/components/ui` folder and should be used by default.

## Page routing

Your page component should go under the `src/pages` folder.

When adding a page, update the react router configuration in `src/main.tsx` to include the new route you just added.

## Shad CN conventions

Follow these conventions when using Shad CN components, which you should use by default.
- Remember to use "cursor-pointer" to make the element clickable
- For title text, use the "tracking-tight font-bold" class to make the text more readable
- Always make apps MOBILE RESPONSIVE. This is important
- AVOID NESTED CARDS. Try and not to nest cards, borders, components, etc. Nested cards add clutter and make the app look messy.
- AVOID SHADOWS. Avoid adding any shadows to components. stick with a thin border without the shadow.
- Avoid skeletons; instead, use the loader2 component to show a spinning loading state when loading data.

## Landing Pages

You must always create good-looking designer-level styles to your application. 
- Make it well animated and fit a certain "theme", ie neo brutalist, retro, neumorphism, glass morphism, etc

Use known images and emojis from online.

If the user is logged in already, show the get started button to say "Dashboard" or "Profile" instead to take them there.

## Responsiveness and formatting

Make sure pages are wrapped in a container to prevent the width stretching out on wide screens. Always make sure they are centered aligned and not off-center.

Always make sure that your designs are mobile responsive. Verify the formatting to ensure it has correct max and min widths as well as mobile responsiveness.

- Always create sidebars for protected dashboard pages and navigate between pages
- Always create navbars for landing pages
- On these bars, the created logo should be clickable and redirect to the index page

## Animating with Framer Motion

You must add animations to components using Framer Motion. It is already installed and configured in the project.

To use it, import the `motion` component from `framer-motion` and use it to wrap the component you want to animate.

### Other Items to animate
- Fade in and Fade Out
- Slide in and Slide Out animations
- Rendering animations
- Button clicks and UI elements

Animate for all components, including on landing page and app pages.

## Three JS Graphics

Your app comes with three js by default. You can use it to create 3D graphics for landing pages, games, etc.

## Colors

You can override colors in: `src/index.css`

This uses the oklch color format for tailwind v4.

Always use these color variable names.

Make sure all ui components are set up to be mobile responsive and compatible with both light and dark mode.

Set theme using `dark` or `light` variables at the parent className.

## Styling and Theming

When changing the theme, always change the underlying theme of the shad cn components app-wide under `src/components/ui` and the colors in the index.css file.

Avoid hardcoding in colors unless necessary for a use case, and properly implement themes through the underlying shad cn ui components.

When styling, ensure buttons and clickable items have pointer-click on them (don't by default).

Always follow a set theme style and ensure it is tuned to the user's liking.

## Toasts

You should always use toasts to display results to the user, such as confirmations, results, errors, etc.

Use the shad cn Sonner component as the toaster. For example:

```
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
export function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Show Toast
    </Button>
  )
}
```

Remember to import { toast } from "sonner". Usage: `toast("Event has been created.")`

## Dialogs

Always ensure your larger dialogs have a scroll in its content to ensure that its content fits the screen size. Make sure that the content is not cut off from the screen.

Ideally, instead of using a new page, use a Dialog instead. 

# Using the Convex backend

You will be implementing the convex backend. Follow your knowledge of convex and the documentation to implement the backend.

## The Convex Schema

You must correctly follow the convex schema implementation.

The schema is defined in `src/convex/schema.ts`.

Do not include the `_id` and `_creationTime` fields in your queries (it is included by default for each table).
Do not index `_creationTime` as it is indexed for you. Never have duplicate indexes.

## Convex Actions: Using CRUD operations

When running anything that involves external connections, you must use a convex action with "use node" at the top of the file.

You cannot have queries or mutations in the same file as a "use node" action file. Thus, you must use pre-built queries and mutations in other files.

You can also use the pre-installed internal crud functions for the database:

```ts
// in convex/users.ts
import { crud } from "convex-helpers/server/crud";
import schema from "./schema.ts";

export const { create, read, update, destroy } = crud(schema, "users");

// in some file, in an action:
const user = await ctx.runQuery(internal.users.read, { id: userId });

await ctx.runMutation(internal.users.update, {
  id: userId,
  patch: {
    status: "inactive",
  },
});
```

## Common Convex Mistakes To Avoid

When using convex, make sure:
- Document IDs are referenced as `_id` field, not `id`.
- Document ID types are referenced as `Id<"TableName">`, not `string`.
- Document object types are referenced as `Doc<"TableName">`.
- Keep schemaValidation to false in the schema file.
- You must correctly type your code so that it passes the type checker.
- You must handle null / undefined cases of your convex queries for both frontend and backend, or else it will throw an error that your data could be null or undefined.
- Always use the `@/folder` path, with `@/convex/folder/file.ts` syntax for importing convex files.
- This includes importing generated files like `@/convex/_generated/server`, `@/convex/_generated/api`
- Remember to import functions like useQuery, useMutation, useAction, etc. from `convex/react`
- NEVER have return type validators.