import './Dashboard.scss';
import {ARTICLES} from "../../data/core/articles";
import {CATEGORIES} from "../../data/core/categories";
import {LAUNCH_DATE, TAB_TITLE} from "../../config/config";
import {useEffect, useState} from "react";
import {RecentYear} from "../../component/RecentYear";
import {Link} from "react-router-dom";
import IconWriting from "../../resources/icons/writing";
import IconListNumbers from "../../resources/icons/list-numbers";
import IconLayoutGrid from "../../resources/icons/layout-grid";
import IconPhoto from "../../resources/icons/photo";
import IconLock from "../../resources/icons/lock";
import IconMoodSmile from "../../resources/icons/mood-smile";
import IconCamera from "../../resources/icons/camera";


export function Dashboard() {

    const [launchedDays, setLaunchedDays] = useState(0);

    useEffect(() => {
        document.title = `后台管理 - 仪表盘 - ${TAB_TITLE}`;
        setLaunchedDays(parseInt((new Date().getTime() - LAUNCH_DATE.getTime()) / (1000 * 3600 * 24)));
    }, [])

    return (
        <div className={`dashboard`}>
            <div className={`stats dashboard-item`}>
                <div className={`m-b-10`}>统计数据</div>
                <div className={`stats-main`}>
                    <div className={`stats-item`}>
                        <div>
                            <div>文章数量</div>
                            <b className={`stats-number`}>{ARTICLES.length}</b>
                        </div>
                    </div>
                    <div className={`stats-item`}>
                        <div>
                            <div>类别数量</div>
                            <b className={`stats-number`}>{CATEGORIES.length}</b>
                        </div>
                    </div>
                    <div className={`stats-item`}>
                        <div>
                            <div>成立天数</div>
                            <b className={`stats-number`}>
                                {launchedDays}
                            </b>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`calendar dashboard-item`}>
                <div>编写记录</div>
                {(ARTICLES.length > 0) && (
                    <RecentYear goto={'/admin/date/'}/>
                )}
            </div>

            <div className={'dashboard-item'}>
                <div>快速开始</div>
                <div className={`quick-links`}>
                    <Link to={`/admin/editor`} className={`quick-link`}>
                        <div className={`quick-link-container`}>
                            <IconWriting/>
                            写文章
                        </div>
                    </Link>

                    <Link to={`/admin/articles/1`} className={`quick-link`}>
                        <div className={`quick-link-container`}>
                            <IconListNumbers/>
                            所有文章
                        </div>
                    </Link>

                    <Link to={`/admin/categories`} className={`quick-link`}>
                        <div className={`quick-link-container`}>
                            <IconLayoutGrid/>
                            分类
                        </div>
                    </Link>

                    <Link to={'/admin/images'} className={`quick-link`}>
                        <div className={`quick-link-container`}>
                            <IconPhoto/>
                            图库
                        </div>
                    </Link>

                    <Link to={'/admin/moments/1'} className={`quick-link`}>
                        <div className={`quick-link-container`}>
                            <IconCamera/>
                            时刻
                        </div>
                    </Link>

                    <Link to={'/admin/password'} className={`quick-link`}>
                        <div className={`quick-link-container`}>
                            <IconLock/>
                            密码
                        </div>
                    </Link>

                    <Link to={'/admin/about'} className={`quick-link`}>
                        <div className={`quick-link-container`}>
                            <IconMoodSmile/>
                            关于
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
