import './Study.scss';
import {STUDY} from "../data/study";
import {Link} from "react-router-dom";

export function Study() {

    return (
        <div className={`study`}>
            {STUDY.map((item, key) => (
                <div key={key} className={`term`}>
                    <div className={`title`}>
                        {item.term}
                    </div>
                    <div className={`courses`}>
                        {item.courses.map((item, key) => (
                            <Link to={`/study-subject/${item.id}`} key={key} className={'course'}>
                                <div className={'course-code'}>{item.code}</div>
                                <div className={`course-name`}>{item.name}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
