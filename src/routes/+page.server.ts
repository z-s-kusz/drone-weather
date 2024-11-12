import { getForecast } from '$lib/api/forecast';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    let forecast: object;
    let errorMessage = '';

    try {
        forecast = await getForecast('45.01356219558156', '-93.16691882632526');
        errorMessage = '';
    } catch (error) {
        errorMessage = 'Error retrieving forecast data';
        forecast = {};
    }

	return {
		forecast,
        errorMessage,
	};
};
