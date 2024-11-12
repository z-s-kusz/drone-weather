<script lang="ts">
    import { browser } from '$app/environment';
	import { addLocation, getLocations } from '$lib/locations-storage';
	import type { Location } from '$lib/types';

    let dialogRef: HTMLDialogElement;
    let locations: Location[] = $state([]);
    let newLocation: Location = $state({
        id: '',
        name: '',
        isFavorite: false,
        lat: '',
        long: '',
    });

    const newLocationSubmit = () => {
        newLocation.id = crypto.randomUUID();

        addLocation(newLocation);
        locations = getLocations();
    };

    const cancelEdit = () => {
        newLocation.name = '';
        newLocation.isFavorite = false;
        newLocation.lat = '';
        newLocation.long = '';

        dialogRef.close();
    };

    // wrap in effect???
    if (browser) {
        locations = getLocations();
    }
</script>

<h2>Locations</h2>
<button type="button" onclick={() => dialogRef.showModal()}>Add New Location</button>

<dialog bind:this={dialogRef}>
    <form onsubmit={newLocationSubmit}>
        <label>
            Name
            <input type="text" autocomplete="off" name="name" />
        </label>
        <p>
            I'm sorry to make you type these. I just don't want to add map stuff right now.
            And I didn't think you'd click "allow location access."
            I'll add maps and stuff later. Probably... well, maybe. But hey, this will give you more accurate
            location data than just "the center of my city!" ...Sorry.
        </p>
        <label>
            Latitude
            <input type="text" autocomplete="off" name="latitude" />
        </label>
        <label>
            Longitude
            <input type="text" autocomplete="off" name="longitude" />
        </label>
        <button type="button" onclick={cancelEdit}>Cancel</button>
        <button type="submit">Save</button>
    </form>
</dialog>
