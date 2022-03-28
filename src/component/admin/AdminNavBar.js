import {Link, NavLink} from "react-router-dom";
import {useEffect, useState} from "react";
import './AdminNavBar.scss';
import $ from "jquery";
import {AdminSearchBar} from "./AdminSearchBar";


export default function AdminNavBar() {

    const RESPONSIVE_THRESHOLD = 600;
    let width = window.innerWidth;

    const [showSearchBar, setShowSearchBar] = useState(false);
    const [toggleMenu, setToggleMenu] = useState(false)
    const [screenWidth, setScreenWidth] = useState(width)
    const [showCancel, setShowCancel] = useState(width > 500);


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
            if (width > RESPONSIVE_THRESHOLD) {
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
        <div className={`admin-nav`}>
            <div className={'container'}>
                {screenWidth <= RESPONSIVE_THRESHOLD &&
                    <Link to={'/admin/dashboard'} className={'back-up-title'}>
                        🌈🐱
                    </Link>}
                {(toggleMenu || screenWidth > RESPONSIVE_THRESHOLD) &&
                    <div className={'nav-main'}>
                        <Link to={'/admin/dashboard'} className={'title'} style={{paddingBottom: 0, borderBottom: `none`}}>
                            🌈🐱
                        </Link>
                        <div className={'nav-items'}>
                            <NavLink activeClassName={`active-nav-item`}
                                     className={'btn m-r-20'}
                                  onClick={() => setToggleMenu(false)}
                                  to={'/admin/editor'}>
                                写文章
                            </NavLink>
                            <NavLink activeClassName={`active-nav-item`}  className={'btn m-r-20'}
                                  onClick={() => setToggleMenu(false)}
                                  to={'/admin/articles/1'}>
                                所有文章
                            </NavLink>
                            <NavLink activeClassName={`active-nav-item`}  className={'btn m-r-20'}
                                  onClick={() => setToggleMenu(false)}
                                  to={'/admin/categories'}>
                                分类
                            </NavLink>
                            <NavLink activeClassName={`active-nav-item`}  className={'btn m-r-20'}
                                  onClick={() => setToggleMenu(false)}
                                  to={'/admin/images'}>
                                图库
                            </NavLink>
                            <NavLink activeClassName={`active-nav-item`}  className={'nav-main-item'}
                                  onClick={() => setToggleMenu(false)}
                                  to={'/admin/password'}>
                                密码
                            </NavLink>
                            <NavLink activeClassName={`active-nav-item`}  className={'nav-main-item'}
                                     onClick={() => setToggleMenu(false)}
                                     to={'/admin/moments/1'}>
                                时刻
                            </NavLink>
                            <NavLink activeClassName={`active-nav-item`}  className={'nav-main-item'}
                                     onClick={() => setToggleMenu(false)}
                                     to={'/admin/about'}>
                                关于
                            </NavLink>
                            <Link className={'nav-main-item'}
                                  target={"_blank"}
                                  rel={"noopener noreferrer"}
                                  onClick={() => setToggleMenu(false)}
                                  to={'/'}>
                                转到博客 →
                            </Link>

                            {(screenWidth <= RESPONSIVE_THRESHOLD) && (
                                <AdminSearchBar setToggleMenu={setToggleMenu} setShowSearchBar={setShowSearchBar} showCancel={showCancel}/>
                            )}
                        </div>
                    </div>}
                {(screenWidth > RESPONSIVE_THRESHOLD) &&
                    <div className={'search'}
                         onClick={handleOpenSearchBar}>搜索</div>}
            </div>

            <div className={'menu-button'}
                 onClick={toggleNav}>{toggleMenu ? '关闭' : '菜单'}</div>

            {(screenWidth > RESPONSIVE_THRESHOLD && showSearchBar) &&
                <AdminSearchBar setToggleMenu={setToggleMenu} setShowSearchBar={setShowSearchBar} showCancel={showCancel}/>}
        </div>
    );
}
