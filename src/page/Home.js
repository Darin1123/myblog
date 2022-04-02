import './Home.scss';
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {EMAIL, HOME_RECENT_YEAR, HOME_TOP_ARTICLES, NAME, TAB_TITLE} from "../config";
import {ArticleItem} from "../component/ArticleItem";
import {TOP_ARTICLES} from "../data/page/home";
import {ARTICLES} from "../data/articles";
import {RecentYear} from "../component/RecentYear";
import {MOMENTS} from "../data/moments";
import feelingLucky from '../resources/special/feeling-lucky.svg';
import {Announcement} from "../component/Announcement";
import Tilt from "react-tilt/dist/tilt";
import {getOnAnnouncements} from "../mockService/announcementService";
import {getTopArticles} from "../mockService/articleService";
import {getHomeCategories} from "../mockService/categoryService";


export function Home(props) {

    const [announcements, setAnnouncements] = useState([]);
    const [articles, setArticles] = useState([]);
    const [homeCategories, setHomeCategories] = useState([]);

    useEffect(() => {
        document.title = `主页 - ${TAB_TITLE}`;
        setAnnouncements(getOnAnnouncements());
        setArticles(getTopArticles());
        setHomeCategories(getHomeCategories());
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={'home'}>
            <div className={`announcements`}>
                {announcements.map((item, key) => (
                    <Announcement content={item.content}
                                  key={key}
                                  consistent={item.consistent}
                                  type={item.type}
                                  dark={props.dark}/>
                ))}
            </div>

            {(HOME_TOP_ARTICLES) && (
                <div className={'full-width flex center space-between'}>
                    <h2>置顶文章</h2>
                </div>
            )}

            {(HOME_TOP_ARTICLES && TOP_ARTICLES.length > 0) && (
                <div className={'top-articles'}>
                    {TOP_ARTICLES.map((item, key) => (
                        <Link key={key} to={`/article/${item.id}`} className={'top-article-item'}>
                            <img alt={item.img} src={`${item.img}`}/>
                            <span className={'title'}>{item.title}</span>
                        </Link>
                    ))}
                </div>
            )}

            {(HOME_TOP_ARTICLES && TOP_ARTICLES.length === 0) && (
                <div>没有置顶文章...</div>
            )}


            <div className={'full-width flex center space-between'}>
                <h2>最近发布</h2>
                <Link to={'/articles/1'} className={'link'}>所有文章 →</Link>
            </div>
            <div className={`home-articles`}>
                {articles.length === 0 && (
                    <div>暂时没有文章...</div>
                )}
                {articles.map((item, key) =>
                    <ArticleItem dark={props.dark} elapsedTime={true} item={item} key={key}/>)}
            </div>

            {(HOME_RECENT_YEAR) && (
                <div className={'full-width flex center space-between'}>
                    <h2>最近一年</h2>
                    <Link to={'/articles/1'} className={'link'}>所有文章 →</Link>
                </div>
            )}

            {(HOME_RECENT_YEAR && ARTICLES.length > 0) && (
                <RecentYear goto={'/date/'}/>
            )}
            {(HOME_RECENT_YEAR && ARTICLES.length === 0) && (
                <div>没有文章...</div>
            )}


            <div className={'full-width flex center space-between'}>
                <h2>分类</h2>
                <Link to={'/categories'} className={'link'}>所有分类 →</Link>
            </div>
            {(homeCategories.length > 0) && (
                <div className={'home-categories'}>
                    {homeCategories.map((item, key) => (
                        <div className={'category'} key={key}>
                            <Tilt options={{max: 62}}>
                                <Link className={'category-logo'} to={`/category/${item.name}/page/1`}>
                                    <img alt={item.name} src={`${item.img}`}/>
                                </Link>
                            </Tilt>
                            <Link to={`/category/${item.name}/page/1`}>{item.name}</Link>
                        </div>
                    ))}
                </div>
            )}

            {(homeCategories.length === 0) && (
                <div className={'home-categories'}>
                    没有分类...
                </div>
            )}

            <div className={'full-width flex center space-between'}>
                <h2>时刻</h2>
                <Link to={'/moments'} className={'link'}>所有时刻 →</Link>
            </div>

            {(MOMENTS.length === 0) && (
                <div className={'home-moments'}>
                    没有时刻...
                </div>
            )}

            {(MOMENTS.length > 0) && (
                <div className={'home-moments'}>
                    {MOMENTS.slice(0, 6).map((item, key) => (
                        <Tilt options={{max: 38, scale: 1}} key={key} className={`home-moment`}>
                            <div className={`home-moment-title`}>{item.title}</div>
                            <div className={`home-moment-content auto-wrap`}>{item.content.length > 40 ? (item.content.slice(0, 60) + '...') : item.content}</div>
                        </Tilt>
                    ))}
                </div>
            )}

            <div className={'full-width flex center space-between'}>
                <h2>Feeling lucky!</h2>
            </div>

            <div className={'home-feeling-lucky'}>
                <Tilt options={{max: 38, scale: 1.1}}>
                    <Link to={'/feeling-lucky'}>
                        <img src={feelingLucky} alt={'feeling-lucky'}/>
                    </Link>
                </Tilt>
            </div>

            <div className={'full-width flex center space-between home-about'}>
                <h2>关于我</h2>
                <Link to={'/about'} className={'link'}>查看详情 →</Link>
            </div>
            <div className={`home-about-content`}>
                <div>你好! 我是{NAME}.</div>
                <div className={'m-t-5'}>如有任何问题, 请使用 <a href={`mailto:${EMAIL}`}>电子邮件</a> 联系我. ;-)</div>
            </div>
        </div>
    );
}
