<script lang="ts">
	import { browser } from '$app/environment';
	import WeatherCard from '$lib/components/WeatherCard.svelte';
	import { getMainLocation } from '$lib/locations-storage.js';
	import { defaultWeatherCardData } from '$lib/weather-card-data-builder.js';
	import type { Location, WeatherCardData } from '$lib/types.js';
	import { getCurrentWeather } from '$lib/api/forecast';

    let location: Location | null = $state(null);
    let current: WeatherCardData = $state(defaultWeatherCardData('Current'));
    let sevenDay: WeatherCardData = $state(defaultWeatherCardData('7 Day Forecast'));
    let error = $state('');
    let loading = $state(false);

    if (browser) {
        location = getMainLocation();
    }

    $effect(() => {
        getAllData();
    });

    async function getAllData() {
        if (!location) return;
        loading = true;

        try {
            current = await getCurrentWeather(location);
            error = '';
        } catch(error) {
            error = 'Error fetching data. Refresh to try again.';
        } finally {
            loading = false;
        }
    }
</script>

{#if error}
    <p>{error}</p>
{/if}

{#if loading}
    <p>loading...</p>
{/if}

{#if !location}
    <a href="/manage-locations">Add a location to get started!</a>
{/if}

<WeatherCard title="Current" summary={current.summary} weather={current.weather} score={current.score}/>

<WeatherCard title="7 Day Forecast" summary={sevenDay.summary} />
