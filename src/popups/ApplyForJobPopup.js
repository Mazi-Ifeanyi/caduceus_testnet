

import classes from '../styles/popups/ApplyForJobPopup.module.css';
import success from '../assets/Success2.png';
import { useNavigate } from 'react-router-dom';


const ApplyForJobPopup = (props) =>{
    const { setApply, apply } = props;
    const navigate = useNavigate();
    
    const navigateToJobBoard = (type) =>{
        if(type === 2){
            navigate('/jobseeker_dashboard');
        }
        setApply(prev=>({...prev, status: false}));
    }

    const openLinkHandler = () =>{
        const url = apply.url;
        // const url = 'ifeanyi@jobcrypt.com';
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
        if(regex.test(url)){
        window.open(`mailto:${url}`);
        }else{
            window.open(url)
        }
    }

    const browseJobsHandler = () =>{
        setApply(prev=>({...prev, status: false}));
    }
    // { status: true, companyLink: jobDetails.companyLink || '', applylink: jobDetails.applyLink || ''}

   return(
    <section className={classes.parent} onClick={()=>setApply(false)}>
            <div className={classes.box} onClick={(e)=>e.stopPropagation()}>
                <img src={success} alt='' className={classes.success} />
                <h1>Congratulations!!!</h1>
                <p className={classes.sendResumeTxt}>Kindly send your resume to</p>
                <p className={classes.emailTxt} onClick={openLinkHandler}>{apply.url}</p>
                <div className={classes.btnContainer}>
                    <button className={classes.btn1} onClick={()=>navigateToJobBoard(1)}>Browse other jobs</button>
                    <button className={classes.btn2} onClick={()=>navigateToJobBoard(2)}>Previous Applications</button>
                </div>
            </div>
        </section>
   )
}

export default ApplyForJobPopup;