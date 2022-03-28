import './AdminAbout.scss';
import {useEffect, useState} from "react";
import {TAB_TITLE} from "../../config/config";
import beautify from "json-beautify";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import {sleep} from "../../util/util";
import {ArticleMain} from "../../component/ArticleMain";
import IconPhoto from "../../resources/icons/photo";
import {Attachment} from "../../component/admin/Attachment";
import {ABOUT} from "../../data/page/about";


/**
 * This page is for editing existing article
 * @returns {JSX.Element}
 * @constructor
 */
export function AdminAbout() {

    const [content, setContent] = useState(``);
    const [showResult, setShowResult] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showAttachment, setShowAttachment] = useState(false);

    useEffect(() => {
        document.title = `后台管理 - 编辑关于页 - ${TAB_TITLE}`;
        setContent(ABOUT);
    }, []);

    return (<div className={'edit-about'}>

        {(showAttachment) && (
            <Attachment setShowAttachment={setShowAttachment}/>
        )}

        <div className={`edit-main`}>

            <div className={`full-width flex center space-between`} onClick={() => setShowAttachment(!showAttachment)}>
                <h2>编辑 `关于`</h2>
                <div className={`edit-main-images-icon`}>
                    <IconPhoto/>
                    <span>
                        附件库
                    </span>
                </div>
            </div>


            <div className={'workspace'}>
                    <textarea onChange={(e) => setContent(e.target.value)}
                              value={content}
                              placeholder={'在这里输入文章...'}/>
                <ArticleMain content={content}/>
            </div>
            <h3>
                生成数据
            </h3>
            <div className={'action'}>
                <div className={'button'} onClick={() => setShowResult(true)}>
                    生成数据代码
                </div>
            </div>
            {showResult &&
                <div className={'result'}>
                    <pre>
                        {beautify(content, null, 2, 100)}
                    </pre>
                    <CopyToClipboard
                        text={beautify(content, null, 2, 100)}
                        onCopy={async () => {
                            await setCopied(false);
                            await sleep(60);
                            setCopied(true)
                        }}>
                        <div className={'copy-button'}>
                            {copied &&
                                <div className={'m-r-10 gray-text'}>
                                    已复制!
                                </div>}
                            <div className={'button'} onClick={() => {
                            }}>复制
                            </div>
                        </div>
                    </CopyToClipboard>
                </div>}
        </div>
    </div>);
}
