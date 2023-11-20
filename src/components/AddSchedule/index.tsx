// float button for adding new schedule

import { Button, DatePicker, Drawer, FloatButton, Form, Input, Modal, Select, Space, message } from "antd";
import { PlusOutlined, CloseOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Dayjs } from "dayjs";
import { Event, Time } from "../../data/interface";
import TextArea from "antd/es/input/TextArea";
import { WeekStr } from "../../data/constants";
import { strDate, strTime } from "../../utils/date";
import { isOk, request } from "../../utils/network";

interface AddScheduleProps {
    date: Dayjs;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    jwt: string;
}

export const AddSchedule = (props: AddScheduleProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const NewScheduleDrawer = ({ date: defaultDate, jwt: jwt, setLoading: setLoading }: AddScheduleProps) => {
        const [date, setDate] = useState<Dayjs>(defaultDate);
        const [repeat, setRepeat] = useState<"never" | "daily" | "weekly" | "monthly">("never");
        const [title, setTitle] = useState<string>();
        const [description, setDescription] = useState<string>();
        const [timeStart, setTimeStart] = useState<Time>({ Hour: defaultDate.hour(), Minute: defaultDate.minute() });
        const [timeEnd, setTimeEnd] = useState<Time>();
        const [dateEnd, setDateEnd] = useState<Dayjs>();

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

            };
            console.log("add event to schedule:", event);
            type NewScheduleResp = {
                hash: string;
            };
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
                    <div style={{ color: "grey" }}>Reminds at {strTime(timeStart)}{timeEnd ? ` - ${strTime(timeEnd)}` : ""} {repeat === "never" ? `on ${strDate(date)}`
                        :
                        (repeat === "daily" ?
                            "everyday" : (repeat === "weekly" ?
                                `every ${WeekStr[date.day() + 1]}` : `every ${date.date()}th`)
                        )}</div>
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
                        placeholder="untitled"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Description">
                    <TextArea
                        rows={4}
                        placeholder="no description"
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
                        defaultValue={date}
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
                <Form.Item style={{ marginTop: "5rem" }}>
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
            <NewScheduleDrawer date={props.date} setLoading={props.setLoading} jwt={props.jwt} />
        </Drawer >
        <FloatButton
            shape="circle"
            type="primary"
            style={{ right: 50 }}
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
        />
    </>;
};
