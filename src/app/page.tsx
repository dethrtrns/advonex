"use client";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
// import { useEffect } from "react";

export default function Home() {
  // check active appside from auth context and redirect accordingly
  const { activeAppSide } = useAuth();

  if (activeAppSide === "LAWYER") {
    redirect("/lawyer");
  } else {
    redirect("/client");
  }
  //redirect to /client by default for / path
  // useEffect(() => {
  //   if (activeAppSide === "LAWYER") {
  //     redirect("/lawyer");
  //   } else {
  //     redirect("/client");
  //   }
  // }, []);
  // redirect("/client");
  return (
    <>
      <h1>loading Advonex</h1>
    </>
  );
}
