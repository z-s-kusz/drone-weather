<script lang="ts">
	import type { WeatherData } from '$lib/types';

    interface Props {
        title: string;
        summary: string;
        score?: number;
        weather?: WeatherData;
        link?: string;
    }

    let { title, summary, weather, link, score }: Props = $props();
</script>

<section class="card">
    <h2>
        {#if link}
            <a href={link}>{title}</a>
        {:else}
            {title}
        {/if}
    </h2>

    {#if score}
        <p>{score} / 5 Rating</p>
    {/if}

    <p>{summary}</p>

    {#if weather}
        <div class="weather">
            <span>Temp: {weather.temp} &deg;F. |</span>
            <span>Wind: {weather.wind10m}mph |</span>
            <span>Gusts: {weather.windGusts10m}mph |</span>
            <span>Wind at 80 meters: {weather.wind80m}mph |</span>
            <span>Precipitation: {weather.precip}%</span>
        </div>
    {/if}
</section>

<style>
    .card {
        text-align: center;
        border: 4px solid indigo;
        border-radius: var(--bd-radius);
        padding: 2rem;
    }
</style>