import { useEffect, useState } from "react";
import { ModeSelect } from "../../components/ModeSelect";
import dayjs, { Dayjs } from "dayjs";
import { DisplayMode, Event } from "../../data/interface";
import { DaySchedule } from "../../components/DaySchedule";
import { AddSchedule } from "../../components/AddSchedule";
import { WeekSchedule } from "../../components/WeekSchedule";
import { MonthSchedule } from "../../components/MonthSchedule";
import { useAppState } from "../../state";
import { Alert, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";

export interface ScheduleProps {
    date: Dayjs;
    setDate: React.Dispatch<React.SetStateAction<Dayjs>>;
    jwt: string;
    setErrMsg: React.Dispatch<React.SetStateAction<string | undefined>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenAddBar: React.Dispatch<React.SetStateAction<boolean>>;
    setEventBase: React.Dispatch<React.SetStateAction<Event | undefined>>;
}

export const Page = () => {
    const [mode, setMode] = useState<DisplayMode>();
    const [date, setDate] = useState<Dayjs>(dayjs());
    const { self } = useAppState();
    const navigate = useNavigate();
    const [jwt, setJwt] = useState<string>("");
    const [errMsg, setErrMsg] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [openAddBar, setOpenAddBar] = useState<boolean>(false);
    const [eventBase, setEventBase] = useState<Event>();

    useEffect(() => {
        if (self === null) {
            console.error("not logged in");
            // alert("请先登录");
            message.info("Please login to view schedule");
            navigate("/login");
        }
        else {
            setJwt(self.jwt);
        }
    }, [self, setJwt, navigate]);

    useEffect(() => {
        if (errMsg === "invalid JWT" || errMsg === "token expired") {
            console.error("not logged in");
            // alert("请先登录");
            message.info("Login expired");
            navigate("/login");
        }
    }, [errMsg, navigate]);


    return <Spin spinning={loading} size="large">
        <div style={{ display: "flex", flexDirection: "column" }}>
            {/* schedule page */}
            {/* <div>{`mode:${mode}  you selected: ${date.format("YYYY-MM-DD")}`}</div> */}
            <div style={{ justifyContent: "center", display: "flex", marginTop: "5vh" }}>
                {
                    errMsg && <Alert
                        message={`- ${errMsg}`}
                        type="info"
                        style={{ width: "80%" }}
                    />
                }
            </div>
            {(mode === "day" || !mode) && <div style={{ justifyContent: "center", display: "flex", marginTop: "2vh", marginBottom: "20vh" }}>
                <DaySchedule date={date} setDate={setDate} jwt={jwt} setErrMsg={setErrMsg} setLoading={setLoading} setOpenAddBar={setOpenAddBar} setEventBase={setEventBase} />
            </div>}
            {mode === "week" && <div style={{ justifyContent: "center", display: "flex", marginTop: "2vh", marginBottom: "20vh" }}>
                <WeekSchedule date={date} setDate={setDate} jwt={jwt} setErrMsg={setErrMsg} setLoading={setLoading} setOpenAddBar={setOpenAddBar} setEventBase={setEventBase} />
            </div>}
            {mode === "month" && <div style={{ justifyContent: "center", display: "flex", marginTop: "2vh", marginBottom: "20vh" }}>
                <MonthSchedule date={date} setDate={setDate} jwt={jwt} setErrMsg={setErrMsg} setLoading={setLoading} setOpenAddBar={setOpenAddBar} setEventBase={setEventBase} />
            </div>}
            <ModeSelect mode={mode ? mode : "day"} setMode={setMode} date={date} setDate={setDate} />
            <AddSchedule date={date} setLoading={setLoading} jwt={jwt} open={openAddBar} setOpen={setOpenAddBar} eventBase={eventBase} />
        </div>
    </Spin>;
}
