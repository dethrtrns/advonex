import { RegisterDialog } from "@/components/auth/register-dialog";
import SwipeUpDrawer from "@/components/custom/SwipeUpDrawer";
import { SwipableSidebar } from "@/components/layout/SwipableSidebar";
import { LoginModal } from "@/hooks/login/login-modal";

export default function Login() {
  return (
    <div>
      {/* <LoginModal /> */}
      <SwipeUpDrawer
        isOpen={true}
        closeButtonText="Close"
        title="Hello"
        description="This is a description">
        <h2>hey there</h2>
      </SwipeUpDrawer>
    </div>
  );
}
