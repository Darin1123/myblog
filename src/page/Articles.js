import {SIZE, TAB_TITLE} from "../config";
import './Articles.scss';
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {Pagination} from "../component/Pagination";
import {ArticleItem} from "../component/ArticleItem";
import {ARTICLES} from "../data/articles";


export function Articles() {

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
        document.title = `所有文章 - ${TAB_TITLE}`
        setSelectedArticles(ARTICLES.slice((page - 1) * SIZE, page * SIZE));
    }, [page]);

    return (
        <div className={'main'}>
            {selectedArticles.map((item, key) =>
                <ArticleItem key={key} item={item}/>)}

            {ARTICLES.length === 0 && (
                <div>什么也没有...</div>
            )}

            {ARTICLES.length > 0 && (
            <div className={'full-width flex-column center'}>
                <Pagination page={page}
                            path={'/articles'}
                            totalPageNumber={totalPageNumber}/>
            </div>)}
        </div>
    );

}
