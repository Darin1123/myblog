import {ANNOUNCEMENTS} from "../data/announcements";

export function getOnAnnouncements() {
    return ANNOUNCEMENTS.filter(item => item.status === 'on');
}
