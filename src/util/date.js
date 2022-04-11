/**
 * Get recent occurred Sunday
 * @param d Date Type
 * @returns {Date} recent occurred Sunday
 */
export function getLastSunday(d) {
    let t = new Date(d);
    t.setDate(t.getDate() - t.getDay());
    return t;
}

/**
 * Get days from an end date and count backwards for a certain length
 * @param end Date type
 * @param length length
 * @returns {*[]}
 */
export function getDays(end, length) {
    let arr = []
    for (let i = 0; i < length; i++) {
        let date = new Date();
        date.setFullYear(end.getFullYear());
        date.setMonth(end.getMonth());
        date.setDate(end.getDate() - i);
        arr.push(date);
    }
    return arr;
}

/**
 * count i-th day in a week for a date
 * @param dt
 * @returns {number}
 */
export function dayOfWeek(dt) {
    return (dt.getDay() + 1 ) % 7;
}

export function convertMonth(month) {
    switch (month) {
        case 0: return '一';
        case 1: return '二';
        case 2: return '三';
        case 3: return '四';
        case 4: return '五';
        case 5: return '六';
        case 6: return '七';
        case 7: return '八';
        case 8: return '九';
        case 9: return '十';
        case 10: return '十一';
        case 11: return '十二';
        default: return '~';
    }
}

export function convertDay(day) {
    switch (day) {
        case 0: return '日';
        case 1: return '一';
        case 2: return '二';
        case 3: return '三';
        case 4: return '四';
        case 5: return '五';
        case 6: return '六';
        default: return '~';
    }
}

/**
 * Convert date object to formatted string
 * @param date
 * @returns {string}
 */
export function convertDate(date) {
    return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

export function compareDates(d1, d2) {
    if (d1.getFullYear() > d2.getFullYear()) {
        return 1;
    }
    if (d1.getFullYear() < d2.getFullYear()) {
        return -1;
    }
    if (d1.getMonth() > d2.getMonth()) {
        return 1;
    }
    if (d1.getMonth() < d2.getMonth()) {
        return -1;
    }
    if (d1.getDate() > d2.getDate()) {
        return 1;
    }
    if (d1.getDate() < d2.getDate()) {
        return -1;
    }
    return 0;
}

/**
 *
 * @param article
 * @returns {Date}
 */
export function getArticleDate(article) {
    let dt = article.date;
    return new Date(dt.year, dt.month - 1, dt.day);
}

/**
 * convert str to Date
 * @param str must be YYYY-MM-DD
 * @returns {null|Date} Date object
 */
export function string2date(str) {
    let parts = str.split('-');
    if (parts.length === 3) {
        return new Date(parts[0], parts[1]-1, parts[2]);
    } else {
        return null;
    }
}

export function convertDateStr(str) {
    let parts = str.split('-');
    if (parts.length === 3) {
        return `${parseInt(parts[0])} 年 ${parseInt(parts[1])} 月 ${parseInt(parts[2])} 日`
    } else {
        return null;
    }
}

export function elapsedTime(date) {
    let today = new Date();
    let thatDay = new Date(date.year, date.month - 1, date.day);
    let diff = today.getTime() - thatDay.getTime();
    let days = Math.floor(diff / (1000 * 3600 * 24));
    if (days === 0) {
        return "今天";
    }
    if (days < 7) {
        return `${days} 天前`;
    }

    if (days < 30) {
        return `${Math.floor(days / 7)} 周前`;
    }

    if (days < 365) {
        return `${Math.floor(days / 30.5)} 个月前`;
    }

    return `${date.year} 年 ${date.month} 月 ${date.day} 日`
}

export function compareDateObjects(d1, d2) {
    if (d1.year < d2.year) {
        return -1;
    } else if (d1.year > d2.year) {
        return 1;
    }

    if (d1.month < d2.month) {
        return -1;
    } else if (d1.month > d2.month) {
        return 1;
    }

    return d1.day - d2.day;
}

