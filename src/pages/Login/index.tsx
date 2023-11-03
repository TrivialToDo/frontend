// TODO: get clipboard contents

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isOk, request } from '../../utils/network';
import { useAppState } from '../../state';
import { Self } from '../../data/interface';
import { Alert, Input, Spin } from 'antd';
import { UserOutlined } from "@ant-design/icons";

export const Page = () => {
    const [value, setValue] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string>();
    const navigate = useNavigate();
    const { self, setSelf } = useAppState();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    const onLogin = async (token: string | undefined) => {
        if (!token) return;
        setLoading(true);
        // POST login
        console.log("login:", token);
        type LoginResp = Self;
        const loginResp = await request<LoginResp>(
            "/api/login",
            "POST",
            { token: token },
        );

        if (!isOk(loginResp)) {
            setErrMsg(loginResp.data.msg);
            setLoading(false);
            return;
        }

        setSelf(loginResp.data);

        navigate("/schedule");
        setLoading(false);
    };

    useEffect(() => {
        if (self !== null) {
            console.log(self);
            navigate("/schedule");
        }
        if (token !== null) {
            console.log("token=", token);
            onLogin(token);
        }
    });

    return <Spin spinning={loading} size="large">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "15rem" }}>
            <div style={{ textAlign: "center", fontSize: "2rem", marginBottom: "1rem", fontWeight: "bold" }}>
                Login
            </div>
            <Input
                size="large"
                style={{ width: "50%" }}
                placeholder="Input your token"
                value={value}
                onChange={(e) => { setValue(e.target.value); }}
                onPressEnter={() => onLogin(value)}
                prefix={<UserOutlined />}
            />
            {
                errMsg && <Alert
                    message={errMsg}
                    type="info"
                />
            }
        </div >
    </Spin>;
}
