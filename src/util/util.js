export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getLevel(count) {
    if (count > 2) {
        return 3;
    }
    return count;
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

export function randomlyPick(array) {
    return array[Math.floor(Math.random() * array.length)];
}
