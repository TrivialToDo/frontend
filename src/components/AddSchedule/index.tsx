// float button for adding new schedule

import { Button, DatePicker, Drawer, FloatButton, Form, Input, Modal, Select, Space, TimePicker, Tooltip, message } from "antd";
import { PlusOutlined, CloseOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Event, Time } from "../../data/interface";
import TextArea from "antd/es/input/TextArea";
import { WeekStr } from "../../data/constants";
import { strDate, strTime } from "../../utils/date";
import { isOk, request } from "../../utils/network";

interface AddScheduleProps {
    date: Dayjs;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    jwt: string;
    eventBase?: Event;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddSchedule = (props: AddScheduleProps) => {
    // const [open, setOpen] = useState<boolean>(false);
    const setOpen = props.setOpen;
    const open = props.open;
    const NewScheduleDrawer = ({ date: defaultDate, jwt: jwt, setLoading: setLoading }: AddScheduleProps) => {
        const [date, setDate] = useState<Dayjs>(props.eventBase ? dayjs(props.eventBase.dateStart) : defaultDate);
        const [repeat, setRepeat] = useState<"never" | "daily" | "weekly" | "monthly">(props.eventBase ? props.eventBase.repeat : "never");
        const [title, setTitle] = useState<string | undefined>(props.eventBase?.title);
        const [description, setDescription] = useState<string | undefined>(props.eventBase?.description);
        const [timeStart, setTimeStart] = useState<Time>(props.eventBase ? props.eventBase.timeStart
            : { Hour: defaultDate.hour(), Minute: defaultDate.minute() });
        const [timeEnd, setTimeEnd] = useState<Time | undefined>(props.eventBase?.timeEnd);
        const [reminder, setReminder] = useState<Time | undefined>(props.eventBase?.reminder);
        const [dateEnd, setDateEnd] = useState<Dayjs | undefined>(props.eventBase ? dayjs(props.eventBase.dateEnd) : undefined);

        // const [errMsg, setErrMsg] = useState<string>();
        const [showConfirm, setShowConfirm] = useState<boolean>(false);

        const onCheckForm = () => {
            if (title === undefined) {
                // setErrMsg("Please fill in the title. ");
                message.info("Please fill in the title. ");
                return;
            }
            if (title.length > 50) {
                message.info("Title too long: title length should not exceed 50. ");
                return;
            }
            setShowConfirm(true);
        };
        const onSubmit = async () => {
            setLoading(true);
            setShowConfirm(false);
            const event: Event = {
                hash: "",
                title: title ? title : "Untitled",
                description: description ? description : "",
                repeat: repeat,
                timeStart: timeStart,
                timeEnd: timeEnd,
                dateStart: date.format("YYYY-MM-DD"),
                dateEnd: dateEnd?.format("YYYY-MM-DD"),
                reminder: reminder,
            };
            type NewScheduleResp = {
                hash: string;
            };
            if (props.eventBase) {
                console.log("modify event: ", props.eventBase.hash, event);
                const resp = await request<NewScheduleResp>(
                    "/api/event/modify",
                    "POST",
                    { hash: props.eventBase.hash, event: event }, jwt
                );
                setLoading(false);
                if (!isOk(resp)) {
                    message.info(`Request failed: ${resp.data.msg}`);
                    return;
                }
                setOpen(false);
                message.info(`Event ${resp.data.hash.substring(0, 7)} modified`);
            }
            else {
                console.log("add event to schedule:", event);
                const resp = await request<NewScheduleResp>(
                    "/api/event/new",
                    "POST",
                    { event: event }, jwt
                );
                setLoading(false);
                if (!isOk(resp)) {
                    message.info(`Request failed: ${resp.data.msg}`);
                    return;
                }
                setOpen(false);
                message.info(`Event ${resp.data.hash.substring(0, 7)} added to your schedule`);
            }
        };
        return <div style={{
            display: "flex",
            flexDirection: "row",
            width: "90%",
            alignItems: "top",
            alignSelf: "center",
            marginLeft: "5rem"
        }}>
            <Modal open={showConfirm} onOk={onSubmit} onCancel={() => setShowConfirm(false)}>
                <div style={{ display: "flex", flexDirection: "row", marginTop: "0.7rem" }}>You are adding {
                    <div style={{ fontWeight: "bolder", marginLeft: "0.3rem", marginRight: "0.3rem" }}>
                        {`${title ? title : "Untitled"}`}
                    </div>
                } to your schedule. </div>
                <div style={{ display: "flex", flexDirection: "row", marginTop: "0.7rem" }}>
                    <ClockCircleOutlined style={{ color: "grey", marginRight: "0.5rem" }} />
                    <div style={{ color: "grey" }}>
                        Reminds at
                        {" "}
                        {reminder ? strTime(reminder) :
                            `${strTime(timeStart)}${timeEnd ? ` - ${strTime(timeEnd)}` : ""}`}
                        {" "}
                        {repeat === "never" ? `on ${strDate(date)}`
                            :
                            (repeat === "daily" ?
                                "everyday" : (repeat === "weekly" ?
                                    `every ${WeekStr[date.day() + 1]}` : `every ${date.date()}th`)
                            )}
                    </div>
                </div>
            </Modal>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ width: "50%" }}
            >
                <Form.Item required label="Title">
                    <Input
                        placeholder="Enter a title to your event"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Description">
                    <TextArea
                        rows={4}
                        placeholder="Enter event description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    // onPressEnter={() => { }}
                    />
                </Form.Item>
                <Form.Item label="Repeat">
                    <Select
                        defaultValue={"never"}
                        onChange={(e) => {
                            if (e === "never" || e === "weekly" || e === "daily" || e === "monthly") {
                                setRepeat(e);
                            }
                        }}>
                        <Select.Option value="never">never</Select.Option>
                        <Select.Option value="daily">daily</Select.Option>
                        <Select.Option value="weekly">weekly</Select.Option>
                        <Select.Option value="monthly">monthly</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ width: "50%" }}
            >
                <Form.Item required label="Start From">
                    <DatePicker
                        showTime
                        onChange={(e) => {
                            if (e) {
                                setDate(e);
                                setTimeStart({ Hour: e.hour(), Minute: e.minute() });
                            }
                        }}
                        showToday={false}
                        defaultValue={dayjs(`${date.format("YYYY-MM-DD")} ${strTime(timeStart)}`)}
                    />
                </Form.Item>
                <Form.Item label="End at">
                    {/* <Date /> */}
                    <DatePicker
                        disabledDate={(d) => {
                            return d.isBefore(date);
                        }}
                        showTime
                        onChange={(e) => {
                            if (e) {
                                setDateEnd(e);
                                setTimeEnd({ Hour: e.hour(), Minute: e.minute() });
                            }
                        }}
                        showToday={false}
                        showSecond={false}
                    />
                </Form.Item>
                <Form.Item label="Remind me at">
                    <TimePicker defaultValue={reminder ? dayjs(strTime(reminder)) : undefined} format="HH:mm" onChange={(e) => {
                        if (e) {
                            setReminder({ Hour: e.hour(), Minute: e.minute() });
                        }
                    }} />
                </Form.Item>
                <Form.Item style={{ marginTop: "1rem" }}>
                    <Button type="primary" onClick={onCheckForm} style={{ marginLeft: "5rem" }} size="large">
                        Save
                    </Button>
                    <Button type="default" onClick={() => setOpen(false)} style={{ marginLeft: "2rem" }} size="large">
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>;
    };
    return <>
        <Drawer
            title="New Schedule"
            placement="bottom"
            closable={false}
            onClose={() => setOpen(false)}
            open={open}
            key="bottom"
            closeIcon={<CloseOutlined />}
            extra={
                <Space>
                    <CloseOutlined onClick={() => { setOpen(false) }} />
                </Space>
            }
        >
            <NewScheduleDrawer date={props.date} setLoading={props.setLoading} jwt={props.jwt} open={open} setOpen={setOpen} />
        </Drawer >
        <Tooltip title="Add new schedule" placement="left" arrow>
            <FloatButton
                shape="circle"
                type="primary"
                style={{ right: 50 }}
                icon={<PlusOutlined />}
                onClick={() => setOpen(true)}
            />
        </Tooltip>
    </>;
};
