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
    wind80m: number;
    precip: number;
};

export type WeatherCardData = {
    title: string;
    summary: string;
    link: string;
    weather: WeatherData;
};
