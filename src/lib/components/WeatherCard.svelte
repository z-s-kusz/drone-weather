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
        isAI?: boolean
    }

    let { title, summary, weather, link, score, isAI }: Props = $props();
</script>

<section class="card">
    <h2>
        {#if link}
            <a href={link}>{title}</a>
        {:else}
            {title}
            {#if isAI}<div class="knewave">now with AI!</div>{/if}
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
            <span>Wind: {weather.wind}mph |</span>
            <span>Gusts: {weather.gusts}mph |</span>
            <span>Precipitation: {weather.precip}%</span>
        </div>
    {/if}
</section>

<style>
    .card {
        position: relative;
        text-align: center;
        border: 4px solid indigo;
        border-radius: var(--bd-radius);
        padding: 2rem;
        box-shadow: 0px 0px 20px -8px rgb(238, 13, 140);
    }
    .card::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        box-shadow: 0 0px 15px 10px rgb(118, 11, 194);
        transition: opacity 400ms ease-in-out;
    }
    .card:hover::after {
        opacity: 1;
    }

    pre {
        text-wrap: auto;
    }
</style>