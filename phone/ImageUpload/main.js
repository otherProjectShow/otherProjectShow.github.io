// 另一种写法
function isMobile() {
  try {
    document.createEvent("TouchEvent"); return true;
  } catch(e) {
    return false;
  }
}
function log(txt,isClean = false){
  return;
  if(isClean){
    document.querySelector('#consoleLog').innerHTML = ''
  }
  if(txt){
    document.querySelector('#consoleLog').append(txt+'\n')
  }
}

let postFile = {
  init: function () {
    let t = this;
    t.regional = document.getElementById('label');
    t.getImage = document.getElementById('get_image');
    t.editPic = document.getElementById('edit_pic');
    t.editBox = document.getElementById('cover_box');
    t.px = 0; //background image x
    t.py = 0; //background image y
    t.sx = 15; //crop area x
    t.sy = 15; //crop area y
    t.sHeight = 96*2; //crop area height //in：英寸 （1in = 96px = 2.54cm）;
    t.sWidth = 96*2; //crop area width
    document.getElementById('post_file').addEventListener('change', t.handleFiles, false);
    document.getElementById('save_button').onclick = function () {
      t.editPic.height = t.sHeight;
      t.editPic.width = t.sWidth;
      let ctx = t.editPic.getContext('2d');
      let images = new Image();
      images.src = t.imgUrl;

      images.onload = function () {
        ctx.drawImage(images,t.sx,t.sy,t.sHeight,t.sWidth,0,0,t.sHeight,t.sWidth);
        document.getElementById('show_pic').getElementsByTagName('img')[0].src = t.editPic.toDataURL();
      };
    };
  },
  handleFiles: function() {
    let fileList = this.files[0];
    let oFReader = new FileReader();
    oFReader.readAsDataURL(fileList);
    oFReader.onload = function (oFREvent) {
      postFile.paintImage(oFREvent.target.result);
    };
  },
  paintImage: function(url) {
    let t = this;
    let createCanvas = t.getImage.getContext("2d");
    let img = new Image();
    img.src = url;
    img.onload = function(){
      if ( img.width < t.regional.offsetWidth && img.height < t.regional.offsetHeight) {
        t.imgWidth = img.width;
        t.imgHeight = img.height;
      } else {
        let pWidth = img.width / (img.height / t.regional.offsetHeight);
        let pHeight = img.height / (img.width / t.regional.offsetWidth);
        t.imgWidth = img.width > img.height ? t.regional.offsetWidth : pWidth;
        t.imgHeight = img.height > img.width ? t.regional.offsetHeight : pHeight;
      }
      t.px = (t.regional.offsetWidth - t.imgWidth) / 2 + 'px';
      t.py = (t.regional.offsetHeight - t.imgHeight) / 2 + 'px';

      t.getImage.height = t.imgHeight;
      t.getImage.width = t.imgWidth;
      t.getImage.style.left = t.px;
      t.getImage.style.top = t.py;

      createCanvas.drawImage(img,0,0,t.imgWidth,t.imgHeight);
      t.imgUrl = t.getImage.toDataURL();
      t.cutImage();
      t.drag();
    };
  },
  cutImage: function() {
    let t = this;

    t.editBox.height = t.imgHeight;
    t.editBox.width = t.imgWidth;
    t.editBox.style.display = 'block';
    t.editBox.style.left = t.px;
    t.editBox.style.top = t.py;

    let cover = t.editBox.getContext("2d");
    cover.fillStyle = "rgba(0, 0, 0, 0.5)";
    cover.fillRect (0,0, t.imgWidth, t.imgHeight);
    cover.clearRect(t.sx, t.sy, t.sHeight, t.sWidth);

    document.getElementById('show_edit').style.background = 'url(' + t.imgUrl + ')' + -t.sx + 'px ' + -t.sy + 'px no-repeat';
    document.getElementById('show_edit').style.height = t.sHeight + 'px';
    document.getElementById('show_edit').style.width = t.sWidth + 'px';
  },
  drag: function() {
    let t = this;
    let draging = false;
    let startX = 0;
    let startY = 0;
    let downOnName = 'onmousedown'
    let upOnName = 'onmouseup'
    if(isMobile()){
      downOnName = 'ontouchstart'
      upOnName = 'ontouchend'
    }
    //移动端不是mousedown、mousemove和mouseup
    //相应的应是touchstart、touchmove和touchend
    log(downOnName)
    log(upOnName)

    let onMove = function(_e) {
      let e = _e
      if(isMobile()){
        e = _e.targetTouches[0]
      }
      console.log('e???',e)
      let pageX = e.pageX - ( t.regional.offsetLeft + this.offsetLeft );
      let pageY = e.pageY - ( t.regional.offsetTop + this.offsetTop );
      log(pageX,true)
      log(pageY)

      if ( pageX > t.sx && pageX < t.sx + t.sWidth && pageY > t.sy && pageY < t.sy + t.sHeight ) {
          this.style.cursor = 'move';
          this[downOnName] = function(){
            draging = true;
            console.log('e???01',e)
            t.ex = t.sx;
            t.ey = t.sy;
            startX = e.pageX - ( t.regional.offsetLeft + this.offsetLeft );
            startY = e.pageY - ( t.regional.offsetTop + this.offsetTop );
          }
          window[upOnName] = function() {
            console.log('e???02',e)
            draging = false;
          }
          if (draging) {
            if ( t.ex + (pageX - startX) < 0 ) {
              t.sx = 0;
            } else if ( t.ex + (pageX - startX) + t.sWidth > t.imgWidth) {
              t.sx = t.imgWidth - t.sWidth;
            } else {
              t.sx = t.ex + (pageX - startX);
            };

            if (t.ey + (pageY - startY) < 0) {
              t.sy = 0;
            } else if ( t.ey + (pageY - startY) + t.sHeight > t.imgHeight ) {
              t.sy = t.imgHeight - t.sHeight;
            } else {
              t.sy = t.ey + (pageY - startY);
            }
            t.cutImage();
          }
      } else{
        this.style.cursor = 'auto';
      }
    }
    if(isMobile()){
      document.getElementById('cover_box').addEventListener('touchmove',onMove,false);
    }else{
      document.getElementById('cover_box').onmousemove = onMove;
    }
  }

};

postFile.init();




