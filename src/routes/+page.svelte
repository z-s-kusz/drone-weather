<script lang="ts">
	import { browser } from '$app/environment';
	import WeatherCard from '$lib/components/WeatherCard.svelte';
	import { getMainLocation } from '$lib/locations-storage.js';
	import { defaultWeatherCardData } from '$lib/weather-card-data-builder.js';
	import type { Location, WeatherCardData } from '$lib/types.js';
	import { getCurrentWeather, getSevenDaySummaryAI } from '$lib/api/forecast';

    let location: Location | null = $state(null);
    let current: WeatherCardData = $state(defaultWeatherCardData('Current'));
    let sevenDaySummary = $state('');
    let error = $state('');

    if (browser) {
        location = getMainLocation();
    }

    $effect(() => {
        getAllData();
    });

    async function getAllData() {
        if (!location) return;

        try {
            current = await getCurrentWeather(location);
            sevenDaySummary = await getSevenDaySummaryAI(location);
            error = '';
        } catch(error) {
            error = 'Error fetching data. Refresh to try again.';
        }
    }
</script>

{#if error}
    <p>{error}</p>
{/if}

{#if !location}
    <a href="/manage-locations">Add a location to get started!</a>
{/if}

<h2>{location?.name}</h2>

<WeatherCard title="Current" summary={current.summary} weather={current.weather} score={current.score}/>

<WeatherCard title="7 Day AI Forecast" summary={sevenDaySummary} />

<style>
    h2 {
        text-align: center;
        border: none;
    }
</style>
