import {Link, NavLink} from "react-router-dom";
import {TAB_TITLE} from "../config/config";
import $ from "jquery";
import {SearchBar} from "./SearchBar";
import {useEffect, useState} from "react";
import './NavBar.scss';
import {ARTICLES} from "../data/core/articles";
import {CATEGORIES} from "../data/core/categories";
import {MOMENTS} from "../data/core/moments";
import IconSearch from "../resources/icons/search";
import IconX from "../resources/icons/x";
import IconMenu2 from "../resources/icons/menu-2";
import variables from '../css/export.scss';
import IconSun from "../resources/icons/sun";
import IconMoon from "../resources/icons/moon";


export default function NavBar(props) {

    const THRESHOLD = variables.THRESHOLD;


    let width = window.innerWidth;
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [toggleMenu, setToggleMenu] = useState(false)
    const [screenWidth, setScreenWidth] = useState(width)
    const [showCancel, setShowCancel] = useState(width > THRESHOLD);


    function toggleNav() {
        setToggleMenu(!toggleMenu);
    }

    async function handleOpenSearchBar() {
        await setShowSearchBar(true);
        $("#search-input").focus();
    }

    useEffect(() => {
        const changeWidth = () => {
            let width = window.innerWidth;
            if (width > THRESHOLD) {
                setToggleMenu(false);
                setShowCancel(true);
            } else {
                setShowCancel(false);
            }
            setScreenWidth(width);
        }

        window.addEventListener('resize', changeWidth);
    }, []);

    return (
        <nav className={props.dark ? 'dark-navbar' : ''}>
            <div className={'container'}>
                {screenWidth <= THRESHOLD &&
                    <Link to={'/'} className={'back-up-title'}>
                        {TAB_TITLE}
                    </Link>}
                {(toggleMenu || screenWidth > THRESHOLD) &&
                    <div className={'nav-main'}>
                        <Link to={'/'} className={'title'}>
                            {TAB_TITLE}
                        </Link>
                        <div className={'nav-items'}>
                            <NavLink className={'btn m-r-20'}
                                     activeClassName={'active-nav-item'}
                                     onClick={() => setToggleMenu(false)}
                                     to={'/articles/1'}>
                                所有文章 ({ARTICLES.length})
                            </NavLink>

                            {/*<NavLink className={'btn m-r-20'}*/}
                            {/*         activeClassName={'active-nav-item'}*/}
                            {/*         onClick={() => setToggleMenu(false)}*/}
                            {/*         to={'/study'}>*/}
                            {/*    学习*/}
                            {/*</NavLink>*/}

                            <NavLink className={'btn m-r-20'}
                                     activeClassName={'active-nav-item'}
                                     onClick={() => setToggleMenu(false)}
                                     to={'/categories'}>
                                分类 ({CATEGORIES.length})
                            </NavLink>

                            <NavLink className={'btn m-r-20'}
                                     activeClassName={'active-nav-item'}
                                     onClick={() => setToggleMenu(false)}
                                     to={'/archived'}>
                                归档
                            </NavLink>

                            <NavLink className={'btn m-r-20'}
                                     activeClassName={'active-nav-item'}
                                     onClick={() => setToggleMenu(false)}
                                     to={'/moments'}>
                                时刻 ({MOMENTS.length})
                            </NavLink>

                            <NavLink className={'btn m-r-20'}
                                     activeClassName={'active-nav-item'}
                                     onClick={() => setToggleMenu(false)}
                                     to={'/feeling-lucky'}>
                                Feeling Lucky!
                            </NavLink>

                            <NavLink activeClassName={'active-nav-item'}
                                     onClick={() => setToggleMenu(false)}
                                     to={'/about'}>关于</NavLink>
                            {/*{screenWidth <= 500 &&*/}
                            {/*<span className={'back-up-search'}*/}
                            {/*     onClick={handleOpenSearchBar}>*/}
                            {/*    搜索*/}
                            {/*</span>}*/}
                            {(screenWidth <= THRESHOLD) && (
                                <SearchBar dark={props.dark} setToggleMenu={setToggleMenu} setShowSearchBar={setShowSearchBar} showCancel={showCancel}/>
                            )}
                        </div>
                    </div>}
                {(screenWidth > THRESHOLD) && (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div onClick={props.toggleDark} className={`dark-mode`}>
                            {props.dark ? (
                                <IconMoon/>
                            ) : (
                                <IconSun/>
                            )}
                        </div>


                        <div className={'search'}
                             onClick={handleOpenSearchBar}>
                            <IconSearch/>
                        </div>
                    </div>
                )}
            </div>

            <div className={'menu-button'}>
                <div onClick={props.toggleDark} className={`dark-mode`}>
                    {props.dark ? (
                        <IconMoon/>
                    ) : (
                        <IconSun/>
                    )}
                </div>
                <div onClick={toggleNav}>{toggleMenu ? (<IconX/>) : (<IconMenu2/>)}</div>
            </div>


            {(screenWidth > THRESHOLD && showSearchBar) &&
                <SearchBar  dark={props.dark}  setToggleMenu={setToggleMenu} setShowSearchBar={setShowSearchBar} showCancel={showCancel}/>}
        </nav>
    );
}
