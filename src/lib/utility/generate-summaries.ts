import type { SnapshotSummary } from '$lib/types';

// let summary = 'Perfect weather for even the itty-bittiest little drone to fly outside!';
// let score = 5;
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

    if (weather.wind <= 4) {
        score = 4;
        summary = 'Very light winds';
    } else if (weather.wind <= 8) {
        score = 3;
        summary = 'Lighter winds'
    } else if (weather.wind <= 12) {
        score = 2;
        summary += 'Windy';
    } else if (weather.wind <= 16) {
        score = 1;
        summary += 'Ver windy but flyable';
    } else {
        score = 0;
        summary += 'Very windy'
    }

    if (weather.gusts <= 8) {
        score++;
        summary += ' with very light gusts';
    } else if (weather.gusts <= 16) {
        summary += 'with moderate gusts';
    } else {
        summary += ' with strong gusts.';
    }

    if (weather.precipitation >= 33) {
        summary += ' Chance of precipitation.';
    }
    return { summary, score };
}

export function generateTimeSpanSummary(weather: any): SnapshotSummary[] {
    return [];    
}
