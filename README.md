# UniSync Time - Unified Time and Attendance Management System

Welcome to UniSync Time! This is a modern, AI-enhanced application designed to unify employee time tracking, attendance, and access control. Built with a powerful stack of modern web technologies, this starter kit provides a solid foundation for a real-world enterprise application.

## Application Structure

The project follows the standard Next.js App Router structure, which is organized for scalability and clarity.

-   **/src/app/**: This is the core of the application, containing all pages and routes.
    -   **`/(pages)/*`**: Each subdirectory like `/dashboard`, `/attendance`, `/settings`, etc., represents a route in the application. Each contains a `page.tsx` file for the main component.
    -   **`/layout.tsx`**: The root layout of the application, which includes the main HTML structure and the `AppShell`.
    -   **`/globals.css`**: The global stylesheet, which also contains the theme variables for ShadCN/UI.
-   **/src/components/**: Contains all reusable React components.
    -   **/ui/**: Houses the components from the ShadCN/UI library (e.g., `Button`, `Card`).
    "   **/layout/**: Contains layout components like the `AppShell` and `Sidebar`.
    -   **/icons.tsx**: Custom SVG icons.
-   **/src/lib/**: For shared utilities, data, and type definitions.
    -   **`data.ts`**: Currently holds all the **mock data** for the application (employees, attendance records, etc.). This is where you'd replace mock data with real database calls.
    -   **`utils.ts`**: Utility functions, like the `cn` function for merging Tailwind classes.
    -   **`placeholder-images.ts`**: Manages placeholder image data.
-   **/src/hooks/**: Custom React hooks.
    -   **`use-auth.tsx`**: A simple context-based hook for managing mock user authentication state.
    -   **`use-toast.ts`**: Hook for displaying toast notifications.
-   **/src/ai/**: All Generative AI functionality using Genkit.
    -   **`genkit.ts`**: Initializes and configures the Genkit AI instance.
    -   **/flows/**: Contains the Genkit flows that define the AI logic, prompts, and schemas (e.g., `generate-attendance-report.ts`).

## Technology Stack

This application is built with a curated set of modern, production-ready technologies:

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router) - A powerful React framework for building fast, server-rendered applications.
-   **Language**: [TypeScript](https://www.typescriptlang.org/) - For type safety and improved developer experience.
-   **UI Components**: [ShadCN/UI](https://ui.shadcn.com/) - A collection of beautifully designed, accessible, and unstyled components that you can customize.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
-   **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) - A flexible and powerful framework for building production-ready AI-powered features.
-   **Charting**: [Recharts](https://recharts.org/) - A composable charting library built on React components.
-   **Icons**: [Lucide React](https://lucide.dev/) - A beautiful and consistent icon set.

## How to Expand and Add Value

This starter app is designed to be a launchpad. Here are several ways you can expand upon it:

### 1. Integrate Real Authentication

The current login system is a mock implementation for demonstration purposes.

-   **Action**: Replace the `useAuth` hook (`src/hooks/use-auth.tsx`) with a real authentication provider.
-   **Recommendation**: Use [Firebase Authentication](https://firebase.google.com/docs/auth). It's secure, easy to implement, and supports various providers (email/password, social, etc.). You would initialize Firebase in a client-side config file and use its SDK to handle user sign-up, sign-in, and session management.

### 2. Connect to a Real Database

All data is currently mocked in `src/lib/data.ts`.

-   **Action**: Replace the static data arrays with API calls to a backend service that connects to a database.
-   **Recommendation**:
    -   **Backend**: Create API routes in Next.js or use a separate backend service.
    -   **Database**: [Firestore](https://firebase.google.com/docs/firestore) is an excellent choice for a NoSQL, real-time database that integrates seamlessly with Firebase Auth and Next.js. You could create services to fetch and update collections for `employees`, `attendance`, etc.

### 3. Expand AI Capabilities with Genkit

The AI report generator is just the beginning.

-   **Action**: Create new Genkit flows in `src/ai/flows/`.
-   **Ideas**:
    -   **Anomaly Detection**: Create a flow that analyzes attendance data and flags unusual patterns (e.g., frequent lateness, unscheduled absences).
    -   **Predictive Shift Scheduling**: Build a flow that suggests optimal shift assignments based on historical data, employee availability, and business needs.
    -   **Natural Language Query**: Implement a flow that allows supervisors to ask questions in plain English (e.g., "Who was absent last week?") and get a structured answer.

### 4. Add New Pages and Features

-   **Action**: Create a new folder in `/src/app/` to add a new route. For example, to add a "Company Calendar" page, you would create `/src/app/calendar/page.tsx`.
-   **Ideas**:
    -   **Employee Profile Page**: A detailed view for each employee showing their attendance history, shift schedule, and personal details.
    -   **Leave Management System**: A feature for employees to request time off and for supervisors to approve it.
    -   **Real-time Notifications**: Use a service like Firebase Cloud Messaging to send real-time notifications for events like late clock-ins or jammed doors.

### 5. Customize the UI and Theme

-   **Action**: Modify the CSS variables in `src/app/globals.css` to change the application's color scheme.
-   **Recommendation**: Adjust `primary`, `secondary`, `background`, and `accent` colors to match your company's branding. You can also customize component styles directly.
