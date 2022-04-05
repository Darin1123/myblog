import {Link, NavLink} from "react-router-dom";
import {TAB_TITLE} from "../config";
import $ from "jquery";
import {SearchBar} from "./SearchBar";
import {useEffect, useRef, useState} from "react";
import './NavBar.scss';
import {ARTICLES} from "../data/articles";
import {CATEGORIES} from "../data/categories";
import {MOMENTS} from "../data/moments";
import IconSearch from "../resources/icons/search";
import IconX from "../resources/icons/x";
import IconMenu2 from "../resources/icons/menu-2";
import variables from '../css/export.scss';
import IconSun from "../resources/icons/sun";
import IconMoon from "../resources/icons/moon";
import Tilt from "react-tilt/dist/tilt";
import IconAtom from "../resources/icons/atom";
import {getTopPortals} from "../mockService/portalService";


export default function NavBar(props) {

    const THRESHOLD = variables.THRESHOLD;


    let width = window.innerWidth;
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [toggleMenu, setToggleMenu] = useState(false)
    const [screenWidth, setScreenWidth] = useState(width)
    const [showCancel, setShowCancel] = useState(width > THRESHOLD);
    const [showPortals, setShowPortals] = useState(false);


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
                        <div className={`nav-portals`}>
                            <Tilt options={{scale: 1.2, max: 0}} >
                                <IconAtom onClick={() => setShowPortals(true)}/>
                            </Tilt>
                            {(showPortals) && (
                                <Portals dark={props.dark} closePortals={() => setShowPortals(false)}/>
                            )}
                        </div>

                        <Tilt options={{scale: 1.2, max: 0}}>
                            <div onClick={props.toggleDark} className={`dark-mode`}>
                                {props.dark ? (
                                    <IconMoon/>
                                ) : (
                                    <IconSun/>
                                )}
                            </div>
                        </Tilt>

                        <Tilt options={{scale: 1.2, max: 0}}>
                            <div className={'search'}
                                 onClick={handleOpenSearchBar}>
                                <IconSearch/>
                            </div>
                        </Tilt>

                    </div>
                )}
            </div>

            {(screenWidth <= THRESHOLD) && (
                <div className={'menu-button'}>
                    <div className={`nav-portals`}>
                        <Tilt options={{scale: 1.2, max: 0}} >
                            <IconAtom onClick={() => setShowPortals(true)}/>
                        </Tilt>
                        {(showPortals) && (
                            <Portals dark={props.dark} closePortals={() => setShowPortals(false)}/>
                        )}
                    </div>
                    <Tilt options={{scale: 1.2, max: 0}}>
                        <div onClick={props.toggleDark} className={`dark-mode`}>
                            {props.dark ? (
                                <IconMoon/>
                            ) : (
                                <IconSun/>
                            )}
                        </div>
                    </Tilt>
                    <Tilt options={{scale: 1.2, max: 0}}>
                        <div onClick={toggleNav}>{toggleMenu ? (<IconX/>) : (<IconMenu2/>)}</div>
                    </Tilt>
                </div>
            )}

            {(screenWidth > THRESHOLD && showSearchBar) &&
                <SearchBar dark={props.dark} setToggleMenu={setToggleMenu} setShowSearchBar={setShowSearchBar} showCancel={showCancel}/>}
        </nav>
    );
}

function useOutsideAlerter(ref, func) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                func();
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

function Portals(props) {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, props.closePortals);

    return (
        <div ref={wrapperRef} className={`portals-main ` + (props.dark? 'dark-portals-main' : '')}>
            {getTopPortals().map((item, key) => (
                <a key={key} href={item.href} target={'_blank'} rel="noreferrer">{item.name}</a>
            ))}

            <Link to={'/portals'}>传送门 →</Link>
        </div>
    );
}
