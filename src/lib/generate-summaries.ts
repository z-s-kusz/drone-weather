import type { SnapshotSummary } from '$lib/types';

// let summary = 'Perfect weather for even the itty-bittiest little drone to fly outside!';
// let score = 5;
export function generateSnapshotSummary(weather: any): { summary: string, score: number} {
    let summary = '';
    let score = 0;

    if (weather.temperature2m <= 40) {
        summary = 'Too cold to fly tiny drones outside.';
        score = 0;
        return { summary, score };
    }
    if (weather.precipitation >= 66) {
        summary = 'Too wet to fly any drones outside.';
        score = 0;
        return { summary, score };
    }
    if (weather.wind10m >= 20) {
        summary = 'Too windy to fly tiny drones outside.'
        score = 0;
        return { summary, score };
    }

    if (weather.wind10m >= 14) {
        summary += 'Quite breezy. ';
        score += 1;
    } else if (weather.wind10m >= 9) {
        summary += 'Breezy. '
        score += 2;
    } else if (weather.wind10m >=4) {
        score+= 3;
    } else {
        summary+= 'Very low wind. '
        score += 4;
    }

    if (weather.wind_gusts_10m <= 14) {
        summary += 'Mild gusts. ';
    }else if (weather.windGusts10m <= 10) {
        summary += 'Super light gusts. ';
        score += 1;
    }

    if (weather.precipitation >= 33) {
        summary += 'Chance of precipitation. ';
    }
    return { summary, score };
}

export function generateTimeSpanSummary(weather: any): SnapshotSummary[] {
    return [];    
}
