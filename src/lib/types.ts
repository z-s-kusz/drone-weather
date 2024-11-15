export type Location = {
    id: string;
    name: string;
    isFavorite: boolean;
    lat: string;
    long: string;
}

export type WeatherData = {
    temp: number;
    wind10m: number;
    windGusts10m: number;
    wind80m?: number;
    precip: number;
};

export type WeatherCardData = {
    title: string;
    summary: string;
    score: number;
    link: string;
    weather?: WeatherData;
};

export type SnapshotSummary = {
    date: string;
    score: number;
    summary: string;
}

export type TimeSpanSumamryCard = {
    title: string;
    link?: string;
    summary: string;
    snapshots: SnapshotSummary[];
};
