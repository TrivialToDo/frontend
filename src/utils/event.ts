import { Event } from "../data/interface";
import { isOk, request } from "./network";

export const getEventList = async (
    date: string,
    jwt: string,
    mode: "day" | "week" | "month",
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setEventList: React.Dispatch<React.SetStateAction<Event[][]>>,
    setErrMsg: React.Dispatch<React.SetStateAction<string | undefined>>,
) => {
    setLoading(true);
    // POST login
    console.log("get event:", date, mode);
    type GetEventResp = {
        list: Event[][];
    };
    const resp = await request<GetEventResp>(
        `/api/schedule/${mode}/${date}`,
        "GET", undefined, jwt
    );

    if (!isOk(resp)) {
        setErrMsg(resp.data.msg);
        setLoading(false);
        return;
    }

    setEventList(resp.data.list);
    setLoading(false);
};



