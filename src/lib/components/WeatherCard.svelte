<script lang="ts">
    import { fade } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
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
        <p in:fade={{ duration: 800, easing: cubicOut }}>{score} / 5 Rating</p>
    {/if}

    {#if summary}
        <pre in:fade={{ duration: 800, easing: cubicOut }}>{summary}</pre>
    {:else}
        <pre>loading...</pre>
    {/if}

    {#if weather}
        <div in:fade={{ duration: 800, easing: cubicOut }}>
            <span>Temp: {weather.temp} &deg;F. |</span>
            <span>Wind: {weather.wind10m}mph |</span>
            <span>Gusts: {weather.windGusts10m}mph |</span>
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
        box-shadow: 0px 0px 20px -8px rgb(238, 13, 140);
    }
    pre {
        text-wrap: auto;
    }
</style>