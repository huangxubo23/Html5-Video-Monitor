var video = document.querySelector('video');
var audio = document.querySelector('audio');
var canvas = document.querySelectorAll('canvas')[0];
var canvasForDiff = document.querySelectorAll('canvas')[1];

/*
* video 捕获摄像头画面
*/
navigator.webkitGetUserMedia({
    video: true
}, success, error);

function success(stream) {
    video.src = window.URL.createObjectURL(stream);
    video.play();
}

function error(err) {
    alert('video error: ' + err);
}


/*
* canvas
*/
var context = canvas.getContext('2d'),
    diffCtx = canvasForDiff.getContext('2d');
//将第二个画布混合模式设为“差异”
diffCtx.globalCompositeOperation = 'difference';

var preFrame,  //前一帧
    curFrame;  //当前帧
var diffFrame; //存放差异帧的imageData

//捕获并保存帧内容
function captureAndSaveFrame() {
    preFrame = curFrame;
    context.drawImage(video, 0, 0, 640, 680);
    //转为base64并保存
    curFrame = canvas.toDataURL();
}

//绘制Base64图像到画布
function drawImage(src, ctx) {
    ctx = ctx || diffCtx;
    var img = new Image();
    img.src = src;
    ctx.drawImage(img, 0, 0, 640, 480);
}

//渲染前后两帧差异
function renderDiff() {
    if (!preFrame || !curFrame) return;
    diffCtx.clearRect(0, 0, 640, 480);
    drawImage(preFrame);
    drawImage(curFrame);
    //捕获差异帧的imageData对象
    diffFrame = diffCtx.getImageData(0, 0, 640, 480);
}

//计算差异
function calcDiff() {
    if (!diffFrame) return 0;
    var cache = arguments.callee,
        count = 0;
    //整个画布都是白色时所有像素的值的总和
    cache.total = cache.total || 0;
    for (var i = 0, l = diffFrame.width * diffFrame.height * 4; i < l; i += 4) {
        count += diffFrame.data[i] + diffFrame.data[i + 1] + diffFrame.data[i + 2];
        //只需在第一次循环里执行
        if (!cache.isLoopEver) {
            //单个白色像素值
            cache.total += 255 * 3;
        }
    }
    cache.isLoopEver = true;
    //亮度放大
    count *= 3;
    //返回“差异画布高亮部分像素总值”占“画布全亮情况像素总值”的比例
    return Number(count / cache.total).toFixed(2);
}

//播放音频
function fireAlarm() {
    alert('alert');
    audio.play();
}

//定时捕获
function timer(delta) {
    setTimeout(function () {
        captureAndSaveFrame();
        renderDiff();
        setTimeout(function () {
            console.log(calcDiff());
        }, 10);
        timer(delta);
    }, delta || 500);
}

timer();