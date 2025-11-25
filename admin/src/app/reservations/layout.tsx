"use client";

import { Header } from "@components/header";
import { ThemedLayoutV2 } from "@refinedev/antd";
import { Authenticated } from "@refinedev/core";
import React from "react";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <Authenticated key="reservations-layout" redirectOnFail="/login">
      <ThemedLayoutV2 Header={Header}>{children}</ThemedLayoutV2>
    </Authenticated>
  );
}
