import './Editor.scss';
import {useEffect, useState} from "react";
import '../../css/markdown.scss';
import '../../css/util.scss';
import {v4 as uuidv4} from 'uuid';
import beautify from "json-beautify";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import {TAB_TITLE} from "../../config/config";
import {useBeforeunload} from 'react-beforeunload';
import {sleep} from "../../util/util";
import {CATEGORIES} from "../../data/core/categories";
import {ArticleMain} from "../../component/ArticleMain";
import {Attachment} from "../../component/admin/Attachment";
import IconPhoto from "../../resources/icons/photo";


/**
 * This page is for adding new articles
 * @returns {JSX.Element}
 * @constructor
 */
export function Editor() {
    const [title, setTitle] = useState(``);
    const [content, setContent] = useState(``);
    const [category, setCategory] = useState(null);
    const [peek, setPeek] = useState(null);
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);
    const [showAttachment, setShowAttachment] = useState(false);

    useBeforeunload(() => "确定要离开吗? 所有输入的数据将会丢失.");

    useEffect(() => {
        document.title = `后台管理 - 编辑器 - ${TAB_TITLE}`;
    }, []);

    function generateResult() {
        let date = new Date();
        let data = {
            id: uuidv4(),
            title: title,
            category: category,
            date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            },
            peek: peek,
            content: content
        };
        setResult(data);
    }

    function foo() {
        // this function does nothing on purpose
    }

    return (
        <div className={'editor'}>
            {(showAttachment) && (
                <Attachment setShowAttachment={setShowAttachment}/>
            )}

            <div className={`full-width flex center space-between`}>
                <h2>文章编辑器</h2>
                <div className={`edit-main-images-icon`}
                     onClick={() => setShowAttachment(!showAttachment)}>
                    <IconPhoto/>
                    <span>
                        附件库
                    </span>
                </div>
            </div>
            <p>
                <b>这只是一个文章编辑工具. 不具备发布的功能.</b> 请在左侧输入 Markdown 文本, 在右侧进行预览.
            </p>
            <p className={'red-text'}>
                <b>请注意</b>: 在离开此页面请前务必对信息进行保存! 关闭后所有已编辑的数据将会丢失!
            </p>
            <h3>
                第一步: 文章编辑
            </h3>
            <input placeholder={'请输入标题'}
                   onChange={e => setTitle(e.target.value)}
                   className={'title-input'}/>
            <div className={'workspace'}>
                <textarea onChange={(e) => setContent(e.target.value)}
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
                    <select onChange={e => setCategory(e.target.value)}>
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
                            <div className={'button'} onClick={foo}>复制</div>
                        </CopyToClipboard>
                    </div>

                </div>}
        </div>
    );
}
