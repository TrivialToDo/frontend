import { Divider, Modal, Popover, Tag, message } from "antd";
import { Event } from "../../data/interface";
import { Dayjs } from "dayjs";
import { ClockCircleFilled } from "@ant-design/icons";
import { strTime } from "../../utils/date";
import { useState } from "react";
import { deleteEvent } from "../../utils/event";
import Link from "antd/es/typography/Link";

interface EventThumbnailProps {
    events: Event[];
    date?: Dayjs;
    hour?: number;
    jwt: string;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const EventThumbnail = (props: EventThumbnailProps) => {
    // const strD = props.date ? props.date.format("YYYY-MM-DD") : undefined;
    // const hour = props.hour === undefined ? -1 : props.hour;
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [selectEvent, setSelectEvent] = useState<Event>();
    const [bloading, setBLoading] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string>();
    const DeleteConfirm = () => {
        const e = selectEvent;
        // console.log("select event: ", e?.hash);
        return e && <Modal
            zIndex={999}
            okText={"Delete"}
            open={showConfirm}
            onOk={() => { deleteEvent(e.hash, props.jwt, props.setLoading, setErrMsg, setSelectEvent, setBLoading) }}
            onCancel={() => { setShowConfirm(false); setSelectEvent(undefined); }}
            okButtonProps={{ loading: bloading, children: <div>delete</div> }}
        >
            <div style={{ display: "flex", flexDirection: "row", marginTop: "0.7rem" }}>Are you sure to delete {
                <div style={{ fontWeight: "bolder", marginLeft: "0.3rem", marginRight: "0.3rem" }}>
                    {e.title}
                </div>
            } from your schedule? </div>
        </Modal>;
    };

    if (errMsg) {
        message.info(`Failed to delete: ${errMsg}`);
    }
    return <div style={{ textAlign: "center" }}>
        {
            showConfirm && <DeleteConfirm />
        }
        {
            props.events.map((e, idx) => {
                // const active = (strD === undefined || (strD === e.dateStart || (strD > e.dateStart && e.dateEnd && strD <= e.dateEnd)))
                //     && (hour === -1 || (hour === e.timeStart.Hour || (hour > e.timeStart.Hour && e.timeEnd && hour <= e.timeEnd.Hour)));
                return <div key={idx}>
                    <Popover
                        zIndex={10 + idx}
                        content={
                            <div style={{ display: "flex", flexDirection: "column", width: "15rem" }}>
                                <div style={{ minHeight: "3rem", marginLeft: "0.1rem" }}>{e.description}</div>
                                <Divider plain style={{ marginTop: "6px", marginBottom: "4px" }} />
                                <div style={{ color: "grey", display: "flex", justifyContent: "flex-end" }}>
                                    <ClockCircleFilled style={{ color: "grey", marginRight: "4px" }} />
                                    {strTime(e.timeStart)}
                                    {e.timeEnd && `-${strTime(e.timeEnd)}`}
                                </div>
                            </div>
                        }
                        title={<div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem" }}>
                            <div style={{ marginLeft: "0.1rem" }}>{e.title}</div>
                            <div style={{ display: "flex", justifyContent: "flex-end", fontSize: "1.2rem", marginTop: "0.2rem" }}>
                                <Link onClick={() => {

                                }} target="_blank" style={{ marginRight: "0.8rem" }}>
                                    Edit
                                </Link>
                                <Link onClick={() => {
                                    setSelectEvent(e);
                                    setShowConfirm(true);
                                    console.log("attemping to delete: ", e.hash);
                                }} target="_blank">
                                    Delete
                                </Link>
                            </div>
                        </div>}
                        trigger="click"
                        onOpenChange={(v) => {
                            setShowConfirm(false);
                            setSelectEvent(v ? e : undefined);
                        }}
                    >
                        <Tag closeIcon
                            onClose={(_) => {
                                _.preventDefault();
                                setSelectEvent(e);
                                setShowConfirm(true);
                                console.log("attemping to delete: ", e.hash);
                            }}
                            color={selectEvent?.hash === e.hash ? "#108ee9" : ""}
                            style={{ height: "1.5rem", alignContent: "center", marginBottom: "0.3rem" }}
                        >
                            {/*TODO: tooltip?*/}
                            {e.title.slice(0, 8)}
                        </Tag>
                        {/* <Badge color={active ? "blue" : "grey"} style={{ marginRight: "3px" }} /> */}
                        {/* {e.title} */}
                    </Popover>
                </div >;
            })
        }
        {/* {
            <Tag style={{ borderStyle: "dashed", height: "1.5rem", alignContent: "center" }}
                icon={<PlusOutlined />}
                onClick={() => {
                    // TODO: open post bar and pass current date
                }}
            >
                New Event
            </Tag>
        } */}
    </div >;
};

export default EventThumbnail;
