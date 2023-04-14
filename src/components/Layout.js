import { useSelector, useDispatch } from 'react-redux';



import classes from '../styles/components/Layout.module.css';
import Footer from './Footer';
import Header from './Header';
import Header2 from './Header2';
import { connect, stake } from '../store/MetaMaskSlice';
import { isNull } from '../utils/Util';
import { useEffect } from 'react';

const Layout = (props) =>{
    const { children } = props;
    const isConnected = useSelector(state=>state.meta.isConnected);
    const dispatch = useDispatch();


    useEffect(()=>{
        const session = sessionStorage.getItem('wallet');
        if(!isNull(session))dispatch(connect({ wallet: session }));
        const staked = JSON.parse(sessionStorage.getItem('staked'));
        if(staked)dispatch(stake());
    },[dispatch]);


    return(
        <main className={classes.parent}>
            {!isConnected &&<Header />}
            {isConnected && <Header2 />}
            {children}
            <Footer />
        </main>
    )
}

export default Layout;