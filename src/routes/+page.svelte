<script lang="ts">
	import { browser } from '$app/environment';
	import WeatherCard from '$lib/components/WeatherCard.svelte';
	import { getMainLocation } from '$lib/locations-storage.js';
	import { defaultWeatherCardData } from '$lib/weather-card-data-builder.js';
	import type { Location, WeatherCardData } from '$lib/types.js';
	import { getCurrentWeatherCard } from '$lib/api/forecast';

    let location: Location | null = $state(null);
    let current: WeatherCardData = $state(defaultWeatherCardData('Current'));
    let today: WeatherCardData = $state(defaultWeatherCardData('Today'));
    let sevenDay: WeatherCardData = $state(defaultWeatherCardData('7 Day Forecast'));
    let error = $state('');
    let loading = $state(false);

    if (browser) {
        location = getMainLocation();
    }

    $effect(() => {
        setCurrent();
    });

    async function setCurrent() {
        if (!location) return;
        loading = true;

        try {
            current = await getCurrentWeatherCard(location);
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

<WeatherCard title="Current" link="" summary={current.summary} weather={current.weather} />

<WeatherCard title="Today" link="" summary={today.summary} weather={today.weather} />

<WeatherCard title="7 Day Forecast" link="" summary={sevenDay.summary} weather={sevenDay.weather} />
