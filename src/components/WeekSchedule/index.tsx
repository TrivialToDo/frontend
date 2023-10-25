// schedule form displayed in week mode
// TODO: highlight selected column and set date
// TODO: add event button

import { ScheduleProps } from "../../pages/Schedule";
import { Card, Button, Table } from "antd"
import { CaretLeftFilled, CaretRightFilled, ClockCircleFilled } from "@ant-design/icons";
import { MonthStr, WeekStr } from "../../data/constants";
import React, { useEffect, useState } from "react";
import { Event } from "../../data/interface";
import { MockWeekEvents, getMonday, strDate } from "../../utils/date";
import type { ColumnsType } from 'antd/es/table';
import { EventJSX } from "../../utils/eventRender";

interface TableData {
    key: string;
    time: string;
    [k: number]: JSX.Element;
}

export const WeekSchedule = (props: ScheduleProps) => {
    // return <>TODO: week schedule</>;
    const [date, setDate] = useState(getMonday(props.date));
    const [eventList, setEventList] = useState<Event[][]>();
    const [loading, setLoading] = useState<boolean>(false);
    // console.log(strDate(date));
    const [data, setData] = useState<TableData[]>();

    useEffect(() => {
        // request event list of the day
        setDate(getMonday(date));
        console.log("get event list:", strDate(date));
        setEventList(MockWeekEvents(strDate(date)));
    }, [props.date]);

    useEffect(() => {
        if (!eventList) return;
        setData(Array.from({ length: 24 }, (_, idx) => {
            const tmp: TableData = { key: `${idx} o'clock`, time: `${idx}:00` };
            for (let i = 0; i < 7; i += 1) {
                const list: Event[] = [];
                for (let j = 0; j < eventList[i].length; j += 1) {
                    const e = eventList[i][j];
                    if (e.timeStart.Hour === idx ||
                        e.timeStart.Hour <= idx && e.timeEnd && e.timeEnd.Hour >= idx) {
                        list.push(e);
                    }
                }
                tmp[i] = <EventJSX events={list} hour={idx} />;
            }
            return tmp;
        }));
    }, [eventList]);

    const onChangeWeek = (type: "forward" | "backward") => {
        if (type === "forward") {
            props.setDate(date.add(1, "week"));
        }
        else {
            props.setDate(date.subtract(1, "week"));
        }
    };


    const columns: ColumnsType<TableData> = Array.from({ length: 8 }, (_, idx) => {
        if (idx) return {
            title: `${WeekStr[idx]} ${date.date() + idx - 1}`,
            dataIndex: [idx - 1],
            key: idx,
            ellipsis: true,
            fixed: true,
            selectable: true,
            clickable: true,
        };
        return {
            title: "",
            dataIndex: "time",
            key: -1,
            rowScope: "row",
            fixed: true,
            ellipsis: true,
        };
    });

    return <>
        <Card
            title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Button
                        icon={<CaretLeftFilled />}
                        type="text"
                        onClick={() => onChangeWeek("backward")}
                    />
                    <span>{`${props.date.year()} ${MonthStr[props.date.month() + 1]}`}</span>
                    <Button
                        icon={<CaretRightFilled />}
                        type="text"
                        onClick={() => onChangeWeek("forward")}
                    />
                </div>
            }
            style={{ width: "80%", overflow: "overlay" }}
            type="inner"
            loading={loading}
            bodyStyle={{ textAlign: "center", width: "100%" }}
        >
            <div style={{ marginTop: "5%", marginBottom: "5%", marginLeft: "10%", marginRight: "10%" }}>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    bordered
                    tableLayout="fixed"
                />
            </div>
        </Card >
    </>;
};
