import { useEffect, useState } from "react";
import { ModeSelect } from "../../components/ModeSelect";
import dayjs, { Dayjs } from "dayjs";
import { DisplayMode } from "../../data/interface";
import { DaySchedule } from "../../components/DaySchedule";
import { AddSchedule } from "../../components/AddSchedule";
import { WeekSchedule } from "../../components/WeekSchedule";
import { MonthSchedule } from "../../components/MonthSchedule";
import { useAppState } from "../../state";
import { Alert } from "antd";
// import { useNavigate } from "react-router-dom";

export interface ScheduleProps {
    date: Dayjs;
    setDate: React.Dispatch<React.SetStateAction<Dayjs>>;
    jwt: string;
    setErrMsg: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const Page = () => {
    const [mode, setMode] = useState<DisplayMode>("week");
    const [date, setDate] = useState<Dayjs>(dayjs());
    const { self } = useAppState();
    // const navigate = useNavigate();
    const [jwt, setJwt] = useState<string>("");
    const [errMsg, setErrMsg] = useState<string>();

    useEffect(() => {
        if (self === null) {
            console.error("not logged in");
            // alert("请先登录");
            // navigate("/login");
        }
        else {
            setJwt(self.jwt);
        }
    }, [self, setJwt]);


    return <div style={{ display: "flex", flexDirection: "column" }}>
        {/* schedule page */}
        {/* <div>{`mode:${mode}  you selected: ${date.format("YYYY-MM-DD")}`}</div> */}
        <div style={{ justifyContent: "center", display: "flex", marginTop: "5vh" }}>
            {
                errMsg && <Alert
                    message={errMsg}
                    type="info"
                    style={{ width: "80%" }}
                />
            }
        </div>
        {mode === "day" && <div style={{ justifyContent: "center", display: "flex", marginTop: "2vh", marginBottom: "20vh" }}>
            <DaySchedule date={date} setDate={setDate} jwt={jwt} setErrMsg={setErrMsg} />
        </div>}
        {mode === "week" && <div style={{ justifyContent: "center", display: "flex", marginTop: "2vh", marginBottom: "20vh" }}>
            <WeekSchedule date={date} setDate={setDate} jwt={jwt} setErrMsg={setErrMsg} />
        </div>}
        {mode === "month" && <div style={{ justifyContent: "center", display: "flex", marginTop: "2vh", marginBottom: "20vh" }}>
            <MonthSchedule date={date} setDate={setDate} jwt={jwt} setErrMsg={setErrMsg} />
        </div>}
        <ModeSelect mode={mode} setMode={setMode} date={date} setDate={setDate} />
        <AddSchedule />
    </div>;
}
