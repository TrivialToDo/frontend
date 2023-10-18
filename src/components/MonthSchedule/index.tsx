// schedule form displayed in week mode

import { useEffect, useState } from "react";
import { ScheduleProps } from "../../pages/Schedule";
import { MockMonthEvents, strDate, strTime } from "../../utils/date";
import { Event } from "../../data/interface";
import { Card, Button, Calendar, Badge, Popover, Divider } from "antd";
import { CaretLeftFilled, CaretRightFilled, ClockCircleFilled } from "@ant-design/icons";
import { MonthStr } from "../../data/constants";
import { Dayjs } from "dayjs";

export const MonthSchedule = (props: ScheduleProps) => {
    const date = props.date;
    const [eventList, setEventList] = useState<Event[][]>(MockMonthEvents(strDate(date)));
    const [loading, setLoading] = useState<boolean>(false);
    console.log(strDate(props.date));
    useEffect(() => {
        // request event list of the day
        console.log("get event list:", strDate(date));
        setEventList(MockMonthEvents(strDate(date)));
    }, [date]);

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
        return (
            <div style={{ textAlign: "center" }}>
                {dayEvents.map((e, idx) => (
                    <div key={idx} >
                        <Popover
                            content={
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {e.description}
                                    <Divider plain style={{ marginTop: "6px", marginBottom: "4px" }} />
                                    <div style={{ color: "grey", display: "flex", justifyContent: "flex-end" }}>
                                        <ClockCircleFilled style={{ color: "grey", marginRight: "4px" }} />
                                        {strTime(e.time)}
                                    </div>
                                </div>
                            }
                            title={e.title}
                            trigger="click"
                        >
                            <Badge color={d.isSame(props.date) ? "blue" : "grey"} style={{ marginRight: "3px" }} />
                            {e.title}
                        </Popover>
                    </div >
                ))}
            </div >
        );
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
