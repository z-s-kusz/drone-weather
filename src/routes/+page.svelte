<script lang="ts">
	import { browser } from '$app/environment';
	import WeatherCard from '$lib/components/WeatherCard.svelte';
	import { getMainLocation, initializeDefaultLocation } from '$lib/utility/locations-storage.js';
	import { defaultWeatherCardData } from '$lib/utility/weather-card-data-builder.js';
	import type { Location, WeatherCardData } from '$lib/types.js';
	import { getCurrentWeather, getSevenDaySummaryAI } from '$lib/api/forecast';

    let location: Location | null = $state(null);
    let current: WeatherCardData = $state(defaultWeatherCardData('Current'));
    let sevenDaySummary = $state('');
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
            current = await getCurrentWeather(location);
            sevenDaySummary = await getSevenDaySummaryAI(location);
            error = '';
        } catch(error) {
            error = 'Error fetching data. Refresh to try again.';
        }
    }

    function getTodaysDate(): string {
        const date = new Date();
        const day = date.toLocaleDateString('default', { weekday: 'short' });
        const month = date.toLocaleString('default', { month: 'short' });
        return `${day} ${month} ${date.getUTCDate()}`;
    }
</script>

{#if error}
    <p class="error">{error}</p>
{/if}

{#if !location}
    <a href="/manage-locations">Add a location to get started!</a>
{:else}
    <h2>{location.name} | {getTodaysDate()}</h2>
{/if}

<WeatherCard title="Current" summary={current.summary} weather={current.weather} score={current.score}/>

<WeatherCard title="7 Day AI Forecast" summary={sevenDaySummary} />

<style>
    .error {
        padding: 2rem;
        font-size: 24px;
    }

    h2 {
        border: none;
    }
</style>
