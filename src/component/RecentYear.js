import {compareDates, convertDate, convertMonth, dayOfWeek, getArticleDate, getDays, getLevel} from "../util/util";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {ARTICLES} from "../data/articles";
import './RecentYear.scss';

export function RecentYear(props) {

    const [calendarMonths, setCalendarMonths] = useState([]);
    const [calendar, setCalendar] = useState([]);
    const [residual, setResidual] = useState(0);

    function generateCalendarData() {
        const today = new Date();
        let days = dayOfWeek(today);
        setResidual(days);
        let calendarDays = getDays(today, days);
        let endDate = new Date();
        endDate.setDate(today.getDate() - days);
        calendarDays = calendarDays.concat(getDays(endDate, 7 * 52)).reverse();


        let months = [];
        let month = -1;
        let N = calendarDays.length;
        for (let i = 0; i < N; i += 7) {
            if ((i + 6) > N - 1) {
                break;
            }
            let ms = calendarDays[i].getMonth();
            let me = calendarDays[i + 6].getMonth();
            if (me === ms && ms !== month) {
                months.push(ms);
                month = ms;
            } else {
                months.push(-1);
            }
        }

        let ARTICLES_REVERSED = ARTICLES.slice().reverse();

        let data = new Map();
        let dt = getArticleDate(ARTICLES_REVERSED[0]);
        let count = 1;
        for (let i = 1; i < ARTICLES_REVERSED.length; i++) {
            if (compareDates(getArticleDate(ARTICLES_REVERSED[i]), dt) === 0) {
                count++;
            } else {
                data.set(`${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`,count);
                count = 1;
                dt = getArticleDate(ARTICLES_REVERSED[i]);
            }
        }
        data.set(`${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`,count);


        let calendar = [];


        for (let i = 0; i < calendarDays.length; i++) {
            let date = calendarDays[i];
            let count = data.get(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
            if (count !== undefined) {
                calendar.push({
                    date: date,
                    count: count
                })
            } else {
                calendar.push({
                    date: date,
                    count: 0
                })
            }
        }


        setCalendarMonths(months);
        setCalendar(calendar);
    }

    function determineMessageClass(key) {
        if (key < 28) {
            return `left-message`;
        }
        if (key > (calendar.length - residual - 7 * 3)) {
            return `right-message`;
        }
        return 'center-message';
    }

    function renderCalendarItem(item, key) {
        if (item.count > 0) {
            return (
                <Link key={key} to={`${props.goto}${item.date.getFullYear()}-${item.date.getMonth() + 1}-${item.date.getDate()}/page/1`}
                      className={`calendar-item level-${getLevel(item.count)}`} style={{cursor: `pointer`}}>
                    <div className={`calendar-item-message ${determineMessageClass(key)}`}>
                        {convertDate(item.date)} 共 {item.count} 篇文章
                    </div>
                </Link>
            );
        } else {
            return (
                <div key={key}
                     className={`calendar-item level-${getLevel(item.count)}`}>
                    <div className={`calendar-item-message ${determineMessageClass(key)}`}>
                        {convertDate(item.date)} 共 {item.count} 篇文章
                    </div>
                </div>
            );
        }
    }

    useEffect(() => {
        generateCalendarData();
    }, [])

    return (
        <div className={`calendar-container`}>
            <div className={`calendar-main`}>
                <div className={`calendar-months`}>
                    {calendarMonths.map((item, key) => (
                        <div className={`calendar-month`}
                             style={{left: key * 18}}
                             key={key}>
                            {item !== -1 ? `${convertMonth(item)}月` : ``}
                        </div>
                    ))}
                </div>
                <div className={`calendar-days`}>
                    <div className={`calendar-left`}>
                        <div className={`calendar-day`}></div>
                        <div className={`calendar-day`}>周一</div>
                        <div className={`calendar-day`}></div>
                        <div className={`calendar-day`}>周三</div>
                        <div className={`calendar-day`}></div>
                        <div className={`calendar-day`}>周五</div>
                        <div className={`calendar-day`}></div>
                    </div>
                    <div className={`calendar-right`}>
                        {calendar.map((item, key) => renderCalendarItem(item, key))}
                    </div>
                </div>
            </div>
            <div className={`calendar-legend`}>
                <div className={`legend-container`}>
                    <div>少</div>
                    <div className={`level level-0`}/>
                    <div className={`level level-1`}/>
                    <div className={`level level-2`}/>
                    <div className={`level level-3`}/>
                    <div>多</div>
                </div>
            </div>
        </div>
    );
}
