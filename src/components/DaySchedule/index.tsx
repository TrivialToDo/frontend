// schedule form displayed in day mode

import { Dayjs } from 'dayjs';
import { Event } from '../../data/interface';
import { useEffect, useState } from 'react';
import { MockDayEvents, checkUpcoming, strDate, strTime } from '../../utils/date';
import { Card, Button, Timeline, Collapse } from "antd";
import { CaretLeftFilled, CaretRightFilled, ClockCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { ScheduleProps } from '../../pages/Schedule';

const EventItem = (e: Event, idx: number, date: Dayjs) => {
    const upc = checkUpcoming(e.time, date);
    return <Timeline.Item
        key={idx}
        color={upc > 0 ? "grey" : "blue"}
        dot={upc === 0 && <LoadingOutlined />}
    >
        <div style={{ width: "20%", textAlign: "left" }}>
            {strTime(e.time)}
        </div>,
        <div style={{ marginBottom: "20px" }}>
            <Collapse items={
                [
                    {
                        key: e.hash,
                        label: e.title,
                        children: e.description,
                    }
                ]
            } />
        </div>
    </Timeline.Item>;
};

export const DaySchedule = (props: ScheduleProps) => {
    const date = props.date;
    const dateStr = strDate(props.date);
    const [eventList, setEventList] = useState<Event[]>(MockDayEvents(dateStr));
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        // request event list of the day
        console.log("get event list:", strDate(date));
        setEventList(MockDayEvents(strDate(date)));
    }, [date]);

    const onChangeDate = (type: "forward" | "backward") => {
        if (type === "forward") {
            props.setDate(date.add(1, "day"));
        }
        else {
            props.setDate(date.subtract(1, "day"));
        }
    };

    return <>
        <Card
            title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Button
                        icon={<CaretLeftFilled />}
                        type="text"
                        onClick={() => onChangeDate("backward")}
                    />
                    <span>{dateStr}</span>
                    <Button
                        icon={<CaretRightFilled />}
                        type="text"
                        onClick={() => onChangeDate("forward")}
                    />
                </div>
            }
            style={{ width: "80%", overflow: "overlay" }}
            type="inner"
            loading={loading}
            bodyStyle={{ textAlign: "left", width: "100%" }}
        >
            <div style={{ marginTop: "5%", marginBottom: "5%", marginLeft: "10%", marginRight: "10%" }}>
                <Timeline
                    style={{ width: "100%", float: "left" }}
                    mode="left"
                >
                    <Timeline.Item key={-1} dot={<ClockCircleFilled />} color="blue">
                        <div style={{ width: "20%", textAlign: "left", height: "3vh" }} />
                    </Timeline.Item>
                    {eventList.map((e: Event, idx: number) => EventItem(e, idx, props.date))}
                    <Timeline.Item key={-2} color="grey">
                        <div style={{ width: "20%", textAlign: "left" }}>
                        </div>
                    </Timeline.Item>
                </Timeline>
            </div>
        </Card >
    </>;
};