const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");

const symbols='~`!@#$%^&*()_+={[}]|:;"<,>.?/';

//initially
let password= "";
let passwordLength= 10;
let checkCount=0;
handleSlider();
//strength circle color is gray
setIndicator("#ccc");

//set password length according slider value
function handleSlider()
{
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    // const min = inputSlider.min;
    // const max = inputSlider.max;
    // inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
    const min = parseInt(inputSlider.min);
    const max = parseInt(inputSlider.max);
    const percent = ((passwordLength - min) * 100) / (max - min);

    // inputSlider.style.backgroundImage = `linear-gradient(to right, lightgreen 0%, lightgreen ${percent}%, var(--lt-violet) ${percent}%, var(--lt-violet) 100%)`;
    inputSlider.style.backgroundImage = `linear-gradient(to right, #9912adff 0%, #9912adff ${percent}%, #29105aff ${percent}%, #29105aff 100%)`;
}

function setIndicator(color)
{
    indicator.style.backgroundColor=color;
    //apply shadow 
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max)
{
    //Math.random() range is 0(inclusive) - 1(exclusive)
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber()
{
    return getRndInteger(0,9);
}

function generateLowerCase()
{
    return String.fromCharCode(getRndInteger(97,123));//this method coverts random ascii code to character
}

function generateUpperCase()
{
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol()
{
    const random=getRndInteger(0,symbols.length);
    return symbols.charAt(random);
}

//Function to calculate the strength of the password
function calcStrength()
{
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    //check which checkbox has been ticked
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8)
    {
        setIndicator("#0f0");
    }

    else if (
      (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6 ) 
    {
      setIndicator("#ff0");
    } 
    
    else {
      setIndicator("#f00");
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);//Uses Clipboard API
        copyMsg.innerText="copied";
    }

    catch(e){
        copyMsg.innerText="failed";
    }

    //to make 'copy' message span visible
    //adds the CSS class 'active' to the HTML element referenced by copyMsg
    copyMsg.classList.add("active");

    //To make the 'copied' get vanished after 2 seconds
    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    } ,2000);
}


function shufflePassword(array)
{
    //Fisher Yates method to shuffle an array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}



function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    })

    //special condition
    if(passwordLength < checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);//when ticked or unticked the inner function gets invoked
})


//ev is event object here
inputSlider.addEventListener('input',(ev)=>{
    passwordLength=ev.target.value;
    handleSlider();
})


//if password field is non-empty then you can't copy it
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)//check if non-empty or not
    {
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
    //none of the checkbox is selected
    if(checkCount<=0)return;

    if(passwordLength < checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }

    // let's start the journey to find new password

    //remove old password
    password="";

    //let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked)
    // {
    //     password+=generateUpperCase();
    // }

    // if(lowercaseCheck.checked)
    // {
    //     password+=generateLowerCase();
    // }

    // if(numbersCheck.checked)
    // {
    //     password+=generateRandomNumber();
    // }

    // if(symbolsCheck.checked)
    // {
    //     password+=generateSymbol();
    // }

    let funcArr=[];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0;i<funcArr.length;i++)
    {
       password+=funcArr[i](); 
    }

    //remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++)
    {
       let randIndex=getRndInteger(0,funcArr.length);
       password+=funcArr[randIndex]();
    }

    //shuffle the password
    password=shufflePassword(Array.from(password));

    //show password in UI
    passwordDisplay.value=password;
    //calculate strength
    calcStrength();
})