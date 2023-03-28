// root
import classNames from 'classnames';

// styles
import styles from '@/components/MenuIcon/index.module.scss';

const MenuIcon = () => {
    const cn = classNames;
    return (
        <div className={styles.root}>
            <div className={styles.quattro}>
                <div className={cn(styles.line, styles.line_first)}></div>
                <div className={cn(styles.line, styles.line_second)}></div>
                <div className={cn(styles.line, styles.line_third)}></div>
            </div>
            <div className={styles.text}>SEE Menu CATEGORIES</div>
        </div>
    );
}

export default MenuIcon;
