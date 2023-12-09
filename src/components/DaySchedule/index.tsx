// schedule form displayed in day mode
// TODO: add event button

import { Dayjs } from 'dayjs';
import { Event } from '../../data/interface';
import { useEffect, useState } from 'react';
import { MockDayEvents, checkUpcoming, strDate, strTime } from '../../utils/date';
import { Card, Button, Steps, Modal, message, Tooltip } from "antd";
import { CaretLeftFilled, CaretRightFilled, ClockCircleFilled, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ScheduleProps } from '../../pages/Schedule';
import { deleteEvent, getEventList } from '../../utils/event';

// const EventItem = (e: Event, idx: number, date: Dayjs) => {
//     const upc = checkUpcoming(e.timeStart, date);
//     return <Timeline.Item
//         key={idx}
//         color={upc > 0 ? "grey" : "blue"}
//         dot={upc === 0 && <LoadingOutlined />}
//     >
//         <div style={{ width: "20%", textAlign: "left" }}>
//             {strTime(e.timeStart)}
//         </div>,
//         <div style={{ marginBottom: "20px" }}>
//             <Collapse items={
//                 [
//                     {
//                         key: e.hash,
//                         label: e.title,
//                         children: e.description,
//                     }
//                 ]
//             } />
//         </div>
//     </Timeline.Item>;
// };

// const EventTimeLine = (eventList: Event[][], date: Dayjs) => {
//     return <Timeline
//         style={{ width: "100%", float: "left" }}
//         mode="left"
//     >
//         <Timeline.Item key={-1} dot={<ClockCircleFilled />} color="blue">
//             <div style={{ width: "20%", textAlign: "left", height: "3vh" }} />
//         </Timeline.Item>
//         {eventList[0].map((e: Event, idx: number) => EventItem(e, idx, date))}
//         <Timeline.Item key={-2} color="grey">
//             <div style={{ width: "20%", textAlign: "left" }}>
//             </div>
//         </Timeline.Item>
//     </Timeline>;
// };

export const DaySchedule = (props: ScheduleProps) => {
    const DeleteConfirm = () => {
        const e = selectEvent;
        const [bloading, setBLoading] = useState<boolean>(false);
        const [errMsg, setErrMsg] = useState<string>();
        if (errMsg) {
            message.info(`Failed to delete: ${errMsg}`);
        }
        return e && <Modal
            zIndex={999}
            okText={"Delete"}
            open={showConfirm}
            onOk={() => { deleteEvent(e.hash, props.jwt, props.setLoading, setErrMsg, setSelectEvent, setBLoading); }}
            onCancel={() => { setShowConfirm(false); }}
            okButtonProps={{ loading: bloading, children: <div>delete</div> }}
        >
            <div style={{ display: "flex", flexDirection: "row", marginTop: "0.7rem" }}>Are you sure to delete {
                <div style={{ fontWeight: "bolder", marginLeft: "0.3rem", marginRight: "0.3rem" }}>
                    {e.title}
                </div>
            } from your schedule? </div>
        </Modal>;
    };
    const EventItem2 = (
        e: Event,
        id: number,
        selId: number | undefined,
        date: Dayjs,
    ) => {
        const upc = checkUpcoming(e.timeStart, date);
        const status = upc === 0 ? "process" : upc > 0 ? "wait" : "finish";
        return <Steps.Step
            key={id}
            title={
                <div style={{ marginLeft: "0.2rem", width: "80rem", display: "flex", flexDirection: "row" }}>
                    {selId === id && <div>
                        <Tooltip title="Edit" placement="top" arrow={false}>
                            <Button shape="circle" style={{ marginLeft: "0.3rem" }} icon={<EditOutlined />}
                                onClick={() => {
                                    props.setEventBase(e);
                                    props.setOpenAddBar(true);
                                    // TODO: edit
                                }}
                            />
                        </Tooltip>
                        {/* <Button shape="circle" style={{ marginLeft: "0.5rem" }} icon={<DeleteOutlined />} /> */}
                    </div>}
                    <Tooltip title="Click to modify" placement="topLeft">
                        <div style={{ marginLeft: "1.2rem", fontSize: "1.1rem", fontWeight: "Bolder", marginBottom: "0.5rem" }}>
                            {`${strTime(e.timeStart)} - ${e.title}`}
                        </div>
                    </Tooltip>
                </div >
            }
            description={
                < div style={{ marginLeft: "1.6rem", width: "80rem", marginTop: "1rem", marginBottom: "1.5rem" }}>
                    {e.description}
                </div >
            }

            icon={selId === id ?
                <Tooltip title="Delete" placement="top" arrow={false}>
                    <Button shape="circle" icon={<DeleteOutlined />} onClick={
                        () => {
                            setSelectEvent(e);
                            setShowConfirm(true)
                        }
                    } />
                </Tooltip>
                :
                undefined
                // status === "wait" ? <ClockCircleFilled /> : undefined
            }
            status={status}
        >
        </Steps.Step >;
    };
    const date = props.date;
    const dateStr = strDate(props.date);
    const [eventList, setEventList] = useState<Event[][]>([MockDayEvents(dateStr)]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [selectEvent, setSelectEvent] = useState<Event>();
    useEffect(() => {
        // request event list of the day
        const str = strDate(date);
        console.log("get event list:", str);
        if (props.jwt.length === 0) {
            setEventList([MockDayEvents(str)]);
        }
        else {
            getEventList(str, props.jwt, "day", setLoading, setEventList, props.setErrMsg);
        }
    }, [date, props.jwt, props.setErrMsg]);


    const onChangeDate = (type: "forward" | "backward") => {
        if (type === "forward") {
            props.setDate(date.add(1, "day"));
        }
        else {
            props.setDate(date.subtract(1, "day"));
        }
    };

    const EventProgress = () => {
        const [selId, setSelId] = useState<number>();
        return <>
            <Steps
                onChange={(cur) => setSelId((id) => { return id === cur ? undefined : cur })}
                direction="vertical"
            >
                {[<Steps.Step key={0} status="finish" title={
                    <div style={{ marginLeft: "0.2rem", width: "80rem", display: "flex", flexDirection: "row" }}>
                        <div style={{ marginLeft: "1.2rem", fontSize: "1.5rem", fontWeight: "Bolder", marginBottom: "2rem" }}>
                            {"Events of the Day"}
                        </div>

                    </div>
                } />].concat(
                    eventList[0].map((e: Event, idx: number) => EventItem2(e, idx + 1, selId, props.date))
                ).concat([<Steps.Step key={999} icon={<ClockCircleFilled />} />])}
            </Steps>
        </>;
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
                    <div style={{ fontSize: "1.1rem" }}>{dateStr}</div>
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
                <DeleteConfirm />
                <EventProgress />
                {/* <EventTimeLine /> */}
            </div>
        </Card >
    </>;
};