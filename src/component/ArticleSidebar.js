import $ from "jquery";
import {splitByLaTeX} from "../util/outline";
import {InlineMath} from "react-katex";
import IconThumbUp from "../resources/icons/thumb-up";
import IconShare from "../resources/icons/share";
import React, {useEffect, useState} from "react";
import './ArticleSidebar.scss';
import {NAME_IN_ENGLISH} from "../config";
import IconX from "../resources/icons/x";
import {CopyToClipboard} from "react-copy-to-clipboard/src";


export function ArticleSidebar(props) {

    let outline = props.outline;
    let fontSize = props.fontSize;
    let setFontSize = props.setFontSize;
    let [message, setMessage] = useState(null);

    useEffect(() => {
        setMessage(null);
    }, [outline])

    function biggerFont() {
        if (fontSize === 18) {
            return;
        }
        let biggerSize = fontSize + 2;
        setFontSize(biggerSize);
        $('article').css({
            fontSize: `${biggerSize}px`
        });
    }

    function smallerFont() {
        if (fontSize <= 12) {
            return;
        }
        let smallerSize = fontSize - 2;
        setFontSize(smallerSize);
        $('article').css({
            fontSize: `${smallerSize}px`
        });
    }

    function like() {
        setMessage('谢谢! ;-)');
    }

    function share() {
        setMessage('文章链接已复制! ;-)');
    }

    return (
        <div className={`sidebar`}>
            <div className={`m-b-5`}>
                <b>文章大纲</b>
            </div>
            <div className={`outline`}>
                <div className={'outline-wrapper'}>
                    {outline.length === 0 && (
                        <div className={'gray-text'}>
                            没有内容...
                        </div>
                    )}
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
            <div className={`m-b-5 m-t-20`}>
                <b>菜单</b>
            </div>
            <div className={`menu`}>
                {(props.showMenu) && (
                    <div className={`left`}>
                        <IconThumbUp onClick={like}/>
                        <CopyToClipboard text={window.location.href}>
                            <IconShare onClick={share}/>
                        </CopyToClipboard>
                    </div>
                )}

                <div className={`font-size`}>
                    <span onClick={biggerFont}
                          style={{fontSize: '16px'}}>A</span>
                    <span onClick={smallerFont}
                          style={{fontSize: '12px'}}>A</span>
                    <span onClick={async () => {
                        setFontSize(14);
                        $('article').css({
                            fontSize: `${14}px`
                        });
                    }} style={{fontSize: '12px'}}>重置</span>
                </div>
            </div>
            {(message !== null) && (
                <div className={'action-message'}>
                    <div>
                        <b>{NAME_IN_ENGLISH}</b>: {message}
                    </div>
                    <IconX onClick={() => setMessage(null)}/>
                </div>
            )}

        </div>
    );
}
