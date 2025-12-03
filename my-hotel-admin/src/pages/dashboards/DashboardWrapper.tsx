import { useEffect, useState } from "react";
import { Spin } from "antd";
import { DashboardAdmin } from "./admin";
import { DashboardFrontDesk } from "./front-desk";

const USER_KEY = "refine-user";

export const DashboardWrapper: React.FC = () => {
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRoles = () => {
            try {
                const userStr = localStorage.getItem(USER_KEY);
                console.log("DashboardWrapper - userStr:", userStr);
                if (userStr) {
                    const userData = JSON.parse(userStr);
                    console.log("DashboardWrapper - userData:", userData);
                    console.log("DashboardWrapper - userData.roles:", userData.roles);
                    
                    // roles có thể là array of strings hoặc array of objects
                    const roles = userData.roles || [];
                    const roleNames = roles
                        .map((r: string | { name: string } | null | undefined) => {
                            if (!r) return null;
                            return typeof r === 'string' ? r : r.name;
                        })
                        .filter((name: string | null): name is string => name !== null && name !== undefined);
                    
                    console.log("DashboardWrapper - roleNames:", roleNames);
                    setUserRoles(roleNames);
                }
            } catch (error) {
                console.error("Error fetching user roles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRoles();
    }, []);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    console.log("DashboardWrapper - Final userRoles:", userRoles);

    // Check if user is Admin
    const isAdmin = userRoles.some(role => 
        role?.toLowerCase() === "admin" || 
        role?.toLowerCase() === "administrator" ||
        role?.toLowerCase() === "property manager"
    );

    // Check if user is Front Desk / Receptionist
    const isFrontDesk = userRoles.some(role => {
        const r = role?.toLowerCase();
        return r === "front desk" ||
            r === "front-desk" ||
            r === "frontdesk" ||
            r === "receptionist" ||
            r === "lễ tân" ||
            r === "le tan";
    });

    console.log("DashboardWrapper - isAdmin:", isAdmin, "isFrontDesk:", isFrontDesk);

    // Admin gets Admin dashboard
    if (isAdmin) {
        return <DashboardAdmin />;
    }

    // Front Desk gets Front Desk dashboard
    if (isFrontDesk) {
        return <DashboardFrontDesk />;
    }

    // Default: Front Desk dashboard (for other roles that work with reservations)
    return <DashboardFrontDesk />;
};
