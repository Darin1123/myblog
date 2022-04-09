import './Moments.scss';
import {useEffect, useState} from "react";
import {NOTE_SIZE, TAB_TITLE} from "../config";
import {MOMENTS} from "../data/moments";
import InfiniteScroll from "react-infinite-scroll-component";
import {MomentItem} from "../component/MomentItem";
import {convertDay} from "../util/date";
import {Link} from "react-router-dom";
import feelingLucky from '../resources/special/feeling-lucky.svg';

export function Moments() {

    const THRESHOLD = 1000;
    const today = new Date();
    let windowWidth = window.innerWidth;
    const [screenWidth, setScreenWidth] = useState(windowWidth)
    const [selectedMoments, setSelectedMoments] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    // const [selectedTag, setSelectedTag] = useState(null);

    const loader = (
        <div className={`m-t-20`}>
            加载中...
        </div>
    );

    const endMessage = (
        <div className={`flex-column center`} style={{paddingTop: '20px'}}>
            <i>后面没有了...</i>
        </div>
    );

    function loadMore() {
        let newItems = MOMENTS.slice(selectedMoments.length, selectedMoments.length + NOTE_SIZE);
        setSelectedMoments([...selectedMoments, ...newItems]);
        if (selectedMoments.length === MOMENTS.length) {
            setHasMore(false);
        }
    }

    // function filter(tag) {
    //     if (selectedTag === tag) {
    //         initMoments();
    //         setSelectedTag(null);
    //     } else {
    //         let filtered = MOMENTS.filter(item => item.tags.includes(tag));
    //         setSelectedMoments(filtered);
    //         setSelectedTag(tag);
    //     }
    // }

    function initMoments() {
        if (MOMENTS.length > 0) {
            setSelectedMoments(MOMENTS.slice(0, NOTE_SIZE));
        } else {
            setHasMore(false);
        }
    }

    useEffect(() => {
        document.title = `时刻 - ${TAB_TITLE}`;
        initMoments();

        const changeWidth = () => {
            setScreenWidth(window.innerWidth);
        }

        window.scrollTo(0, 0);

        window.addEventListener('resize', changeWidth);
    }, [screenWidth])

    return (
        <div className={`moments${windowWidth > THRESHOLD ? '' : '-mobile'}`}>
            <div className={'moments-main'}>
                <InfiniteScroll
                    next={loadMore}
                    hasMore={hasMore}
                    endMessage={endMessage}
                    loader={loader}
                    dataLength={selectedMoments.length}>
                    {selectedMoments.map((item, key) => (
                        <MomentItem item={item} key={key}
                                    // filter={filter}
                        />
                    ))}
                </InfiniteScroll>
            </div>
            {(screenWidth > THRESHOLD) && (
                <div className={'extra'}>
                    <div className={'flex space-between center m-b-10'}>
                        <div>
                            星期{convertDay(today.getDay())}
                        </div>
                        <div>
                            {today.getFullYear()} 年 {today.getMonth() + 1} 月 {today.getDate()} 日
                        </div>
                    </div>
                    <div>

                    </div>
                    {/*<div className={'tags m-b-10'}>*/}
                    {/*    {MOMENTS_TAGS.map((item, key) => (*/}
                    {/*        <span key={key} className={`m-r-5 ` + (selectedTag === item ? "bold" : '')} onClick={() => filter(item)}>*/}
                    {/*            #{item}*/}
                    {/*        </span>*/}
                    {/*    ))}*/}
                    {/*    <span onClick={() => {*/}
                    {/*        initMoments();*/}
                    {/*        setSelectedTag(null);*/}
                    {/*    }}>重置</span>*/}
                    {/*</div>*/}

                    <Link to={'/feeling-lucky'} className={`link-to-feeling-lucky`}>
                        <img alt={'feeling-lucky'} src={feelingLucky}/>
                        <div className={`text`}>I'm feeling lucky today!</div>

                    </Link>

                    <div className={`links`}>
                        <div className={'wrapper'}>
                            <Link to={'/'}>主页</Link>&nbsp;·&nbsp;
                            <Link to={'/articles/1'}>文章</Link>&nbsp;·&nbsp;
                            <Link to={'/categories'}>分类</Link>&nbsp;·&nbsp;
                            <Link to={'/about'}>关于</Link>&nbsp;·&nbsp;
                            <a href={'https://github.com/Darin1123/RainbowCat'}
                               target={'_blank'} rel="noreferrer">🌈 RainbowCat 🐱</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
