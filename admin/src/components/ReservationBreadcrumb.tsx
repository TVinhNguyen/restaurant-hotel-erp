"use client";

import { Breadcrumb } from "antd";
import { useRouter } from "next/navigation";

interface ReservationBreadcrumbProps {
  reservationId: string;
  confirmationCode?: string;
  currentPage: string;
}

export function ReservationBreadcrumb({ 
  reservationId, 
  confirmationCode, 
  currentPage 
}: ReservationBreadcrumbProps) {
  const router = useRouter();

  const items = [
    {
      title: (
        <a onClick={() => router.push("/reservations")} style={{ cursor: "pointer" }}>
          Reservations
        </a>
      ),
    },
    {
      title: (
        <a 
          onClick={() => router.push(`/reservations/show/${reservationId}`)} 
          style={{ cursor: "pointer" }}
        >
          #{confirmationCode || reservationId}
        </a>
      ),
    },
    {
      title: currentPage,
    },
  ];

  return <Breadcrumb style={{ marginBottom: 16 }} items={items} />;
}
