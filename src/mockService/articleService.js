import {ARTICLES} from "../data/articles";
import {RECENT_ARTICLE_SIZE} from "../config";

export function getTopArticles() {
    return ARTICLES.slice(0, RECENT_ARTICLE_SIZE);
}
