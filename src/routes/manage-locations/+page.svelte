<script lang="ts">
    import { browser } from '$app/environment';
	import { addLocation, getLocations, removeLocation, updateLocation } from '$lib/utility/locations-storage';
	import type { Location } from '$lib/types';

    const emptyLocation = { id: '', name: '', isFavorite: false, lat: '', long: '' };
    let dialogRef: HTMLDialogElement;
    let locations: Location[] = $state([]);
    let editableLocation: Location = $state(emptyLocation);

    const onInputchange = (event: any, key: string) => {
        // @ts-ignore
        editableLocation[key] = event.currentTarget.value;
    };

    const submitLocation = () => {
        if (editableLocation.id) {
            updateLocation(editableLocation, true);
        } else {
            editableLocation.id = crypto.randomUUID();
            addLocation(editableLocation);
        }
        locations = getLocations();
        editableLocation = emptyLocation;
        dialogRef.close();
    };

    const cancelEdit = () => {
        editableLocation = emptyLocation;
        dialogRef.close();
    };

    const editLocation = (location: Location) => {
        editableLocation = location;
        dialogRef.showModal();
    };

    const deleteLocation = (location: Location) => {
        editableLocation = emptyLocation;
        removeLocation(location);
        locations = getLocations();
        dialogRef.close();
    };

    // wrap in effect???
    if (browser) {
        locations = getLocations();
    }
</script>

<dialog bind:this={dialogRef}>
    <form onsubmit={submitLocation}>
        <h2>{editableLocation.id ? 'Edit' : 'New'} Location</h2>

        <label>
            Name
            <input type="text" autocomplete="off" name="name"
                value={editableLocation.name} oninput={(e) => onInputchange(e, 'name')} />
        </label>
        <p>
            Sorry to make you enter these. I just don't want to add maps right now.
            And I didn't think you'd click "allow location access."
            Lat and long with 1-4 decimal places is fine.
            <a href="https://xkcd.com/2170/" target="_blank">Click for info on coordinate precision.</a>
        </p>
        <label>
            Latitude
            <input type="text" autocomplete="off" name="latitude"
                value={editableLocation.lat} oninput={(e) => onInputchange(e, 'lat')} />
        </label>
        <label>
            Longitude
            <input type="text" autocomplete="off" name="longitude"
                value={editableLocation.long} oninput={(e) => onInputchange(e, 'long')} />
        </label>
        <label>
            Mark As Favorite
            <input type="checkbox" name="favorite" bind:checked={editableLocation.isFavorite} />
        </label>

        <button type="button" onclick={cancelEdit}>Cancel</button>
        {#if editableLocation.id}
            <button type="button" onclick={() => deleteLocation(editableLocation)}>Delete</button>
        {/if}
        <button type="submit">Save</button>
    </form>
</dialog>

<div class="flex">
    <h2>Locations</h2>
    <button type="button" onclick={() => dialogRef.showModal()}>Add New Location</button>

    {#each locations as location }
        <div class="location">
            <h4>{location.name} {location.isFavorite ? ' [favorite ⭐]' : ''}</h4>
            <p>Coordinates: {location.lat}, {location.long}</p>
            <button type="button" onclick={() => editLocation(location)}>Edit</button>
        </div>
    {/each}
</div>
<style>
    .flex {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .location {
        width: min(700px, 100%); 
        border: 2px solid indigo;
        border-radius: var(--bd-radius); /* from matcha css */
        padding: 2rem;
        margin: 1rem 0;
        box-sizing: border-box;
    }
</style>
