<script lang="ts">
	import type { Location } from '$lib/types';
	import { cubicOut } from 'svelte/easing';
    import { fade } from 'svelte/transition';

    interface Props {
        setLocation: (locationId: string) => void;
        location: Location;
        locationOptions: Location[];
    }

    let { setLocation, location, locationOptions }: Props = $props();
    let drawerIsOpen = $state(false);

    function toggleDrawer() {
        drawerIsOpen = !drawerIsOpen;
    }


function onLocationSelect(e: any) {
    drawerIsOpen = false;
    setLocation(e.currentTarget.value);
}
</script>

<button type="button" onclick={toggleDrawer} class="icon-btn {drawerIsOpen ? 'open' : 'closed'}">&#10152;</button>

{#if drawerIsOpen}
    <section class="options-drawer" in:fade={{ duration: 800, easing: cubicOut }}>
        <select value={location.id} onchange={onLocationSelect}>
            {#each locationOptions as option}
                <option value={option.id}>{option.name}</option>
            {/each}
        </select>
    </section>
{/if}

<style>
    .icon-btn {
        transition:400ms ease-in-out;

        &.open {
            transform: rotate(90deg);
        }
    }

    .options-drawer {
        flex: 1 0 100%;
    }
</style>
