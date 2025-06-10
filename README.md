
# Gleam Gallery - Exquisite Jewelry E-Commerce Platform

This is a Next.js starter project for Gleam Gallery, an e-commerce platform designed for showcasing and selling exquisite jewelry. It's built with a modern tech stack and includes features for both customers and administrators.

## Core Technologies

*   **Next.js (App Router)**: For server-side rendering, routing, and full-stack capabilities.
*   **React**: For building interactive user interfaces.
*   **TypeScript**: For type safety and improved developer experience.
*   **ShadCN UI Components**: For a collection of beautifully designed, accessible, and customizable UI components.
*   **Tailwind CSS**: For utility-first styling.
*   **Genkit (Firebase Genkit)**: For integrating Generative AI features.

## Key Features

### Customer-Facing (Frontend)

*   **Homepage (`/`)**:
    *   Displays a welcome message and a call to action to explore products.
    *   Showcases product categories with images and descriptions, allowing users to navigate directly to category-specific product listings.
*   **Product Listing Page (`/products`)**:
    *   Displays all available jewelry items in a grid format.
    *   Includes filtering options by category and material.
    *   Each product card shows an image, name, material, gemstones, price, and buttons to view details or add to cart.
*   **Product Detail Page (`/products/[productId]`)**:
    *   Provides a detailed view of a single product, including a larger image, full description, price, material, gemstones, style, and occasion.
    *   Allows users to specify quantity and add the product to their cart.
*   **Shopping Cart (`/cart`)**:
    *   Displays items added to the cart.
    *   Users can adjust quantities, remove items, or clear the entire cart.
    *   Shows an order summary with total items and total price.
    *   Includes a "Proceed to Checkout" button (demo functionality).
*   **User Authentication**:
    *   **Login Page (`/login`)**: Allows existing users to log in.
    *   **Register Page (`/register`)**: Allows new users to create an account.
    *   User sessions are persisted in `localStorage` on the client-side.
    *   Carts are specific to logged-in users or a "guest" session.

### Administration Panel (`/admin`)

The admin panel is protected and accessible only to users with an 'admin' role.

*   **Admin Dashboard (`/admin`)**:
    *   Provides an overview and quick links to various management sections.
*   **Manage Products (`/admin/products`)**:
    *   Displays a table of all products with their image, name, category, material, and price.
    *   Allows admins to:
        *   **Add New Products (`/admin/products/new`)**: Via a form including name, description, price, image upload, category, material, gemstones, style, and occasion.
        *   **Edit Existing Products (`/admin/products/[productId]/edit`)**: Via a pre-filled form.
        *   **Delete Products**: Removes products from the store (with a confirmation dialog).
*   **Manage Categories (`/admin/categories`)**:
    *   Displays a table of all product categories with their image, name, and description.
    *   Allows admins to:
        *   **Add New Categories (`/admin/categories/new`)**: Via a form including name, description, and image upload.
        *   **Edit Existing Categories (`/admin/categories/[categoryId]/edit`)**: Via a pre-filled form.
        *   (Delete functionality is currently a placeholder).
*   **AI Description Generator (`/admin/description-generator`)**:
    *   An admin tool that uses Genkit to generate compelling jewelry descriptions based on input attributes (name, material, gemstones, style, occasion).
*   **Manage Category Images (`/admin/category-images`)**:
    *   Placeholder page for future functionality to update images specifically for category displays.
*   **Manage Announcements (`/admin/announcements`)**:
    *   Placeholder page for future functionality to upload and manage site-wide announcement banners or photos.
*   **Analytics (Coming Soon)**:
    *   Placeholder card on the dashboard for future analytics features.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run the Development Server**:
    The Next.js app and Genkit (for AI features) run on different ports.
    *   **Start Next.js app**:
        ```bash
        npm run dev
        ```
        This typically starts the app on `http://localhost:9002` (or the configured port).
    *   **Start Genkit development service (in a separate terminal)**:
        ```bash
        npm run genkit:dev
        ```
        This starts the Genkit service, usually on `http://localhost:3400`. The AI Description Generator relies on this service.

3.  **Access the Application**:
    *   Frontend: `http://localhost:9002`
    *   Admin Panel: `http://localhost:9002/admin` (Login with `admin` / `adminpassword` for default admin access).

## Project Structure Highlights

*   **`src/app/`**: Contains all the routes, pages, and layouts, following the Next.js App Router structure.
    *   **`src/app/admin/`**: Admin-specific routes and layouts.
    *   **`src/app/api/`**: API routes (e.g., for fetching products).
*   **`src/components/`**: Reusable React components.
    *   **`src/components/admin/`**: Components specific to the admin panel.
    *   **`src/components/auth/`**: Login and registration form components.
    *   **`src/components/cart/`**: Cart-related components.
    *   **`src/components/layout/`**: Site-wide layout components (header, footer).
    *   **`src/components/products/`**: Product card and detail display components.
    *   **`src/components/ui/`**: ShadCN UI components.
*   **`src/contexts/`**: React Context providers (e.g., `AuthContext`, `CartContext`).
*   **`src/lib/`**: Core logic, data, server actions, and type definitions.
    *   **`src/lib/actions.ts`**: Server Actions for form submissions and data mutations.
    *   **`src/lib/data.ts`**: In-memory data store for products and categories (for demo purposes).
    *   **`src/lib/auth-data.ts`**: In-memory user store and authentication logic (for demo purposes).
    *   **`src/lib/types.ts`**: TypeScript type definitions.
*   **`src/ai/`**: Genkit related files.
    *   **`src/ai/flows/`**: Genkit flows (e.g., `generate-jewelry-description.ts`).
    *   **`src/ai/genkit.ts`**: Genkit initialization.
*   **`public/`**: Static assets.

This README provides a comprehensive overview. Feel free to explore the codebase to understand the implementation details further!
