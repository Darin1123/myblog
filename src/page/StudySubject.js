import "./StudySubject.scss";
import {useParams} from "react-router";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {FILE_PATH, STUDY} from "../data/core/study";
import React from "react";

export function StudySubject() {

    let {id} = useParams();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        for (let i in STUDY) {
            let term = STUDY[i];
            for (let j in term.courses) {
                if (term.courses[j].id === id) {
                    setCourse(term.courses[j]);
                }
            }
        }
    }, []);

    return (
        <div className={`study-subject`}>
            <Link to={'/study'} className={'go-back'}>
                ← 返回
            </Link>

            {course !== null && (
                <React.Fragment>
                    <h2>{course.code} - {course.name}</h2>
                    {(course.documents.length > 0) && (
                        <div className={`files`}>
                            {course.documents.map((section, key) => (
                                <div key={key}>
                                    <h3>{section.section}</h3>
                                    {section.items.map((item, key) => (
                                        <a key={key}
                                           rel="noreferrer"
                                           target={'_blank'}
                                           className={`file`}
                                           href={`${window.location.origin}${FILE_PATH}${item}`}>
                                            {item.split('/').pop()}
                                        </a>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                    {(course.documents.length === 0) && (
                        <div>没有文件</div>
                    )}

                </React.Fragment>
            )}
        </div>
    );
}
