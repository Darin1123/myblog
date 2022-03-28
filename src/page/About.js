import './About.scss';
import {useEffect} from "react";
import {TAB_TITLE} from "../config/config";
import {ArticleMain} from "../component/ArticleMain";
import {ABOUT} from "../data/page/about";

export function About() {

    useEffect(() => {
        document.title = `关于 - ${TAB_TITLE}`
    }, []);

    return (
        <div className={'about'}>
            {(ABOUT.length === 0) && (
                <div>什么也没有写...</div>
            )}
            {(ABOUT.length > 0) && (
                <ArticleMain content={ABOUT}/>
            )}
        </div>
    );
}
