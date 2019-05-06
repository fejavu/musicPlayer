var musicList = [];
var currentIndex = 0;
var audio = new Audio();
audio.autoplay = true;

function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

getMusicList(function(list){
  musicList = list;
  generateList(list); // above the loadMusic function
  loadMusic(musicList[currentIndex]);
})

audio.ontimeupdate = function(){
  $('.currentProcess').style.width = (this.currentTime/this.duration)*100+'%';
  // console.log(musicObj.duration);
  // console.log(min);
  // console.log(sec);
  // $('.time').style.color = '#E70009';

}

audio.onplay = function() {
  clock =setInterval(function(){
    var min = Math.floor(audio.currentTime / 60) + '';
    var sec = Math.floor(audio.currentTime % 60) + '';
    sec = sec.length === 2 ? sec:'0' + sec;
    $('.time').innerText = min + ':' + sec;
  },1000)
}

audio.onpause = function() {
  clearInterval(clock);
}

audio.onended = function () {
  console.log('ended');
  currentIndex = (++currentIndex) % musicList.length;
  // console.log(currentIndex);
  loadMusic(musicList[currentIndex]);
}

$('.pause').onclick = function (){
  if(audio.paused){
    audio.play();
    $('.pause').classList.remove('icon-stop');
    $('.pause').classList.add('icon-music-icon_pause');
  }else {
    audio.pause();
    $('.pause').classList.remove('icon-music-icon_pause');
    $('.pause').classList.add('icon-stop');
  }

}

$('.forward').onclick = function() {
  currentIndex = (++currentIndex) % musicList.length;
  console.log(currentIndex);
  loadMusic(musicList[currentIndex]);
}

$('.backward').onclick = function() {
  currentIndex = (musicList.length + (--currentIndex)) % musicList.length;
  console.log(currentIndex);
  loadMusic(musicList[currentIndex]);
}

$('.process').onclick = function(e) {
  console.log(e);
  var percent = e.offsetX / parseInt(getComputedStyle(this).width);
  console.log(percent);
  audio.currentTime=audio.duration * percent;
}

$('.playList').addEventListener('click', function(e){
  if($('.selected')) {
    $('.selected').classList.remove('selected');
  }
  e.target.classList.add('selected');

  // select and play
  if(e.target.tagName.toLowerCase()==='li') {
    for(var i=0;i<this.children.length;i++) {
      if(this.children[i] === e.target){
        currentIndex = i;
      }
    }
    // console.log(currentIndex);
    loadMusic(musicList[currentIndex]);
  }
})


function getMusicList(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET','./music.json',true);
  xhr.onload = function(){
    if((xhr.status >= 200 && xhr.status<300)|| xhr.status==304){
      callback(JSON.parse(this.responseText));
    }else{
      console.log("failed to get data");
    }
  }
  xhr.onerror = function(){
    console.log('network error');
  }
  xhr.send();
}


function loadMusic(musicObj) {
  var musicUList = $('.playList');
  audio.src = musicObj.src;
  audio.play();

  $('.name').innerText = musicObj.title;
  $('.artist').innerText = musicObj.author;
  $('.cover').style.backgroundImage = 'url('+ musicObj.img +')';
  for(var i=0;i< (musicUList).children.length;i++) {
    musicUList.children[i].classList.remove('selected');
  }
    // console.log('currentIndex: ' + currentIndex);
    // console.log('typeof: ' + typeof(currentIndex))
    // console.log((musicUList.children[currentIndex]));
    musicUList.children[currentIndex].classList.add('selected');

    if($('.icon-stop')) {
      $('.pause').classList.remove('icon-stop');
      $('.pause').classList.add('icon-music-icon_pause');
    }
}
  
function generateList(list) {
    for(var i=0;i<list.length;i++) {
      var musicItem = document.createElement('li');
      musicItem.classList.add('musicList');
      musicItem.innerText = list[i].title + ' - ' + list[i].author;
      $('.playList').appendChild(musicItem);
    }
}
