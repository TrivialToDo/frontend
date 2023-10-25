import { Event, Time } from "../data/interface";
import dayjs, { Dayjs } from "dayjs";


export const strDate = (date: Dayjs): string => {
    return date.format("YYYY-MM-DD");
};

export const parseDate = (str: string): Dayjs => {
    return dayjs(str, "YYYY-MM-DD");
};

export const strTime = (time: Time): string => {
    const fHour = dayjs().set("hour", time.Hour).format("HH");
    const fMinute = dayjs().set("minute", time.Minute).format("mm");
    return `${fHour}:${fMinute}`;
};

export const parseTime = (str: string): Time => {
    const time = dayjs(str, "HH:mm");
    return { Hour: time.hour(), Minute: time.minute() };
};

export const getMonday = (date: Dayjs): Dayjs => {
    const curWeekday = date.day() || 7;
    const mon = date.subtract(curWeekday - 1, "day");
    return mon;
};

export const getFirst = (date: Dayjs): Dayjs => {
    const curDay = date.date();
    const fir = date.subtract(curDay - 1, "day");
    return fir;
};

export const getWeekIter = (date: Dayjs): Dayjs[] => {
    let cur = getMonday(date);
    const week: Dayjs[] = [cur];
    for (let i = 1; i < 7; i += 1) {
        cur = cur.add(1, "day");
        week.push(cur);
    }
    return week;
};

export const getMonthIter = (date: Dayjs): Dayjs[] => {
    let cur = getFirst(date);
    const month: Dayjs[] = [cur];
    for (let i = 1; i < date.daysInMonth(); i += 1) {
        cur = cur.add(1, "day");
        month.push(cur);
    }
    return month;
};

export const checkUpcoming = (eventTime: Time, eventDate: Dayjs) => {
    const date = dayjs(`${strDate(eventDate)}T${strTime(eventTime)}:00`);
    const diff = date.diff(dayjs(), "minute");
    if (diff < 60 && diff > -60) {
        return 0;
    }
    return diff > 0 ? 1 : -1;
};


function rand(l: number, r: number, d?: string, ofs?: number): number {
    if (d === undefined || ofs === undefined) {
        return Math.floor(Math.random() * (r - l + 1)) + l;
    }
    const date = parseDate(d);
    const seed = date.year() * 5003 + date.month() * 401 + date.date() * 11 + ofs;
    const num = Math.sin(seed) * 1000;
    const rd = num - Math.floor(num);

    return Math.floor(rd * (r - l + 1)) + l;
}

export const MockEvent = (d: string, h: number, m: number): Event => {
    return { hash: `${d}T${h}:${m}-hash`, title: "untitled", description: "none", repeat: "never", timeStart: { Hour: h, Minute: m }, dateStart: d };
}

export const MockDayEvents = (d: string): Event[] => {
    const len = rand(0, 6, d, 23);
    const list: Event[] = [];
    for (let i = 0; i < len; i++) {
        list.push(MockEvent(d, rand(0, 23, d, i), rand(0, 59, d, i)));
    }
    list.sort((a, b) => {
        if (a.timeStart.Hour < b.timeStart.Hour || (a.timeStart.Hour == b.timeStart.Hour && a.timeStart.Minute < b.timeStart.Minute)) return -1;
        if (a.timeStart.Hour == b.timeStart.Hour && a.timeStart.Minute == b.timeStart.Minute) return 0;
        return 1;
    });
    // return [
    //     MockEvent(d, 9, 30),
    //     MockEvent(d, 12, 30),
    //     MockEvent(d, 18, 30),
    // ];
    return list;
};

export const MockWeekEvents = (d: string): Event[][] => {
    const week = getWeekIter(dayjs(d));
    const weekEvents: Event[][] = [];
    for (let i = 0; i < 7; i += 1) {
        weekEvents.push(MockDayEvents(strDate(week[i])));
    }
    return weekEvents;
}

export const MockMonthEvents = (d: string): Event[][] => {
    const date = dayjs(d);
    const month = getMonthIter(date);
    const monthEvents: Event[][] = [];
    for (let i = 0; i < date.daysInMonth(); i += 1) {
        monthEvents.push(MockDayEvents(strDate(month[i])));
    }
    return monthEvents;
}
