import type { OpenMeteoGroupedData, OpenMeteoTimeSpanData } from '$lib/types';
import { formatDateShort } from './dates';
import { bestWindSpeedMax, okGustsMax, okWindSpeedMax, worstAlllowedWindSpeedMax, worstAllowedGustsMax } from './ideal-weather-settings';

export function generateSnapshotSummary(weather: any): { summary: string, score: number} {
    let summary = '';
    let score = 0;

    if (weather.temperature <= 40) {
        summary = 'Too cold to fly tiny drones outside.';
        score = 0;
        return { summary, score };
    }
    if (weather.precipitation >= 66) {
        summary = 'Too wet to fly any drones outside.';
        score = 0;
        return { summary, score };
    }
    if (weather.wind >= 20) {
        summary = 'Too windy to fly tiny drones outside.'
        score = 0;
        return { summary, score };
    }

    if (weather.wind <= bestWindSpeedMax) {
        score = 4;
        summary = 'Very light winds';
    } else if (weather.wind <= okWindSpeedMax) {
        score = 3;
        summary = 'Lighter winds'
    } else if (weather.wind <= worstAlllowedWindSpeedMax) {
        score = 2;
        summary += 'Windy';
    } else {
        score = 0;
        summary += 'Very windy';
    }

    if (weather.gusts <= okGustsMax) {
        score++;
        summary += ' with very light gusts.';
    } else if (weather.gusts <= worstAllowedGustsMax) {
        summary += ' with moderate gusts.';
    } else {
        summary += ' with strong gusts.';
    }

    if (weather.precipitation >= 33) {
        summary += ' Chance of precipitation.';
    }
    return { summary, score };
}

export function generateTimeSpanSummary(weather: OpenMeteoTimeSpanData): string {
    weather = filterBadTimes(weather);
    const weatherByDays = splitIntoDays(weather);

    let fiveStarHours: string[] = [];
    let fourStarHours: string[] = [];
    let finalSummary = '';

    weatherByDays.forEach((day) => {
        day.weather.time.forEach((item, i) => {
            const { summary, score } = generateSnapshotSummary({
                precipitation: day.weather.precipitation[i],
                tempurature: day.weather.temperature[i],
                wind: day.weather.wind[i],
                gusts: day.weather.gusts[i],
            });
            if (score === 5) fiveStarHours.push(day.label);
            if (score === 4) fourStarHours.push(day.label);
        });
    });

    const fiveCount = fiveStarHours.length;
    const fourCount = fourStarHours.length;

    if (!fiveCount && !fourCount) {
        return 'No especially good flying days forecasted.';
    }

    if (fiveCount) {
        finalSummary += `${fiveCount} great flying time${pluralize(fiveCount)} forecasted on ${listDaysOut(fiveStarHours)}`;
    }
    // only list fourStarDays if there are not many five star.
    if (fourCount && fiveCount < 3) {
        finalSummary += `${fourCount} fair flying time${pluralize(fourCount)} forecasted on ${listDaysOut(fourStarHours)}`
    }
    return finalSummary;   
}

export function filterBadTimes(weather: OpenMeteoTimeSpanData): OpenMeteoTimeSpanData {
    let filteredWeather: OpenMeteoTimeSpanData = {
        time: [],
        temperature: [],
        wind: [],
        gusts: [],
        precipitation: [],
    };

    for (let i = 0; i < weather.time.length; i++) {
        let removeItem = false;

        if (weather.precipitation[i] >= 20) removeItem = true;
        if (weather.temperature[i] < 40) removeItem = true;
        if (weather.gusts[i] > worstAllowedGustsMax) removeItem = true;
        if (weather.wind[i] > worstAlllowedWindSpeedMax) removeItem = true;

        if (!removeItem) {
            Object.keys(weather).forEach((key) => {
                // @ts-ignore get yo shit together typescript
                filteredWeather[key].push(weather[key]);
            });
        }
    }

    return filteredWeather;
}

export function splitIntoDays(weather: OpenMeteoTimeSpanData): OpenMeteoGroupedData[] {
    const days: OpenMeteoGroupedData[] = [];

    weather.time.forEach((time, i) => {
        const precipitation = weather.precipitation[i];
        const temperature = weather.temperature[i];
        const wind = weather.wind[i];
        const gusts = weather.gusts[i];
        const shortLabel = formatDateShort(new Date(time));
        let parentDay = days.find((day) => day.label === shortLabel);

        if (parentDay) {
            parentDay.weather.precipitation.push(precipitation);
            parentDay.weather.temperature.push(temperature);
            parentDay.weather.wind.push(wind);
            parentDay.weather.gusts.push(gusts);
            parentDay.weather.time.push(time);
        } else {
            parentDay = {
                label: shortLabel,
                weather: {
                    precipitation: [precipitation],
                    temperature: [temperature],
                    wind: [wind],
                    gusts: [gusts],
                    time: [time],
                },
            };
            days.push(parentDay);
        }
    });

    return days;
}

function pluralize(count: number): string {
    return count === 1 ? '' : 's';
}

function listDaysOut(days: string[]): string {
    const dedupedDays: string[] = [];
    days.forEach((day) => {
        if (!dedupedDays.includes(day)) dedupedDays.push(day);
    });

    if (dedupedDays.length === 1) {
        return `${dedupedDays[0]}.\n`;
    } else {
        let message = 'the following days: \n';
        dedupedDays.forEach((day, i) => {
            // handle last day separatly
            // if (i === dedupedDays.length - 1) return message += `${day} \n`;
            message += `${day} \n`;
        });
        return message;
    }
}
