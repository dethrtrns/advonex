# Lawyer-Side UX Flow for Registration and Profile Management

This document outlines the UX flow for the lawyer-side registration process after email verification and sign-in, focusing on the collection of essential information to make a lawyer's profile publicly visible.

## Mandatory Fields for Public Profile Visibility

Based on the `LawyerProfile` schema in `schema.prisma` and the requirement that a lawyer's profile becomes visible once `registrationPending` is set to `false`, the following fields are considered essential for a basic public profile:

*   `name`: The lawyer's full name.
*   `photo`: A profile picture. (A placeholder can be used if not provided initially, but the option to upload should be present).
*   `locationId`: The primary location where the lawyer practices (city/state).
*   `experience`: Years of legal experience.
*   `bio`: A brief professional biography.
*   `consultFee`: The fee for consultation.
*   `barId`: The lawyer's bar identification number (crucial for professional verification).
*   At least one `specializationId` or `practiceArea`: The lawyer's area(s) of expertise.
*   At least one `primaryCourtId` or `practiceCourt`: The court(s) where the lawyer primarily practices.

---

## UX Flow: Progressive Disclosure (Minimalist First, then Expand)

This flow aims to get the lawyer to a "publicly visible" state with minimal initial friction, allowing them to fill in more details later. The `registrationPending` flag will be set to `false` after the completion of the initial multi-step form.

### Registration Stage (Multi-step Form - Sets `registrationPending` to `false`)

This form collects the mandatory fields.

*   **Step 1: Basic Personal & Professional Info**
    *   `name` (Text Input)
    *   `photo` (Image Upload with option to skip for a default placeholder)
    *   `experience` (Number Input/Dropdown for years)
    *   `bio` (Textarea - short, e.g., 2-3 sentences)
    *   `consultFee` (Number Input)
*   **Step 2: Core Legal Credentials & Location**
    *   `barId` (Text Input)
    *   `locationId` (Dropdowns for Country, State, City - linked to `Location` model)
    *   `specializationId` (Dropdown/Search for primary specialization from `PracticeArea`)
    *   `practiceAreas` (Multi-select/Tags for additional practice areas from `PracticeArea`)
    *   `primaryCourtId` (Dropdown/Search for primary court from `PracticeCourt`)
    *   `practiceCourts` (Multi-select/Tags for additional practice courts from `PracticeCourt`)

*   **Submission:** Upon completion of Step 2, all mandatory fields are collected. The frontend sends a `PUT` request to `/profiles/lawyer` with all collected data, including `registrationPending: false`. On successful response, the lawyer's profile is now public.
*   **Redirection:** Redirect to the Lawyer Dashboard.

### After Registration (Dashboard - Edit/Update Profile)

Once `registrationPending` is `false`, the lawyer can access their full dashboard.

*   **Dashboard Landing:** The lawyer lands on their dashboard. A prominent section or notification could encourage them to complete their profile further.
*   **"My Profile" Tab/Section:** This dedicated section allows the lawyer to view and edit all their profile information.
    *   **Edit Functionality:** All fields from the initial registration steps are editable.
    *   **Additional Sections:**
        *   **Education:** Add/Edit `Education` details (degree, institution, year).
        *   **Services:** Add/Edit `Service` offerings (from predefined list or custom).
        *   **Detailed Bio/About Me:** Expand on the initial `bio`.
        *   **Contact Information:** (If applicable, not in current schema, but common for profiles).
    *   **Save Changes:** Each section or the entire profile can have a "Save" button that triggers a `PUT` request to `/profiles/lawyer` with the updated data.

---

## Implementation Details & Decisions

This section documents the key implementation decisions for the chosen UX flow.

*   **Partial Registration (Saving Progress):**
    *   After a lawyer completes Step 1 of the registration, the frontend will send a `PUT` request to `/profiles/lawyer` with the collected data. The backend will save this partial information, and `registrationPending` will remain `true`.
    *   When a lawyer with `registrationPending: true` logs in, the frontend will fetch their profile data. By checking which mandatory fields are present or missing, the frontend will determine if the lawyer has completed Step 1 and will redirect them to the appropriate step (e.g., Step 2).

*   **Profile Editing on Dashboard:**
    *   The "My Profile" page on the dashboard will initially display the lawyer's information in a read-only format.
    *   An "Edit Profile" button will be prominently displayed. Clicking this button will switch the entire profile page into an "edit mode," making all fields editable within a form.
    *   A "Save Changes" button will be located at the bottom of the form. Clicking this button will submit all updated data in a single `PUT` request to `/profiles/lawyer`.

*   **Handling Stale Registrations:**
    *   To manage incomplete profiles, a backend cron job is recommended. This job would periodically query the database for profiles where `registrationPending` is `true` and the `updatedAt` timestamp is older than a defined threshold (e.g., 30 days). These stale profiles can then be soft-deleted or permanently removed, ensuring a clean database.

## Verification (`isVerified`)

In both flows, the `isVerified` flag remains separate. It is a backend-controlled flag that indicates Advonex has verified the lawyer's credentials (e.g., `barId`). This would likely be triggered by an internal process after the lawyer has completed their registration and submitted their `barId`. The frontend would simply display a "Advonex Verified" badge on the public profile if `isVerified` is true.

# session info with gemini(including decisions made):
- **`registrationPending` Flag:** The backend sets `registrationPending` to `true` by default. The frontend is responsible for setting this to `false` by sending `registrationPending: false` in the `PUT /profiles/lawyer` request only after the lawyer has successfully completed all steps of the registration process.
- **No Backend Changes for Step Tracking:** The backend does not need to be modified to track the user's current registration step. The frontend can determine the user's progress by fetching the lawyer's profile and checking which mandatory fields have been filled.
- **UX Flow:** We will proceed with a single, two-step registration flow (UX Flow 1). UX Flow 2 has been discarded.
- **Partial Registration:** The frontend will save the user's progress after Step 1 by sending a `PUT` request with the partial data. The `registrationPending` flag will remain `true`.
- **Dashboard Profile Editing:** The profile page on the dashboard will have a dedicated "edit mode." An "Edit Profile" button will make all fields editable, and a "Save Changes" button will submit all changes at once.
- **Stale Registrations:** A backend cron job is the agreed-upon solution for cleaning up incomplete registrations that have been pending for an extended period.