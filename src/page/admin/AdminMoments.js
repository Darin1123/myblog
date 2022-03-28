import './AdminMoments.scss';
import {Link} from "react-router-dom";
import {useEffect} from "react";
import {TAB_TITLE} from "../../config/config";

export function AdminMoments() {

    useEffect(() => {
        document.title = `后台管理 - 管理时刻 - ${TAB_TITLE}`;
    }, [])

    return (
        <div className={`admin-moments`}>
            <Link to={'/admin/add-moment'} className={`m-r-10`}>
                添加时刻
            </Link>
            <Link to={'/admin/all-moments/1'} className={`m-r-10`}>
                编辑时刻
            </Link>
        </div>
    );
}
