<script lang="ts">
    import '$lib/global.css';

    const { children } = $props();
</script>

<header>
    <h1><a href="/">The Tiny Drone Outdoor Flying Forecast</a></h1>
</header>

{@render children()}
