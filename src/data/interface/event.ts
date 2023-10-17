export interface Event {
    hash: string;
    title: string;
    description: string;
    repeat: "never" | "daily" | "weekly" | "monthly";
    time: Time;
    dateStart: Date;
}

export interface Time {
    Hour: number;
    Minute: number;
}

export interface Date {
    Year: number;
    Month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    Week: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    Day: number;
}
