"use client";

import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LoginLayout({
  children,
}: React.PropsWithChildren) {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    console.log("Login layout token:", token);

    if (token) {
      // User is logged in, redirect to main page
      window.location.href = '/';
      return;
    }

    setIsChecking(false);
  }, []);

  // Show loading while checking
  if (isChecking) {
    return <div>Checking authentication...</div>;
  }

  return <>{children}</>;
}
