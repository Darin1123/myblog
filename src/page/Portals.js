import './Portals.scss';
import React, {useEffect} from "react";
import {TAB_TITLE} from "../config";
import {LazyLoadImage} from "react-lazy-load-image-component";
import Tilt from "react-tilt/dist/tilt";
import {PORTAL_IMAGE_PATH} from "../data/page/portals";
import {getAllPortals} from "../mockService/portalService";

export function Portals() {

    useEffect(() => {
        document.title = `传送门 - ${TAB_TITLE}`;
    }, []);

    return (
        <div className={`portals`}>
            <h2>传送门</h2>
            <div className={`portal-items`}>
                {getAllPortals().map((item, key) => (
                    <Tilt key={key} options={{max: 38, scale: 1.1}} className={`portal-item`}>
                        <a target={'_blank'} rel="noreferrer" href={item.href}>
                            <div className={`img-container`}>
                                <LazyLoadImage
                                    effect={'blur'}
                                    alt={item.name}
                                    src={PORTAL_IMAGE_PATH + item.img}/>
                            </div>

                            <div className={'portal-name'}>{item.name}</div>
                        </a>
                    </Tilt>
                ))}
            </div>
            <h2>最近上头</h2>
            <div className={'high'}>
                <iframe
                    src="//player.bilibili.com/player.html?aid=766813855&bvid=BV1jr4y1z7qG&cid=517143262&page=1"
                    scrolling="no"
                    border="0"
                    frameBorder="no"
                    framespacing="0"
                    allowFullScreen="true"/>
                {/*<iframe src="https://www.youtube.com/embed/yw88g5QW6nw" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />*/}
            </div>
        </div>
    )
}
