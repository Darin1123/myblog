import './FeelingLucky.scss';
import {useEffect, useState} from "react";
import React from "react";
import {NAME} from "../config";
import {ARTICLES} from "../data/articles";
import {NavHashLink} from "react-router-hash-link";
import {extractOutline, randomlyPick, splitByLaTeX} from "../util/util";
import {InlineMath} from "react-katex";
import $ from "jquery";
import IconArrowUp from "../resources/icons/arrow-up";
import IconBallBasketball from "../resources/icons/ball-basketball";
import IconBallBowling from "../resources/icons/ball-bowling";
import IconBallFootball from "../resources/icons/ball-football";
import IconBallTennis from "../resources/icons/ball-tennis";
import IconBallVolleyball from "../resources/icons/ball-volleyball";
import IconPokeball from "../resources/icons/pokeball";
import {LightgalleryItem, LightgalleryProvider} from "react-lightgallery";
import {LazyLoadImage} from "react-lazy-load-image-component";
// import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
// import {okaidia} from "react-syntax-highlighter/dist/cjs/styles/prism";
import SyntaxHighlighter from 'react-syntax-highlighter';
// import atomOneLight from "react-syntax-highlighter/src/styles/hljs/atom-one-light";
import {atomOneDark} from "react-syntax-highlighter/src/styles/hljs";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";

export function FeelingLucky(props) {

    let articleIdMap = {};
    let refreshIcons = [
        <IconBallBasketball/>,
        <IconBallBowling/>,
        <IconBallFootball/>,
        <IconBallTennis/>,
        <IconBallVolleyball/>,
        <IconPokeball/>
    ];

    const [loaded, setLoaded] = useState(false);
    const [article, setArticle] = useState(null);
    const [outline, setOutline] = useState([]);
    const [refreshIcon, setRefreshIcon] = useState(randomlyPick(refreshIcons));

    function constructId(name, idMap) {
        name = name.replace('*', '');
        name = name.replace('?', '');
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
            return id+'-1';
        } else {
            idMap[id] = idMap[id] + 2;
            return `${id}-${idMap[id]}`;
        }

        // Production
        // if (idMap[id] === undefined) {
        //     idMap[id] = 1;
        //     return id;
        // } else {
        //     let old = idMap[id];
        //     idMap[id] = idMap[id] + 1;
        //     return `${id}-${old}`;
        // }
    }

    async function load() {
        await setLoaded(false);
        let article = randomlyPick(ARTICLES);
        await setArticle(article);
        setLoaded(true);
        setRefreshIcon(randomlyPick(refreshIcons));
        let rawOutline = extractOutline(article.content);

        let idMap = {};
        let processedOutline = [];
        for (let i in rawOutline) {
            let name = rawOutline[i].name;
            let id = constructId(name, idMap);
            processedOutline.push({
                level: rawOutline[i].level,
                name: rawOutline[i].name,
                id: id
            });
        }

        setOutline(processedOutline);
    }

    function constructHeaderId(children) {
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
        id = id.replace('*', '');
        id = id.replace('?', '');


        if (articleIdMap[id] === undefined) {
            articleIdMap[id] = 1;
            return id;
        } else {
            let oldValue = articleIdMap[id];
            articleIdMap[id] = articleIdMap[id] + 1;
            return `${id}-${oldValue}`;
        }
    }

    useEffect(() => {
        document.title = `随机一篇 - ${NAME}的博客`;
        load();
    }, [])

    return (
        <div className={`feeling-lucky`}>
            {(!loaded) && (
                <div>
                    加载中...
                </div>
            )}
            {(loaded) && (
                <React.Fragment>
                    <div className={`outline`}>
                        <div className={'outline-wrapper'}>
                            {outline.map((item, key) => (
                                <div className={'outline-item ' + `level-${item.level}`}
                                     onClick={() => {
                                         $('html, body').animate({scrollTop: $(item.id).offset().top - 66}, 200)
                                     }}
                                     key={key}>
                                    {splitByLaTeX(item.name).map(((item, key) => (
                                        item.isLaTeX ? <InlineMath key={key} math={item.content}/> :
                                            <span key={key}>{item.content}</span>
                                    )))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={`actions`}>
                        <div className={`action m-r-10`} onClick={async () => {
                            await load();
                            $('html,body').animate({scrollTop: $("html").offset().top}, 200);
                        }}>
                            {refreshIcon}
                        </div>

                        <div className={`action`} onClick={() => {
                            $('html,body').animate({scrollTop: $("html").offset().top}, 200)
                        }}>
                            <IconArrowUp/>
                        </div>
                    </div>
                    <article>
                        <h2>{article.title}</h2>
                        <ReactMarkdown
                            components={{
                                p: ({node, children}) => {
                                    // img tag
                                    if (node.children[0].tagName === "img") {
                                        const image = node.children[0];
                                        return (
                                            <div className="image">
                                                <LightgalleryProvider>
                                                    <LightgalleryItem
                                                        group={image.properties.alt}
                                                        src={`${image.properties.src}`}>
                                                        <LazyLoadImage
                                                            effect={'blur'}
                                                            alt={image.properties.alt}
                                                            src={`${image.properties.src}`}/>
                                                    </LightgalleryItem>
                                                </LightgalleryProvider>
                                            </div>
                                        );
                                    }

                                    // a tag
                                    if (node.children[0].tagName === "a") {
                                        const a = node.children[0];
                                        return (
                                            <a href={a.properties.href}
                                               rel="noreferrer"
                                               target={'_blank'}>
                                                {a.children[0].value}
                                            </a>
                                        );
                                    }

                                    // Return default child otherwise
                                    return <p>{children}</p>;
                                },
                                a: ({node}) => {
                                    return (
                                        <a href={node.properties.href}
                                           rel={"noreferrer"}
                                           target={'_blank'}>
                                            {node.children[0].value}
                                        </a>
                                    );
                                },
                                h2: ({children}) => {
                                    return (
                                        <h2 id={constructHeaderId(children)}>
                                            {children}
                                        </h2>
                                    )
                                },
                                h3: ({children}) => {
                                    return (
                                        <h3 id={constructHeaderId(children)}>
                                            {children}
                                        </h3>
                                    )
                                },
                                h4: ({children}) => {
                                    return (
                                        <h4 id={constructHeaderId(children)}>
                                            {children}
                                        </h4>
                                    )
                                },
                                h5: ({children}) => {
                                    return (
                                        <h5 id={constructHeaderId(children)}>
                                            {children}
                                        </h5>
                                    )
                                },
                                code({node, inline, className, children, ...props}) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            children={String(children).replace(/\n$/, '')}
                                            style={atomOneDark}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        />
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                            children={article.content}
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex, rehypeRaw]}
                        />
                    </article>
                </React.Fragment>
            )}
        </div>
    );
}
