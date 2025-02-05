import { gridUrlWithPrefix } from '@ag-website-shared/utils/gridUrlWithPrefix';
import { useFrameworkFromStore } from '@utils/hooks/useFrameworkFromStore';
import type { FunctionComponent } from 'react';

import { Icon } from '../icon/Icon';
import styles from './getting-started.module.scss';

const GettingStarted: FunctionComponent = () => {
    const framework = useFrameworkFromStore();

    const features = [
        {
            icon: 'concepts',
            title: 'Key Features',
            description: 'Browse our commonly used features',
            link: './key-features/',
        },
        {
            icon: 'tutorials',
            title: 'Tutorials',
            description: 'Features, themes and more',
            link: './deep-dive/',
        },
        {
            icon: 'communityEnterprise',
            title: 'Community & Enterprise',
            description: 'Compare the differences between versions',
            link: './community-vs-enterprise/',
        },
    ];

    return (
        <div className={styles.container}>
            {features.map((feature, index) => (
                <a href={gridUrlWithPrefix({ framework, url: feature.link })}>
                    <div key={index} className={styles.card}>
                        <div className={styles.iconGroup}>
                            <Icon name={feature.icon} className={styles.icon}>
                                {feature.icon}
                            </Icon>
                        </div>
                        <div className={styles.titleIcon}>
                            <h3 className={styles.title}>{feature.title}</h3>
                            <div>
                                <Icon name="chevronRight" className={`${styles.icon} ${styles.arrowRight}`}></Icon>
                            </div>
                        </div>
                        <p className={styles.description}>{feature.description}</p>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default GettingStarted;
