# Plan to Refactor the Lawyer Registration Page

The goal of this refactoring is to make each input component on the lawyer registration page a standalone unit. Each component will have its own Zod schema, validation, and submission logic. This will allow for more modular and reusable components, and it will enable a better user experience by allowing for both individual field updates and a final, batched update.

## 1. Refactor Individual Components

I will refactor each of the following components to be standalone:

*   `NameInputs.tsx`
*   `LocationInputs.tsx`
*   `ProfessionalInfoInputs.tsx`
*   `PrimaryCourtInput.tsx`
*   `BioInput.tsx`
*   `EducationInputs.tsx`
*   `PhotoUpload.tsx`

For each component, I will perform the following steps:

1.  **Create a new file for the refactored component.** I will name the new files with a `.new.tsx` suffix for now (e.g., `NameInputs.new.tsx`).
2.  **Define a Zod schema.** Each component will have its own Zod schema that defines the shape and validation rules for its data.
3.  **Use `react-hook-form` and `zodResolver`.** Each component will have its own `useForm` hook, initialized with its Zod schema.
4.  **Implement `submitMode` and `onSubmit` props.**
    *   `submitMode`: This prop will be an enum with two possible values: `"internal"` and `"external"`. The default value will be `"internal"`.
    *   `onSubmit`: This prop will be a function that is called when the form is submitted in `"external"` mode.
5.  **Implement internal submission logic.** When `submitMode` is `"internal"`, the component will handle its own submission by calling the appropriate service function (e.g., `updateLawyerProfile`).
6.  **Update the component's JSX.** The JSX will be updated to use the `react-hook-form` fields and to include a submit button when `submitMode` is `"internal"`.

## 2. Create a New Registration Page

After refactoring all the individual components, I will create a new registration page that uses these new components.

1.  **Create a new file for the registration page.** I will name the new file `page.new.tsx`.
2.  **Use a `Stepper` component.** The new registration page will use a `Stepper` component to guide the user through the different sections of the form.
3.  **Use the refactored components in `"external"` mode.** Each of the refactored components will be used with `submitMode="external"`.
4.  **Implement a final submission function.** The new registration page will have a final submission function that is called when the user completes all the steps in the stepper. This function will gather the data from all the components and send a single, batched request to the server.

## 3. File and Folder Structure

All new files will be created in the same directory as the original files. Once the refactoring is complete and approved, I will replace the original files with the new files.

## Permissions

I will need permission to create new files and to replace the existing files once the refactoring is complete.
