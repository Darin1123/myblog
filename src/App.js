import './App.scss';
import './css/util.scss';
import {Route, HashRouter} from "react-router-dom";
import {Articles} from "./page/Articles";
import {Article} from "./page/Article";
import {Categories} from "./page/Categories";
import {About} from "./page/About";
import {SingleCategory} from "./page/SingleCategory";
import {Switch} from "react-router";
import {SearchResult} from "./page/SearchResult";
import {PageNotFound} from "./page/PageNotFound";
import {Editor} from "./page/admin/Editor";
import {Home} from "./page/Home";
import NavBar from "./component/NavBar";
import {SearchCategory} from "./page/SearchCategory";
import {Images} from "./page/admin/Images";
import {HOST_LINK, HOST_NAME, MY_PASSWORD, NAME_IN_ENGLISH, THEME} from "./config";
import {EncryptPassword} from "./page/admin/EncryptPassword";
import React, {useEffect, useState} from "react";
import AdminNavBar from "./component/admin/AdminNavBar";
import {sha256} from "js-sha256";
import {Dashboard} from "./page/admin/Dashboard";
import {AdminPageNotFound} from "./page/admin/AdminPageNotFound";
import {AdminArticles} from "./page/admin/AdminArticles";
import {Edit} from "./page/admin/Edit";
import {AdminSearchResult} from "./page/admin/AdminSearchResult";
import {AdminObserveDate} from "./page/admin/AdminObserveDate";
import {AdminAbout} from "./page/admin/AdminAbout";
import {AdminCategories} from "./page/admin/AdminCategories";
import {Moments} from "./page/Moments";
import {ObserveDate} from "./page/ObserveDate";
import {AllMoments} from "./page/admin/AllMoments";
import {EditMoment} from "./page/admin/EditMoment";
import {AdminMoments} from "./page/admin/AdminMoments";
import {AddMoment} from "./page/admin/AddMoment";
import {Playground} from "./page/Playground";
import {Archived} from "./page/Archived";
import './css/THEME.scss';
import {FeelingLucky} from "./page/FeelingLucky";
import $ from 'jquery';
import variables from "./css/export.scss";

function App() {

    const [adminVerified, setAdminVerified] = useState(false);
    const [adminPassword, setAdminPassword] = useState(``);
    const [adminGoTo, setAdminGoTo] = useState('/admin/dashboard');
    const [authenticationErrorMessage, setAuthenticationErrorMessage] = useState(null);

    const [dark, setDark] = useState(decideDefaultDark());

    function authenticate() {
        if (adminPassword.trim().length === 0) {
            setAuthenticationErrorMessage(null);
            setAdminPassword(``);
            return;
        }
        if (sha256(adminPassword) === MY_PASSWORD) {
            setAdminVerified(true);
            document.location.hash = adminGoTo;
        } else {
            setAuthenticationErrorMessage(`错误的密码`);
        }
    }

    function handleOnKeyDown(e) {
        if (e.key === 'Enter') {
            authenticate();
        }
    }

    function toggleDark() {
        setDark(!dark);
    }

    function decideDefaultDark() {
        let now = new Date().getHours();
        return now >= 19 || now <= 5;
    }

    useEffect(() => {
        decideDefaultDark();
        let hash = document.location.hash.replace('#', '');
        let html = $("html");

        const DARK_BG = variables.DARK_BG;
        const DARK_TEXT_COLOR = variables.DARK_TEXT_COLOR;
        const LIGHT_BG = variables.LIGHT_BG;
        const LIGHT_TEXT_COLOR= variables.LIGHT_TEXT_COLOR;

        if (dark) {
            html.css("background-color", DARK_BG);
            html.css("color", DARK_TEXT_COLOR);
            $('html a').css("color", DARK_TEXT_COLOR);
        } else {
            html.css("background-color", LIGHT_BG);
            html.css("color", LIGHT_TEXT_COLOR);
            $('html a').css("color", LIGHT_TEXT_COLOR);
        }
        if (hash.startsWith('/admin')) {
            if (hash === '/admin' || hash === '/admin/') {
                setAdminGoTo('/admin/dashboard');
            } else {
                setAdminGoTo(hash);
            }
        }
    }, [dark]);

    return (
        <div className={"App " + (dark ? 'dark' : '') + THEME}>
            <HashRouter>
                <Switch>
                    <Route path={`/admin`}>
                        {(adminVerified) && (
                            <React.Fragment>
                                <AdminNavBar toggleDark={toggleDark} dark={dark}/>
                                <main>
                                    <Switch>
                                        <Route path={`/admin/dashboard`}>
                                            <Dashboard/>
                                        </Route>
                                        <Route path={'/admin/articles/:page'} exact={true}>
                                            <AdminArticles/>
                                        </Route>
                                        <Route path={'/admin/edit/:id'}>
                                            <Edit/>
                                        </Route>
                                        <Route path={'/admin/categories'}>
                                            <AdminCategories/>
                                        </Route>
                                        <Route path={'/admin/editor'}>
                                            <Editor/>
                                        </Route>
                                        <Route path={'/admin/images'}>
                                            <Images/>
                                        </Route>
                                        <Route path={'/admin/date/:date/page/:page'}>
                                            <AdminObserveDate/>
                                        </Route>
                                        <Route path={'/admin/password'}>
                                            <EncryptPassword/>
                                        </Route>
                                        <Route path={'/admin/about'}>
                                            <AdminAbout/>
                                        </Route>
                                        <Route path={'/admin/moments'}>
                                            <AdminMoments/>
                                        </Route>
                                        <Route path={'/admin/all-moments/:page'}>
                                            <AllMoments/>
                                        </Route>
                                        <Route path={'/admin/add-moment'}>
                                            <AddMoment/>
                                        </Route>
                                        <Route path={'/admin/edit-moment/:id'}>
                                            <EditMoment/>
                                        </Route>
                                        <Route path={'/admin/search/:keyword/page/:page'}>
                                            <AdminSearchResult/>
                                        </Route>
                                        <Route>
                                            <AdminPageNotFound/>
                                        </Route>
                                    </Switch>
                                </main>
                            </React.Fragment>
                        )}
                        {(!adminVerified) && (
                            <div className={`admin-authentication`}>
                                <h2>请输入密码</h2>
                                {authenticationErrorMessage !== null && (
                                    <span className={`error-message`}>
                                        {authenticationErrorMessage}
                                    </span>
                                )}
                                <input onKeyDown={handleOnKeyDown}
                                       type={`password`}
                                       placeholder={`请输入密码...`}
                                       onChange={(e) => setAdminPassword(e.target.value)}/>
                                <div className={`confirm-button`} onClick={authenticate}>确认</div>
                            </div>
                        )}
                    </Route>
                    <Route>
                        <React.Fragment>
                            <NavBar dark={dark} toggleDark={toggleDark}/>
                            <main>
                                <Switch>
                                    <Route path={'/'} exact={true}>
                                        <Home dark={dark}/>
                                    </Route>
                                    <Route path={'/articles/:page'} exact={true}>
                                        <Articles dark={dark}/>
                                    </Route>
                                    <Route path={'/categories'}>
                                        <Categories/>
                                    </Route>
                                    <Route path={'/category/:category/page/:page'}>
                                        <SingleCategory/>
                                    </Route>
                                    <Route path={'/about'}>
                                        <About/>
                                    </Route>
                                    <Route path={'/date/:date/page/:page'}>
                                        <ObserveDate/>
                                    </Route>
                                    <Route path={'/moments'}>
                                        <Moments/>
                                    </Route>
                                    <Route path={'/note/:id'}>
                                        <About/>
                                    </Route>
                                    <Route path={'/article/:id'} dark={dark}>
                                        <Article/>
                                    </Route>
                                    <Route path={'/search/:keyword/page/:page'}>
                                        <SearchResult/>
                                    </Route>
                                    <Route path={'/search-category/:keyword'}>
                                        <SearchCategory/>
                                    </Route>
                                    <Route path={'/archived'}>
                                        <Archived dark={dark}/>
                                    </Route>
                                    <Route path={'/feeling-lucky'}>
                                        <FeelingLucky/>
                                    </Route>
                                    {/*<Route path={'/study'}>*/}
                                    {/*    <Study/>*/}
                                    {/*</Route>*/}
                                    {/*<Route path={'/study-subject/:id'}>*/}
                                    {/*    <StudySubject/>*/}
                                    {/*</Route>*/}
                                    <Route path={'/playground'}>
                                        <Playground/>
                                    </Route>
                                    <Route>
                                        <PageNotFound/>
                                    </Route>
                                </Switch>
                            </main>
                        </React.Fragment>
                    </Route>
                </Switch>
            </HashRouter>


            <footer>
                <div className={'m-b-5'}>
                    Proudly powered by <a href={'https://github.com/Darin1123/RainbowCat'}>🌈🐱</a>.&nbsp;
                    由&nbsp;
                    <a href={HOST_LINK} target="_blank" rel="noreferrer">{HOST_NAME}</a>
                    &nbsp;托管.
                </div>
                <div>Copyright © {new Date().getFullYear()} {NAME_IN_ENGLISH}. 保留所有权利.</div>
            </footer>
        </div>
    );
}

export default App;
