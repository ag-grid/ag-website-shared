import classnames from 'classnames';
import type { FunctionComponent } from 'react';
import { useEffect, useState } from 'react';

import { urlWithBaseUrl } from '@utils/urlWithBaseUrl';

import styles from './FrameworkTextAnimation.module.scss';

const WORDS = ['JavaScript', 'Vue', 'Angular', 'React'] as const;
const LOGO_PATH = 'images/fw-logos/';

interface Props {
    prefix?: string;
    suffix?: string;
    className?: string;
    showLogos?: boolean;
}

export const FrameworkTextAnimation: FunctionComponent<Props> = ({ prefix, suffix, className, showLogos }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [leavingIndex, setLeavingIndex] = useState(-1);

    const p = prefix ? `${prefix} ` : '';
    const s = suffix ? ` ${suffix}` : '';

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLeavingIndex(activeIndex);
            setActiveIndex((prev) => (prev + 1) % WORDS.length);
        }, 2500);

        return () => clearTimeout(timeout);
    }, [activeIndex]);

    useEffect(() => {
        if (leavingIndex < 0) return;
        const timeout = setTimeout(() => setLeavingIndex(-1), 600);
        return () => clearTimeout(timeout);
    }, [leavingIndex]);

    const renderLogo = (word: string) =>
        showLogos ? (
            <img
                src={urlWithBaseUrl(`/${LOGO_PATH}${word.toLowerCase()}.svg`)}
                alt=""
                className={styles.logo}
            />
        ) : null;

    return (
        <span className={classnames(styles.animatedWordsOuter, className)}>
            <span className={styles.spacer} aria-hidden="true">
                {showLogos && <img src={urlWithBaseUrl(`/${LOGO_PATH}javascript.svg`)} alt="" className={styles.logo} />}
                {`${p}${WORDS[0]}${s}`}
            </span>
            {WORDS.map((word, i) => (
                <span
                    key={word}
                    className={classnames(styles.word, styles[word.toLowerCase()], {
                        [styles.active]: i === activeIndex,
                        [styles.leaving]: i === leavingIndex,
                    })}
                >
                    {renderLogo(word)}
                    {`${p}${word}${s}`}
                </span>
            ))}
        </span>
    );
};
