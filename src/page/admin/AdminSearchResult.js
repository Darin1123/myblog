import {useParams} from "react-router";
import './AdminSearchResult.scss';
import {useEffect, useState} from "react";
import {SIZE, TAB_TITLE} from "../../config/config";
import {Pagination} from "../../component/Pagination";
import {ARTICLES} from "../../data/core/articles";
import {AdminArticleItem} from "../../component/admin/AdminArticleItem";

export function AdminSearchResult(props) {

    let {keyword, page} = useParams();

    const [selectedArticles, setSelectedArticles] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPageNumber, setTotalPageNumber] = useState(0);
    page = parseInt(page);

    useEffect(() => {
        document.title = `搜索 - ${keyword} - ${TAB_TITLE}`;
        let result = ARTICLES.filter(item => {
            if (item.title.includes(keyword)) {
                return true;
            }
            if (item.category !== null && item.category.includes(keyword)) {
                return true;
            }
            if (keyword.includes(item.category)) {
                return true;
            }
            if (keyword.includes(item.title)) {
                return true;
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
                <div>
                    共找到 {total} 篇文章, 第 {(page - 1) * SIZE + 1} - {page * SIZE > total ? total : page * SIZE} 篇
                </div>}
            <div>
                {selectedArticles.map((item, key) =>
                    <AdminArticleItem key={key} item={item}/>)}
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
