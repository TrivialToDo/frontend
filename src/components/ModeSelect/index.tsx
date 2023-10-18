// switch for day/week mode, displays calendar

import { FloatButton, Calendar, theme, CalendarProps } from "antd";
import { CalendarOutlined } from "@ant-design/icons";

import { Dayjs } from "dayjs";
import { useState } from "react";
import { DisplayMode } from "../../data/interface";


interface ModeSelectProps {
    mode: DisplayMode;
    setMode: React.Dispatch<React.SetStateAction<DisplayMode>>;
    date: Dayjs;
    setDate: React.Dispatch<React.SetStateAction<Dayjs>>;
}

const CalendarCard = (props: ModeSelectProps) => {
    // const selectDateStr = strDate(props.date);
    const [value, setValue] = useState<Dayjs>(props.date);
    const { token } = theme.useToken();
    const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {
        console.log(value.format("YYYY-MM-DD"), mode);
    };
    const onSelect = (nVal: Dayjs) => {
        console.log("select date:", nVal.format("YYYY-MM-DD"));
        setValue(nVal);
        props.setDate(nVal);
    };
    const wrapperStyle: React.CSSProperties = {
        width: 300,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
    };
    return <>
        <div style={wrapperStyle}>
            <Calendar
                fullscreen={false}
                onPanelChange={onPanelChange}
                onSelect={onSelect}
                value={value}
            />
        </div>
    </>;
};

export const ModeSelect = (props: ModeSelectProps) => {
    // const [showCalendar, setShowCalendar] = useState(false);
    const select = (mode: DisplayMode) => {
        console.log("select mode:", mode);
        props.setMode(mode);
    };
    return <>
        <FloatButton.Group
            trigger="click"
            type="primary"
            shape="circle"
            style={{ left: 50 }}
            icon={<CalendarOutlined />}
        // tooltip="选择日期"
        >
            <CalendarCard
                setMode={props.setMode}
                setDate={props.setDate}
                date={props.date}
                mode={props.mode}
            />
        </FloatButton.Group>
        <FloatButton
            shape="circle"
            style={{ left: 120 }}
            icon={false}
            description="D"
            onClick={() => select("day")}
            type={props.mode === "day" ? "primary" : "default"}
        // tooltip="日期视图"
        />
        <FloatButton
            shape="circle"
            style={{ left: 190 }}
            icon={false}
            description="W"
            onClick={() => select("week")}
            type={props.mode === "week" ? "primary" : "default"}
        // tooltip="星期视图"
        />
        <FloatButton
            shape="circle"
            style={{ left: 260 }}
            icon={false}
            description="M"
            onClick={() => select("month")}
            type={props.mode === "month" ? "primary" : "default"}
        // tooltip="月份视图"
        />
    </>;
}
