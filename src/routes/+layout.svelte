<script lang="ts">
    import '$lib/global.css';

    const { children } = $props();
</script>

<header>
    <h1><a href="/">The Tiny Drone Outdoor Flying Forecast</a></h1>

    <nav>
        <a href="/">Home</a>
        <a href="manage-locations">Manage Locations</a>
    </nav>
</header>

{@render children()}

<style>
    header {
        padding-top: 2rem;
        border-bottom: 1px solid var(--bd-muted);
    }

    h1 {
         border: none;
    }

    nav {
        margin-bottom: 0.25rem;
        a {
            padding-right: 1rem;
        }
    }
</style>
