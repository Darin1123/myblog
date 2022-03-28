import {Link} from "react-router-dom";
import './ArticleItem.scss';
import {calculateElapsedTime, getArticleDate} from "../util/util";
import {NEW_ARTICLE_RANGE} from "../config/config";

export function ArticleItem(props) {
    let item = props.item

    let today = new Date();
    let articleDate = getArticleDate(item);

    let newArticle = (today.getTime() - articleDate.getTime()) / (1000 * 3600 * 24) < NEW_ARTICLE_RANGE;


    return (
        <div className={'article-item'}>
            <div className={'flex full-width space-between'}>
                <div className={'flex center'}>
                    <Link className={'m-r-20 text-14 bold'} to={`/article/${item.id}`}>
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
                    {(props.useElapsedTime !== undefined && props.useElapsedTime) ?  calculateElapsedTime(item.date) : `${item.date.year} 年 ${item.date.month} 月 ${item.date.day} 日 `}
                </div>
            </div>
            <div className={'peek'}>
                {item.peek !== null ? item.peek : '如题所示'}...
            </div>
        </div>
    );
}
