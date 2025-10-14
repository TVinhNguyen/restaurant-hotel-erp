import { Header } from "@components/header";
import { ThemedLayoutV2 } from "@refinedev/antd";
import React from "react";

export default function Layout({ children }: React.PropsWithChildren) {
  return <ThemedLayoutV2 Header={Header}>{children}</ThemedLayoutV2>;
}
