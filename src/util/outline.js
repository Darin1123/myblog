const SPECIAL_CHARS = /[*?.():!@<>/\[\]+",&]+/g

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

export function constructHeaderId(children, articleIdMap) {
    let id = '';
    for (let i in children) {
        let child = children[i];
        if (typeof child === 'string') {
            id += child;
        } else {
            let className = child.props.className;
            if (!(className !== undefined && className !== null && className.includes('math'))) {
                if (child.props.node !== undefined) {
                    let tagName = child.props.node.tagName;
                    if (tagName !== undefined) {  // inline code `code`
                        id += child.props.children[0];
                    }
                }
            }
        }
    }
    id = id.replace(/\s+/g, '-');
    id = id.replace(SPECIAL_CHARS, '');


    if (articleIdMap[id] === undefined) {
        articleIdMap[id] = 1;
        return id;
    } else {
        let oldValue = articleIdMap[id];
        articleIdMap[id] = articleIdMap[id] + 1;
        return `${id}-${oldValue}`;
    }
}

export function constructId(name, idMap) {
    let id = '#';
    let parts = splitByLaTeX(name);
    for (let i in parts) {
        if (!parts[i].isLaTeX) {
            id += parts[i].content;
        }
    }
    id = id.replace(/`/g, '').replace(/\s+/g, '-');
    // Under dev, due to react component life cycle, here adding 2 for each iteration
    if (idMap[id] === undefined) {
        idMap[id] = 1;
        id =  id+'-1';
    } else {
        idMap[id] = idMap[id] + 2;
        id = `${id}-${idMap[id]}`;
    }

    // Production
    // if (idMap[id] === undefined) {
    //     idMap[id] = 1;
    // } else {
    //     let old = idMap[id];
    //     idMap[id] = idMap[id] + 1;
    //     id = `${id}-${old}`;
    // }

    return id.replace(SPECIAL_CHARS, '');

}
