import './Edit.scss';
import {useEffect, useState} from "react";
import {TAB_TITLE} from "../../config";
import {useParams} from "react-router";
import beautify from "json-beautify";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import {sleep} from "../../util/util";
import {ArticleMain} from "../../component/ArticleMain";
import {ARTICLES} from "../../data/articles";
import {CATEGORIES} from "../../data/categories";
import IconPhoto from "../../resources/icons/photo";
import {Attachment} from "../../component/admin/Attachment";
import React from "react";


/**
 * This page is for editing existing article
 * @returns {JSX.Element}
 * @constructor
 */
export function Edit() {

    let {id} = useParams();

    const [loadArticleFailed, setLoadArticleFailed] = useState(false);
    const [topTitle, setTopTitle] = useState(``);

    const [articleId, setArticleId] = useState(``);
    const [title, setTitle] = useState(``);
    const [content, setContent] = useState(``);
    const [category, setCategory] = useState(null);
    const [peek, setPeek] = useState(null);
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);
    const [date, setDate] = useState(null);
    const [showAttachment, setShowAttachment] = useState(false);

    useEffect(() => {
        let filterResult = ARTICLES.filter(item => item.id === id);
        if (filterResult.length > 0) {
            setLoadArticleFailed(false);
            let article = filterResult[0];
            setTopTitle(article.title);
            setArticleId(article.id);
            setTitle(article.title);
            setContent(article.content);
            setPeek(article.peek);
            setCategory(article.category);
            setDate(article.date);
            document.title = `后台管理 - 编辑 \`${article.title}\` - ${TAB_TITLE}`;
        } else {
            setLoadArticleFailed(true);
            document.title = `后台管理 - 文章不存在 - ${TAB_TITLE}`;
        }

    }, [topTitle, id]);

    function generateResult() {
        let data = {
            id: articleId,
            title: title,
            category: category,
            date: date,
            peek: peek,
            content: content
        };
        setResult(data);
    }

    return (<div className={'edit'}>

        {(!loadArticleFailed && showAttachment) && (
            <Attachment setShowAttachment={setShowAttachment}/>
        )}

        <div className={`edit-main`}>

            <div className={`full-width flex center space-between`}>
                <h2>{loadArticleFailed ? `无法加载文章` : `编辑 \`${topTitle}\``}</h2>
                {(!loadArticleFailed) && (
                    <div className={`edit-main-images-icon`}
                         onClick={() => setShowAttachment(!showAttachment)}>
                        <IconPhoto/>
                        <span>附件库</span>
                    </div>
                )}
            </div>

            {(loadArticleFailed) && (
                <div>文章不存在...</div>
            )}

            {(!loadArticleFailed) && (
                <React.Fragment>
                    <h3>
                        第一步: 文章编辑
                    </h3>
                    <input placeholder={'请输入标题'}
                           value={title}
                           onChange={e => setTitle(e.target.value)}
                           className={'title-input'}/>
                    <div className={'workspace'}>
                    <textarea onChange={(e) => setContent(e.target.value)}
                              value={content}
                              placeholder={'在这里输入文章...'}/>
                        <ArticleMain content={content}/>
                    </div>
                    <h3>
                        第二步. 文章信息
                    </h3>
                    <div className={'meta-data'}>
                        <div className={'item'}>
                            <div className={'label'}>
                                类别:
                            </div>
                            <select value={category} onChange={e => setCategory(e.target.value)}>
                                <option value={null}>无类别</option>
                                {CATEGORIES.map((item, key) =>
                                    <option key={key}>
                                        {item}
                                    </option>)}
                            </select>
                        </div>
                        <div className={'item'}>
                            <div className={'label'}>
                                简介:
                            </div>
                            <input placeholder={'简单介绍一下这篇文章'}
                                   value={peek}
                                   onChange={e => setPeek(e.target.value)}/>
                        </div>
                    </div>
                    <h3>
                        第三步. 生成数据
                    </h3>
                    <div className={'action'}>
                        <div className={'button'} onClick={generateResult}>
                            生成数据代码
                        </div>
                    </div>
                    {result !== null &&
                        <div className={'result'}>
                            <pre>
                                {beautify(result, null, 2, 100)}
                            </pre>
                            <div className={'copy-button'}>
                                {copied &&
                                    <div className={'m-r-10 gray-text'}>
                                        已复制!
                                    </div>}
                                <CopyToClipboard
                                    text={beautify(result, null, 2, 100)}
                                    onCopy={async () => {
                                        await setCopied(false);
                                        await sleep(60);
                                        setCopied(true)
                                    }}>
                                    <div className={'button'} onClick={() => {
                                    }}>复制
                                    </div>
                                </CopyToClipboard>
                            </div>
                        </div>}
                </React.Fragment>
            )}

        </div>
    </div>);
}


