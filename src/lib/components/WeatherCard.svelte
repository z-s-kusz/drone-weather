<script lang="ts">
    interface Props {
        title: string;
        summary: string;
        weather: any;
        link: string;
    }

    let { title, summary, weather, link }: Props = $props();
</script>

<section class="card">
    <h2><a href={link}>{title}</a></h2>
    <p>{summary}</p>
    <div class="weather">
        <span>Temp: {weather.temp} &deg;F. |</span>
        <span>Wind: {weather.wind10m}mph |</span>
        <span>Wind at 80 meters: {weather.wind80m}mph |</span>
        <span>Precipitation: {weather.precip}%</span>
    </div>
</section>

<style>
    .card {
        border: 4px solid indigo;
        border-radius: var(--bd-radius);
        padding: 2rem;
    }
</style>