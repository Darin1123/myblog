import {Link} from "react-router-dom";
import './ArticleItem.scss';
import {convertDate, elapsedTime, getArticleDate} from "../util/date";
import {NEW_ARTICLE_RANGE} from "../config";

export function ArticleItem(props) {
    let item = props.item

    let today = new Date();
    let articleDate = getArticleDate(item);

    let newArticle = (today.getTime() - articleDate.getTime()) / (1000 * 3600 * 24) < NEW_ARTICLE_RANGE;


    return (
        <div className={'article-item ' + (props.dark? 'article-item-dark' : '')}>
            <div className={'flex full-width space-between'}>
                <div className={'flex center'}>
                    <Link className={'m-r-20 text-14 bold title'} to={`/article/${item.id}`}>
                        {item.title}
                    </Link>
                    {(newArticle) && (
                        <span className={`new-tag`}>New!</span>
                    )}
                    {item.category !== null &&
                        <Link className={'text-12 category-link'} to={`/category/${item.category}/page/1`}>
                            {item.category} →
                        </Link>}
                </div>
                <div className={'time'}>
                    {props.elapsedTime !== undefined && props.elapsedTime ? elapsedTime(item.date) : `${item.date.year} 年 ${item.date.month} 月 ${item.date.day} 日`}
                </div>
            </div>
            <div className={'peek m-t-20'}>
                {item.peek !== null ? item.peek : '如题所示'}...
            </div>
        </div>
    );
}
