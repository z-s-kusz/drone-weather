<script lang="ts">
	import { addLocation, getLocations } from '$lib/locations-storage';
	import type { Location } from '$lib/types';

    let locations = $state(getLocations());
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

</script>

<dialog>
    <form onsubmit={newLocationSubmit}>
        <label>
            <input type="text" autocomplete="off" name="name" />
        </label>
        <label>
            <input type="text" autocomplete="off" name="latitude" />
        </label>
        <label>
            <input type="text" autocomplete="off" name="longitude" />
        </label>
        <button type="submit">Enter</button>
    </form>
</dialog>
