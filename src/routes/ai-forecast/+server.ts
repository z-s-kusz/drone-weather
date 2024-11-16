import { OPENAI_API_KEY } from '$env/static/private';
import { getSevenDayWeatherData } from '$lib/server/get-open-meteo-data.js';
import { error, json } from '@sveltejs/kit';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

export async function GET({ url }): Promise<any> {
    // values not garunteed but non-numbers passed to parseFloat will result in NaN
    let lat = parseFloat(url.searchParams.get('lat')!);
    let long = parseFloat(url.searchParams.get('long')!);

    if (Number.isNaN(lat) || Number.isNaN(long)) {
        return error(400, '"lat" and "long" are requred and must be numbers.');
    }

    try {
        const weather = await getSevenDayWeatherData(lat, long);
        const forecast = await getAIForecast(weather);
        return json(forecast);
    } catch (error) {
        // @ts-ignore no idea why i have to ignore this one
        return error(500, 'Error getting ai forecast.');
    }
}

async function getAIForecast(weather: any): Promise<string> {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemMessage },
                {
                    role: 'user',
                    content: `Weather JSON: ${JSON.stringify(weather)}.`,
                },
            ],
            model: 'gpt-4o-mini',
        });

        const summary = completion.choices[0].message.content!;
        return summary;
    } catch (error) {
        console.error(error);
        throw new Error('getAIForecast error.');
    }
}

const maxAllowedWindSpeed = 12;
const idealWindSpeedMax = 6;
const gustsMax = 16;
const minTemp = 40;

const systemMessage = `
Prompt:
You're a weather forecaster helping hobbyists find optimal times to fly tiny drones.
These drones are very sensitive to weather conditions.
Your task is to identify the best days for flying within a seven-day forecast provided as hourly JSON data.
Your response should help hobbyists decide the best days to fly, prioritizing ease of understanding.

Criteria:
* Wind:
   - Preferable wind speeds are below ${maxAllowedWindSpeed} mph.
   - Ideal wind speeds are below ${idealWindSpeedMax} mph.
   - Gusts should be below ${gustsMax} mph. The lower the better.
* Temp:
   - Hours with temperatures below ${minTemp}°F should be ignored.
* Rain:
   - Exclude hours with a high chance of rain.

Output:
- Identify up to 3 days that best match the criteria.
- Provide concise recommendations.
- Don't mention tempurature, it's assumed any day mentioned is warm enough.
- Don't mention rain, it's assumed any day mentioned has a low/no chance of rain.

Example Responses:
* "Wednesday and Sunday look to be great flying days with light winds and below-average gusts."
* "Thursday will be slightly windy but should still be fine for flying."
* "No ideal flying days are forecasted."`;
