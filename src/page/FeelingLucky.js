import './FeelingLucky.scss';
import {useEffect, useState} from "react";
import React from "react";
import {NAME} from "../config";
import {ARTICLES} from "../data/articles";
import {randomlyPick} from "../util/util";
import {constructHeaderId, constructId, extractOutline, splitByLaTeX} from "../util/outline";
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
import IconThumbUp from "../resources/icons/thumb-up";
import IconShare from "../resources/icons/share";

export function FeelingLucky(props) {

    let [fontSize, setFontSize] = useState(14);
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
                    <div className={`sidebar`}>
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
                        <div className={`menu`}>
                            <div className={`left`}>
                                <IconThumbUp/>
                                <IconShare/>
                            </div>
                            <div className={`font-size`}>
                    <span onClick={() => {
                        let biggerSize = fontSize + 2;
                        setFontSize(biggerSize);
                        $('article').css({
                            fontSize: `${biggerSize}px`
                        });
                    }} style={{fontSize: '16px'}}>A</span>
                                <span onClick={async () => {
                                    let smallerSize = fontSize - 2;
                                    setFontSize(smallerSize);
                                    $('article').css({
                                        fontSize: `${smallerSize}px`
                                    });
                                }} style={{fontSize: '12px'}}>A</span>
                                <span onClick={async () => {
                                    setFontSize(14);
                                    $('article').css({
                                        fontSize: `${14}px`
                                    });
                                }} style={{fontSize: '12px'}}>重置</span>
                            </div>
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
                                        <h2 id={constructHeaderId(children, articleIdMap)}>
                                            {children}
                                        </h2>
                                    )
                                },
                                h3: ({children}) => {
                                    return (
                                        <h3 id={constructHeaderId(children, articleIdMap)}>
                                            {children}
                                        </h3>
                                    )
                                },
                                h4: ({children}) => {
                                    return (
                                        <h4 id={constructHeaderId(children, articleIdMap)}>
                                            {children}
                                        </h4>
                                    )
                                },
                                h5: ({children}) => {
                                    return (
                                        <h5 id={constructHeaderId(children, articleIdMap)}>
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
