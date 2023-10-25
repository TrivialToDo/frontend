import { Badge, Divider, Popover } from "antd";
import { Event } from "../data/interface";
import { Dayjs } from "dayjs";
import { ClockCircleFilled } from "@ant-design/icons";
import { strTime } from "./date";

export const EventJSX = (props: { events: Event[], date?: Dayjs, hour?: number }) => {
    const strD = props.date ? props.date.format("YYYY-MM-DD") : undefined;
    const hour = props.hour === undefined ? -1 : props.hour;
    return <div style={{ textAlign: "center" }}>
        {
            props.events.map((e, idx) => {
                const active = (strD === undefined || (strD === e.dateStart || (strD > e.dateStart && e.dateEnd && strD <= e.dateEnd)))
                    && (hour === -1 || (hour === e.timeStart.Hour || (hour > e.timeStart.Hour && e.timeEnd && hour <= e.timeEnd.Hour)));
                return <div key={idx} >
                    <Popover
                        content={
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {e.description}
                                <Divider plain style={{ marginTop: "6px", marginBottom: "4px" }} />
                                <div style={{ color: "grey", display: "flex", justifyContent: "flex-end" }}>
                                    <ClockCircleFilled style={{ color: "grey", marginRight: "4px" }} />
                                    {strTime(e.timeStart)}
                                    {e.timeEnd && `-${strTime(e.timeEnd)}`}
                                </div>
                            </div>
                        }
                        title={e.title}
                        trigger="click"
                    >
                        <Badge color={active ? "blue" : "grey"} style={{ marginRight: "3px" }} />
                        {e.title}
                    </Popover>
                </div >;
            })
        }
    </div >;
};
