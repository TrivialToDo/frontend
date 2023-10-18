import { useState } from "react";
import { ModeSelect } from "../../components/ModeSelect";
import dayjs, { Dayjs } from "dayjs";
import { DisplayMode } from "../../data/interface";
import { DaySchedule } from "../../components/DaySchedule";
import { AddSchedule } from "../../components/AddSchedule";
import { WeekSchedule } from "../../components/WeekSchedule";
import { MonthSchedule } from "../../components/MonthSchedule";

export interface ScheduleProps {
    date: Dayjs;
    setDate: React.Dispatch<React.SetStateAction<Dayjs>>;
}

export const Page = () => {
    const [mode, setMode] = useState<DisplayMode>("week");
    const [date, setDate] = useState<Dayjs>(dayjs());
    return <div style={{ display: "flex", flexDirection: "column" }}>
        {/* schedule page */}
        {/* <div>{`mode:${mode}  you selected: ${date.format("YYYY-MM-DD")}`}</div> */}
        {mode === "day" && <div style={{ justifyContent: "center", display: "flex", marginTop: "5vh", marginBottom: "20vh" }}>
            <DaySchedule date={date} setDate={setDate} />
        </div>}
        {mode === "week" && <div style={{ justifyContent: "center", display: "flex", marginTop: "5vh", marginBottom: "20vh" }}>
            <WeekSchedule date={date} setDate={setDate} />
        </div>}
        {mode === "month" && <div style={{ justifyContent: "center", display: "flex", marginTop: "5vh", marginBottom: "20vh" }}>
            <MonthSchedule date={date} setDate={setDate} />
        </div>}
        <ModeSelect mode={mode} setMode={setMode} date={date} setDate={setDate} />
        <AddSchedule />
    </div>;
}
