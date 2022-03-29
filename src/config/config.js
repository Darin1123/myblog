import {LightgalleryItem, LightgalleryProvider} from "react-lightgallery";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {okaidia} from "react-syntax-highlighter/dist/cjs/styles/prism";
import {string2date} from "../util/util";
import {LazyLoadImage} from "react-lazy-load-image-component";
import React from "react";
import 'react-lazy-load-image-component/src/effects/blur.css';


/* 基本配置 */
export const SIZE = 10  // 单页文章数量
export const NOTE_SIZE = 15  // 单次时刻数量
export const RECENT_ARTICLE_SIZE = 5  // 最近发布文章数量
export const NAME = `Darren`  // 名字
export const NAME_IN_ENGLISH = `Darren Wang`  // 英文名
export const TAB_TITLE = `${NAME}的博客`  // 网页标签标题, 博客主页标题
export const EMAIL = 'darin1123@outlook.com'  // 联系方式 - 邮箱
export const SEARCH_ARTICLE_TITLE_LENGTH = 32  // 搜索框
export const MY_PASSWORD = `0f90abf282f635ba25c26a70b0ebc584629c676f5db5346706c164be4c526e57`; // 用于进入编辑页面等直接获取 markdown 代码的页面, 在后台管理的密码页面生成.
export const NEW_ARTICLE_RANGE = 10;  // 判定为新文章的天数范围, 被判定为新的话会在标题处添加 New! 标记
export const THEME = '';  // TODO

/* 其他信息 */
export const LAUNCH_DATE = string2date(`2021-01-03`); // 创办日期. 格式: YYYY-MM-DD

/* 页面配置 */
export const HOME_TOP_ARTICLES = false;
export const HOME_RECENT_YEAR = false;

/* Footer */
export const HOST_NAME = 'Gitee Pages';
export const HOST_LINK = 'https://gitee.com/help/articles/4136';

/* 特殊的文章规则 */
export const CUSTOM_MARKDOWN = {
    // p tag
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
                            {/*<img src={`${image.properties.src}`}*/}
                            {/*     alt={image.properties.alt}/>*/}
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
            if (a.properties !== undefined
                && a.properties.href !== undefined
                && a.children.length > 0
                && a.children[0].value !== undefined) {
                return (
                    <a href={a.properties.href}
                       rel="noreferrer"
                       target={'_blank'}>
                        {a.children[0].value}
                    </a>
                );
            }
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
    code({node, inline, className, children, ...props}) {
        const match = /language-(\w+)/.exec(className || '')
        return !inline && match ? (
            <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                style={okaidia}
                language={match[1]}
                PreTag="div"
                {...props}
            />
        ) : (
            <code className={className} {...props}>
                {children}
            </code>
        )
    },
}
