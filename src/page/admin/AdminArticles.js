import {SIZE, TAB_TITLE} from "../../config";
import './AdminArticles.scss';
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {Pagination} from "../../component/Pagination";
import {ARTICLES} from "../../data/articles";
import {AdminArticleItem} from "../../component/admin/AdminArticleItem";


export function AdminArticles() {

    const [selectedArticles, setSelectedArticles] = useState([]);
    let {page} = useParams();
    if (!page) {
        page = 1;
    } else {
        page = parseInt(page);
    }
    let totalPageNumber;
    totalPageNumber = Math.ceil(ARTICLES.length / SIZE);

    useEffect(() => {
        document.title = `后台管理 - 所有文章 - ${TAB_TITLE}`
        setSelectedArticles(ARTICLES.slice((page - 1) * SIZE, page * SIZE));
    }, [page]);

    return (
        <div className={'admin-articles'}>
            {selectedArticles.map((item, key) =>
                <AdminArticleItem key={key} item={item}/>)}

            {ARTICLES.length === 0 && (
                <div>什么也没有...</div>
            )}

            {ARTICLES.length > 0 && (
            <div className={'full-width flex-column center'}>
                <Pagination page={page}
                            path={'/admin/articles'}
                            totalPageNumber={totalPageNumber}/>
            </div>)}
        </div>
    );

}
