// schedule form displayed in week mode

import { useEffect, useState } from "react";
import { ScheduleProps } from "../../pages/Schedule";
import { MockMonthEvents, strDate } from "../../utils/date";
import { Event } from "../../data/interface";
import { Card, Button, Calendar } from "antd";
import { CaretLeftFilled, CaretRightFilled } from "@ant-design/icons";
import { MonthStr } from "../../data/constants";
import { Dayjs } from "dayjs";
import EventThumbnail from "../EventThumbnail";
import { getEventList } from "../../utils/event";

export const MonthSchedule = (props: ScheduleProps) => {
    const date = props.date;
    const [eventList, setEventList] = useState<Event[][]>(MockMonthEvents(strDate(date)));
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        // request event list of the month

        const str = strDate(date);
        console.log("get event list:", str);
        if (props.jwt.length === 0) {
            setEventList(MockMonthEvents(str));
        }
        else {
            getEventList(str, props.jwt, "month", setLoading, setEventList, props.setErrMsg);
        }
    }, [date, props.jwt, props.setErrMsg]);

    const onChangeMonth = (type: "forward" | "backward") => {
        if (type === "forward") {
            props.setDate(date.add(1, "month"));
        }
        else {
            props.setDate(date.subtract(1, "month"));
        }
    };

    const onSelect = (nVal: Dayjs) => {
        console.log("calendar select date:", nVal.format("YYYY-MM-DD"));
        props.setDate(nVal);
    };

    const cellRender = (d: Dayjs) => {
        if (d.month() !== props.date.month() || d.date() > eventList.length) {
            return <></>;
        }
        const dayEvents = eventList[d.date() - 1];
        return <EventThumbnail events={dayEvents} date={props.date} jwt={props.jwt} setLoading={props.setLoading} />;
    };

    return <>
        <Card
            title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Button
                        icon={<CaretLeftFilled />}
                        type="text"
                        onClick={() => onChangeMonth("backward")}
                    />
                    <span>{`${props.date.year()} ${MonthStr[props.date.month() + 1]}`}</span>
                    <Button
                        icon={<CaretRightFilled />}
                        type="text"
                        onClick={() => onChangeMonth("forward")}
                    />
                </div>
            }
            style={{ width: "80%", overflow: "overlay" }}
            type="inner"
            loading={loading}
            bodyStyle={{ textAlign: "center", width: "100%" }}
        >
            <div style={{ marginTop: "5%", marginBottom: "5%", marginLeft: "10%", marginRight: "10%" }}>
                <Calendar
                    mode="month"
                    headerRender={() => <></>}
                    value={date}
                    onSelect={onSelect}
                    cellRender={cellRender}
                />
            </div>
        </Card >
    </>;
};
