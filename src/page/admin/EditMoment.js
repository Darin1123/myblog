import './EditMoment.scss';
import {useHistory, useParams} from "react-router";
import React, {useEffect, useRef, useState} from "react";
import {TAB_TITLE} from "../../config/config";
import {MOMENTS} from "../../data/core/moments";
import IconX from "../../resources/icons/x";
import IconCheck from "../../resources/icons/check";
import IconPlus from "../../resources/icons/plus";
import {IMAGES} from "../../data/core/images";
import beautify from "json-beautify";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import {sleep} from "../../util/util";
import {v4} from "uuid";
import {LazyLoadImage} from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

export function EditMoment() {

    const {id} = useParams();
    const MOMENT_IMAGE_PATH = "img/moments/";
    const [moment, setMoment] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [tags, setTags] = useState([]);
    const [date, setDate] = useState('');
    const [momentImages, setMomentImages] = useState([]);
    const [showImages, setShowImages] = useState(false);
    const [order, setOrder] = useState(0);
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);

    const history = useHistory();

    useEffect(() => {
        let filtered = MOMENTS.filter(item => item.id === id);
        if (filtered.length === 1) {
            let moment = filtered[0];
            setMoment(moment);
            document.title = `后台管理 - 编辑 '${filtered[0].title}' - ${TAB_TITLE}`;
            setTitle(moment.title);
            setContent(moment.content);
            let rawImages = [];
            for (let i in moment.images) {
                rawImages.push({
                   name: moment.images[i],
                    order: parseInt(i) + 1
                });
            }
            setImages(rawImages);
            setTags(moment.tags);
            setDate(moment.date);

            let rawMomentImages = IMAGES.filter(item => item.path === MOMENT_IMAGE_PATH)[0].items;

            let initialOrder = 1;
            let processedMomentImages = [];
            for (let i in rawMomentImages) {
                if (moment.images.includes(rawMomentImages[i])) {
                    processedMomentImages.push({
                        name: rawMomentImages[i],
                        order: initialOrder,
                        selected: true
                    });
                    initialOrder++;
                } else {
                    processedMomentImages.push({
                        name: rawMomentImages[i],
                        order: -1,
                        selected: false
                    });
                }
            }

            setOrder(initialOrder);

            setMomentImages(processedMomentImages)

        } else {
            document.title = `后台管理 - 不存在的时刻 - ${TAB_TITLE}`;
        }
    }, [id]);

    function dropImage(key) {
        let filteredImages = images.filter((item, index) => index !== key);
        setImages(filteredImages);
    }

    function addTag(tag) {
        setTags([...tags, tag]);
    }

    function deleteTag(index) {
        let filteredTags = tags.filter((item, key) => key !== index);
        setTags(filteredTags);
    }

    function generateResult() {
        let data = {
            id: v4(),
            title: title,
            tags: tags,
            date: date,
            images: images.map(item => item.name),
            content: content
        };
        setResult(data);
    }

    return (
        <div className={`edit-moment`}>
            {(moment !== null && showImages) && (
                <div className={`moment-images`}>
                    <div className={`moment-images-top`}>
                        <div>
                            添加图片 ({order - 1}/9)
                        </div>
                        <div className={`pointer`}
                             onClick={() => {
                                 let selectedImages = [];
                                 for (let i in momentImages) {
                                     if (momentImages[i].selected) {
                                         selectedImages.push(momentImages[i]);
                                     }
                                 }
                                 selectedImages.sort(function(a, b) {
                                     return a.order - b.order;
                                 })
                                 setImages(selectedImages);
                                 setShowImages(false);
                             }}>
                            确定
                        </div>
                    </div>
                    <div className={`images`}>
                        {momentImages.map((item, key) => (
                            <div className={`select-image`} key={key}>
                                <LazyLoadImage
                                    key={key}
                                    effect={'blur'}
                                    alt={`${item}`}
                                    onClick={() => {
                                        let index = key;
                                        // select an image
                                        if (!momentImages[key].selected) {
                                            if (order === 10) {
                                                return;
                                            }
                                            const updated = momentImages[key];
                                            updated.selected = true;
                                            updated.order = order;
                                            setOrder(order + 1);
                                            const updatedObject = momentImages.map((item, key) => {
                                                return key === index ? updated : item
                                            });
                                            setMomentImages(updatedObject);
                                        } else {  // unselect an image
                                            const updatedObject = momentImages.map((item, key) => {
                                                if (key === index) {
                                                    item.selected = false;
                                                    return item;
                                                }
                                                if (key !== index && item.order > momentImages[index].order) {
                                                    item.order = item.order - 1
                                                    return item;
                                                }
                                                return item;
                                            });
                                            setOrder(order - 1);
                                            setMomentImages(updatedObject);
                                        }
                                    }}
                                    src={MOMENT_IMAGE_PATH + item.name}/>
                                {item.selected && (
                                    <div className={`order`}>
                                        {item.order}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {(moment !== null) && (
                <div>
                    <div className={`pointer`}
                         style={{width: 'fit-content'}}
                         onClick={() => history.goBack()}>
                        ← 返回
                    </div>
                    <div className={`edit-moment-top m-t-20`}>
                        <input className={'title'}
                               value={title}
                               onChange={(e) => setTitle(e.target.value)}/>
                        <input className={`date`}
                               value={date}
                               onChange={(e) => setDate(e.target.value)}/>
                    </div>
                    <div className={`tags`}>
                        {tags.map((item, key) => (
                            <div key={key} className={'tag'}>
                                <span>#{item}</span>
                                <div className={`svg-container`}
                                     onClick={() => deleteTag(key)}>
                                    <IconX/>
                                </div>
                            </div>
                        ))}
                        <AddTag addTag={addTag}/>
                    </div>
                    <textarea className={'content'} value={content}
                              onChange={(e) => setContent(e.target.value)}/>

                    {(images.length === 0) && (
                        <div className={'add-image m-t-10'} onClick={() => {
                            setShowImages(true);
                        }}>
                            <IconPlus/>
                        </div>
                    )}

                    {(images.length > 0) && (
                        <div className={`edit-moment-images`}>

                            {(images.length === 1) && (
                                <div className={`single-image`}>
                                    <div className={`single-image-container`}>
                                        <div className={`delete`}
                                             onClick={() => {
                                                 dropImage(0);
                                                 let name = images[0].name;
                                                 let index = -1;
                                                 for (let i in momentImages) {
                                                     if (momentImages[i].name === name) {
                                                         index = i;
                                                     }
                                                 }
                                                 const updatedObject = momentImages.map((item, key) => {
                                                     if (name === item.name) {
                                                         item.selected = false;
                                                         return item;
                                                     }
                                                     if (name !== item.name && momentImages[index].order > item.order) {
                                                         item.order = item.order - 1
                                                         return item;
                                                     }
                                                     return item;
                                                 });
                                                 setOrder(order - 1);
                                                 setMomentImages(updatedObject);
                                             }}>
                                            <IconX/>
                                        </div>
                                        <img src={`img/moments/${images[0].name}`}
                                             alt={`${images[0].name}`}
                                             width={'100%'}/>
                                    </div>
                                    <div className={'add-image'} onClick={() => setShowImages(true)}>
                                        <IconPlus/>
                                    </div>
                                </div>
                            )}

                            {(images.length > 1) && (
                                <div className={`multiple-images`}>
                                    {images.map((item, key) => (
                                        <div key={key} className={`image-wrapper`}>
                                            <div className={`delete`} onClick={() => {
                                                let name = images[key].name;
                                                let index = -1;
                                                for (let i in momentImages) {
                                                    if (momentImages[i].name === name) {
                                                        index = i;
                                                    }
                                                }
                                                const updatedObject = momentImages.map((item, key) => {
                                                    if (name === item.name) {
                                                        item.selected = false;
                                                        return item;
                                                    }
                                                    let diffItem = name !== item.name;
                                                    let higherOrder = item.order > momentImages[index].order;
                                                    if (diffItem && higherOrder) {
                                                        console.log(
                                                            item.name,
                                                            item.order,
                                                            momentImages[key].name,
                                                            momentImages[key].order);
                                                        item.order = item.order - 1;
                                                        return item;
                                                    }
                                                    return item;
                                                });
                                                dropImage(key);
                                                setOrder(order - 1);
                                                setMomentImages(updatedObject);
                                            }}>
                                                <IconX/>
                                            </div>
                                            <div className={`container`} key={key}>
                                                <img src={`img/moments/${item.name}`}
                                                     alt={`${item.name}`}/>
                                            </div>
                                        </div>
                                    ))}
                                    {(images.length < 9) && (
                                        <div className={'add-image'} onClick={() => setShowImages(true)}>
                                            <IconPlus/>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div className={`generate-button`} onClick={generateResult}>
                        生成代码
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
                </div>
            )}
            {(moment === null) && (
                <div>
                    该时刻不存在.
                </div>
            )}
        </div>
    );
}

function AddTag(props) {
    const wrapperRef = useRef(null);
    let [showAddTag, setShowAddTag] = useState(false);
    let [newTag, setNewTag] = useState('');
    useOutsideAlerter(wrapperRef, setShowAddTag);

    return (
        <div ref={wrapperRef} className={`add-tag`}>
            {(!showAddTag) && (
                <div className={`svg-container`}>
                    <IconPlus className={`show-add-tag`}
                              onClick={() => setShowAddTag(!showAddTag)}/>
                </div>
            )}
            {(showAddTag) && (
                <div className={`add-tag-main`}>
                    <input id={'add-tag-input'}
                           value={newTag}
                           onChange={(e) => setNewTag(e.target.value)}
                           placeholder={'添加Tag...'}/>
                    <div className={`svg-container`} onClick={() => {
                        if (newTag.trim().length === 0) {
                            return;
                        }
                        props.addTag(newTag);
                        setNewTag('');
                        setShowAddTag(false);
                    }}>
                        <IconCheck/>
                    </div>
                </div>
            )}
        </div>
    );
}

function useOutsideAlerter(ref, func) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                func(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [func, ref]);
}
