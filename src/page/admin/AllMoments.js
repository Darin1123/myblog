import './AllMoments.scss';
import {MOMENTS} from "../../data/moments";
import {Pagination} from "../../component/Pagination";
import {useParams} from "react-router";
import {SIZE, TAB_TITLE} from "../../config";
import {useEffect, useState} from "react";
import {convertDateStr} from "../../util/util";
import {Link} from "react-router-dom";


export function AllMoments() {

    const [selectedMoments, setSelectedMoments] = useState([]);
    let {page} = useParams();
    page = parseInt(page);
    let totalPageNumber = Math.ceil(selectedMoments.length / SIZE);

    useEffect(() => {
        document.title = `后台管理 - 所有时刻 - ${TAB_TITLE}`;
        setSelectedMoments(MOMENTS.slice((page - 1) * SIZE, page * SIZE));
    }, [page]);

    return (
      <div className={`admin-all-moments`}>

          <Link to={'/admin/moments'}
                style={{textDecoration: 'none'}}>
              ← 返回
          </Link>

          {selectedMoments.map((item, key) => (
              <div key={key} className={`moment-item`}>
                  <Link to={`/admin/edit-moment/${item.id}`} className={`pointer`}>{item.title}</Link>
                  <span className={`text-10 gray-text`}>
                      {convertDateStr(item.date)}
                  </span>
              </div>
          ))}

          {(MOMENTS.length > 0) && (
              <div className={`full-width flex-column center m-t-20`}>
                  <Pagination page={page} path={'/admin/moments'} totalPageNumber={totalPageNumber}/>
              </div>
          )}
      </div>
    );
}
