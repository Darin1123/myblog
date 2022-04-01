import {useParams} from "react-router";
import './SingleCategory.scss';
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {NEW_ARTICLE_RANGE, SIZE, TAB_TITLE} from "../config";
import {Pagination} from "../component/Pagination";
import {ARTICLES} from "../data/articles";
import {CATEGORY_NETWORK} from "../data/categories";
import {getArticleDate} from "../util/util";

export function SingleCategory() {

    const [selectedArticles, setSelectedArticles] = useState([]);
    const [totalPageNumber, setTotalPageNumber] = useState(0);
    const [relatedCategories, setRelatedCategories] = useState([]);
    let {category, page} = useParams();
    page = parseInt(page);


    useEffect(() => {
        document.title = `分类 - ${category} - ${TAB_TITLE}`;
        let articles = ARTICLES.filter(item => item.category === category);
        setSelectedArticles(articles.slice((page - 1) * SIZE, page * SIZE));
        setTotalPageNumber(Math.ceil(articles.length / SIZE));
        if (CATEGORY_NETWORK[category] !== undefined) {
            setRelatedCategories(CATEGORY_NETWORK[category]);
        }
    }, [page, category]);

    return (
        <div className={'single-category'}>
            <div className={'crumbs'}>
                <span>
                    <Link to={`/`}>主页</Link>&nbsp;&nbsp;·&nbsp;&nbsp;
                    <Link to={`/categories`}>分类</Link>&nbsp;&nbsp;·&nbsp;&nbsp;
                </span>
                <span>
                    {category}
                </span>
            </div>

            <h1>{category}</h1>

            {totalPageNumber === 0 &&
                <div>
                    没有文章, 再等等.
                </div>}

            {totalPageNumber > 0 &&
                <div>
                    {selectedArticles.map((item, key) =>
                        <div key={key} className={'article-item'}>
                            <div className={'flex full-width space-between'}>
                                <div className={'flex center'}>
                                    <Link className={'m-r-10 text-16 bold'} to={`/article/${item.id}`}>
                                        {item.title}
                                    </Link>
                                    {((new Date().getTime() - getArticleDate(item).getTime()) / (1000 * 3600 * 24) < NEW_ARTICLE_RANGE) && (
                                        <span className={`new-tag`}>New!</span>
                                    )}
                                </div>

                                <div className={'time'}>
                                    {`${item.date.year} 年 ${item.date.month} 月 ${item.date.day} 日 `}
                                </div>
                            </div>
                            <div className={'peek'}>
                                {item.peek === null ? '如题所示' : item.peek}...
                            </div>
                        </div>)}
                </div>}

            {(relatedCategories.length !== 0) && (
                <div className={`related-categories`}>
                    <div>相关分类: </div>
                    {relatedCategories.map((item, key) => (
                        <Link to={`/category/${item}/page/1`} key={key}>
                            {item}
                        </Link>
                    ))}
                </div>
            )}

            {totalPageNumber > 0 &&
                <div className={'full-width flex-column center'}>
                    <Pagination page={page}
                                path={`/category/${category}/page`}
                                totalPageNumber={totalPageNumber}/>
                </div>}
        </div>
    );

}
