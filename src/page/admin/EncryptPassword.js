import './EncryptPassword.scss';
import {useEffect, useState} from "react";
import IconEye from "../../resources/icons/eye";
import IconEyeOff from "../../resources/icons/eye-off";
import {TAB_TITLE} from "../../config";
import {sha256} from "js-sha256";
import {sleep} from "../../util/util";
import {CopyToClipboard} from "react-copy-to-clipboard/src";

export function EncryptPassword() {

    const [showRaw, setShowRaw] = useState(false);
    const [rawPassword, setRawPassword] = useState(``);
    const [encryptedPassword, setEncryptedPassword] = useState(null);
    const [copied, setCopied] = useState(false);

    function toggleShowRaw() {
        setShowRaw(!showRaw);
    }

    function encrypt() {
        if (rawPassword.trim().length === 0) {
            setRawPassword('');
            return;
        }
        setEncryptedPassword(sha256(rawPassword));
        setCopied(false);

    }

    useEffect(() => {
        document.title = `后台管理 - 密码加密 - ${TAB_TITLE}`;
    }, [])

    return (
        <div className={`encrypt-password`}>

            <div className={`encrypt-password-main`}>
                <h2>密码加密</h2>
                <div className={`flex center`}>
                    <div className={`encrypt-password-input-container`}>
                        <input placeholder={`输入需要加密的密码`}
                               onChange={(e) => setRawPassword(e.target.value)}
                               type={showRaw ? `text` : `password`}/>
                        {showRaw ? (<IconEye onClick={toggleShowRaw}/>) : (<IconEyeOff onClick={toggleShowRaw}/>)}
                    </div>
                    <div className={`encrypt-button`} onClick={encrypt}>
                        加密
                    </div>
                </div>
                {(encryptedPassword !== null) && (
                    <div className={`encrypt-result`}>
                        <div>
                            加密成功! 加密后的密码为:
                        </div>
                        <div className={`encrypt-result-content`}>
                            {encryptedPassword}
                        </div>
                        <div className={`encrypt-copy-container`}>
                            {copied &&
                                <div className={'m-r-10 gray-text'}>
                                    已复制!
                                </div>}
                            <CopyToClipboard
                                text={encryptedPassword}
                                onCopy={async () => {
                                    await setCopied(false);
                                    await sleep(60);
                                    setCopied(true)
                                }}>
                                <div className={`copy-button`} onClick={() => {}}>复制</div>
                            </CopyToClipboard>
                        </div>
                    </div>)}
            </div>
        </div>
    );
}
