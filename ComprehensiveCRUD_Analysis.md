# Comprehensive CRUD Architecture and Features Analysis

This document analyzes the architecture and features of the "Comprehensive" CRUD implementation found in `src/Models/Comprehensive/`. This implementation serves as a reference model for building scalable and maintainable CRUD interfaces in the application.

## 1. Architecture Overview

The architecture follows a **Model-Centric**, **Metadata-Driven**, and **Component-Based** approach. It heavily emphasizes **DRY (Don't Repeat Yourself)** principles and leverages **Generic** components to reduce boilerplate code.

### 1.1. Key Architectural Components

*   **Model Definition (`ComprehensiveModel.ts`)**:
    *   Defines the TypeScript interface for the data entity.
    *   Acts as the single source of truth for the data structure.

*   **Metadata Layer (`ComprehensiveModel.meta.ts`)**:
    *   **Purpose**: Centralizes UI-related configuration for the model.
    *   **Content**: Defines labels, input types, placeholders, validation rules (required), sortability, and options for enums.
    *   **Usage**: This metadata is consumed by the Table, Search, and Create/Edit forms to generate UI elements dynamically. This ensures consistency (e.g., the same label is used in the table header and the form input) and makes refactoring easier.

*   **Service Layer (`ComprehensiveService.ts`)**:
    *   Extends a generic `BaseService`.
    *   Inherits common CRUD operations (`getAll`, `getById`, `create`, `update`, `delete`).
    *   Encapsulates API endpoint logic (`/comprehensiveentity`).

*   **UI Composition**:
    *   **Page (`ComprehensivePage.tsx`)**: The container component that orchestrates the layout. It composes generic layout components (`PageWrapper`, `PageTransition`, `Breadcrumb`, `PageHeader`) with specific business components (`ComprehensiveSearch`, `ComprehensiveTable`).
    *   **Table (`ComprehensiveTable.tsx`)**: Wraps the generic `BaseDataTable`. It connects the generic table logic with the specific service and column definitions.
    *   **Columns (`ComprehensiveTableColumns.tsx`)**: Defines the specific rendering logic for each column, utilizing `comprehensiveModelMeta` for headers to maintain consistency.
    *   **Form (`ComprehensiveCreate.tsx`)**: Handles both Creation and Editing. It uses `zod` for schema validation and generic form components (`FormInput`, `FormSelect`, etc.) that consume the model metadata.

### 1.2. DRY (Don't Repeat Yourself) & Generic Patterns

*   **Centralized Metadata**: Instead of hardcoding "String Field" in the Table Header, Search Form, and Create Form, it is defined once in `comprehensiveModelMeta`. Changing it there updates it everywhere.
*   **Generic Service**: `BaseService<T>` handles the HTTP boilerplate. The specific service only needs to define the endpoint.
*   **Generic Table**: `BaseDataTable<T, F>` handles pagination, sorting, and data fetching. The specific component only provides the configuration (columns, service, query key).
*   **Reusable Form Components**: Components like `FormInput`, `FormSelect`, and `FormAutoComplete` abstract away the complexity of binding to the form state (likely React Hook Form) and rendering styles.

## 2. Features

The Comprehensive CRUD implementation includes a full suite of features for managing complex data entities.

### 2.1. Data Types Support
The model demonstrates handling of various data types:
*   **Primitives**: String, Boolean.
*   **Numbers**: Integer, Long, Double, BigDecimal (high precision).
*   **Dates**:
    *   `dateField`: ISO 8601 (UTC).
    *   `localDateField`: Date only (yyyy-MM-dd).
    *   `localDateTimeField`: ISO without offset.
*   **Enums**: Dropdown selection with label mapping.
*   **Relations**:
    *   **One-to-One**: User selection via Autocomplete.
    *   **Many-to-One**: Channel selection via Autocomplete.
    *   **Attachments**: File upload handling.

### 2.2. List View (Table)
*   **Pagination**: Built-in support via `BaseDataTable`.
*   **Sorting**: Columns can be sorted (configured in metadata).
*   **Dynamic Filtering**: Integration with the Search component.
*   **Row Actions**:
    *   **View**: Navigate to details page.
    *   **Edit**: Navigate to edit page.
    *   **Delete**: Delete item with confirmation.
*   **Formatting**:
    *   Dates are converted to Jalali (Persian) calendar.
    *   Enums are displayed with human-readable labels.
    *   Booleans are displayed as Yes/No options.

### 2.3. Create / Edit Form
*   **Unified Component**: A single component (`ComprehensiveCreate.tsx`) handles both modes.
*   **Validation**: Client-side validation using `zod` schemas.
*   **State Management**: Uses `React Query` (`useMutation`, `useQuery`) for data fetching and optimistic updates/cache invalidation.
*   **Rich Inputs**:
    *   `FormAutoComplete` for searching and selecting related entities (User, Channel).
    *   `FormUploader` for handling file attachments.
    *   `DateInput` for date picking.
*   **Feedback**: Toast notifications for success and error states.

### 2.4. Details View
*   **Layout**: Uses `RecordDisplayLayout` to provide a consistent header and container for details.
*   **Field Rendering**: Uses `DisplayField` to render label-value pairs in a grid layout (`RowContainer`).
*   **File Preview**: Uses `FilePreview` component to display attached files (images, etc.).
*   **Navigation**: Uses `LinkView` to create clickable links to related entities (e.g., User, Channel).
*   **State Handling**: Explicitly handles loading (`TablePlaceholder`) and error (`TableErrorState`) states.

### 2.5. Advanced Search
*   **Field-Specific Filters**:
    *   **Text**: `LIKE` operator for partial matches.
    *   **Numbers**: Range filtering (`GE` - Greater/Equal, `LE` - Less/Equal).
    *   **Dates**: Date range filtering.
    *   **Enums**: Exact match selection.
*   **Operator-Based Naming**: Uses a convention (e.g., `field_GE`) to map UI filters directly to backend query parameters.

## 4. Routing & Permissions Integration

The module is fully integrated into the application's routing and security infrastructure.

### 4.1. Route Configuration (`src/router/Routes.tsx`)
*   **Centralized Config**: Routes are defined in `routeConfig` array.
*   **Lazy Loading**: Components (`ComprehensivePage`, `ComprehensiveCreate`, etc.) are lazy-loaded for performance.
*   **Menu Integration**: The "List" route is marked with `showInMenu: true` and includes an icon and label, automatically appearing in the sidebar.
*   **Hierarchy**: Routes use a `parent` property (e.g., `/dashboard/portal`) to group them correctly in the navigation menu.

### 4.2. Permissions (`src/router/Permission.ts`)
*   **Granular Control**: Each route is protected by a specific permission:
    *   List/View: `Permission.ComprehensiveEntity_Read`
    *   Create: `Permission.ComprehensiveEntity_Create`
    *   Edit: `Permission.ComprehensiveEntity_Update`
    *   Delete: `Permission.ComprehensiveEntity_Delete` (used in Table actions)
*   **Route Guard**: The router checks these permissions before rendering the component.

### 4.3. Navigation Helpers
*   **ViewName Constants**: Routes are referenced by stable names (e.g., `VIEWNAME.COMPREHENSIVE_LIST`) defined in `ViewName.ts`, avoiding hardcoded strings.
*   **Dynamic Links**: `getViewPath(VIEWNAME.COMPREHENSIVE_EDIT, id)` is used to generate URLs, ensuring safety if paths change.
*   **Route Metadata**: The `useRouteMetadata` hook allows pages to access their own configuration (like "Page Title") dynamically.

## 5. Core Utilities & Components

The architecture relies on a set of robust core utilities and components to ensure consistency and speed up development.

### 5.1. Form Validation (`src/core/forms/validation.ts`)
*   **Zod Integration**: Uses `zod` for schema definition and validation.
*   **Pre-built Validators**:
    *   **Numbers**: `integer`, `long`, `float`, `double`, `bigDecimal` (includes regex checks and max length).
    *   **Text**: `text` (required), `optionalText`.
    *   **Date/Time**: `date`, `dateTime`.
    *   **Selection**: `select`, `multiSelect`, `autoComplete`.
    *   **Generic**: `notNull` for checking various types.

### 5.2. Option & Enum Utilities (`src/core/forms/OptionUtils.ts`)
*   **Standard Options**: `YES_OR_NO_OPTIONS` (Boolean), `PAGE_SIZE_OPTIONS`.
*   **Sort Generation**: `buildSortOptions` automatically creates "Ascending" and "Descending" options based on model metadata.
*   **Enum Helpers**: `getOptions` and `getLabel` convert Enum objects into dropdown options and display labels.

### 5.3. Message Utilities (`src/core/forms/MessageUtils.ts`)
*   **Factory Pattern**: `createMessages(modelName)` generates a complete set of localized success/error messages for Create, Update, and Delete actions, ensuring consistent wording across the app.

### 5.4. Filter Operators (`src/core/forms/FilterOperators.ts`)
*   **Server Compatibility**: Defines operators (`LIKE`, `EQ`, `GE`, `LE`, etc.) that match the backend's specification.
*   **Key Builder**: `buildFilterKey` constructs query parameters (e.g., `age_ge`) in a type-safe manner.

### 5.5. Date Utilities (`src/core/forms/DateUtils.ts`)
*   **Jalali Support**: Built on `react-multi-date-picker`.
*   **Conversion**:
    *   `GEORGIAN_TO_JALALI`: ISO -> Jalali (Display).
    *   `JALALI_TO_GEORGIAN`: Jalali -> ISO (Submission).

### 5.6. Breadcrumbs (`src/hooks/useBreadcrumbs.ts`)
*   **Automatic Generation**: The `useBreadcrumbs` hook traverses the route hierarchy (defined in `Routes.tsx`) to generate breadcrumbs automatically.
*   **Parent Resolution**: Handles nested routes and resolves labels from route configuration.

### 5.7. UI Components
*   **Form Upload**: `FormUploader` handles drag-and-drop, file previews (images vs docs), and integration with `AttachmentService`.
*   **General Components**:
    *   **Layout**: `RowContainer`, `RecordDisplayLayout`, `PageHeader`.
    *   **Interaction**: `Accordion`, `Modal`, `Drawer`, `DropDown`.
    *   **Feedback**: `ConfirmationModal`, `ErrorMessage`, `Spinner`, `ProgressBar`.

### 5.8. Styling (`src/index.css`)
*   **Tailwind CSS**: Core styling engine.
*   **Typography**: Uses `IRANSansXFaNum` for Persian support.
*   **Dark Mode**: Native support via Tailwind's `dark` variant.
*   **Custom Elements**: Styled tables (`.rounded-corners`), custom scrollbars, and `NProgress` bar.

## 6. File Structure Summary

| File | Purpose |
|------|---------|
| `ComprehensiveModel.ts` | TypeScript Interface Definition. |
| `ComprehensiveModel.meta.ts` | UI Metadata (Labels, Types, Validation). |
| `ComprehensiveService.ts` | API Service (extends BaseService). |
| `ComprehensivePage.tsx` | Main Entry Page (Layout & Composition). |
| `ComprehensiveTable.tsx` | Table Component (wraps BaseDataTable). |
| `ComprehensiveTableColumns.tsx` | Column Definitions & Rendering Logic. |
| `ComprehensiveCreate.tsx` | Create & Edit Form Logic. |
| `ComprehensiveDisplay.tsx` | Read-Only Details View. |
| `ComprehensiveSearch.tsx` | Search/Filter Form Component. |
| `ComprehensiveEnumField.ts` | Enum Definitions & Label Mappings. |
