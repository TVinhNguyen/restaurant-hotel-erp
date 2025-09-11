"use client";

import { Tag } from "antd";

interface StatusBadgeProps {
  status: string;
  type?: 'reservation' | 'payment';
}

export function StatusBadge({ status, type = 'reservation' }: StatusBadgeProps) {
  const getReservationStatusConfig = (status: string) => {
    const configs = {
      pending: { color: "orange", text: "PENDING" },
      confirmed: { color: "blue", text: "CONFIRMED" },
      checked_in: { color: "green", text: "CHECKED IN" },
      checked_out: { color: "gray", text: "CHECKED OUT" },
      cancelled: { color: "red", text: "CANCELLED" },
      no_show: { color: "volcano", text: "NO SHOW" },
    };
    
    return configs[status as keyof typeof configs] || { color: "default", text: status.toUpperCase() };
  };

  const getPaymentStatusConfig = (status: string) => {
    const configs = {
      unpaid: { color: "red", text: "UNPAID" },
      partial: { color: "orange", text: "PARTIAL" },
      paid: { color: "green", text: "PAID" },
      refunded: { color: "purple", text: "REFUNDED" },
      authorized: { color: "blue", text: "AUTHORIZED" },
      captured: { color: "green", text: "CAPTURED" },
      voided: { color: "volcano", text: "VOIDED" },
    };
    
    return configs[status as keyof typeof configs] || { color: "default", text: status.toUpperCase() };
  };

  const config = type === 'payment' 
    ? getPaymentStatusConfig(status)
    : getReservationStatusConfig(status);

  return (
    <Tag color={config.color}>
      {config.text}
    </Tag>
  );
}
