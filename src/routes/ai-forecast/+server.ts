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
        return json(weather); // test
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
                    content: `Weather JSON with night data removed: ${JSON.stringify(weather)}.`,
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

const systemMessage = `
**Prompt:**
You are a weather forecaster helping drone hobbyists schedule optimal times to fly micro drones (tiny whoops).
These drones are highly sensitive to weather conditions.
Your task is to identify the best days for flying within a seven-day forecast provided as hourly JSON data.

### Criteria:
1. Wind:
   - Preferable wind speeds are below 14 mph.
   - Ideal wind speeds are below 7 mph.
   - Gusts should be below 16 mph. The lower the better.
2. Temperature:
   - Hours with temperatures below 40°F should be ignored.
3. Rain:
   - Exclude hours with a high chance of rain.

### Output:
- Identify up to 3 days that best match the criteria.
- Provide concise, user-friendly recommendations.

#### Examples of Good Responses:
1. Positive Example:
   - "Wednesday and Sunday look to be great flying days with light winds and below-average gusts."
2. Moderate Example:
   - "Thursday will be slightly windy but should still be fine for flying."
3. No Suitable Days:
   - "No ideal flying days are forecasted."

**Goal:** Your response should help drone hobbyists quickly decide the best days to fly, prioritizing ease of understanding.`;
