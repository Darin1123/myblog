import {LightgalleryItem} from "react-lightgallery";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import './AttachmentItem.scss';
import {sleep} from "../../util/util";
import {useEffect, useRef, useState} from "react";

export function AttachmentItem(props) {

    const wrapperRef = useRef(null);
    const [copied, setCopied] = useState(false);
    useOutsideAlerter(() => {
        setCopied(false);
    }, wrapperRef);

    return (
        <div className={`image-container`} ref={wrapperRef}>
            <LightgalleryItem group={`附件库`} src={props.item}>
                <img src={props.item} alt={props.item}/>
            </LightgalleryItem>

            <div className={`full-width flex justify-end m-t-5`}>
                {(copied) && (
                    <span className={`m-r-5 gray-text`}>已复制</span>
                )}
                <CopyToClipboard
                    text={`![${props.item}](${props.item})`}
                    onCopy={async () => {
                        await setCopied(false);
                        await sleep(60);
                        setCopied(true)
                    }}>
                    <span className={`pointer`}>复制图片代码</span>
                </CopyToClipboard>
            </div>

        </div>
    );
}

function useOutsideAlerter(func, ref) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                func();
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, func]);
}
