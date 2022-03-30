import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import '../css/markdown.scss';
import {CUSTOM_MARKDOWN} from "../config";

export function ArticleMain(props) {
    return (
        <article>
            <ReactMarkdown
                components={CUSTOM_MARKDOWN}
                children={props.content}
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
            />
        </article>
    );
}
