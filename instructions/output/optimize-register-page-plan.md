# Plan to Optimize the Lawyer Registration Page

The goal is to refactor the lawyer registration page to improve readability and maintainability by breaking down the form into smaller, reusable components.

## 1. Create a New Directory for Components

I will start by creating a new directory to house the new form field components:

-   `src/app/lawyer/register/components/`

## 2. Create Individual Form Field Components

Next, I will create a separate file for each logical grouping of form fields inside the new directory. Each component will receive the `control` object from `react-hook-form` as a prop.

-   **`PhotoUpload.tsx`**: Handles the profile picture upload.
-   **`NameInputs.tsx`**: Contains the `firstName` and `lastName` fields.
-   **`LocationInputs.tsx`**: Contains the `state` and `city` dropdowns.
-   **`ProfessionalInfoInputs.tsx`**: A component to hold the professional information fields like `barNumber`, `practiceArea`, `experience`, and `consultFee`.
-   **`PrimaryCourtInput.tsx`**: For the `primaryCourt` field.
-   **`BioInput.tsx`**: For the `bio` textarea.
-   **`EducationInputs.tsx`**: Contains `lawSchool`, `degree`, and `graduationYear` fields.

## 3. Refactor the Main Registration Page

After creating the components, I will refactor the main registration page (`src/app/lawyer/register/page.tsx`):

-   I will remove the existing JSX for the form fields.
-   I will import the newly created components.
-   The main form will be simplified to call these components, passing the `form.control` to each one.

## 4. Permissions

I will need to perform the following actions:

-   Create a new directory: `c:\Users\alexr\Desktop\Aified\advonex\src\app\lawyer\register\components`
-   Create the following new files:
    -   `c:\Users\alexr\Desktop\Aified\advonex\src\app\lawyer\register\components\PhotoUpload.tsx`
    -   `c:\Users\alexr\Desktop\Aified\advonex\src\app\lawyer\register\components\NameInputs.tsx`
    -   `c:\Users\alexr\Desktop\Aified\advonex\src\app\lawyer\register\components\LocationInputs.tsx`
    -   `c:\Users\alexr\Desktop\Aified\advonex\src\app\lawyer\register\components\ProfessionalInfoInputs.tsx`
    -   `c:\Users\alexr\Desktop\Aified\advonex\src\app\lawyer\register\components\PrimaryCourtInput.tsx`
    -   `c:\Users\alexr\Desktop\Aified\advonex\src\app\lawyer\register\components\BioInput.tsx`
    -   `c:\Users\alexr\Desktop\Aified\advonex\src\app\lawyer\register\components\EducationInputs.tsx`
-   Modify the existing file: `c:\Users\alexr\Desktop\Aified\advonex\src\app\lawyer\register\page.tsx`

Please review this plan. If you approve, I will proceed with the implementation.
