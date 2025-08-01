# Implementation Plan: Lawyer-Side UX for Registration and Profile Management

This plan outlines the steps to implement the lawyer's registration and profile management features as detailed in `lawyer-side-ux.md`.

## Permissions

I will need permission to perform the following actions:

- **Create** new files and directories for the lawyer registration, dashboard components, and data services. ok
- **Modify** `src\lib\backend\lawyer.ts` to add the necessary API calls for updating the lawyer's profile. ok
- **Read** files in `src/data`, `src\lib`, `instructions\input\endpointsUsageGuideV1.md`, `src\contexts\AuthContext.tsx` to understand codebase/project. ok

---

## Phase 0: Data Abstraction Layer

To ensure future scalability, we will create a service to abstract the fetching of static data. Initially, this service will fetch data from local mock files, but it can be easily updated to call backend endpoints later without changing the UI components.

### 0.1. Create `staticDataService.ts`

I will create a new file at `src/services/staticDataService.ts`.

### 0.2. Implement Mock Service Functions

Inside this service, I will create and export functions to fetch data for the forms:

- `getLocations()`
- `getPracticeAreas()`
- `getCourts()`

These functions will import the corresponding data from the `src/data` directory and return it as a `Promise` to simulate a real asynchronous API call.

---

## Phase 1: Multi-Step Registration Form

### 1.1. Create Folder Structure

I will create the following directory structure to house the new components:

```
src/
|-- app/
|   |-- lawyer/
|       |-- register/
|           |-- page.tsx
|           |-- components/
|               |-- Step1Form.tsx
|               |-- Step2Form.tsx
|               |-- MultiStepRegisterForm.tsx     
```

### 1.2. Develop `MultiStepRegisterForm.tsx`

- This component will manage the state of the multi-step form (which step is active).
- It will render `Step1Form` or `Step2Form` based on the current step.
- It will handle the submission of data for both partial and full registration.

### 1.3. Develop `Step1Form.tsx`

- This component will contain the form fields for Step 1:
  - `name` (Text Input)
  - `photo` (Image Upload)
  - `experience` (Number Input/Dropdown)
  - `bio` (Textarea)
  - `consultFee` (Number Input)
- It will use `react-hook-form` for form state management and `zod` for validation.
- On successful submission, it will call a function passed from `MultiStepRegisterForm` to save the partial data and proceed to Step 2.

### 1.4. Develop `Step2Form.tsx`

- This component will contain the form fields for Step 2:
  - `barId` (Text Input)
  - `locationId` (Dropdowns for Country, State, City)
  - `specializationId` (Dropdown/Search)
  - `practiceAreas` (Multi-select/Tags)
  - `primaryCourtId` (Dropdown/Search)
  - `practiceCourts` (Multi-select/Tags)
- It will use `react-hook-form` and `zod`.
- The dropdowns will be populated with data fetched from the **`staticDataService`**.
- On successful submission, it will call a function passed from `MultiStepRegisterForm` to submit the complete profile data.

### 1.5. Update `lawyerService.ts`

- I will add a function to `src\lib\backend\lawyer.ts` to handle the `PUT` request to `/profiles/lawyer`. This function will be used for both partial and full registration updates.

### 1.6. Create `src/app/lawyer/register/page.tsx`

- This page will render the `MultiStepRegisterForm` component.
- It will also handle the logic for checking if a lawyer has a partially filled profile and redirecting them to the correct step.

---

## Phase 2: Lawyer Dashboard and Profile Management

### 2.1. Create Folder Structure

I will create the following directory structure:

```
src/
|-- app/
|   |-- lawyer/
|       |-- dashboard/
|           |-- page.tsx
|           |-- profile/
|               |-- page.tsx
|-- components/
|   |-- lawyer/
|       |-- dashboard/
|           |-- ProfileDisplay.tsx
|           |-- ProfileEditForm.tsx
```

### 2.2. Develop `src/app/lawyer/dashboard/page.tsx`

- This will be the main dashboard page.
- For now, it will contain a welcome message and a link to the "My Profile" page.

### 2.3. Develop `src/app/lawyer/dashboard/profile/page.tsx`

- This page will fetch the lawyer's profile data.
- It will manage the "view" and "edit" modes.
- It will render `ProfileDisplay` in "view" mode and `ProfileEditForm` in "edit" mode.

### 2.4. Develop `ProfileDisplay.tsx`

- This component will display the lawyer's profile information in a read-only format.
- It will have an "Edit Profile" button that will switch the parent component to "edit" mode.

### 2.5. Develop `ProfileEditForm.tsx`

- This component will be a form pre-filled with the lawyer's current profile data.
- It will allow the lawyer to edit all their profile information.
- Dropdowns for fields like location, practice areas, and courts will be populated using the **`staticDataService`**.
- It will have a "Save Changes" button that will submit the updated data via the `lawyerService`.

---

Once you approve this plan, I will begin with Phase 0.


# issues to avoid:
- **Maximum update depth exceeded error**: This error can occur when a component calls `setState` inside `useEffect`, but `useEffect` either doesn't have a dependency array, or one of the dependencies changes on every render. This was observed in:
  - `src/components/lawyer/dashboard/ProfileEditForm.tsx`
  - `src/app/lawyer/dashboard/profile/page.tsx`
  - `src/app/lawyer/dashboard/page.tsx`
  This was observed with `initialData` and the `user` object from `useAuth()` being unstable, causing infinite re-renders. To avoid this, ensure that props and dependencies passed to `useEffect` are stable (e.g., by using `useMemo`).
