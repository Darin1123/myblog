import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {TAB_TITLE} from "../config/config";
import './SearchCategory.scss'
import {Link} from "react-router-dom";
import {CATEGORIES} from "../data/core/categories";


export function SearchCategory() {

    let {keyword} = useParams();

    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        document.title = `搜索分类 \`${keyword}\` - ${TAB_TITLE}`;

        setSelectedCategories(CATEGORIES.filter(item => {
            let lowerCaseCategory = item.toLowerCase();
            let lowerCaseKeyword = keyword.toLowerCase();
            return lowerCaseCategory.includes(lowerCaseKeyword) || lowerCaseKeyword.includes(lowerCaseCategory);
        }))
    }, [keyword]);

    return (
        <div className={'search-category'}>
            <h2>搜索分类 `{keyword}`</h2>
            {selectedCategories.length === 0 && (
                <div>
                    <div>没有 `{keyword}` 相关的分类...</div>
                    <div className={'m-t-5'}>去 <Link to={'/categories'}>分类</Link> 页</div>
                </div>
            )}
            {selectedCategories.map((item, key) =>
                <div className={'category-item'}
                     key={key}>
                    <Link to={`/category/${item}/page/1`}>{`${item} →`}</Link>
                </div>)}
        </div>
    );
}
