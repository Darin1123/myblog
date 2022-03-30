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

    return transitions(
        (styles, item) => item && (
            <animated.div className={`announcement`} style={styles}>
                <div className={`content`}>
                    {props.content}
                </div>
                <div className={'svg-container'} onClick={() => setShow(!show)}>
                    <IconX/>
                </div>
            </animated.div>
            )
    );

}
