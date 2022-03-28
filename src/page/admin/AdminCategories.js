import {CATEGORIES} from "../../data/core/categories";
import './AdminCategories.scss';
import {useEffect, useState} from "react";
import {TAB_TITLE} from "../../config/config";
import beautify from "json-beautify";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import {sleep} from "../../util/util";
import IconX from "../../resources/icons/x";

export function AdminCategories() {


    let originalCategories = []
    for (let i = 0; i < CATEGORIES.length; i++) {
        originalCategories.push({
            name: CATEGORIES[i],
            new: false
        });
    }

    const [newCategory, setNewCategory] = useState(``);
    const [categories, setCategories] = useState(originalCategories);

    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);

    function add() {
        setNewCategory(``);
        if (newCategory.trim().length === 0) {
            return;
        }

        let newItem = {
            name: newCategory,
            new: true
        };

        setCategories(prev => [...prev, newItem]);
    }

    function sort() {
        let sorted = [...categories].sort((a, b) => a.name.localeCompare(b.name));

        setCategories(sorted);
    }

    function reset() {
        let originalCategories = []
        for (let i = 0; i < CATEGORIES.length; i++) {
            originalCategories.push({
                name: CATEGORIES[i],
                new: false
            });
        }

        setCategories(originalCategories);
    }

    function generate() {
        let data = [];
        for (let i = 0; i < categories.length; i++) {
            data.push(categories[i].name);
        }
        setResult(data);
        setCopied(false);
    }

    function remove(key) {
        setCategories(categories.filter((item, index) => index !== key));
    }

    useEffect(() => {
        document.title = `后台管理 - 分类 - ${TAB_TITLE}`;
    }, [categories]);

    return (
        <div className={`admin-categories`}>

            <h3>已有分类</h3>
            {(categories.length > 0) && (
                <div className={`categories`}>
                    {categories.map((item, key) => (
                        <div key={key}
                             className={`category ` + (item.new ? 'new' : '')}>
                            {item.name}
                            <span className={`svg-container`}
                                  onClick={() => remove(key)}>
                        <IconX/>
                        </span>
                        </div>
                    ))}
                </div>
            )}

            {(categories.length === 0) && (
                <div>
                    没有分类...
                </div>
            )}

            <h3>管理分类</h3>
            <div className={`add-new-container`}>
                <input
                    onChange={e => setNewCategory(e.target.value)}
                    value={newCategory}
                    placeholder={`输入新类别名称...`}/>
                <div onClick={add} className={`add-button`}>添加</div>
                <div className={`flex`}>
                    <div onClick={sort} className={`manage-button`}>排序</div>
                    <div onClick={reset} className={`manage-button`}>重置</div>
                </div>
            </div>

            <div>
                <h3>
                    生成代码
                </h3>

                <div onClick={generate}
                     style={{backgroundColor: `#000`, color: `#fff`}}
                     className={`generate-button`}>生成代码
                </div>

                {result !== null && (
                    <div className={`result`}>
                        <pre>
                        {beautify(result, null, 2, 100)}
                    </pre>

                        <div className={'copy-button'}>
                            {copied &&
                                <div className={'m-r-10 gray-text'}>
                                    已复制!
                                </div>}
                            <CopyToClipboard
                                text={beautify(result, null, 2, 100)}
                                onCopy={async () => {
                                    await setCopied(false);
                                    await sleep(60);
                                    setCopied(true)
                                }}>
                                <div className={'button'} onClick={() => {
                                }}>复制
                                </div>
                            </CopyToClipboard>
                        </div>

                    </div>)}
            </div>


        </div>
    );
}
