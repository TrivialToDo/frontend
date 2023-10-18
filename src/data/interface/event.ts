export interface Event {
    hash: string;
    title: string;
    description: string;
    repeat: "never" | "daily" | "weekly" | "monthly";
    time: Time;
    dateStart: string;
}

export interface Time {
    Hour: number;
    Minute: number;
}
