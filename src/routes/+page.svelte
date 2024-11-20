<script lang="ts">
	import { browser } from '$app/environment';
	import WeatherCard from '$lib/components/WeatherCard.svelte';
	import { getMainLocation, initializeDefaultLocation } from '$lib/utility/locations-storage.js';
	import { defaultWeatherCardData } from '$lib/utility/weather-card-data-builder.js';
	import type { Location, WeatherCardData } from '$lib/types.js';
	import { getWeather, getSevenDaySummaryAI } from '$lib/api/forecast';
	import { formatDateShort } from '$lib/utility/dates';

    let location: Location | null = $state(null);
    let current: WeatherCardData = $state(defaultWeatherCardData('Current'));
    let sevenDaySummary = $state('');
    let sevenDayAISummary = $state('');
    let error = $state('');

    if (browser) {
        location = getMainLocation() || initializeDefaultLocation();
    }

    $effect(() => {
        getAllData();
    });

    async function getAllData() {
        if (!location) return;

        try {
            current = await getWeather(location, 'current') as WeatherCardData;
            sevenDaySummary = await getWeather(location, 'sevenDay') as string;
            sevenDayAISummary = await getSevenDaySummaryAI(location);
            error = '';
        } catch(error) {
            error = 'Error fetching data. Refresh to try again.';
        }
    }
</script>

{#if error}
    <p class="error">{error}</p>
{/if}

{#if !location}
    <a href="/manage-locations">Add a location to get started!</a>
{:else}
    <h2>{location.name} | {formatDateShort(new Date())}</h2>
{/if}

<WeatherCard title="Current" summary={current.summary} weather={current.weather} score={current.score}/>

<WeatherCard title="7 Day Forecast" summary={sevenDaySummary} />

<WeatherCard title="7 Day Forecast" isAI={true} summary={sevenDayAISummary} />

<style>
    .error {
        padding: 2rem;
        font-size: 24px;
    }
</style>
