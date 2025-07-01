import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";

export default function Home() {
  //redirect to /client by default for / path
 redirect("/client");
  return (
    <>
      <h1>loading Advonex</h1>
    </>
  )
}
