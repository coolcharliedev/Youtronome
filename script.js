async function newRound(){
    if(window.localStorage.getItem('gameMode') == "active") return alert('Please wait for the previous round to end')
    bpm = await genBpm()

    delayTime = 60/bpm

    console.log(delayTime*1000,bpm)

    window.localStorage.setItem('bpm',bpm)

    window.localStorage.setItem('delayTime',delayTime)

    window.localStorage.setItem('gameMode',"active")

    window.localStorage.setItem('sequenceCounter',1)

    document.getElementById('bpminput').focus()
    
    document.getElementById('previousguesses').innerHTML = ''

    iterable()
}

async function genBpm(){
    upperlimit = 350
    lowerlimit = 20
    bpme = Math.floor(Math.random() * upperlimit-lowerlimit)+lowerlimit
    bpme = Math.floor(bpme/5)*5
    return bpme
}

async function removeSeq(){
    i = 0
    elms = document.getElementsByClassName('indicator')
    while(i<elms.length){
        elms[i].classList.remove('active')
        i++
    }
}

async function addSeq(){
    i = 0
    elms = document.getElementsByClassName('indicator')
    while(i<elms.length){
        elms[i].classList.add('active')
        i++
    }
}

async function iterable(){
    console.log('beat')
    if(window.localStorage.getItem("gameMode") != "active") return

    if(window.localStorage.getItem('sequenceCounter') == 1){
        removeSeq()
        window.localStorage.setItem('sequenceCounter',0)
    }else{
        addSeq()
        window.localStorage.setItem('sequenceCounter',1)
    }

    var audio = new Audio('tick.mp3');
    audio.play();

    delayTime = window.localStorage.getItem('delayTime')
    
    delayTime = parseFloat(delayTime)
    
    delayTime = delayTime*1000
    
    setTimeout(function(){iterable()},delayTime)
}

//bpminput
async function sendGuess(){
    input = document.getElementById('bpminput').value
    if(!parseInt(input)) return document.getElementById('bpminput').value = ""

    document.getElementById('bpminput').value = ""
    document.getElementById('bpminput').focus()

    bpm = window.localStorage.getItem('bpm')

    //(Math.abs(input-bpm))

    t = document.createElement('div')

    b = document.createElement('span')
    b.innerHTML = input+"bpm"
    b.style.color=getColorFromValue(Math.abs(input-bpm))
    b.classList.add('h1')
    t.appendChild(b)

    if(input == bpm){
        alert('correct!')
        window.localStorage.removeItem('gameMode')
    }

    document.getElementById('previousguesses').prepend(t)
}

function getColorFromValue(value) {
  if (value < 0) {
    throw new Error("Value must be greater than or equal to 0");
  }

  // Cap the value at 60 if it's higher
  const clampedValue = Math.min(value, 60);

  // Calculate hue: 120 (green) to 0 (red)
  const hue = 120 - (clampedValue / 60) * 120;

  // Return HSL color string
  return `hsl(${hue}, 100%, 50%)`;
}
