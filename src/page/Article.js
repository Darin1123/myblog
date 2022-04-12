import './Article.scss';
import {useParams} from "react-router";
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {Link} from "react-router-dom";
import 'katex/dist/katex.min.css';
import remarkGfm from 'remark-gfm';
import React, {useEffect, useState} from "react";
import "lightgallery.js/dist/css/lightgallery.css";
import {LightgalleryItem, LightgalleryProvider} from "react-lightgallery";
import {TAB_TITLE} from "../config";
import '../css/markdown.scss';
import rehypeRaw from 'rehype-raw';
import {ARTICLES} from "../data/articles";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {constructHeaderId, constructId, extractOutline} from "../util/outline";
import 'katex/dist/katex.min.css';
import IconArrowUp from "../resources/icons/arrow-up";
import $ from 'jquery';
// import {okaidia} from 'react-syntax-highlighter/dist/esm/styles/prism'
// import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter/';
import SyntaxHighlighter from 'react-syntax-highlighter';
// import atomOneLight from "react-syntax-highlighter/src/styles/hljs/atom-one-light";
import {atomOneDark} from "react-syntax-highlighter/src/styles/hljs";
import {ArticleSidebar} from "../component/ArticleSidebar";

export function Article(props) {
    const {id} = useParams();

    let article = null;
    let prevArticle = null;
    let nextArticle = null;
    let [outline, setOutline] = useState([]);
    let articleIdMap = {};
    let [fontSize, setFontSize] = useState(14);

    ARTICLES.forEach(function (item, index) {
        if (item.id === id) {
            article = item;

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


            // process outline
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

            articleIdMap = {};

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

            <ArticleSidebar outline={outline} fontSize={fontSize} setFontSize={setFontSize}/>


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
