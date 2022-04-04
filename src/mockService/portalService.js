import {PORTALS} from "../data/page/portals";

export function getTopPortals() {
    return PORTALS.slice(0, 5);
}

export function getAllPortals() {
    return PORTALS;
}
