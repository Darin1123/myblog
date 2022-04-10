import './Article.scss';
import {useParams} from "react-router";
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {Link} from "react-router-dom";
import 'katex/dist/katex.min.css';
import remarkGfm from 'remark-gfm';
import React, {useEffect} from "react";
import "lightgallery.js/dist/css/lightgallery.css";
import {LightgalleryItem, LightgalleryProvider} from "react-lightgallery";
import {TAB_TITLE} from "../config";
import '../css/markdown.scss';
import rehypeRaw from 'rehype-raw';
import {ARTICLES} from "../data/articles";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {extractOutline, splitByLaTeX} from "../util/util";
import 'katex/dist/katex.min.css';
import {InlineMath} from 'react-katex';
import {NavHashLink} from "react-router-hash-link";
import IconArrowUp from "../resources/icons/arrow-up";
import $ from 'jquery';
// import {okaidia} from 'react-syntax-highlighter/dist/esm/styles/prism'
// import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter/';
import SyntaxHighlighter from 'react-syntax-highlighter';
// import atomOneLight from "react-syntax-highlighter/src/styles/hljs/atom-one-light";
import {atomOneDark} from "react-syntax-highlighter/src/styles/hljs";

export function Article(props) {
    const {id} = useParams();

    let article = null;
    let prevArticle = null;
    let nextArticle = null;
    let outline = [];
    let idMap = {};
    let articleIdMap = {};

    ARTICLES.forEach(function (item, index) {
        if (item.id === id) {
            article = item;

            outline = extractOutline(article.content);

            if (index > 0) {
                prevArticle = {
                    id: ARTICLES[index - 1].id,
                    title: ARTICLES[index - 1].title
                }
            }

            if (index < ARTICLES.length - 1) {
                nextArticle = {
                    id: ARTICLES[index + 1].id,
                    title: ARTICLES[index + 1].title
                }
            }
        }
    });

    useEffect(() => {
        if (article !== null) {
            document.title = `正在阅读: ${article.title} - ${TAB_TITLE}`;
            window.scrollTo(0, 0);
        }
    }, [article]);

    if (article === null) {
        return (
            <div className={'article'}>
                <h3>出错了</h3>
                该文章不存在...
            </div>
        );
    }

    function constructId(name) {
        let id = '#';
        let parts = splitByLaTeX(name);
        for (let i in parts) {
            if (!parts[i].isLaTeX) {
                id += parts[i].content;
            }
        }
        id = id.replace(/`/g, '').replace(/\s+/g, '-');
        // Under dev, due to react component life cycle, here adding 2 for each iteration
        // if (idMap[id] === undefined) {
        //     idMap[id] = 1;
        //     return id+'-1';
        // } else {
        //     idMap[id] = idMap[id] + 2;
        //     return `${id}-${idMap[id]}`;
        // }

        // Production
        if (idMap[id] === undefined) {
            idMap[id] = 1;
            return id;
        } else {
            let old = idMap[id];
            idMap[id] = idMap[id] + 1;
            return `${id}-${old}`;
        }
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

        if (articleIdMap[id] === undefined) {
            articleIdMap[id] = 1;
            return id;
        } else {
            let oldValue = articleIdMap[id];
            articleIdMap[id] = articleIdMap[id] + 1;
            return `${id}-${oldValue}`;
        }
    }

    return (
        <div className={'article auto-wrap ' + (props.dark ? 'dark-article' : '')}>
            <div className={`article-top`}>
                <div className={'crumbs'}>
                    {article.category !== null && (
                        <span>
                            <Link className={'underline-link'} to={`/categories`}>分类</Link>&nbsp;&nbsp;·&nbsp;&nbsp;
                            <Link className={'underline-link'} to={`/category/${article.category}/page/1`}>{article.category}</Link>&nbsp;&nbsp;·&nbsp;&nbsp;
                        </span>)}

                    <span>
                        {article.title}
                    </span>
                </div>
            </div>
            <div className={`outline`}>
                <div className={'outline-wrapper'}>
                    {outline.map((item, key) => (
                        <div className={'outline-item ' + `level-${item.level}`}
                                     to={constructId(item.name)}
                             onClick={() => {
                                 console.log(constructId(item.name));
                                 console.log($(`${constructId(item.name)}`));
                                 $('html, body').animate({scrollTop: $(constructId(item.name)).offset().top - 66}, 200)
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

            <div className={`go-to-top`} onClick={() => {
                $('html,body').animate({scrollTop: $("html").offset().top}, 200)
            }}>
                <IconArrowUp/>
            </div>

            <article>
                <h1>{article.title}</h1>
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
            <div className={`prev-next`}>
                {(prevArticle !== null) && (
                    <Link to={`/article/${prevArticle.id}`}>上一篇: {prevArticle.title}</Link>
                )}
                {(prevArticle === null) && (
                    <span>上一篇: 没有了...</span>
                )}
                {(nextArticle !== null) && (
                    <Link to={`/article/${nextArticle.id}`}>下一篇: {nextArticle.title}</Link>
                )}
                {(nextArticle === null) && (
                    <span>下一篇: 没有了...</span>
                )}
            </div>
        </div>
    );
}
