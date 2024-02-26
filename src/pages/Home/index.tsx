import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export const Page = () => {
    const navigate = useNavigate();
    return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "15rem" }}>
        <div style={{ textAlign: "center", fontSize: "2rem", marginBottom: "2rem", fontWeight: "bold" }}>
            Welcome to TrivialTODO
        </div>
        <Button type="primary" size="large" onClick={() => { navigate("/login") }}>Login to Explore</Button>
    </div>;
}
