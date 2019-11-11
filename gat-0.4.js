if (typeof(gat) === "undefined") {var gat = {};}

gat.Randomizer = class{
  constructor(initSeed){
    if (initSeed == undefined) initSeed = Date.now()
    if (typeof initSeed !== "number") {
      console.log("not a number as the input Seed")
      return;
    }
    initSeed = Math.abs(initSeed)
    initSeed = initSeed % 2147483646
    if(initSeed<1){
      initSeed = Math.round(initSeed*2147483646)
    }
    initSeed = (initSeed * 9973 + 192887) % 2147483647;
    this._seed = initSeed;
    this.initSeed = initSeed;
  }

  newRandomizer(){
    return new gat.Randomizer(this.next());
  }
  
  reset(){
    this._seed = this.initSeed;
  }

  next(min, max){
    if(max==undefined) {
      max = min;
      min = 0;
    }
    this._seed = this._seed * 16807 % 2147483647;
    if(min == undefined) min = 0
    if(max == undefined) max = min + 1
    return min + (max-min)*(this._seed / 2147483647);
  }

  nextInt(min, max){ // max number not included
    if(max==undefined) {
      max = min;
      min = 0;
    }
    this._seed = this._seed * 16807 % 2147483647;
    if(min == undefined) min = 0
    if(max == undefined) max = 2147483647
    return min + this._seed%(max-min)
  }

  nextBool(){
    this._seed = this._seed * 16807 % 2147483647;
    return this._seed<1073741823
  }

  nextArray(count, min, max){
    let out = []
    for(let i=0; i<count; i++){
      out.push(this.next(min, max));
    }
    return out;
  }

  nextChoice(choiceArray){
    return choiceArray[this.nextInt(0,choiceArray.length)]
  }

  nextWeightedChoice(choiceArray, probSum){
    // choiceArray need the structure: [[v1,prob1],[v2,prob2],...]
    let tempSum = 0;
    let ranVal = this.next(0, probSum);
    for(let c of choiceArray){
      tempSum += c[1];
      if (ranVal <= tempSum){
        return c[0]
      }
    }
  }

}

gat.CenteredElement = class{
  constructor(elemtTag, size, settings){
    this.settings = {
      borderAlpha: 0.96,
      ...settings
    }
    
    this.element = document.createElement(elemtTag);
    this._size = size;

    this.element.width = this.size[0];
    this.element.height = this.size[1];

    window.addEventListener("resize", this.resize.bind(this));
  }

  resize(){
    let middlePos = this.getMiddlePosition();
    let style = this.element.style
    style.position = "absolute";
    style.top = middlePos.offsetY.toString()+"px";
    style.left = middlePos.offsetX.toString()+"px";
    style.width = middlePos.width.toString()+"px";
    style.height = middlePos.height.toString()+"px";

    // strangly this only works this way correct...
    middlePos = this.getMiddlePosition();
    style = this.element.style
    style.position = "absolute";
    style.top = middlePos.offsetY.toString()+"px";
    style.left = middlePos.offsetX.toString()+"px";
    style.width = middlePos.width.toString()+"px";
    style.height = middlePos.height.toString()+"px";
  }

  getMiddlePosition(){
    let widthMult = this.size[1]/this.size[0];
    let alpha = this.settings.borderAlpha;
    let middlePos = {};
    
    // const posRect = this.element.parentElement.getBoundingClientRect();
    let width = this.element.parentElement.clientWidth;
    let height = this.element.parentElement.clientHeight;

    if(this.element.parentElement.nodeName === "BODY"){
      height = window.innerHeight;
      width = window.innerWidth;
    }

    if (width * widthMult <= height) {
        // stößt links und rechts an
        middlePos.width = alpha * width;
        middlePos.height = middlePos.width * widthMult;
    } else {
        // stößt unten und oben an
        middlePos.height = alpha * height;
        middlePos.width = middlePos.height / widthMult;
    }
    middlePos.offsetX = (width - middlePos.width) / 2;
    middlePos.offsetY = (height - middlePos.height) / 2;
    return middlePos;
  }

  get size(){
      return this._size
  }

  set size(sizeArg){
    if (sizeArg[0]==this._size[0] && sizeArg[1]==this._size[1]){
      return
    }
    this._size = sizeArg
    this.element.width = sizeArg[0];
    this.element.height = sizeArg[1];
    this.resize()
  }

  toggleLoader(){
    
  }
}

gat.addSaveAsSVGKey = function(key, canvasElement, drawfunc, namefunc){
  window.addEventListener("keyup", (event) => {
    if (document.activeElement.tagName == "TEXTAREA" || document.activeElement.tagName == "INPUT") return
    if(event.key == key){
      const ctx = new C2S(canvasElement.width, canvasElement.height);
      drawfunc(ctx)
      gat.downloadText(namefunc() + ".svg", ctx.getSerializedSvg());
    }
  });
}

gat.SeedList = class{
  constructor(initSeed, maxValue){
    this.maxValue = maxValue;
    this.currentSeedIndex = 0;
    this.seeds = [initSeed];
  }
  
  next(){
    this.currentSeedIndex++;
    if(this.currentSeedIndex+1 >= this.seeds.length){
      this.seeds.push(Math.floor(Math.random()*this.maxValue));
    }
    return this.seeds[this.currentSeedIndex];
  }
  
  prev(){
    if (this.currentSeedIndex>0) this.currentSeedIndex--;
    return this.seeds[this.currentSeedIndex];
  }

  current(){
    return this.seeds[this.currentSeedIndex];
  }

}

gat.ParameterHandler = class {
  constructor(onFinishChangeCalback){
    this.paramNameList = [];
    this.paramValueMap = {};
    this.paramSettingMap = {};
    this.onFinishChangeCalback = onFinishChangeCalback;
  }

  addParam(name, initValue, minValue, maxValue, stepSize){
    this.paramNameList.push(name);
    this.paramValueMap[name] = initValue;

    let binCount = Math.ceil(Math.log2(((maxValue-minValue)/stepSize) + 1))
    let type = "number"
    this.paramSettingMap[name] = {minValue, stepSize, binCount, type}
  }

  addSlider(name, initValue, minValue, maxValue, stepSize, directUpdate){
    // minValue and maxValue should be divideable by stepSize
    if(this.gui == undefined) this.gui = new dat.GUI();

    this.paramNameList.push(name)
    this.paramValueMap[name] = initValue;
  
    let binCount = Math.ceil(Math.log2(((maxValue-minValue)/stepSize) + 1))
    let type = "number"
    this.paramSettingMap[name] = {minValue, stepSize, binCount, type}
    
    let controller = this.gui.add(this.paramValueMap, name, minValue, maxValue, stepSize)
    .listen();

    if(directUpdate){
      return controller.onChange(this.onFinishChangeCalback)
    } else {
      return controller.onFinishChange(this.onFinishChangeCalback);
    } 
  }

  addButton(name, func){
    if(this.gui == undefined) this.gui = new dat.GUI();

    this.paramValueMap[name] = func;

    return this.gui.add(this.paramValueMap, name);
  }

  addCheckbox(name, initValue){
    if(this.gui == undefined) this.gui = new dat.GUI();

    this.paramNameList.push(name)
    this.paramValueMap[name] = initValue;
  
    let numOfPossibleValues = 2;
    let binCount = Math.ceil(Math.log2(numOfPossibleValues))
    let type = "boolean"
    this.paramSettingMap[name] = {binCount, type}
    
    return this.gui.add(this.paramValueMap, name)
    .onFinishChange(this.onFinishChangeCalback)
    .listen();
  }

  addDropdown(name, initValue, dropdownList){
    if(this.gui == undefined) this.gui = new dat.GUI();

    this.paramNameList.push(name)
    this.paramValueMap[name] = initValue;

    let binCount = Math.ceil(Math.log2(dropdownList.length))
    let type = "dropdown"
    this.paramSettingMap[name] = {binCount, type, dropdownList}

    return this.gui.add(this.paramValueMap, name, dropdownList)
    .onFinishChange(this.onFinishChangeCalback)
    .listen();
  }

  addText(name, initValue){
    if(this.gui == undefined) this.gui = new dat.GUI();

    this.paramNameList.push(name)
    this.paramValueMap[name] = initValue;

    return this.gui.add(this.paramValueMap, name).onFinishChange(this.onFinishChangeCalback)
    .listen(); 
  }

  load(s){
    s = this.hex2Binary(s);
    let currentCharIndex = s.length;
    for(let i = this.paramNameList.length; i>0 ; i--){
      let paramName = this.paramNameList[i-1]
      let setting = this.paramSettingMap[paramName];
      
      let subStr = s.substring(currentCharIndex - setting.binCount, currentCharIndex)
      currentCharIndex -= setting.binCount
      
      let intValue = parseInt(subStr, 2)
      let value;
      if (setting.type == "boolean"){
        value = intValue===1 ? true : false;
      } else if(setting.type == "dropdown") {
        value = setting.dropdownList[intValue]
      } else if(setting.type == "number") {
        value = setting.minValue + (intValue * setting.stepSize);
      }
      this.paramValueMap[paramName] = value;
      setting.minValue + (parseInt(subStr, 16) * setting.stepSize)
    }
  }

  save(){
    let s = "";
    for(let paramName of this.paramNameList){
      let setting = this.paramSettingMap[paramName];
      let value = this.paramValueMap[paramName];
      
      let intValue;
      if (setting.type == "boolean"){
        intValue = value===true ? 1 : 0;
      } else if(setting.type == "dropdown") {
        intValue = setting.dropdownList.indexOf(value)
      } else if(setting.type == "number") {
        intValue = Math.round((value-setting.minValue)/setting.stepSize);
      }

      let binValue = intValue.toString(2)
      s += "0".repeat(setting.binCount - binValue.length) + binValue;
    }
    return this.hex2Binary(s);
  }

  set(paramName, value){
    this.paramValueMap[paramName] = value;
  }

  getAll(){
    return this.paramValueMap;
  }

  get(paramName){
    return this.paramValueMap[paramName]
  }

  binary2Hex(binStr){
    const binStrArray = binStr.split( /(?=(?:.{4,4})*$)/ );
    return binStrArray.map((value) => parseInt(value, 2).toString(16)).join("")
  }

  hex2Binary(hexStr){
    return hexStr.split("").map((value) => {
      let binStr = parseInt(value, 16).toString(2);
      return "0".repeat(4 - binStr.length) + binStr
    }).join("") 
  }
  
}

gat.ui = class {
  constructor(){
    this.guiDiv = document.createElement("div");
    this.guiDiv.classList.add("ui-div");
    document.body.appendChild(this.guiDiv)

    this.canvasDiv = document.createElement("div");
    this.canvasDiv.classList.add("canvas-div");
    document.body.appendChild(this.canvasDiv)
    
    

    //this.values = {};
    this.getValueFunctions = {};

    this.addButton = this._addButton.bind(this, this.guiDiv);
    this.addCheckbox = this._addCheckbox.bind(this, this.guiDiv);
    this.addInput = this._addInput.bind(this, this.guiDiv);
    this.addSelection = this._addSelection.bind(this, this.guiDiv);
    this.addTextarea = this._addTextarea.bind(this, this.guiDiv);
    this.addFileInput = this._addFileInput.bind(this, this.guiDiv);
  }

  addFinishedTypingCallback(callbackFunc, time){
    this.typingTimer;
    window.addEventListener("keyup", (event) => {
      if (document.activeElement.tagName == "TEXTAREA" || document.activeElement.tagName == "INPUT") {
        clearTimeout(this.typingTimer);
        this.typingTimer = setTimeout(callbackFunc, time);
      }
    });
  }

  get values(){
    let values = {};
    for(let key in this.getValueFunctions){
      values[key] = this.getValueFunctions[key]();
    }
    return values;
  }

  _addButton(parentElement, name, func){
    const element = document.createElement("label");
    element.classList.add("ui-label");
    element.classList.add("ui-button-label");
    element.innerHTML = name;
    element.id = name;
    element.onclick = func;
    parentElement.appendChild(element);
    parentElement.appendChild(document.createElement("br"))
    return element;
  }

  _addCheckbox(parentElement, name, func){
    const element = document.createElement("label");
    element.classList.add("ui-label");
    element.innerHTML = name;
    element.id = name;
    parentElement.appendChild(element);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onchange = func;
    this.getValueFunctions[name] = function(){return checkbox.checked}
    element.appendChild(checkbox)
    parentElement.appendChild(document.createElement("br"))
    return element;
  }

  _addInput(parentElement, name, value, func, getValueFunc){
    let element = document.createElement("label");
    element.innerHTML = name
    element.classList.add("ui-label")
    parentElement.appendChild(element);
    parentElement.appendChild(document.createElement("br"))

    element = document.createElement("input");
    element.value = value;
    element.classList.add("item")
    element.classList.add("ui-input")
    //element.onchange = func;
    element.id = name;
    parentElement.appendChild(element);
    parentElement.appendChild(document.createElement("br"))

    if(getValueFunc == undefined){
      this.getValueFunctions[name] = function(){return element.value}
    } else {
      this.getValueFunctions[name] = function(){return getValueFunc(element.value)}
    }
    return element;
  }

  _addSelection(parentElement, name, values, func){
    let element = document.createElement("label");
    element.innerText = name
    element.classList.add("ui-label")
    parentElement.appendChild(element);
    parentElement.appendChild(document.createElement("br"))

    element = document.createElement("select");
    element.classList.add("item")
    element.onchange = func;
    element.id = name;
    for(let option of values){
      const optElement = document.createElement("option");
      optElement.innerText = option;
      element.appendChild(optElement);
    }
    parentElement.appendChild(element);
    parentElement.appendChild(document.createElement("br"))

    this.getValueFunctions[name] = function(){return element.value}
    return element;
  }

  _addTextarea(parentElement, name, value, func){
    let element = document.createElement("label");
    element.innerHTML = name
    element.classList.add("ui-label")
    parentElement.appendChild(element);
    parentElement.appendChild(document.createElement("br"))

    element = document.createElement("textarea");
    element.value = value;
    element.classList.add("item")
    element.classList.add("ui-input")
    
    element.rows = 5;
    element.id = name;
    parentElement.appendChild(element);
    parentElement.appendChild(document.createElement("br"))

    this.getValueFunctions[name] = function(){return element.value}   
    return element; 
  }

  _addFileInput(parentElement, name, func){
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    fileInput.addEventListener("change", func, false);
    //fileInput.accept = ".pbf"


    parentElement.appendChild(fileInput);

    const element = document.createElement("label");
    element.classList.add("ui-label");
    element.classList.add("ui-button-label");
    element.innerHTML = name;
    element.id = name;
    element.onclick = function(){
      fileInput.click();
    }
    parentElement.appendChild(element);
    parentElement.appendChild(document.createElement("br"))
    return element;
  }

  addTab(name){
    const element = document.createElement("label");
    element.classList.add("ui-label");
    element.classList.add("ui-button-label");
    element.classList.add("ui-tab-label");
    element.innerHTML = name;
    element.onclick = function(){
      if(subDiv.style.display == "none"){
        for(let td of document.getElementsByName("subDiv")){
          td.style.display = "none"
        }
        subDiv.style.display = "inherit";
      } else {
        subDiv.style.display = "none";
      }
    };
    this.guiDiv.appendChild(element);
    this.guiDiv.appendChild(document.createElement("br"))
    
    const subDiv = document.createElement("div");
    subDiv.setAttribute("name", "subDiv");
    subDiv.style.display = "none";
    subDiv.classList.add("ui-tab")
    this.guiDiv.appendChild(subDiv);

    return {
      addButton: this._addButton.bind(this, subDiv),
      addCheckbox: this._addCheckbox.bind(this, subDiv),
      addInput: this._addInput.bind(this, subDiv),
      addSelection: this._addSelection.bind(this, subDiv),
      addTextarea: this._addTextarea.bind(this, subDiv),
      addFileInput: this._addFileInput.bind(this, subDiv),
    }
  }
  
}

gat.ranVariable = {
  discreteDistribution: function(seed, valueProbabilityArray){
    let sum = 0;
    for(let i=0; i<valueProbabilityArray.length; i++){
      sum += valueProbabilityArray[i][1];
      valueProbabilityArray[i][1] = sum;
    }
    let scaledSeed = seed * sum;
    for(let i=0; i<valueProbabilityArray.length; i++){
      if(scaledSeed<=valueProbabilityArray[i][1]){
        return valueProbabilityArray[i][0]
      }
    }
  },

  linearDistribution: function(seed, valueProbabilityArray){
    let sum = 0;
    for(let i=0; i<valueProbabilityArray.length; i++){
      sum += valueProbabilityArray[i][1];
      valueProbabilityArray[i][1] = sum;
    }
    let scaledSeed = seed * sum;
    for(let i=0; i<valueProbabilityArray.length; i++){
      if(scaledSeed<=valueProbabilityArray[i][1]){
        if(i==0){
          return valueProbabilityArray[i][0]
        }
        let probLength = valueProbabilityArray[i][1] - valueProbabilityArray[i-1][1];
        let relScaledSeed = scaledSeed - valueProbabilityArray[i-1][1];
        let probPercent = relScaledSeed/probLength;

        let relValueDiff = valueProbabilityArray[i][0] - valueProbabilityArray[i-1][0];

        return valueProbabilityArray[i-1][0] + probPercent*relValueDiff;
      }
    }

  }
}

gat.checkMobile = function(){
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

gat.downloadText = function(filename, text){
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

gat.downloadCanvas = function(filename, canvas) {
  var element = document.createElement('a');
  element.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

gat.getURLQueryParam = function(param){
  return new URLSearchParams(window.location.search).get(param);
}

gat.getURLQueryParams = function(){
  out = {};
  new URLSearchParams(window.location.search).forEach(function(value, key){
    out[key] = value
  });
  return out
}

gat.setURLQueryParam = function(param, value){
  let urlParam = new URLSearchParams(window.location.search);
  urlParam.delete(param)
  urlParam.append(param, value)
  window.history.replaceState(null, "", "?" + urlParam.toString());
}

gat.setURLQueryParams = function(paramValueObj){
  let urlParam = new URLSearchParams(window.location.search);
  for(param in paramValueObj){
    urlParam.delete(param)
    urlParam.append(param, paramValueObj[param])
  }
  window.history.replaceState(null, "", "?" + urlParam.toString());
}

gat.addLoader = function(){
  const loader = document.createElement("div");
  loader.classList.add("loader");
  document.body.appendChild(loader); 
}

gat.removeLoader = function(){
  document.body.getElementsByClassName("loader")[0].remove();
}

gat.addLoaderText = function(){
  const loader = document.createElement("label");
  loader.classList.add("loader-text");
  loader.id = "loader-text";
  document.body.appendChild(loader);
  return loader; 
}

gat.removeLoaderText = function(){
  document.getElementById("loader-text").remove();
}

