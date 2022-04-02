import {useParams} from "react-router";
import './SearchResult.scss';
import {useEffect, useState} from "react";
import {SIZE, TAB_TITLE} from "../config";
import {Pagination} from "../component/Pagination";
import {ArticleItem} from "../component/ArticleItem";
import {ARTICLES} from "../data/articles";

export function SearchResult(props) {

    let {keyword, page} = useParams();

    const [selectedArticles, setSelectedArticles] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPageNumber, setTotalPageNumber] = useState(0);
    page = parseInt(page);
    keyword = keyword.toLowerCase();

    useEffect(() => {
        document.title = `搜索 - ${keyword} - ${TAB_TITLE}`;
        let result = ARTICLES.filter(item => {
            if (item.title.toLowerCase().includes(keyword)) {
                return true;
            }
            if (keyword.includes(item.title.toLowerCase())) {
                return true;
            }
            if (item.category !== null) {
                if (item.category.toLowerCase().includes(keyword)) {
                    return true;
                }
                if (keyword.includes(item.category.toLowerCase())) {
                    return true;
                }
            }
            if (keyword.includes(item.date.year)) {
                return true;
            }
            if (item.content.includes(keyword)) {
                return true;
            }
            return false;
        });
        setTotal(result.length);
        setSelectedArticles(result.slice((page - 1) * SIZE, page * SIZE));
        setTotalPageNumber(Math.ceil(result.length / SIZE));
    }, [keyword, page, props]);

    return (
        <div className={'search-result'}>
            <h2>搜索 `{keyword}`</h2>
            {total === 0 &&
            <div>
                什么也没有搜到, 试试别的.
            </div>}
            {total > 0 &&
                <div className={'m-b-10'}>
                    共找到 {total} 篇文章, 第 {(page - 1) * SIZE + 1} - {page * SIZE > total ? total : page * SIZE} 篇
                </div>}
            <div>
                {selectedArticles.map((item, key) =>
                    <ArticleItem key={key} item={item}/>)}
            </div>

            {totalPageNumber > 0 &&
                <div className={'full-width flex-column center'}>
                    <Pagination page={page}
                                path={`/search/${keyword}/page`}
                                totalPageNumber={totalPageNumber}/>
                </div>}
        </div>
    );
}
