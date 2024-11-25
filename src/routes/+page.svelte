<script lang="ts">
	import { browser } from '$app/environment';
	import WeatherCard from '$lib/components/WeatherCard.svelte';
	import { getLocations, getMainLocation, initializeDefaultLocation } from '$lib/utility/locations-storage.js';
	import { defaultWeatherCardData } from '$lib/utility/weather-card-data-builder.js';
	import type { Location, WeatherCardData } from '$lib/types.js';
	import { getWeather, getSevenDaySummaryAI } from '$lib/api/forecast';
	import { formatDateShort } from '$lib/utility/dates';
	import LocationSelect from '$lib/components/LocationSelect.svelte';

    let location: Location | null = $state(null);
    let locations: Location[] = $state([]);
    let current: WeatherCardData = $state(defaultWeatherCardData('Current'));
    let sevenDaySummary = $state('');
    let sevenDayAISummary = $state('');
    let error = $state('');

    if (browser) {
        location = getMainLocation() || initializeDefaultLocation();
        locations = getLocations();
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

    function setLocation(locationId: string) {
        const selectedLocation = locations.find((location) => location.id === locationId);
        if (!selectedLocation) return error = 'Selected location not found. Reload and try again.';
        location = selectedLocation
    }
</script>

{#if error}
    <p class="error">{error}</p>
{/if}

{#if !location}
    <a href="/manage-locations">Add a location to get started!</a>
{:else}
    <div class="location-container">
        <h2>{location.name} | {formatDateShort(new Date())}</h2>
        <LocationSelect setLocation={setLocation} location={location} locationOptions={locations} />
    </div>
{/if}

<WeatherCard title="Current" summary={current.summary} weather={current.weather} score={current.score}/>

<WeatherCard title="7 Day Forecast" summary={sevenDaySummary} />

<WeatherCard title="7 Day Forecast" isAI={true} summary={sevenDayAISummary} />

<style>
    .error {
        padding: 2rem;
        font-size: 24px;
    }

    .location-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;

        h2 {
            flex: 0 1 auto;
        }
    }
    :global(.location-container button) {
        margin: 8;
        width: 45px;
        height: 45px;
        box-sizing: border-box;
    }
</style>
