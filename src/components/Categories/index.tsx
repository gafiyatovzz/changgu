// root
import classNames from 'classnames';

// components
import Image from 'next/image';

// images & icons
import arrowDown from '@/images/svg/arrow-down.svg';

// styles
import styles from '@/components/Categories/index.module.scss';

// entities
import {PreparedData} from "@/lib/notion";

type Props = {
    categories: PreparedData[],
}

const Categories = ({
    categories,
}: Props) => {
    const cn = classNames;

    return (
        <div className={styles.root}>

        </div>
    );
}

const Category = (categories: PreparedData[]) => {

}

export default Categories;
