import './PageNotFound.scss';
import {Link} from "react-router-dom";
import {useEffect} from "react";
import {TAB_TITLE} from "../config";

export function PageNotFound() {

    useEffect(() => {
        document.title = `页面不见了 - ${TAB_TITLE}`
    }, []);

    return (
        <div className={'page-not-found'}>
            <h2>404</h2>
            <p>
                糟糕, 这个页面丢失了...
            </p>
            <h4>
                可能想看?
            </h4>
            <div className={'links'}>
                <Link to={'/'}>主页</Link>
                <Link to={'/categories'}>分类</Link>
                <Link to={'/archived'}>归档</Link>
                <Link to={'/moments'}>时刻</Link>
                <Link to={'/feeling-lucky'}>Feeling lucky</Link>
                <Link to={'/about'}>关于</Link>
            </div>
        </div>
    );
}

