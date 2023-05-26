var max = 150;
var mn = 35;
var mi = 5;

setInterval(changeTime, 10);

function loadData() {
  let m = Number(getCookie("mistakes"));
  let c = Number(getCookie("clicks"));
  let t = Number(getCookie("time"));
  letters = getCookie("letters").split("");
  document.getElementById("mistakes").innerHTML = "mistakes(per 100c):" + ((m*100)/(m+c)).toFixed(2);
  document.getElementById("acpm").innerHTML = "cpm:" + (c*60*1000/t).toFixed(2);
  var tesdf = letters.toString();
  if(!(tesdf === "")){
    tesdf += ","
  }
  document.getElementById("selected").innerHTML = tesdf + "<span></span>";
}
function start(){
  if(letters.length > 0){
    document.getElementById("select").style.display = "none";  
    var text = generate()
    var i = 0;
    while(i < Math.floor((max-1)/mn)+1){
      document.getElementById("texts").appendChild(document.createElement("p"));
      document.getElementById("texts").childNodes[i+1].innerHTML = "<span>" + text.substring(mn*i, mn*(i+1)) + "&nbsp</span>";
      i++;
    }    
    characterIndex = 0;    
    mistake = 0;
    click = 0;
    time = 0;
    startTime = 0;
    novy = true;
    higlight();
    document.getElementById("main").style.display = "block";
    writing = true;
  }
}

function end(){
  document.getElementById("main").style.display = "none";
  if(!(time === 0)){
    let m = Number(getCookie("mistakes")) + mistake;
    setCookie("mistakes",m,999);
    let c = Number(getCookie("clicks")) + click;
    setCookie("clicks",c,999);
    let t = Number(getCookie("time")) + time;
    setCookie("time",t,999);
    var i = 0;
    var parent = document.getElementById("texts");
    while(i < Math.floor((max-1)/mn)+1){
      parent.removeChild(parent.lastChild);
      i++;
    }  
  }
  loadData();
  document.getElementById("select").style.display = "block";
  writing = false;
}

function reset(){
  deleteCookie("mistakes"); 
  deleteCookie("clicks");
  deleteCookie("time");
  deleteCookie("letters");
  loadData();
}

function generate(){
  var text = "";
  var i = 0;
  while(i<max){
    if((i % mi) === (mi-1)){
      text += " ";
    }
    else{
      text += letters[Math.floor(Math.random() * letters.length)];
    }
    i++;
  }
  return text;
}

var writing = false;
var letters = [];

document.addEventListener('keydown', keyPressed2);

function keyPressed2(event) {
  //console.log(event.keyCode); //log key code for debug
  if(!writing){
    if(event.keyCode === 8){ //backspace
      letters.pop();
      var i = 0;
      let lett = "";
      while(i < letters.length){
        lett += letters[i];
        i++;
      }
      setCookie("letters",lett,999);
    }
    else if(event.keyCode === 13){ //enter
      setTimeout(start, 100);
    }
    else if(event.keyCode === 46){ //enter
      setTimeout(reset, 100);
    }
    else if(64 < event.keyCode && event.keyCode < 91){
      var char = String.fromCharCode(event.keyCode);
      letters.concat(char)
      let first = letters.find(myFunction);
      if(first === char){

      }
      else{
        letters = letters.concat(char);
        var i = 0;
        let lett = "";
        while(i < letters.length){
          lett += letters[i];
          i++;
        }
        setCookie("letters",lett,999);
      }

      function myFunction(value, index, array) {
        return value === char;
      }
    }
    loadData();
  }  
}



//writing
var characterIndex = 0;
var novy = true;
var mistake = 0;
var click = 0;
var startTime = 0;
var time = 0;

function changeTime(){
  var minutes = "";
  if(startTime === 0){
    miliseconds = time;
  }
  else{
    miliseconds = Date.now() - startTime;
  }
  document.getElementById("time").innerHTML = ("000" + Math.floor(miliseconds/60000)).slice(-2) + ":" + ("000" + (Math.floor(miliseconds/1000) - Math.floor(miliseconds/60000)*60)).slice(-2) + "." + ("000" + (miliseconds - Math.floor(miliseconds/1000)*1000)).slice(-3);
  document.getElementById("cpm").innerHTML = (click*60*1000/miliseconds).toFixed(2);
}


function higlight(){
  document.getElementById("count").innerHTML = mistake;
  var n = Math.floor(characterIndex / mn);
  if(n > 0){
    document.getElementById("texts").childNodes[n].innerHTML = '<span class="done">'+ document.getElementById("texts").childNodes[n].innerText + "</span>";
  }
  var i = characterIndex - mn*(n);     
  n += 1;
  var paragraph = document.getElementById("texts").childNodes[n];

  var text = paragraph.innerText;
  if(characterIndex > max-1){
    var highlightedText = '<span class="done">' + text + '</span>';
  }
  else if(novy){
    var highlightedText = '<span class="done">' + text.substring(0, i) + '</span><span class="write">' + text.charAt(i) + '</span><span>' + text.substring(i + 1) + '</span>';
  }
  else{
    var highlightedText = '<span class="done">' + text.substring(0, i) + '</span><span class="false write">' + text.charAt(i) + '</span><span>' + text.substring(i + 1) + '</span>';
  }  
  paragraph.innerHTML = highlightedText;
}

function keyPressed(event) {
  if(writing && event.keyCode===27){
    setTimeout(end, 100);
  }
  else if(writing && characterIndex < max){
    if(characterIndex === 0 && startTime === 0){
      startTime = Date.now();
    }
    time = Date.now() - startTime;
    const keyCode = event.keyCode;
    var n = Math.floor(characterIndex / mn);
    var i = characterIndex - mn*(n);     
    n += 1;
    var paragraph = document.getElementById("texts").childNodes[n];
    var text = paragraph.innerText;
    if(String.fromCharCode(keyCode) === text.charAt(i).toUpperCase()){
      characterIndex += 1;
      novy = true;
      click += 1;
      if(characterIndex === max){        
        startTime = 0;
      }
    }
    else{
      novy = false;
      mistake += 1;
      document.getElementById("count").innerHTML = mistake;
    }
    higlight();
  }
  else if(writing && event.keyCode===13){
    setTimeout(end, 100);
  }
}

document.addEventListener('keydown', keyPressed);

//keyboard
var keys = document.querySelectorAll('.key');

function pressKey(event) {
  var key = event.keyCode;
  var activeKey = document.querySelector('[data-key="' + key + '"]');
  if (activeKey) {
    activeKey.classList.add('active');
  }
}

function releaseKey(event) {
  var key = event.keyCode;
  var activeKey = document.querySelector('[data-key="' + key + '"]');
  if (activeKey) {
    activeKey.classList.remove('active');
  }
}

document.addEventListener('keydown', pressKey);
document.addEventListener('keyup', releaseKey);


function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function deleteCookie(name){
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}