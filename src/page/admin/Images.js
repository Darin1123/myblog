import {useEffect, useState} from "react";
import {TAB_TITLE} from "../../config";
import './Images.scss';
import {IMAGES} from "../../data/images";
import {LightgalleryItem, LightgalleryProvider} from "react-lightgallery";
import {LazyLoadImage} from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';


export function Images() {

    const [selectedPath, setSelectedPath] = useState(null);
    const [images, setImages] = useState([]);

    function selectPath(path) {
        setSelectedPath(path);
        let images = IMAGES.filter(item => item.path === path);
        if (images.length === 1) {
            setImages(images[0].items);
        }
    }

    useEffect(() => {
        document.title = `后台管理 - 图片库 - ${TAB_TITLE}`;
    }, []);

    return (
        <div className={'images'}>

            <div className={`image-main`}>
                <h2>
                    图库 {selectedPath !== null && (<span> - `{selectedPath}`</span>)}
                </h2>
                {(IMAGES.length > 0 && selectedPath === null) && (
                    <div>
                        <b>选择目录</b>
                        <div className={`paths`}>
                            {IMAGES.map((item, key) => (
                                <div key={key}
                                     onClick={() => selectPath(item.path)}
                                     className={`path`}>{item.path}</div>
                            ))}
                        </div>
                    </div>
                )}

                {(IMAGES.length === 0) && (
                    <div>
                        没有内容...
                    </div>
                )}

                {(IMAGES.length > 0 && selectedPath !== null) && (
                    <div className={`images-main`}>
                        <div className={`pointer`} onClick={() => setSelectedPath(null)}>← 返回</div>
                        <div className={`content`}>
                            <LightgalleryProvider>
                                {images.map((item, key) => (
                                    <LightgalleryItem src={`${selectedPath}${item}`} key={key} group={`${selectedPath}`}>
                                        <LazyLoadImage
                                            key={key}
                                            effect={'blur'}
                                            alt={`${item}`}
                                            src={`${selectedPath}${item}`}/>
                                    </LightgalleryItem>
                                ))}
                            </LightgalleryProvider>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
