import {Link} from "react-router-dom";
import './AdminArticleItem.scss';

export function AdminArticleItem(props) {
    let item = props.item
    return (
        <div className={'admin-article-item'}>
            <div className={'flex full-width space-between'}>
                <div className={'flex center'}>
                    <Link className={'m-r-20 text-14 title'} to={`/admin/edit/${item.id}`}>
                        {item.title}
                    </Link>
                </div>
                <div className={'time'}>
                    {`${item.date.year} 年 ${item.date.month} 月 ${item.date.day} 日 `}
                </div>
            </div>
            <div className={'peek'}>
                {item.peek !== null ? item.peek : '如题所示'}...
            </div>
        </div>
    );
}
