import IconSearch from "../resources/icons/search";
import {useState} from "react";
import $ from "jquery";
import React, {useRef, useEffect} from "react";
import './SearchBar.scss';
import {SEARCH_ARTICLE_TITLE_LENGTH} from "../config";
import {CATEGORIES} from "../data/categories";
import {ARTICLES} from "../data/articles";


export function SearchBar(props) {

    const wrapperRef = useRef(null);
    useOutsideAlerter(props, wrapperRef);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [foundCategories, setFoundCategories] = useState([]);
    const [foundArticles, setFoundArticles] = useState([]);

    async function search() {
        if (searchKeyword.trim().length === 0) {
            setSearchKeyword('');
            $("#search-input").val('');
            return;
        }
        await props.setShowSearchBar(false);
        let trimmedKeyword = searchKeyword.trim().replace(/\//g, "");
        document.location.hash = `/search/${trimmedKeyword}/page/1`;
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            search();
        }
    }

    function handleKeywordChange(e) {
        let keyword = e.target.value;
        setSearchKeyword(keyword);
        searchCategory(keyword);
        searchArticle(keyword);
    }

    function searchCategory(keyword) {
        keyword = keyword.toLowerCase();
        let foundCategories = CATEGORIES.filter(item => {
            let lowerCaseCategory = item.toLowerCase();
            if (lowerCaseCategory.includes(keyword)) {
                return true;
            }
            return keyword.includes(lowerCaseCategory);
        });

        setFoundCategories(foundCategories);
    }

    function searchArticle(keyword) {
        keyword = keyword.toLowerCase();
        let foundArticles = ARTICLES.filter(item => {
            let lowerCaseTitle = item.title.toLowerCase();


            if (lowerCaseTitle.includes(keyword)) {
                return true;
            }
            if (item.category !== null) {
                let lowerCaseCategory = item.category.toLowerCase();
                if (lowerCaseCategory.includes(keyword)) {
                    return true;
                }
                if (keyword.includes(lowerCaseCategory)) {
                    return true;
                }
            }

            if (keyword.includes(lowerCaseTitle)) {
                return true;
            }
            if (keyword.includes(item.date.year)) {
                return true;
            }
            if (item.content.includes(keyword)) {
                return true;
            }

            return false;
        });

        setFoundArticles(foundArticles);
    }

    async function goto(location) {
        await props.setToggleMenu(false);
        await props.setShowSearchBar(false);
        document.location.hash = location;
    }

    return (
        <div className={'search-bar ' + (props.dark ? 'dark-search-bar' : '')} ref={wrapperRef}>
            <div className={'search-input-container'}>
                <div className={'container'}>
                    <input id={'search-input'}
                           placeholder={'搜索关键字'}
                           onKeyDown={handleKeyDown}
                           onChange={handleKeywordChange}/>
                    <div className={'button'}>
                        <IconSearch onClick={search}/>
                    </div>
                </div>

                {(props.showCancel) && (
                    <div className={'close'} onClick={() => props.setShowSearchBar(false)}>
                        取消
                    </div>
                )}
            </div>

            {searchKeyword.trim().length > 0 &&
                <div className={'result'}>
                    {(foundCategories.length > 0 && (
                        <div className={'section'}>
                            <b>分类</b>
                            {foundCategories.slice(0, 5).map((item, key) => (
                                <div key={key} onClick={() => goto(`/category/${item}/page/1`)}
                                     className={'section-item'}>
                                    {item}
                                </div>
                            ))}
                            {foundCategories.length > 5 && (
                                <div className={'section-item'} onClick={() => goto(`/search-category/${searchKeyword}`)}>查看全部 →</div>
                            )}
                        </div>
                    ))}
                    {(foundArticles.length > 0 && (
                        <div className={'section'}>
                            <b>文章</b>
                            {foundArticles.slice(0, 5).map((item, key) => (
                                <div key={key} className={'section-item'}
                                     onClick={() => goto(`/article/${item.id}`)}>
                                    {item.title.length > SEARCH_ARTICLE_TITLE_LENGTH ? item.title.slice(0, SEARCH_ARTICLE_TITLE_LENGTH - 3) + '...' : item.title}
                                </div>
                            ))}
                            {foundArticles.length > 5 && (
                                <div className={'section-item'} onClick={() => goto(`/search/${searchKeyword}/page/1`)}>查看全部 →</div>
                            )}
                        </div>
                    ))}
                    {(foundCategories.length === 0 && foundArticles.length === 0) && (
                        <div className={'italic'}>什么也没有搜到...</div>
                    )}
                </div>}
        </div>
    );
}

function useOutsideAlerter(props, ref) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                props.setShowSearchBar(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, props]);
}
