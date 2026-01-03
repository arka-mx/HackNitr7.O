import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function GuestRoute({ children }: { children: React.ReactNode }) {
    const { currentUser } = useAuth();

    if (currentUser) {
        return <Navigate to="/landing" replace />;
    }

    return <>{children}</>;
}
