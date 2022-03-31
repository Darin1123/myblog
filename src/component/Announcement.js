import {useState} from "react";
import './Announcement.scss';
import IconX from "../resources/icons/x";
import {useTransition, animated, config} from "react-spring";

export function Announcement(props) {
    const [show, setShow] = useState(true);
    const transitions = useTransition(show, {
        from: {
            opacity: 0
        },
        enter: {
            opacity: 1
        },
        leave: {
            opacity: 0
        },
        reverse: show,
        config: config.stiff,
        onSet: () => setShow(!show)
    });

    let type = '';
    if (props.type === undefined) {
        type = 'default'
    } else {
        type = props.type;
    }

    return transitions(
        (styles, item) => item && (
            <animated.div className={`announcement ${type}` + (props.dark ? '-dark' : '')} style={styles}>
                <div className={`content auto-wrap`}>
                    {props.content}
                </div>
                {(!props.consistent) && (
                    <div className={'svg-container'} onClick={() => setShow(!show)}>
                        <IconX/>
                    </div>
                )}
            </animated.div>
            )
    );

}
