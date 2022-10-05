//global value
let div=null;
const defaultColor = {
	red: 222,
	green: 222,
	blue: 222,
};
const defaultPresetColors = [
	'#ffcdd2',
	'#f8bbd0',
	'#e1bee7',
	'#ff8a80',
	'#ff80ab',
	'#ea80fc',
	'#b39ddb',
	'#9fa8da',
	'#90caf9',
	'#b388ff',
	'#8c9eff',
	'#82b1ff',
	'#03a9f4',
	'#00bcd4',
	'#009688',
	'#80d8ff',
	'#84ffff',
	'#a7ffeb',
	'#c8e6c9',
	'#dcedc8',
	'#f0f4c3',
	'#b9f6ca',
	'#ccff90',
	'#ffcc80',
];
const copySound = new Audio('./copy-sound.wav');

window.onload=()=>{
    main()
    updateColorCodeToDom(defaultColor)
    displayAllColorBoxes(document.getElementById("preset-colors"),defaultPresetColors)
    }
    
/**
 *This function will load all data need for color picker to work.It will be loaded when window will open;
 */
 let main= ()=>{
    // DOM ref
    const copyToClipboardBtn=document.getElementById("copy-to-clipboard");
    const randomColorBtn=document.getElementById("generate-random-color");
    const hexCodeHolder=document.getElementById("input-hex");
    const rgbCodeHolder=document.getElementById("input-rgb");
    const colorSliderRed=document.getElementById("color-slider-red")
    const colorSliderGreen=document.getElementById("color-slider-green")
    const colorSliderBlue=document.getElementById("color-slider-blue")
    const colorModeHex=document.getElementById("color-mode-hex")
    const colorMode=document.getElementsByName("color-mode")
    let presetColor=document.getElementById("preset-colors")
    //Event Listener
    randomColorBtn.addEventListener("click",()=>{
       handleRandomColorBtn()
    })
    
    //change display color on input hex code basis
    hexCodeHolder.addEventListener("keyup",(e)=>{
       handleHexCodeHolder(e)
    })
colorSliderRed.addEventListener("change", handleColorSlider(colorSliderRed,colorSliderGreen,colorSliderBlue))
colorSliderGreen.addEventListener("change", handleColorSlider(colorSliderRed,colorSliderGreen,colorSliderBlue))
colorSliderBlue.addEventListener("change", handleColorSlider(colorSliderRed,colorSliderGreen,colorSliderBlue))
copyToClipboardBtn.addEventListener("click" ,()=>{
    handleCopyToClipboardBtn(colorMode,hexCodeHolder,rgbCodeHolder)
})

presetColor.addEventListener("click",()=>handlePresetColorCopy(event))
    
}


/**
 *as highest value of rgb(255,255,255) so we multiply by 255 to get a random umber which is less than 255.
 * @returns {object}
 */
const generateDecimal=()=>{
    const red=Math.floor(Math.random()*255)
    const green=Math.floor(Math.random()*255)
    const blue=Math.floor(Math.random()*255)
    return {
        red,
        green,
        blue
    }
}


/**
 *if value single value comes - like 10 converts to A(single value),then we may get 5 or 4 or 3 digit hex code.So we will add 0 before single character;
 * @param {object} color 
 * @returns {string}
 */
const hexCodeGenerator=({red,green,blue})=>{
   const getTwoDigitCode=(value)=>{
      let hex=value.toString(16);
      return hex.length===1?`0${hex}`:hex;
    }
    //hexCode=#ffffff here first two for red second two for green ..and so on
    return `${getTwoDigitCode(red)}${getTwoDigitCode(green)}${getTwoDigitCode(blue)}`
}


/**
 *convert rgb to hex while typing in hex input field;
 * @param {object} color 
 * @returns {string}
 */
const rgbCodeGenerator=({red,green,blue})=>{
    return `rgb(${red},${green},${blue})`
}


/**
 * will generate decimal value from hex code.Firstly wit will divide 6 digit hex code into 3 section .Then each two value will transfer to integer value.
 * @param {string} hex color code,generated or got from input field of hex code. 
 * @returns {object} color
 */
const hexToDecimal=(hex)=>{
const red=parseInt(hex.slice(0,2),16)
const green=parseInt(hex.slice(2,4),16);
const blue=parseInt(hex.slice(4),16);
return{
    red,
    green,
    blue
}
}

let updateColorCodeToDom=(color)=>{
    let hexCode=hexCodeGenerator(color)
    let rgbCode=rgbCodeGenerator(color)
    document.getElementById("color-display").style.backgroundColor=`#${hexCode}`;//as it is a div
    document.getElementById("input-rgb").value=rgbCode;//as it is input field
    document.getElementById("input-hex").value=hexCode.toUpperCase();
    document.getElementById("color-slider-red").value=color.red;
    document.getElementById("color-slider-red-label").innerHTML=color.red
    document.getElementById("color-slider-green").value=color.green
    document.getElementById("color-slider-green-label").innerHTML=color.green
    document.getElementById("color-slider-blue").value=color.blue
    document.getElementById("color-slider-blue-label").innerHTML=color.blue
}




//event listener
let handleRandomColorBtn=()=>{
     //getting the color object generated in generateDecimal function
     let decimalColorObj=generateDecimal()
     updateColorCodeToDom(decimalColorObj);
}
const handleHexCodeHolder=(e)=>{
     //keyup event means-which key is pressed
     const hexColor=e.target.value;
     if(hexColor){ //if provided hex code is authentic then it will generate it to decimal color object, and updateColorCodeDom will change every field
         this.value=hexColor.toUpperCase() //here this means hexCodeHolder(ref of hex input),as this ref is in its parent function so with this keyWord we can access it.
         if(isValidHex(hexColor)){
             const color =hexToDecimal(hexColor)
             updateColorCodeToDom(color)
         }
     }
}
const handleColorSlider=(colorSliderRed,colorSliderGreen,colorSliderBlue)=>{
    return function(){
        console.log("hiiiiiii")
        const color={
            //input value always come in string to convert it into decimal we use parseInt.
            red:parseInt(colorSliderRed.value),
            green:parseInt(colorSliderGreen.value),
            blue:parseInt(colorSliderBlue.value),
            }
            updateColorCodeToDom(color)
    }
}

const handleCopyToClipboardBtn=(colorMode,hexCodeHolder,rgbCodeHolder)=>{
    let mode =getCheckedRadio(colorMode)
   if(mode===null){
    throw new Error("No Selected")
   }else if(mode==="hex"){
    navigator.clipboard.writeText(`#${hexCodeHolder.value}`)
        if(div!==null){
            div.remove()
            div=null;
        }
        if(isValidHex(hexCodeHolder.value)){
                    generateMsg(`#${hexCodeHolder.value} Copied`)
                }else{
                    alert("Please Provide valid hex code")
                }
   }else{
    navigator.clipboard.writeText(`${rgbCodeHolder.value}`)
            if(div!==null){
                div.remove()
                div=null;
            }
            if(isValidHex(hexCodeHolder.value)){
                        generateMsg(`${rgbCodeHolder.value} Copied`)
                    }else{
                        alert("Please Provide valid rgb code")
                    }
   }
}

const handlePresetColorCopy=(event)=>{
    let child=event.target
    if(child.className==="color-box"){
        navigator.clipboard.writeText(child.getAttribute("data-color"))
        copySound.volume=.2;
        copySound.play();
    }
}
//DOM manipulation
/**
 * msg string will be given where this generateMsg is being called.
 * @param {string} msg 
 */
const generateMsg=(msg)=>{
    div=document.createElement("div")
    div.innerText=msg;
    div.className="msg msg-slide-in"
    div.addEventListener("click",()=>{
        div.classList.remove("msg-slide-in")
        div.classList.add("msg-slide-out")
        div.addEventListener('animationend',()=>{
            div.remove()
            div=null;
        })
    })

    document.body.appendChild(div)
}
/**
 * get checked radio button from a list of radio button
 * here if we console colorMode we will get a nodes array containing all details of input 
 @param {Array} nodes
 @returns {String | null}
 */
const getCheckedRadio=(nodes)=>{
let checkedValue=null;
//if there are more radio button check which one is checked
for(let i=0; i<nodes.length;i++){
    if(nodes[i].checked){
        checkedValue=nodes[i].value;
        break;
    }
}
return checkedValue;
}
/**
 * will generate a color box
 * @param {string} color 
 * @returns {object}
 */
let generateColorBox=(color)=>{
   
    let div=document.createElement("div")
    div.className="color-box";
    div.style.backgroundColor=color
    //to keep color data in dom (copy purpose)
    div.setAttribute("data-color",color)
   return div;
}
/**
 * 
 * @param {object} parent 
 * @param {array} colors 
 */
let displayAllColorBoxes=(parent,colors)=>{
    colors.forEach(color=>{
    const colorBox=generateColorBox(color)
    parent.appendChild(colorBox)
    })
}
/**
 * check if input value is hex code or not
 @param {string} color //to set color as string..this will suggest all string method
 @returns {boolean}
 */
 const isValidHex=(color)=>{
    if(color.length !== 6)return false;    
   // if(color[0] !== "#")return false;  
  // color=color.substring(1)//to keep # separate,as it can not be passed in RegEx;
//to check if all six values are ok
  return /[0-9A-Fa-f]{6}/gi.test(color)
}
