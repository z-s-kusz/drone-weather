<script lang="ts">
	import { browser } from '$app/environment';
	import WeatherCard from '$lib/components/WeatherCard.svelte';
	import { getMainLocation } from '$lib/locations-storage.js';
	import { defaultWeatherCardData } from '$lib/weather-card-data-builder.js';
	import type { Location, WeatherCardData } from '$lib/types.js';

    let { data } = $props();
    let location: Location | null = $state(null);
    let current: WeatherCardData = $state(defaultWeatherCardData('Current'));
    let today: WeatherCardData = $state(defaultWeatherCardData('Today'));
    let sevenDay: WeatherCardData = $state(defaultWeatherCardData('7 Day Forecast'));
    console.log(data.forecast);

    if (browser) {
        location = getMainLocation();
    }

    $effect(() => {
        if (!location) return;


    });
</script>

{#if data.errorMessage}
    <p>{data.errorMessage}</p>
{/if}

{#if !location}
    <a href="/manage-locations">Add a location to get started!</a>
{/if}

<WeatherCard title="Current" link="" summary={current.summary} weather={current.weather} />

<WeatherCard title="Today" link="" summary={today.summary} weather={today.weather} />

<WeatherCard title="7 Day Forecast" link="" summary={sevenDay.summary} weather={sevenDay.weather} />
