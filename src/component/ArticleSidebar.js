import $ from "jquery";
import {splitByLaTeX} from "../util/outline";
import {InlineMath} from "react-katex";
import IconThumbUp from "../resources/icons/thumb-up";
import IconShare from "../resources/icons/share";
import React from "react";
import './ArticleSidebar.scss';


export function ArticleSidebar(props) {

    let outline = props.outline;
    let fontSize = props.fontSize;
    let setFontSize = props.setFontSize;

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

    return (
        <div className={`sidebar`}>
            <div className={`m-b-5`}>
                <b>文章大纲</b>
            </div>
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
            <div className={`m-b-5 m-t-20`}>
                <b>菜单</b>
            </div>
            <div className={`menu`}>
                <div className={`left`}>
                    <IconThumbUp/>
                    <IconShare/>
                </div>
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

        </div>
    );
}
