export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

export function getLevel(count) {
    if (count > 2) {
        return 3;
    }
    return count;
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

export function getArticleDate(article) {
    let dt = article.date;
    return new Date(dt.year, dt.month - 1, dt.day);
}

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

export function extractOutline(article) {
    let lines = article.split('\n');
    let outline = [];
    let flag = true;

    const CODE_PREFIX_1 = `~~~`;
    const CODE_PREFIX_2 = '```';
    let currentPrefix = '';

    for (let i in lines) {
        let line = lines[i];
        if (flag && (line.startsWith(CODE_PREFIX_1) || line.startsWith(CODE_PREFIX_2))) {
            flag = false;
            if (line.startsWith(CODE_PREFIX_1)) {
                currentPrefix = CODE_PREFIX_1;
            } else {
                currentPrefix = CODE_PREFIX_2;
            }
        } else if (!flag && line.startsWith(currentPrefix)) {
            flag = true;
        }
        if (flag && line.startsWith('#')) {
            let parts = line.split(' ');
            let name = line.slice(line.indexOf(' ') + 1).trim();
            outline.push(
                {
                    name: name,
                    level: parts[0].length
                }
            );
        }
    }
    return outline;
}

export function splitByLaTeX(line) {
    let regex = /\$/gi;
    let occurrence = [];
    let result = [];
    while ((result = regex.exec(line))) {
        occurrence.push(result.index);
    }

    if (occurrence.length === 0) {
        return [{
            content: line,
            isLaTeX: false
        }];
    }

    if (occurrence.length % 2 !== 0) {
        throw "number of $ not even";
    }

    let parts = [];
    let previous = 0;
    for (let i = 0; i < occurrence.length; i++) {
        if (i % 2 === 0) {
            parts.push({
                content: line.substring(previous, occurrence[i]).replace('$', ''),
                isLaTeX: false
            });
            previous = occurrence[i];
        } else {
            parts.push({
                content: line.substring(previous, occurrence[i]).replace('$', ''),
                isLaTeX: true
            });
            previous = occurrence[i];
        }
    }
    return parts;
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

export function randomlyPick(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function elapsedTime(date) {
    let today = new Date();
    let thatDay = new Date(date.year, date.month - 1, date.day);
    let diff = today.getTime() - thatDay.getTime();
    let days = Math.ceil(diff / (1000 * 3600 * 24));
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
