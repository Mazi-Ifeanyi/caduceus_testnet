import { isNull } from '../utils/Util';
import iJCStakeManagerAbi from '../abi/i_jc_stake_manager_abi';
import iJCJobCryptAbi from '../abi/i_jc_jobcrypt_abi';
import ierc20MetadataAbi from '../abi/i_erc20_metadata_abi';
import { iERC20Abi } from '../abi/i_erc20_abi';
import { iJCFactoryFacadeAbi } from '../abi/i_jc_factory_facade_core_abi';
import { iOpenProductCoreAbi } from '../abi/i_open_product_core_abi';
import iOpenProductAbi from '../abi/i_open_product_abi';
import { iJCJobPostingEditorAbi } from '../abi/i_jc_job_posting_editor_abi';
import iJCJobPostingAbi from '../abi/i_jc_job_posting_abi';
import { iJCJobSeekerDashboardAbi } from '../abi/i_jc_job_seeker_dashboard_abi';
import { iJCEmployerDashboardAbi } from '../abi/i_jc_employer_dashboard_abi';
import { iJCPaymentManagerAbi } from '../abi/i_jc_payment_manager_abi';
import { getContractFromRegistry } from './InitializeContracts';
import { getContractInstance } from './init';
import { ethers } from 'ethers';
import { sendGetRequest } from '../hooks/useAxios';

const ZERO_ADDRESS ='0x0000000000000000000000000000000000000000';
const JOBCRYPT_IPFS_URL = "https://jobcrypt.infura-ipfs.io/ipfs/";

export const getMinStakeAmount = async() =>{
    let minStakeAmount = '';
    try{
      const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
      if(!isNull(CONTRACTS)){
      const stakeAddress = CONTRACTS[CONTRACTS.findIndex(item=>item.key === 'RESERVED_JOBCRYPT_STAKE_MANAGER_CORE')].value;

      const contract = getContractInstance(stakeAddress,iJCStakeManagerAbi, 'provider');
      minStakeAmount = await contract.getMinimumStakeAmount();
    }
  }catch(err){}
    return minStakeAmount;
}

export const getStakeErc20Address = async() =>{
    let erc20Address = '';
    try{
    const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
    if(!isNull(CONTRACTS)){
        const stakeAddress = CONTRACTS[CONTRACTS.findIndex(item=>item.key === 'RESERVED_JOBCRYPT_STAKE_MANAGER_CORE')].value;

        const contractInstance = getContractInstance(stakeAddress,iJCStakeManagerAbi, 'provider');
        erc20Address = await contractInstance.getStakeErc20Address();
    }
  }catch(err){}

  return erc20Address;
}

export const getUserStakedAmount = async() =>{
    let stakedAMount = '';
    try{
    const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
    if(!isNull(CONTRACTS)){
        const stakeAddress = CONTRACTS[CONTRACTS.findIndex(item=>item.key === 'RESERVED_JOBCRYPT_STAKE_MANAGER_CORE')].value;

        const contractInstance = getContractInstance(stakeAddress,iJCStakeManagerAbi, 'provider');
        stakedAMount = await contractInstance.getStakedAmount();
    }
  }catch(err){}

  return stakedAMount;
}

export const getIsStaked = async() =>{
    let isStaked = false;
    try{
    const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
    if(!isNull(CONTRACTS)){
        const jobCryptAddress = CONTRACTS[CONTRACTS.findIndex(item=>item.key === 'RESERVED_JOBCRYPT_CORE')].value;

        const contractInstance = getContractInstance(jobCryptAddress, iJCJobCryptAbi, 'signer');
        isStaked = await contractInstance.isStaked();
    }
  }catch(err){
    // console.log(err)
  }

  return isStaked;;
}

export const getSymbol = async() =>{
    let symbol = '';
    try{
    const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
    if(!isNull(CONTRACTS)){
        const contractInstance = getContractInstance(await getStakeErc20Address(), ierc20MetadataAbi, 'provider');
        symbol = await contractInstance.symbol();
    }
  }catch(err){}
  return symbol;
}

export const getDecimal = async() =>{
    let decimals = '';
    try{
    const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
    if(!isNull(CONTRACTS)){
        const contractInstance = getContractInstance(await getStakeErc20Address(), ierc20MetadataAbi, 'provider');
        decimals = await contractInstance.decimals();
    }
  }catch(err){}

  return decimals;
}


export const approveStake = async() =>{
    let approve = '';
    try{
    const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
    if(!isNull(CONTRACTS)){
        const stakeAddress = CONTRACTS[CONTRACTS.findIndex(item=>item.key === 'RESERVED_JOBCRYPT_STAKE_MANAGER_CORE')].value;

        const contractInstance = getContractInstance(await getStakeErc20Address(), ierc20MetadataAbi, 'signer');
        approve = await contractInstance.approve(stakeAddress, await getMinStakeAmount());
    }
  }catch(err){}

  return approve;
}

export const stake = async() =>{
  let decimals = '';
  try{
  const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
  if(!isNull(CONTRACTS)){
      const stakeAddress = CONTRACTS[CONTRACTS.findIndex(item=>item.key === 'RESERVED_JOBCRYPT_STAKE_MANAGER_CORE')].value;

      const contractInstance = getContractInstance(stakeAddress, iJCStakeManagerAbi, 'signer');
      decimals = await contractInstance.stake(await getMinStakeAmount());
  }
}catch(err){}

return decimals;
}

export const unstake = async() =>{
  let decimals = '';
  try{
  const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
  if(!isNull(CONTRACTS)){
      const stakeAddress = CONTRACTS[CONTRACTS.findIndex(item=>item.key === 'RESERVED_JOBCRYPT_STAKE_MANAGER_CORE')].value;

      const contractInstance = getContractInstance(stakeAddress, iJCStakeManagerAbi, 'signer');
      decimals = await contractInstance.unstake();
  }
}catch(err){}

return decimals;
}


//------------------------------Everything about staking end-----------------------//


export const findEmployerDashboard = async() =>{
  let factoryFacadeAddress = '', result='';
  try{
      const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
      if(!isNull(CONTRACTS)){
        factoryFacadeAddress = CONTRACTS[CONTRACTS.findIndex(item=>item.key === 'RESERVED_JOBCRYPT_FACTORY_FACADE_CORE')].value;
      }else{
        factoryFacadeAddress = await getContractFromRegistry('RESERVED_JOBCRYPT_FACTORY_FACADE_CORE');
      }

      const contractInstance = getContractInstance(factoryFacadeAddress, iJCFactoryFacadeAbi, 'signer');
      result = await contractInstance.findDashboard("EMPLOYER_DASHBOARD_TYPE");
     
}catch(err){
  // console.log('err', err)

}
 return result;
}


export const createEmployerDashboard = async() =>{
  let factoryFacadeAddress = '', result='';
  try{
      const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
      if(!isNull(CONTRACTS)){
        factoryFacadeAddress = CONTRACTS[CONTRACTS.findIndex(item=>item.key === 'RESERVED_JOBCRYPT_FACTORY_FACADE_CORE')].value;
      }else{
        factoryFacadeAddress = await getContractFromRegistry('RESERVED_JOBCRYPT_FACTORY_FACADE_CORE');
      }

      const contractInstance = getContractInstance(factoryFacadeAddress, iJCFactoryFacadeAbi, 'signer');
      result = await contractInstance.getDashboard("EMPLOYER_DASHBOARD_TYPE");
     
}catch(err){
  // console.log('err', err);

}

 return result;
}

export const loadJobProducts = async() =>{
  let openProductCoreAddress = '', result='';
  try{
      const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
      if(!isNull(CONTRACTS)){
        openProductCoreAddress = CONTRACTS[CONTRACTS.findIndex(item=>item.key === 'RESERVED_OPEN_PRODUCT_CORE')].value;
      }else{
        openProductCoreAddress = await getContractFromRegistry('RESERVED_OPEN_PRODUCT_CORE');
      }

      const contractInstance = getContractInstance(openProductCoreAddress, iOpenProductCoreAbi, 'provider');
      const productAddresses = await contractInstance.getProducts();
     
      if(!isNull(productAddresses)){
        const addressses = filterOutZeroAddresses(productAddresses);
        result = await getProductData(addressses);
      }
}catch(err){
  // console.log('err', err)
}
 return result;
}

const filterOutZeroAddresses = (addresses) =>{
  return addresses.filter(address=> address !== ZERO_ADDRESS);
}

export const getProductData = async(productAddresses) =>{
  let RESULT = [];
  for(let i = 0; i < productAddresses.length; i++){
    try{
      const productAddress = productAddresses[i];
      const contractInstance = getContractInstance(productAddress, iOpenProductAbi);
      const name = await contractInstance.getName();
      let price = await contractInstance.getPrice();
      const currency = await contractInstance.getCurrency();
      const decimals = await getDecimal();
      // console.log('Name: ', name,' Price: ', price,' Currency: ', currency);

      price = ethers.utils.formatUnits(price * 0.8, decimals) * (10 ** decimals);

      var optionTxt = name + " - " + formatPrice(price*0.8, decimals) + " (ex VAT) [" +formatPrice(price*0.2, decimals) + " VAT] You pay: " +  formatPrice(price, decimals) +  " (" + currency + ")";
    //  console.log(optionTxt)
    if(!name.toLowerCase().includes('career')){
     RESULT.push({ optionTxt, address: productAddress, price: formatPrice(price, decimals), currency, name });
    }
    }catch(err){

    }
  }

  return RESULT;
}

const formatPrice = (price, decimal)=> {
  return price / (10 ** decimal);
}


export const createDraftPosting = async(productAddress) =>{
  let factoryFacadeAddress = '', result='';
  // console.log('selected product: ', productAddress)
  try{
      const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
      if(!isNull(CONTRACTS)){
        factoryFacadeAddress = CONTRACTS[CONTRACTS.findIndex(item=>item.key === 'RESERVED_JOBCRYPT_FACTORY_FACADE_CORE')].value;
      }else{
        factoryFacadeAddress = await getContractFromRegistry('RESERVED_JOBCRYPT_FACTORY_FACADE_CORE');
      }

      const contractInstance = getContractInstance(factoryFacadeAddress, iJCFactoryFacadeAbi, 'signer');
      result = await contractInstance.createJobPosting(productAddress);
     
}catch(err){
  // console.log('err', err)

}

 return result;
}


export const getDraftPosting = async(employerDashAddress)=>{
  let result = [];
    try{
      const contractInstance = getContractInstance(employerDashAddress, iJCEmployerDashboardAbi, 'signer');
      const draftPostingAddresses = await contractInstance.getDraftPostings();
      // console.log('------', draftPostingAddresses)
      if(!isNull(draftPostingAddresses)){
         result = await processDraftPosting(draftPostingAddresses);
      }
    }catch(err){
      // console.log(err);
    }

    return result;
}

const processDraftPosting = async(draftPostingAddresses) =>{
  let RESULT = [];
  for(let i = 0; i < draftPostingAddresses.length; i++){
    const draftPostingAddress = draftPostingAddresses[i];
  try{
    const contractInstance = getContractInstance(draftPostingAddress, iJCJobPostingAbi, 'signer');
    const status = resolveStatus(await contractInstance.getStatus());
    const productAddress = await contractInstance.getFeatureADDRESS("PRODUCT_FEATURE");
    const jobTitle = await contractInstance.getFeatureSTR("JOB_TITLE");
    const contractInstance2 = getContractInstance(productAddress, iOpenProductAbi, 'signer');
    const name = await contractInstance2.getName();
    if(!name.toLowerCase().includes('career')){
      RESULT.push({
        status, 
        productAddress,
        jobTitle,
        name,
        draftPostingAddress
      })
    }
   

  }catch(err){
    console.log(err)
  }
}

return RESULT;
}

export const getJobDetailUsingPostingddress = async(postingAddress)=>{
  let INFO = {}, applyLink='';
   try{
    const contractInstance = getContractInstance(postingAddress, iJCJobPostingAbi, 'signer');
    const jobTitle = await contractInstance.getFeatureSTR("JOB_TITLE");
    const locationType = await contractInstance.getFeatureSTR("JOB_LOCATION_TYPE");
    const locationSupport = await contractInstance.getFeatureSTR("JOB_LOCATION_SUPPORT");
    const workLocation = await contractInstance.getFeatureSTR("JOB_WORK_LOCATION");
    const companyName = await contractInstance.getFeatureSTR("COMPANY_NAME");
    const companyLink = await contractInstance.getFeatureSTR("COMPANY_LINK");
    let companySummary = await contractInstance.getFeatureSTR("COMPANY_SUMMARY");
    let companyLogo = await contractInstance.getFeatureSTR("COMPANY_LOGO");
    console.log('company logo hash: ', companyLogo);
    try{
        if(!isNull(companyLogo)){
          companyLogo = await sendGetRequest(`${JOBCRYPT_IPFS_URL}${companyLogo}`);
          console.log('COMPANY LOGO DATA: ', companyLogo);
        }
    }catch(err){
      companyLogo = null;
    }

    try{
      if(!isNull(companySummary)){
      companySummary = await sendGetRequest(`${JOBCRYPT_IPFS_URL}${companySummary}`);
      }
    }catch(err){
      companySummary = ''
    }
    const workType = await contractInstance.getFeatureSTR("JOB_WORK_TYPE");
    const paymentType = await contractInstance.getFeatureSTR("JOB_PAYMENT_TYPE");
    let jobDesc = await contractInstance.getFeatureSTR("JOB_DESCRIPTION");
    try{
      if(!isNull(jobDesc)){
      jobDesc = await sendGetRequest(`${JOBCRYPT_IPFS_URL}${jobDesc}`);
      jobDesc = jobDesc.ops[0].insert;
      }
    }catch(err){
      jobDesc = ''
    }
    const searchTerms = await contractInstance.getFeatureSTR("USER_SEARCH_TERMS");
    try{
     applyLink = await contractInstance.getFeatureSTR("APPLY_LINK");
    }catch(err){
      // console.log('APPLY LINK ERROR: ', err);
    }
    const skills = await contractInstance.getFeatureSTRARRAY("SKILLS_FEATURE");
    const searchCategory = await contractInstance.getFeatureSTRARRAY("CATEGORY_FEATURE");
    const productAddress = await contractInstance.getFeatureADDRESS("PRODUCT_FEATURE");
    let postedDate = await contractInstance.getFeatureUINT("POSTING_DATE_FEATURE");
    postedDate = new Date(ethers.BigNumber.from(postedDate).toNumber() * 1000);

    const contractInstance2 = getContractInstance(productAddress, iOpenProductAbi, 'provider');
    let duration = await contractInstance2.getFeatureUINTValue("DURATION");
    const price = await contractInstance2.getPrice();
    const erc20 = await contractInstance2.getErc20();
    const currency = await contractInstance2.getCurrency();
    duration = duration / (7 * 24 * 60 * 60);
    const week = duration+' Weeks';

    INFO.jobTitle = jobTitle;
    INFO.locationType = locationType;
    INFO.locationSupport = locationSupport;
    INFO.workLocation = workLocation;
    INFO.companyName = companyName;
    INFO.companyLink = companyLink;
    INFO.companySummary = companySummary;
    INFO.companyLogo = companyLogo;
    INFO.paymentType = paymentType;
    INFO.workType = workType;
    INFO.jobDesc = jobDesc;
    INFO.searchTerms = searchTerms;
    INFO.applyLink = applyLink;
    INFO.skills = skills;
    INFO.searchCategory = searchCategory;
    INFO.postedDate=postedDate;
    INFO.price = price;
    INFO.erc20 = erc20;
    INFO.currency = currency;
    INFO.week = week;
    INFO.duration = duration;

   }catch(err){}

   return INFO;
}



export const findJobSeekerDashboard = async() =>{
  try{
    let factoryFacadeAddress = '', result='';
    try{
        const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
        if(!isNull(CONTRACTS)){
          factoryFacadeAddress = CONTRACTS[CONTRACTS.findIndex(item=>item.key === 'RESERVED_JOBCRYPT_FACTORY_FACADE_CORE')].value;
        }else{
          factoryFacadeAddress = await getContractFromRegistry('RESERVED_JOBCRYPT_FACTORY_FACADE_CORE');
        }
  
        const contractInstance = getContractInstance(factoryFacadeAddress, iJCFactoryFacadeAbi, 'signer');
        result = await contractInstance.findDashboard("JOBSEEKER_DASHBOARD_TYPE");
       
  }catch(err){
    // console.log('err', err)
  
  }
  
   return result;
  }catch(err){}
}


export const createJobSeekerDashboard = async() =>{
  let factoryFacadeAddress = '', result='';
  try{
      const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
      if(!isNull(CONTRACTS)){
        factoryFacadeAddress = CONTRACTS[CONTRACTS.findIndex(item=>item.key === 'RESERVED_JOBCRYPT_FACTORY_FACADE_CORE')].value;
      }else{
        factoryFacadeAddress = await getContractFromRegistry('RESERVED_JOBCRYPT_FACTORY_FACADE_CORE');
      }

      const contractInstance = getContractInstance(factoryFacadeAddress, iJCFactoryFacadeAbi, 'signer');
      result = await contractInstance.getDashboard("JOBSEEKER_DASHBOARD_TYPE");
     
}catch(err){
  // console.log('err', err);

}

 return result;
}


//This is for jobseeker
export const getAppliedJobsForUser = async(applicantAddress, jobSeekerDashAddress) =>{
  // console.log('Dash Address; ', jobSeekerDashAddress);
  let result = [];
  try{
    const contractInstance = getContractInstance(jobSeekerDashAddress, iJCJobSeekerDashboardAbi, 'signer');
    const appliedJobsAddresses = await contractInstance.getAppliedJobs();
    // console.log('Applied job addresses: ', appliedJobsAddresses)
    if(!isNull(appliedJobsAddresses)){
     result = await getApplicationData(appliedJobsAddresses, applicantAddress);
    }

  }catch(err){}

  return result;
}

 const getApplicationData = async(appliedJobsAddresses, applicantAddress) =>{
  const APPLICATION_DATA =[];
  let link='', applicationDate = '';
  for(let i = 0; i < appliedJobsAddresses.length; i++){
    const appliedJobAddress = appliedJobsAddresses[i];
    try{
        const contractInstance = getContractInstance(appliedJobAddress, iJCJobPostingAbi, 'signer');
        const applicantData = await contractInstance.getApplicantData(applicantAddress);
        const jobTitle = await contractInstance.getFeatureSTR("JOB_TITLE");
        let noOfApplicant = await contractInstance. getFeatureUINT("APPLICANT_COUNT_FEATURE");
        let statusCode = await contractInstance.getStatus();
        const status = resolveStatus(statusCode);
        noOfApplicant = ethers.BigNumber.from(noOfApplicant).toNumber();
        // console.log('appplicant data: ', applicantData);
        console.log('No of applicant: ', statusCode);

        if(!isNull(applicantData)){
         applicationDate = ethers.BigNumber.from(applicantData.applicationDate).toNumber() * 1000;
         link = applicantData.link
        }
        // console.log('job title: ', jobTitle);
        // console.log('Status: ', statusCode);
        // noOfApplicant = ethers.BigNumber.from(noOfApplicant).toNumber();
        // statusCode = ethers.BigNumber.from(statusCode).toNumber();


        APPLICATION_DATA.push({
           apply_date: applicationDate,
           link: link,
           jobTitle,
           noOfApplicant,
           status,
           statusCode,
           postingAddress: appliedJobAddress
        })
       
    }catch(err){
      console.log(err)
    }
  }
    return APPLICATION_DATA;
}


function resolveStatus(x) {
  if(isNull(x))return'';
  if(x === 0 ) {
      return "DRAFT"; 
  }
  if(x === 1 ) {
      return "OPEN"; 
  }
  if(x === 2 ) {
      return "FILLED"; 
  }
  if(x === 3 ) {
      return "CANCELLED"; 
  }
  if(x == 4 ||x == 5 || x == 6 || x == 7 || x == 8) {
      return "EXPIRED"; 
  }
}


export const getJobPosting = async(employerDashAddress) =>{
  // console.log('Employer dash address: ', employerDashAddress)
  let result =[]
  try{
      if(!isNull(employerDashAddress)){
        const contractInstance = getContractInstance(employerDashAddress, iJCEmployerDashboardAbi, 'signer');
        const postingAddresses = await contractInstance.getPostings();
        result = await getJobPostingDetails(postingAddresses);
      }
  }catch(err){}

  return result;
}


const getJobPostingDetails = async(postingAddresses) =>{
  const JOB_POSTINGS = []; let option1='', option2=''
    for(let i = 0; i < postingAddresses.length; i++){
      try{
      const postingAddress = postingAddresses[i];
      const contractInstance = getContractInstance(postingAddress, iJCJobPostingAbi, 'signer');
      let postedDate = await contractInstance.getFeatureUINT("POSTING_DATE_FEATURE");
      const jobTitle = await contractInstance.getFeatureSTR("JOB_TITLE");
      let applicantCount = await contractInstance.getFeatureUINT("APPLICANT_COUNT_FEATURE");
      let expiryDate = await contractInstance.getFeatureUINT("EXPIRY_DATE_FEATURE");
      const status = resolvePostStatus(await contractInstance.getStatus());
            if (status === "DRAFT") {
                // console.log("draft");
                 option1 = 'EDIT';
                 option2 = 'ARCHIVE';
            }

            if (status === "POSTED") {
                // console.log("posted option");
                 option1 = 'FILL';
                 option2 = 'CANCEL';
            }

            if (status === "EXPIRED") {
                // console.log("expired");
                 option1 = 'EXTEND';
                 option2 = 'ARCHIVE';
            }

            if (status === "FILLED" || status === "CANCELLED" || status === "EXPIRED") {
                 option1 = 'ARCHIVE';
            }
            // console.log('posted date: ', postedDate)
            // console.log('expiry date: ', expiryDate)
            // console.log('applicant count: ', applicantCount)
            // console.log('options: ', postingAddress)
            postedDate = new Date(ethers.BigNumber.from(postedDate.toNumber()) * 1000);
            applicantCount = ethers.BigNumber.from(applicantCount).toNumber();
            expiryDate = new Date(ethers.BigNumber.from(expiryDate).toNumber() * 1000);
            // console.log('PostedDate: ', postedDate)
            // console.log('Expiry date: ', expiryDate)
            JOB_POSTINGS.push({ postedDate, expiryDate, jobTitle, status, applicantCount, options: [option1, option2],  postingAddress })
      }catch(err){}
    }

    return JOB_POSTINGS;
}


function resolvePostStatus(x) {
      if(x == 0 ) {
          return "DRAFT"; 
      }
      if(x == 1 ) {
          return "POSTED"; 
      }
      if(x == 2 ) {
          return "FILLED"; 
      }
      if(x == 3 ) {
          return "CANCELLED"; 
      }
      if(x == 4 ) {
          return "EXPIRED"; 
      }
      if(x == 5 ) {
          return "EXTENDED"; 
      }
      if(x == 6 ) {
          return "DEACTIVATED"; 
      }
      if(x == 7 ) {
          return "BARRED"; 
      }
      if(x == 8 ) {
          return "ARCHIVED"; 
      }  
}


export const executeJobPostingAction = async(code, postedJobAddress) =>{
  let saved = false;
  try{
    const contractInstance = getContractInstance(postedJobAddress, iJCJobPostingEditorAbi, 'signer');
    saved = await contractInstance.executePostingAction(code);
  }catch(err){}

  return saved;
}

const filter = ["this", "is", "an", "role", "that", "will", "see", "you", "and", "highly", "active", "in", ",", "the", "a", "how", "when", "where", "who", "why", "then", "into", "insert", "as", "for", "to", "too", "two", "\n", "new", "out"];



export const saveToEVM = async(jobJSON, jobDescriptionHash, companySummaryHash, employerPostingAddress)=> {
  jobJSON = JSON.parse(jobJSON);
  let selectedPostingAddress = employerPostingAddress
  const featureNames = ["JOB_TITLE", "JOB_LOCATION_TYPE", "JOB_LOCATION_SUPPORT", "JOB_WORK_LOCATION", "COMPANY_NAME", "COMPANY_LINK", "COMPANY_SUMMARY", "JOB_WORK_TYPE", "JOB_PAYMENT_TYPE", "JOB_DESCRIPTION", "USER_SEARCH_TERMS", "APPLY_LINK"];
 
  const featureValues = [jobJSON.jobTitle + "", jobJSON.locationType + "", jobJSON.locationSupport + "", jobJSON.workLocation + "", jobJSON.companyName + "", jobJSON.companyLink, companySummaryHash + "", jobJSON.workType + "", jobJSON.paymentType + "", jobDescriptionHash + "", jobJSON.userSearchTerms + "", jobJSON.applicationLink + ""];
  // console.log(featureNames);
  // console.log(featureValues);

const terms = [jobJSON.jobTitle + "", jobJSON.locationType + "", jobJSON.locationSupport + "", jobJSON.workLocation + "", jobJSON.companyName + "", jobJSON.workType + "", jobJSON.paymentType + ""];

  const c = decomposeText(jobJSON.companySummary);
  const u = decomposeText(jobJSON.userSearchTerms);
  const n = decomposeDescription(jobJSON.description);
  // console.log(c);
  // console.log(u);
  // console.log(n);
  const searchTerms = unique(terms.concat(c).concat(u).concat(n));
  // console.log(searchTerms);
  // console.log('i reached here',jobJSON.searchCategories)
  // console.log('i reached here',jobJSON.skillsRequired);
  
  // console.log('posting address: ', selectedPostingAddress);
  // console.log('featured names: ',featureNames);
  // console.log('featured values: ', featureValues);
  // console.log('search categories: ',jobJSON.searchCategories);
  // console.log('skills: ', jobJSON.skillsRequired);
  // console.log('search terms: ', searchTerms);
  const contractInstance = getContractInstance(selectedPostingAddress, iJCJobPostingEditorAbi, 'signer');
  const result = await contractInstance.populate(featureNames, featureValues, jobJSON.searchCategories, jobJSON.skillsRequired, searchTerms);
  // console.log('Result after populating: ',result);
  
  return result
  //  setSaveMsg("Saved @> EVM :: " + response.blockHash + " :: IPFS COMPANY SUMMARY HASH :: " +companySummaryHash+"IPFS JOB DESCRIPTION :: " + jobDescriptionHash);
}


function unique(array) {
  // console.log('is uniq array: ', typeof array);
    var q = new Set();
    for (var x = 0; x < array.length; x++) {
        q.add(array[x]);
    }
    return Array.from(q.values());
  }

  function decomposeText(text) {
    // console.log(filter.length);
    // console.log(text);
    // to lower case 
    var lower = text.toLowerCase();
    // split
    var array = lower.split(" ");
    // de-duplicate 
    var q = new Set();
    for (var x = 0; x < array.length; x++) {
        var val = array[x];

        if (val.includes(",")) {
            val = val.replace(",", "");
        }
        // console.log("value: " + val + " filter " + filter.includes(val));

        if (!filter.includes(val)) {
            q.add(val);
        }
    }
    return Array.from(q.values());
}


function decomposeDescription(desc) {
  const ops = desc.ops;
  // console.log('ops: ', ops);
  const duppedTerms = [];
  for (var x = 0; x < ops.length; x++) {
      var insert = ops[x].insert;
      // console.log('insert: ',insert);
      duppedTerms.concat(decomposeText(insert));
  }

  // console.log('----Dupped: ', duppedTerms)
  return unique(duppedTerms);
}

export const getPaymentInformation = async(postingAddress) =>{
   try{
    const productAddress = await getProductAddress(postingAddress)
     const contractInstance = getContractInstance(productAddress,iOpenProductAbi, 'provider');
     let duration = await contractInstance.getFeatureUINTValue("DURATION");
     let price = await contractInstance.getPrice();
     try{
     duration = ethers.BigNumber.from(duration).toNumber();
     duration = duration/(60*60*24*7)
    //  console.log('duration: ', duration);
     }catch(err){
      // console.log('duration error: ', err)
     }
     try{
        price = ethers.BigNumber.from(price).toNumber();
     }catch(err){
      // console.log('price error: ', err)
     }
    //  console.log('price: ', price);
     const erc20 = await contractInstance.getErc20();
    //  console.log('Erc20: ', erc20);
     const currency = await contractInstance.getCurrency();
    //  console.log('currency: ', currency);
     const decimal = await getDecimal();
    //  console.log('Decimal: ',decimal)

     return { duration, erc20, currency, price: (price/(10**decimal)), decimal };
   }catch(err){}

   return null;
}

export const approvePayment = async(price, erc20Address) =>{
  // console.log('PRICE TO APPROVE: ', price);
  let paymentManagerAddress = '';
  try{
    const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
    if(!isNull(CONTRACTS)){
         paymentManagerAddress = CONTRACTS[CONTRACTS.findIndex(item=>item.key === 'RESERVED_JOBCRYPT_PAYMENT_MANAGER_CORE')].value;
    }else{
      paymentManagerAddress = await getContractFromRegistry('RESERVED_JOBCRYPT_PAYMENT_MANAGER_CORE');
    }

    const contractInstance = getContractInstance(erc20Address, iERC20Abi, 'signer');
    const approve = await contractInstance.approve(paymentManagerAddress, price);
    return approve;
  }catch{}

  return null;
}


export const buyPosting = async(postingAddress) =>{
  let paymentManagerAddress = '';
  try{
    const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
    if(!isNull(CONTRACTS)){
         paymentManagerAddress = CONTRACTS[CONTRACTS.findIndex(item=>item.key === 'RESERVED_JOBCRYPT_PAYMENT_MANAGER_CORE')].value;
    }else{
      paymentManagerAddress = await getContractFromRegistry('RESERVED_JOBCRYPT_PAYMENT_MANAGER_CORE');
    }

    const contractInstance = getContractInstance(paymentManagerAddress, iJCPaymentManagerAbi, 'signer');
    const result = await contractInstance.payForPosting(postingAddress);
    return result;
  }catch{}

  return null;
}


const getProductAddress = async(postingAddress) =>{
  try{
    const contractInstance = getContractInstance(postingAddress, iJCJobPostingAbi, 'signer');
    return await contractInstance.getFeatureADDRESS("PRODUCT_FEATURE");
   
  }catch(err){
    // console.log(err)
  }

return '';
}


export const isPostingPaid = async(postingAddress) =>{
  let paymentManagerAddress = '';
  try{
      const productAddress = await getProductAddress(postingAddress);
      const CONTRACTS = JSON.parse(sessionStorage.getItem('contracts'));
    if(!isNull(CONTRACTS)){
         paymentManagerAddress = CONTRACTS[CONTRACTS.findIndex(item=>item.key === 'RESERVED_JOBCRYPT_PAYMENT_MANAGER_CORE')].value;
    }else{
      paymentManagerAddress = await getContractFromRegistry('RESERVED_JOBCRYPT_PAYMENT_MANAGER_CORE');
    }

    const contractInstance = getContractInstance(paymentManagerAddress, iJCPaymentManagerAbi, 'signer');
    const isPaid = await contractInstance.isProductPaidForPosting(postingAddress, productAddress);
    return isPaid;

  }catch(err){}

  return false;
}

 export const getProductAddressInfo = async(postingAddress) =>{
  // console.log('....', postingAddress)
  const obj = {}; let name='', price, currency, decimals;
    try{
      const productAddress = await getProductAddress(postingAddress);
      const contractInstance = getContractInstance(productAddress, iOpenProductAbi);
      try{
       name = await contractInstance.getName();
      // console.log('NAME:', name)
      }catch(err){
        // console.log('NAME',err)
      }
      try{
       price = await contractInstance.getPrice();
      // console.log('PRICE:', price)
      }catch(err){
        // console.log('PRICE: ', err)
      }
       currency = await contractInstance.getCurrency();
      // console.log('CURRENCY:', currency)
       decimals = await getDecimal();
      // console.log('DECIMALS: ', decimals);
      price = ethers.utils.formatUnits(price * 0.8, decimals) * (10 ** decimals);
      obj.name = name;
      obj.price = formatPrice(price, decimals);
      obj.currency = currency
      obj.productAddress = productAddress
      // console.log('Obj: ',obj)
    }catch(err){

    }
  
  return obj;
}

export const postAJob = async(postingAddress) =>{
  try{
      const contractInstance = getContractInstance(postingAddress,iJCJobPostingEditorAbi, 'signer');
      const posted = contractInstance.post();
      return posted;
  }catch(err){}

  return false
}

export const getPostJobStatus = async(postingAddress) =>{
   try{
    const contractInstance = getContractInstance(postingAddress, iJCJobPostingAbi, 'provider');
    const status = await contractInstance.getStatus();
    return resolvePostStatus(status);
   }catch(err){}

   return false;
}

export const permissionToViewApplyLink = async(postingAddress) =>{
  let applyLink='';
  try{
      const contractInstance = getContractInstance(postingAddress, iJCJobPostingAbi, 'signer');
      try{
          applyLink = await contractInstance.applyForJob();
          console.log('APPLY LINK: ', applyLink);
          // applyLink = await sendGetRequest(`${JOBCRYPT_IPFS_URL}${applyLink}`);
      }catch(err){
      }
      
  }catch(err){}
    return applyLink;
}

export const getApplyLink = async(postingAddress) =>{
  let applyLink='';
  try{
      const contractInstance = getContractInstance(postingAddress, iJCJobPostingAbi, 'signer');
      try{
          applyLink = await contractInstance.getFeatureSTR('APPLY_LINK');
          // applyLink = await sendGetRequest(`${JOBCRYPT_IPFS_URL}${applyLink}`);
      }catch(err){
      }
      
  }catch(err){}
    return applyLink;
}
