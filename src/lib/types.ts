export type Location = {
    id: string;
    name: string;
    isFavorite: boolean;
    lat: string;
    long: string;
}

export type WeatherData = {
    temperature: number;
    wind: number;
    gusts: number;
    precipitation: number;
};

export type WeatherCardData = {
    title: string;
    summary: string;
    score: number;
    link: string;
    weather?: WeatherData;
};

export type OpenMeteoTimeSpanData = {
    time: string[];
    temperature?: number[];
    precipitation?: number[];
    wind: number[];
    gusts: number[];
}

export type OpenMeteoGroupedData = {
    label: string;
    weather: OpenMeteoTimeSpanData;
};
