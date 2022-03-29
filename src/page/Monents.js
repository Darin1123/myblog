import './Moments.scss';
import {useEffect, useState} from "react";
import {NOTE_SIZE, TAB_TITLE} from "../config/config";
import {MOMENTS} from "../data/core/moments";
import InfiniteScroll from "react-infinite-scroll-component";
import {MomentItem} from "../component/MomentItem";

export function Monents() {

    const [selectedNotes, setSelectedNotes] = useState([]);
    const [hasMore, setHasMore] = useState(true);

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
        let newItems = MOMENTS.slice(selectedNotes.length, selectedNotes.length + NOTE_SIZE);
        setSelectedNotes([...selectedNotes, ...newItems]);
        if (selectedNotes.length === MOMENTS.length) {
            setHasMore(false);
        }
    }

    useEffect(() => {
        document.title = `时刻 - ${TAB_TITLE}`;
        if (MOMENTS.length > 0) {
            setSelectedNotes(MOMENTS.slice(0, NOTE_SIZE));
        } else {
            setHasMore(false);
        }
    }, [])

    return (
        <div className={`moments`}>
            <InfiniteScroll
                next={loadMore}
                hasMore={hasMore}
                endMessage={endMessage}
                loader={loader}
                dataLength={selectedNotes.length}>
                {selectedNotes.map((item, key) => (
                    <MomentItem item={item} key={key}/>
                ))}
            </InfiniteScroll>
        </div>
    );
}
