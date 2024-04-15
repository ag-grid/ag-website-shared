import { useDarkmode } from '@utils/hooks/useDarkmode';
import classNames from 'classnames';

import gridHeaderStyles from './SiteHeader.module.scss';

export const DarkModeToggle = () => {
    const [darkmode, setDarkmode] = useDarkmode();

    return (
        <li className={classNames(gridHeaderStyles.navItem, gridHeaderStyles.buttonItem)}>
            <button
                className={classNames(gridHeaderStyles.navLink, 'button-style-none')}
                onClick={() => setDarkmode(!darkmode)}
            >
                <div className={classNames(gridHeaderStyles.icon, gridHeaderStyles.pseudoIcon)} />

                <span>Dark Mode</span>
            </button>
        </li>
    );
};
