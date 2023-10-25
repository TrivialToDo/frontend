export interface Event {
    hash: string;
    title: string;
    description: string;
    repeat: "never" | "daily" | "weekly" | "monthly";
    timeStart: Time;
    timeEnd?: Time;
    dateStart: string;
    dateEnd?: string;
}

export interface Time {
    Hour: number;
    Minute: number;
}
