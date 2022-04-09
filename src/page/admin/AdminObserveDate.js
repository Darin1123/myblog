import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {SIZE, TAB_TITLE} from "../../config";
import './AdminObserveDate.scss';
import {ARTICLES} from "../../data/articles";
import {compareDates, getArticleDate, string2date} from "../../util/date";
import {AdminArticleItem} from "../../component/admin/AdminArticleItem";
import {Pagination} from "../../component/Pagination";

export function AdminObserveDate() {

    let {date, page} = useParams();
    page = parseInt(page);
    const [selectedArticles, setSelectedArticles] = useState([]);
    const [totalPageNumber, setTotalPageNumber] = useState(0)
    const [errorOccurred, setErrorOccurred] = useState(false);

    useEffect(() => {
        document.title = `后台管理 - \`${date}\` - ${TAB_TITLE}`;
        let dt = string2date(date);
        if (dt === null || dt.toString() === 'Invalid Date') {
            setSelectedArticles([]);
            setErrorOccurred(true);
            return;
        }
        setErrorOccurred(false);
        let selected = ARTICLES.filter(item => compareDates(dt, getArticleDate(item)) === 0);
        setSelectedArticles(selected.slice((page - 1) * SIZE, page * SIZE));
        setTotalPageNumber(Math.ceil(selected.length / SIZE));
    }, [date, page])

    return (
        <div className={`observe-date`}>
            <h2>`{date}` 的文章</h2>

            {errorOccurred && (
                <div>错误的日期格式...</div>
            )}

            {(!errorOccurred && (selectedArticles.length === 0)) && (
                <div>什么也没有...</div>
            )}

            {!errorOccurred && selectedArticles.map((item, key) =>
                <AdminArticleItem key={key} item={item}/>)}

            {(!errorOccurred && selectedArticles.length > 0) && (
                <div className={'full-width flex-column center'}>
                    <Pagination page={page}
                                path={`/admin/date/${date}/page`}
                                totalPageNumber={totalPageNumber}/>
                </div>)}
        </div>
    );
}
