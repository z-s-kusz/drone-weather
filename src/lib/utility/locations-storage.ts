import type { Location } from '$lib/types';

// NOTE: I could have just saved all locations as one array of location objects
// wanted to test out using storage as a table - the only thing it made more efficient is getting 1 by id
// everything else got a lot more boilerplaty and its harder to remove an item manually
// if there are slow downs from accessing storage multiple times per function I'll refactor

export function getLocations(): Location[] {
    let locations: Location[] = [];
    const locationIDsJSON: string | null = localStorage.getItem('locations');

    if (locationIDsJSON) {
        const locationIDs: string[] | null = JSON.parse(locationIDsJSON);
        if (!locationIDs) {
            return [];
        }

        locationIDs.forEach((locationID) => {
            const locationJSON = localStorage.getItem(locationID);
            if (!locationJSON) {
                console.error('saved location had no location data', locationID);
            } else {
                const location: Location = JSON.parse(locationJSON);
                locations.push(location);
            }
        });
    }

    return locations;
}

export function getLocation(id: string): Location | null {
    const locationJSON = localStorage.getItem(id);
    if (locationJSON) return JSON.parse(locationJSON) as Location;
    else return null;
}

export function addLocation(newLocation: Location): void {
    const locationIDsJSON: string | null = localStorage.getItem('locations');

    if (!locationIDsJSON) {
        localStorage.setItem('locations', JSON.stringify([newLocation.id]));
    } else {
        const nextLocationIDs: string[] = [...JSON.parse(locationIDsJSON), newLocation.id];
        localStorage.setItem('locations', JSON.stringify(nextLocationIDs));
    }
    localStorage.setItem(newLocation.id, JSON.stringify(newLocation));

    if (newLocation.isFavorite) setFavoriteLocation(newLocation);
}

export function removeLocation(deletedLocation: Location): Location[] {
    const locationIDsJSON: string | null = localStorage.getItem('locations');

    if (!locationIDsJSON) {
        return [];
    } else {
        const locationIDs: string[] = JSON.parse(locationIDsJSON);
        const nextLocationIDs = locationIDs.filter((locationID) => locationID !== deletedLocation.id);
        localStorage.setItem('locations', JSON.stringify(nextLocationIDs));
    }
    localStorage.removeItem(deletedLocation.id);

    return getLocations();
}

// updateFavs false to avoid infinite update loops on setting a new fav
export function updateLocation(location: Location, updateFavs = false) {
    localStorage.setItem(location.id, JSON.stringify(location));
    if (updateFavs && location.isFavorite) setFavoriteLocation(location);
}

export function setFavoriteLocation(favLocation: Location): Location[] {
    const allLocations = getLocations();

    allLocations.forEach((location) => {
        updateLocation({
            ...location,
            isFavorite: location.id === favLocation.id,
        }, false);
    });

    return getLocations();
}

export function getMainLocation(): Location | null {
    const locations = getLocations();
    const favLocation = locations.find((location) => location.isFavorite);

    if (favLocation) return favLocation;
    else if (locations.length > 0) return locations[0];
    else return null;
}

export function initializeDefaultLocation(): Location {
    const defaultLocation: Location = {
        id: 'mn_default_location',
        name: 'Minneapolis',
        lat: '44.9550',
        long: '-93.2658',
        isFavorite: false,
    };

    addLocation(defaultLocation);
    return defaultLocation;
}
