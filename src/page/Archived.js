import './Archived.scss';
import InfiniteScroll from "react-infinite-scroll-component";
import {useEffect, useState} from "react";
import {TAB_TITLE} from "../config";
import {ARTICLES} from "../data/articles";
import {Link} from "react-router-dom";
import {compareDateObjects} from "../util/util";

export function Archived() {

    let groupedArticles = [];
    let date = ARTICLES[0].date;

    let dayItems = {
        date: date,
        items: []
    };

    const PAGE = 10;

    for (let i in ARTICLES) {
        // console.log(ARTICLES[i].date);
        if (compareDateObjects(date, ARTICLES[i].date) === 0) {
            console.log(ARTICLES[i].date);
            dayItems.items.push(
                {
                    id: ARTICLES[i].id,
                    title: ARTICLES[i].title
                }
            );
        } else {
            groupedArticles.push(dayItems);
            date = ARTICLES[i].date;
            dayItems = {
                date: date,
                items: [
                    {
                        id: ARTICLES[i].id,
                        title: ARTICLES[i].title
                    }
                ]
            };
        }
    }
    groupedArticles.push(dayItems);


    const [hasMore, setHasMore] = useState(true);
    const [selectedArticles, setSelectedArticles] = useState([]);

    function loadMore() {
        let newItems = groupedArticles.slice(selectedArticles.length, selectedArticles.length + PAGE);
        setSelectedArticles([...selectedArticles, ...newItems]);
        if (selectedArticles.length === groupedArticles.length) {
            setHasMore(false);
        }
    }

    function initMoments() {
        if (groupedArticles.length > 0) {
            setSelectedArticles(groupedArticles.slice(0, PAGE));
        } else {
            setHasMore(false);
        }
    }

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

    useEffect(() => {
        document.title = `归档 - ${TAB_TITLE}`;
        initMoments();
    }, [])

    return (
        <div className={`archived`}>
            <InfiniteScroll
                next={loadMore}
                hasMore={hasMore}
                endMessage={endMessage}
                loader={loader}
                dataLength={selectedArticles.length}>
                {selectedArticles.map((item, key) => (
                    <div key={key} className={`archived-item`}>
                        <div className={`item-content`}>
                            <div className={'item-date'}>{item.date.year} 年 {item.date.month} 月 {item.date.day} 日</div>
                            {(item.items.map((item, key) => (
                                <div className={'item-title-wrapper'} key={key}>
                                    <div className={'dot'}/>
                                    <Link
                                        className={'item-title'}
                                        to={`/article/${item.id}`}>
                                        {item.title}
                                    </Link>
                                </div>
                            )))}
                        </div>

                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );
}
