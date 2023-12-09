import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
    const navigate = useNavigate();
    return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "15rem" }}>
        <div style={{ textAlign: "center", fontSize: "2rem", marginBottom: "2rem", fontWeight: "bold" }}>
            404 Not Found
        </div>
        <Button type="primary" size="large" onClick={() => { navigate("/login") }}>Back</Button>
    </div>;
}

export const NoSchedule = () => {
    const navigate = useNavigate();
    return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "15rem" }}>
        <div style={{ textAlign: "center", fontSize: "2rem", marginBottom: "2rem", fontWeight: "bold" }}>
            {"Failed to fetch schedule :("}
        </div>
        <Button type="primary" size="large" onClick={() => { navigate("/login") }}>Back</Button>
    </div>;
}

