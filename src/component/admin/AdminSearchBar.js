import IconSearch from "../../resources/icons/search";
import {useState} from "react";
import $ from "jquery";
import React, {useRef, useEffect} from "react";
import './AdminSearchBar.scss';
import {SEARCH_ARTICLE_TITLE_LENGTH} from "../../config";
import {ARTICLES} from "../../data/articles";


export function AdminSearchBar(props) {

    const wrapperRef = useRef(null);
    useOutsideAlerter(props, wrapperRef);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [foundArticles, setFoundArticles] = useState([]);

    async function search() {
        if (searchKeyword.trim().length === 0) {
            setSearchKeyword('');
            $("#search-input").val('');
            return;
        }
        await props.setShowSearchBar(false);
        let trimmedKeyword = searchKeyword.trim().replace(/\//g, "");
        document.location.hash = `/admin/search/${trimmedKeyword}/page/1`;
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            search();
        }
    }

    function handleKeywordChange(e) {
        let keyword = e.target.value;
        setSearchKeyword(keyword);
        searchArticle(keyword);
    }


    function searchArticle(keyword) {
        keyword = keyword.toLowerCase();
        let foundArticles = ARTICLES.filter(item => {

            if (item.title.includes(keyword)) {
                return true;
            }
            if (item.category !== null && item.category.includes(keyword)) {
                return true;
            }
            if (keyword.includes(item.category)) {
                return true;
            }
            if (keyword.includes(item.title)) {
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
        <div className={'admin-search-bar'} ref={wrapperRef}>
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
                    {(foundArticles.length > 0 && (
                        <div className={'section'}>
                            <b>文章</b>
                            {foundArticles.slice(0, 5).map((item, key) => (
                                <div key={key} className={'section-item'}
                                     onClick={() => goto(`/admin/edit/${item.id}`)}>
                                    {item.title.length > SEARCH_ARTICLE_TITLE_LENGTH ? item.title.slice(0, SEARCH_ARTICLE_TITLE_LENGTH - 3) + '...' : item.title}
                                </div>
                            ))}
                            {foundArticles.length > 5 && (
                                <div className={'section-item'} onClick={() => goto(`/admin/search/${searchKeyword}/page/1`)}>查看全部 →</div>
                            )}
                        </div>
                    ))}
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
