import {Link} from "react-router-dom";
import './Pagination.scss';

/**
 * This is an url-based pagination component. Thus, it must use inside a <Router/> component.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function Pagination(props) {

    let page = props.page;
    let totalPageNumber = props.totalPageNumber;
    let path = props.path;


    return (
        <div className={'pagination'}>
            {/* 上一页 */}
            {page !== 1 &&
                <Link className={'clickable'} to={`${path}/${page - 1}`}>← 上一页</Link>}
            {/* 第一页 */}
            {page > 2 &&
                <Link className={'clickable'} to={`${path}/1`}>1</Link>}
            {/* ... */}
            {page > 4 &&
                <div>...</div>}
            {/* -2 */}
            {page > 3 &&
                <Link className={'clickable'} to={`${path}/${page - 2}`}>{page - 2}</Link>}
            {/* -1 */}
            {page !== 1 &&
                <Link className={'clickable'} to={`${path}/${page - 1}`}>{page - 1}</Link>}

            <div style={{textDecoration: 'underline'}}>{page}</div>

            {/* +1 */}
            {page !== totalPageNumber &&
                <Link className={'clickable'} to={`${path}/${page + 1}`}>{page + 1}</Link>}
            {/* +2 */}
            {(page + 2) < totalPageNumber &&
                <Link className={'clickable'} to={`${path}/${page + 2}`}>{page + 2}</Link>}
            {/* ... */}
            {totalPageNumber - page > 3 &&
                <div>...</div>}
            {totalPageNumber !== 1 && (
                totalPageNumber - page > 1 || (page === 1 && totalPageNumber !== 2)
                ) &&
                <Link className={'clickable'} to={`${path}/${totalPageNumber}`}>{totalPageNumber}</Link>}
            {page !== totalPageNumber &&
                <Link className={'clickable'} to={`${path}/${page + 1}`}>下一页 →</Link>}
        </div>
    );
}
