import './Attachment.scss';
import {IMAGES} from "../../data/core/images";
import {LightgalleryProvider} from "react-lightgallery";
import {AttachmentItem} from "./AttachmentItem";

export function Attachment(props) {

    let images = [];
    IMAGES.forEach((item) => {
        let path = item.path;
        item.items.forEach(imageItem => {
            images.push(`${path}${imageItem}`);
        })
    })

    return (
        <div className={`attachment`}>
            <div className={`attachment-top`}>
                <b>附件库</b>
                <div className={`pointer`} onClick={() => props.setShowAttachment(false)}>关闭</div>
            </div>

            <div className={`content`}>
                <LightgalleryProvider>
                {images.map((item, key) => (
                    <AttachmentItem key={key} item={item}/>
                ))}
                </LightgalleryProvider>
            </div>
        </div>
    );
}
