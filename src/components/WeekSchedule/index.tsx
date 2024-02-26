// schedule form displayed in week mode
// TODO: highlight selected column and set date
// TODO: add event button

import { ScheduleProps } from "../../pages/Schedule";
import { Card, Button, Table } from "antd"
import { CaretLeftFilled, CaretRightFilled } from "@ant-design/icons";
import { MonthStr, WeekStr } from "../../data/constants";
import { useEffect, useState } from "react";
import { Event } from "../../data/interface";
import { MockWeekEvents, getMonday, strDate } from "../../utils/date";
import type { ColumnsType } from 'antd/es/table';
import EventThumbnail from "../EventThumbnail";
import { getEventList } from "../../utils/event";

interface TableData {
    key: string;
    time: string;
    [k: number]: JSX.Element;
}

export const WeekSchedule = (props: ScheduleProps) => {
    // return <>TODO: week schedule</>;
    const [date, setDate] = useState(getMonday(props.date));
    const [eventList, setEventList] = useState<Event[][]>(MockWeekEvents(strDate(date)));
    const [loading, setLoading] = useState<boolean>(false);
    // console.log(strDate(date));
    const [data, setData] = useState<TableData[]>();

    useEffect(() => {
        // request event list of the day
        const mon = getMonday(props.date);
        setDate(mon);
    }, [props.date]);

    useEffect(() => {
        const str = strDate(date);
        console.log("get event list:", str);
        if (props.jwt.length === 0) {
            setEventList(MockWeekEvents(str));
        }
        else {
            getEventList(str, props.jwt, "week", setLoading, setEventList, props.setErrMsg);
        }
    }, [date, props.jwt, props.setErrMsg]);

    useEffect(() => {
        if (!eventList) return;
        setData(Array.from({ length: 24 }, (_, idx) => {
            const tmp: TableData = { key: `${idx} o'clock`, time: `${idx}:00` };
            for (let i = 0; i < 7; i += 1) {
                const list: Event[] = [];
                for (let j = 0; j < eventList[i].length; j += 1) {
                    const e = eventList[i][j];
                    if (e.timeStart.hour === idx ||
                        e.timeStart.hour <= idx && e.timeEnd && e.timeEnd.hour >= idx) {
                        list.push(e);
                    }
                }
                tmp[i] = <EventThumbnail events={list} hour={idx} jwt={props.jwt}
                    setLoading={props.setLoading}
                    setAddBarOpen={props.setOpenAddBar}
                    setEventBase={props.setEventBase} />;
            }
            return tmp;
        }));
    }, [eventList, props]);

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
                    <div style={{ fontSize: "1.1rem" }}>{`${props.date.year()} ${MonthStr[props.date.month() + 1]}`}</div>
                    <Button
                        icon={<CaretRightFilled />}
                        type="text"
                        onClick={() => onChangeWeek("forward")}
                    />
                </div>
            }
            style={{ width: "70%", overflow: "overlay" }}
            type="inner"
            loading={loading}
            bodyStyle={{ textAlign: "center", width: "100%" }}
            id="schedule-table"
        >
            <div style={{ marginTop: "5%", marginBottom: "5%", marginLeft: "5%", marginRight: "5%", textAlign: "center", justifyContent: "center" }}>
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

