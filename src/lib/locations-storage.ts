import type { Location } from '$lib/types';

export function getLocations(): Location[] {
    let locations: Location[] = [];
    const locationIDsJSON: string | null = localStorage.getItem('locations');

    if (locationIDsJSON) {
        const locationIDs: string[] | null = JSON.parse(locationIDsJSON);
        if (!locationIDs) {
            return [];
        }

        locationIDs.forEach((locationID) => {
            const locationJSON = localStorage.get(locationID);
            const location: Location | null = JSON.parse(locationJSON);

            if (!location) console.error('saved location had no location data', locationID);
            else locations.push(location);
        });
    }

    return locations;
}

export function getLocation(id: string): Location | null {
    const locationJSON = localStorage.get(id);
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

    if (newLocation.isFavorite) {
        setFavoriteLocation(newLocation);
    }
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

export function updateLocation(location: Location) {
    localStorage.setItem(location.id, JSON.stringify(location));
}

export function setFavoriteLocation(favLocation: Location): Location[] {
    const allLocations = getLocations();

    allLocations.forEach((location) => {
        updateLocation({
            ...location,
            isFavorite: location.id === favLocation.id,
        });
    });

    return getLocations();
}
