import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

import classes from '../styles/routes/ViewJobApplicationDetailRoute.module.css';
import locationIcon from '../assets/pin.png';
import briefcase from '../assets/briefcase.png';
import locationSupportIcon from '../assets/support.png';
import paymentIcon from '../assets/crypto.png';
import backIcon from '../assets/back.png';
import { useCallback, useEffect, useState } from 'react';
import { getJobDetailUsingPostingddress } from '../contracts/ContractManager';
import { isNull } from '../utils/Util';


const ViewJobApplicationDetailRoute = (props) =>{
    const { postingAddress } = props;
    const navigate = useNavigate();
    const [ data, setData ] = useState({ jobTitle: '', locationType: '--', locationSupport: '--', workLocation: '--', companyName: '', companyLink: '', companySummary: '', paymentType: '', workType: '', jobDesc: '', searchTerms: '', applyLink: '', skills: [], searchCategory: [], postedDate: 0 });

    const getDetail = useCallback(async() =>{
        const result = await getJobDetailUsingPostingddress(postingAddress);
        setData({
            jobTitle: result.jobTitle, locationType: result.locationType, locationSupport: result.locationSupport, workLocation: result.workLocation, companyName: result.workLocation, companyLink: result.companyLink, companySummary: result.companySummary, paymentType: result.paymentType, workType: result.workType, jobDesc: result.jobDesc, searchTerms: result.searchTerms, applyLink: result.applyLink, skills: result.skills, searchCategory: result.searchCategory,postedDate: result.postedDate
        });
    },[]);


    useEffect(()=>{
        getDetail();
    },[getDetail]);


    return(
        <section className={classes.parent}>
            <main className={classes.rightSide}>
                <header className={classes.jobTitleColored}>
                <div className={classes.backwardIconContainer}>
                        <img src={backIcon} alt='' className={classes.backIcon} onClick={()=>navigate('/jobseeker_dashboard')} />
                    </div>
                    <div className={classes.jobTitleColoredDivLeft}>
                        <h1>{data.jobTitle}</h1>
                        <div className={classes.jobTitleNameContainer}>
                            <span>{isNull(data.companyName)? '' : data.companyName.slice(0,1)}</span>
                            <p>{data.companyName}</p>
                        </div>
                    </div>
                </header>
                <section className={classes.detailContainer}>
                    <div className={classes.detail}>
                        <span className={classes.iconContainer}>
                            <img src={locationIcon} alt='' />
                            <p>Location: <strong>{data.locationType}</strong></p>
                        </span>
                        <span className={classes.iconContainer}>
                            <img src={locationSupportIcon} alt='' />
                            <p>Location Support: <strong>{data.locationSupport}</strong></p>
                        </span>
                    </div>
                    <div className={classes.detail}>
                        <span className={classes.iconContainer}>
                            <img src={briefcase} alt='' />
                            <p>WorkType: <strong>{data.workType}</strong></p>
                        </span>
                        <span className={classes.iconContainer}>
                            <img src={paymentIcon} alt='' />
                            <p>Payment: <strong>{data.paymentType}</strong></p>
                        </span>
                    </div>
                </section>
                <section className={classes.roleContainer}>
                    <h1>About the Role</h1>
                    <ul className={classes.ul}>
                        {(!isNull(data.jobDesc)) &&<li dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.jobDesc)}}></li>}
                       {/* {new Array(6).fill().map((item, idx)=>(
                         <li key={idx}>Produce awesome UI designs, assets and user experience improvements to a consistently high quality.</li>
                       ))}
                    </ul>
                    <h1>Requirement</h1>
                    <ul className={classes.ul}>
                       {new Array(6).fill().map((item, idx)=>(
                         <li key={idx}>Produce awesome UI designs, assets and user experience improvements to a consistently high quality.</li>
                       ))} */}
                    </ul>
                </section>
                <footer className={classes.footer}>
                    <div className={classes.footerDiv}>
                        <h1>Skills</h1>
                        <span className={classes.list}>
                            {(!isNull(data.skills) && data.skills.map((skill)=>(
                                <p key={skill}>{skill}</p>
                            )))}
                            {/* <p>React</p>
                            <p>Solidity</p> */}
                        </span>
                    </div>
                    <div className={classes.footerDiv}>
                        <h1>Job Categories</h1>
                        <span className={classes.list}>
                            {(!isNull(data.searchCategory)) && data.searchCategory.map(category=>(
                                <p key={category}>{category}</p>
                            ))}
                            {/* <p>Dev</p>
                            <p>Tech</p>
                            <p>Blockchain</p> */}
                        </span>
                    </div>
                    <div className={classes.footerDiv}>
                        <h1>Apply Details: </h1>
                        <span className={classes.list}>
                            <h1 className={classes.emailTxt}>{data.applyLink}</h1>
                        </span>
                    </div>
                    <div className={classes.footerDiv}>
                        <h1>First Posted: </h1>
                        <span className={classes.list}>
                            <h1 className={classes.emailTxt} style={{ color: '#000'}}> Sat Mar 18 2023 13:50:24 GMT+0100 </h1>
                        </span>
                    </div>
                </footer>
            </main>
        </section>
    )
}

export default ViewJobApplicationDetailRoute;