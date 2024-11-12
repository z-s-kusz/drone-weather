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
        <span>{weather.temp}</span>
        <span>{weather.wind}</span>
        <span>{weather.precipitation}</span>
    </div>
</section>

<style>
    .card {
        border: 4px solid blue;
    }
</style>