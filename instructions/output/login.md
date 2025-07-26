## login plan

 - create login flow as a custom hook(useLogin hook), that exposes these values:
    - open: to open the login modal programmatically wherever this hook is used.
    - close: to close/cancel.
    - loggingIn: boolean to animate, blur, or skelleton the background while the login screen is open(login flow is ongoing).
    - (suggest what else you can think of)

 - the login screen should be mobile first in design hence display like a screen on mobile devices, but on desktop it should display as a modal/dialog with a glassy-blur background by default which can be overridden via props.
 - the flow contains a single email input(validation, error handling, etc. included for all inputs) with request OTP button(after one click the button should go into loading/disabled state for 30 seconds to avoid race conditions), after successfull request it shows the enter otp screen with modern 6 digit otp input field, retry send otp button(30 second buffer/wait time between requests) and a submit/login button that once clicked goes into loading/disabled state until login flow is completed(either success or failure).
 - the role value(expected by backend endpoint and hence in helper functions) is set/sent according to the activeAppSide state of useAuth context/hook.
 - success flow: request otp verification from backend endpoint(use util functions present in utils folder), then login using the login method of useAuth context/hook(to update the app login state). close the modal/screen(so the user is back where they triggered the login flow from).
 - failure flow: show appropriate error message to user and enable the submit/login button so user can retry.
 - optional: animated text(appropraite text according to current action state, like after request otp click, a "sending OTP on your email" type of animated text/aninimation with text) loading indicators while the actions(request OTP action, and verifying and logging you in action) are under process.

 - the screen/modal should also have a "skip login" button to close the modal whenever the user wants(without signing in, after successful sign in/up the modal is closed automatically/by-default).

# important notes/rules to follow:
- create everything(related components,types or helper functions, etc. if not already found in existing files and hence need to be created, should all be in new files in same dir, which i will manually review and then move to appropriate file/folder) in src/hooks/login folder.
- Do not make any changes outside src/hooks/login.
- you can use existing code but do not modify existing codebase without permission or explicit command to do so.
- go through all code/files: in src/contexts and src/utils to understand the codebase and plan implementation that uses functions existing in these files rather than writing everything from scratch.
- Write clean and readable code with proper comments explaining what's going on.
- If needed extract/optimize code/relevant-parts into other places if a single file exceeds 200-300 lines.
- show me your plan before you begin implementations.
- DO NOT make any assumptions, ask me whatever/whenever you need to before/during implementation.

 # util updates todo:
 - review request and verify functions in utils/backend/auth.ts