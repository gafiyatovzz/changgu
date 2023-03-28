
// root
import Image from 'next/image';
import classNames from 'classnames';

// components
import MenuIcon from '@/components/MenuIcon';

// images & icons
import mainPng from '@/images/main.png';
import arrowDown from '@/images/svg/arrow-down.svg';

// styles
import styles from '@/components/MainSection/styles/index.module.scss';

// entities
type Props = {
    categories: []
}

const MainSection = ({
    categories,
}: Props) => {
    const cn = classNames;
    return (
        <div className={styles.root}>
            <div className={styles.main}>
                <MenuIcon />
                <Image className={styles.img} src={mainPng} />
            </div>
            <p className={styles.description}>
                Home Cafe concept was created by&nbsp;
                <a className={cn(styles.description_link, styles.description_sub)} href="#">@max.sibirin</a>&nbsp;
                in 2022 with 10 years <span className={styles.description_sub}>biochemistry</span> — and nutriciology knowledge.
                <Image className={styles.arrow} src={arrowDown}/>
            </p>
        </div>
    );
}

export default MainSection;
