<script lang="ts">
    import '$lib/global.css';

    const { children } = $props();
</script>

<header>
    <h1>Tiny Drone Outdoor Flying Forecast</h1>
</header>

{@render children()}
