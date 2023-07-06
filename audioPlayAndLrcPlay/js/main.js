const isPrintLog = true;//打不打印log

let i = 0
let linenum = 0
let lis = []
let lrcList = [];

//打印日志统一方法
function log(...txt){
  if(isPrintLog) console.log(...txt);
}

//加载
function onload(){
  loadLrc();
  initGc();
}

function playAudo(){
  onload();
  let audio = document.querySelector('#mainAudio');
  audio.src = './audio/01.mp3';
  audio.play();
}

function initGc(){
  let audio = document.querySelector('#mainAudio');
  audio.addEventListener('timeupdate',function lyricScroll(){
    log(audio.currentTime,lrcList[linenum])
    let lrcTimeObj = lrcList[linenum];
    log(lrcTimeObj);

    if(linenum == 0 && audio.currentTime.toFixed(2) >= lrcTimeObj.fd){
      heightLyric(1);
    }
    if(audio.currentTime.toFixed(2) >= lrcTimeObj.fd && audio.currentTime.toFixed(2) <= lrcList[linenum+1].fd){
      heightLyric(linenum)
      linenum++
    }else{
      //支持倒退

    }
  })
}

//加载歌词并扔到页面里
function loadLrc(){
  let lrcTxt = `
  [00:00.000] 作词 : Theodore/이민영
  [00:01.000] 作曲 : 4단콤보
  [00:16.187] 조용하게 기다리다 울어 난
  [00:23.415] 이제 와서 그래
  [00:26.101] 끝인 거 알면서
  [00:29.905] 오늘도 널 미워하다
  [00:36.404] 지쳐 쓰러져가는 걸
  [00:39.557] 또 바보같이 눈물 보이고
  [00:45.622] 이유를 몰라서
  [00:48.381] 하루 종일 혼자 널 불러
  [00:53.058] 마지막까지 이런 나
  [00:59.210] 목소리 듣고 싶은 게 다야
  [01:03.350] 아직도 그렇게 나를
  [01:06.392] 몰라주는 게 싫어
  [01:10.644] 믿을 수가 없어 난
  [01:14.037] 니가 떠난 그날이 너무 아파
  [01:20.361] 견딜 수 없이 힘들어
  [01:24.221] 잊을 수 있을까
  [01:26.585] 헤어지던 그날 우리
  [01:32.380] 다시 널 찾겠지
  [01:34.894] 아무렇지 않게 또
  [01:39.801] 생각나서 눈물 숨기고
  [01:44.654] 나도 내가 미워
  [01:47.295] 상처뿐인 내가 더 싫어
  [01:51.993] 내가 아니면 좋겠어
  [01:58.097] 목소리 듣고 싶은 게 다야
  [02:02.469] 아직도 그렇게 나를
  [02:04.978] 몰라주는 게 싫어
  [02:09.616] 믿을 수가 없어 난
  [02:13.353] 니가 떠난 그날이 너무 아파
  [02:18.327] 견딜 수 없이 힘들어
  [02:23.076] 잊을 수 있을까
  [02:25.548] 헤어지던 그날 우리
  [02:30.820] 슬픈 마음을 속이고
  [02:33.772] 나를 위해 웃어도
  [02:37.112] 힘든데 너 없는 게
  [02:39.516] 이젠 닿을 수 없을 거처럼 느껴
  [02:43.800] 지워버릴 수 있을까 다
  [02:46.413] 너를 떠날 수도 없는 하루를
  [02:51.697] 난 이렇게 보내 또
  [02:56.874] 난 한 번 더 보고 싶은 게 다야
  [03:01.510] 아직도 이렇게 너를 기다리는데 그래
  [03:08.489] 잊을 수가 없어 난
  [03:12.325] 함께 했던 그날이 너무 예뻐
  [03:18.250] 너 없는 나는 힘들어
  [03:21.487] 다시 돌아 갈래
  [03:24.694] 행복했던 그날 우리
  `
  // lrcTxt = `
  // [ti:]
  // [ar:]
  // [al:]
  // [by:]
  // [offset:0]
  // [00:02.01]与彼于此 - 庞琪祥
  // `

  //清空歌词
  document.querySelector('#showLyric').innerHTML = '';

  lis = [];
  linenum = 0;
  lrcList = [];


  let lineLrc = lrcTxt.split('\n');
  log(lineLrc);

  lineLrc.forEach(x => {
    let lrcDiv = document.createElement("li");
    //拆解
    let dAndts = x.split(']');
    if(dAndts.length == 2){
      let d = dAndts[0];
      let t = dAndts[1];
      if(d){
        d = d.replaceAll('[','')
        d = d.trim();

        let lrcTimes = d.split(':')
        let minutes = Number(lrcTimes[0])
        let second = Number(lrcTimes[1])

        let seconds = (minutes * 60 +second).toFixed(2)
        let fd = parseFloat(seconds)

        lrcList.push({
          d,
          fd,
          t,
        });
      }
      if(t){
        t = t.trim();
      }
      lrcDiv.dataset.date = d;
      let textnode = document.createTextNode(t);
      lrcDiv.appendChild(textnode);
      lis.push(lrcDiv);
    }
    i++;
    document.querySelector('#showLyric').appendChild(lrcDiv);
  })
  log(lrcList);
}

/**
 * 歌词滚动效果
 * @param {*} linenum 第几行，从1开始
 */
function heightLyric(linenum){
  // 1、歌词高亮
  // linenum:歌词行号
  let ul = document.getElementById('showLyric');
  if(linenum > 0){
    // 当前播放的前一行取消高亮显示，移除相关类
    //lis[linenum-1].removeAttribute("class");
    document.querySelectorAll('.lineheight').forEach(x => x.removeAttribute("class"))
  }
  // 歌词当前播放行
  let nowline = lis[linenum]
  nowline.setAttribute("class","lineheight")
  // 2、歌词滚动
  let _scrollTop = 0;//歌词滚动出去的距离
  ul.scrollTop = 0//初始，歌词滚出容器的距离为0
  let coefficient = 0.5
  // 当歌词位于可视区域上面，则不滚动
  //歌词可视区域高度的一半>当前歌词距离容器顶部偏移
  if(ul.clientHeight * coefficient > nowline.offsetTop){
    _scrollTop = 0
    //当前行距离顶部频移 >（歌词容器实际距离-可视容器距离的一半
  }else if(nowline.offsetTop > (ul.scrollHeight - ul.clientHeight * (1 - coefficient))){
  // 当最后一行歌词出现在可视区域，则不再向上滚动
    _scrollTop = ul.scrollHeight - ul.clientHeight
  }else{
  // 否则，滚动
    _scrollTop = nowline.offsetTop - ul.clientHeight * coefficient
  }
  /* 当前行距离顶部的偏移-滚动的距离>歌词可视区的一半
  说明：当前行在可视区域一半的位置以下，需要向上滚动 */
  if((nowline.offsetTop - ul.scrollTop) > ul.clientHeight * coefficient){
    ul.scrollTop += Math.ceil(nowline.offsetTop - ul.scrollTop - ul.clientHeight * coefficient)
  }else if((nowline.offsetTop - ul.scrollTop) < ul.clientHeight * coefficient && _scrollTop != 0){
    //当前歌词在可视区域一半以上
    ul.scrollTop -= Math.ceil(ul.clientHeight * coefficient - (nowline.offsetTop - ul.scrollTop))
  }else if(_scrollTop == 0){
    ul.scrollTop = 0
  }else{
    ul.scrollTop += lis[linenum].clientHeight
  }
}

//document.onload = onload;

