import 'katex/dist/katex.min.css';
import beautify from "json-beautify";
import {ARTICLES} from "../data/core/articles";

export function Playground() {
    return (
        <pre>
            {beautify(ARTICLES,null, 2, 100)}
        </pre>
    );
}
