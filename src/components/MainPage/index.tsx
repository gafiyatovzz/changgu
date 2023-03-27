import styles from '@/components/MainPage/MainPage.module.scss';

const MainPage = ({allPosts}: any) => {
    return (<div className={styles.root}>
        {allPosts}
    </div>)
}

export default MainPage;
