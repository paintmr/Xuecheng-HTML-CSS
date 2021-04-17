// 3個JavaScript特效（用原生JavaScript寫的）：
// 1 搜索框聚焦和失去焦点
// 2 点击编程入门的tab切换不同的页面
// 3 轮播图
// 4 （1）網頁滾動到banner上邊框與顯示屏重合時，左邊的職業發展position由absolute變成fixed。（2）網頁滾動到精品推薦nav上邊框與顯示屏重合時，顯示返回頂部按鈕。（3）點擊按鈕，返回頂部。


// 搜索框聚焦和失去焦点
var search = document.getElementById("search");
search.onfocus = function () {
  if (this.value === "输入关键词") {
    this.value = "";
  }
  this.style.color = "#050505";
};
search.onblur = function () {
  if (this.value === "") {
    this.value = "输入关键词";
    this.style.color = "#bfbfbf";
  }
};
// 点击编程入门的tab切换不同的页面
var codingCoursesTabList = document
  .getElementById("coding-courses-tab-list")
  .getElementsByTagName("li");
var codingCoursesTabItems = document.getElementsByClassName("tab-item");
for (let i = 0; i < codingCoursesTabList.length; i++) {
  codingCoursesTabList[i].onclick = function () {
    for (let i = 0; i < codingCoursesTabList.length; i++) {
      codingCoursesTabList[i].className = "";
    }
    this.className = "active-color";
    for (let i = 0; i < codingCoursesTabItems.length; i++) {
      codingCoursesTabItems[i].className = "tab-item";
    }
    codingCoursesTabItems[i].className = "tab-item tab-item-active";
  };
}
// 轮播图
// 1 動畫函數
function animate(obj, target, callback) {
  clearInterval(obj.timer);
  obj.timer = setInterval(function () {
    // 要對step取整，否則盒子到不了目標位置，總會差一點。要看step是正值還是賦值，如果是正值，就向上取整；如果是負值，就向下取整。
    var step = (target - obj.offsetLeft) / 10;
    step = step > 0 ? Math.ceil(step) : Math.floor(step);
    if (obj.offsetLeft === target) {
      clearInterval(obj.timer);
      // 回調函數寫在定時器結束裡面
      // if (callback) {
      //   callback();
      // }
      // 上面三行代碼相當於下面這一行，這叫短路運算。如果左邊為true才會執行右邊的代碼；如果左邊為false，就不再執行右邊的代碼了。
      callback && callback();
      return;
    }
    obj.style.left = obj.offsetLeft + step + "px";
  }, 15);
}
// 2 鼠標經過，顯示隱藏左右按鈕
var picsWrap = document.querySelector('.banner-pic-wrap');
var arrowL = document.querySelector('.arrow-l');
var arrowR = document.querySelector('.arrow-r');
picsWrap.addEventListener('mouseover', function () {
  arrowL.style.display = 'block';
  arrowR.style.display = 'block';
  // 10-2 鼠標經過時，停止定時器
  clearInterval(timer);
  timer = null;
})
picsWrap.addEventListener('mouseout', function () {
  arrowL.style.display = 'none';
  arrowR.style.display = 'none';
  // 10-3 鼠標離開時，開啟定時器
  timer = setInterval(function () {
    arrowR.click()
  }, 2000);
})
// 3 根據圖片張數，動態生成底部按鈕。
var pics = document.querySelector('.carousel');
var dots = document.querySelector('.carousel-dots');
for (let i = 0; i < pics.children.length; i++) {
  var li = document.createElement('li');
  if (i === 0) {
    li.className = 'active';
  }
  dots.appendChild(li);
  // 4 點擊底部按鈕，選中相應按鈕。生成li的時候綁定點擊事件
  var picWidth = picsWrap.clientWidth;
  li.addEventListener("click", function () {
    // 把所有的按鈕變成非選中狀態，然後選中當前按鈕
    for (let i = 0; i < dots.children.length; i++) {
      dots.children[i].className = '';
    }
    this.className = 'active';
    // 7-2 記錄當前是第幾個下部按鈕
    dotI = i;
    // 5 點擊底部按鈕，選擇相應圖片
    animate(pics, -picWidth * i);
  })
}
// 6 點擊右側按鈕播放圖片
// 6-1 克隆pic0，放到pics末尾
var pic1 = pics.children[0].cloneNode(true);
pics.appendChild(pic1);
var picI = 0;//6-2 記錄當前是第幾張圖片
var dotI = 0;//7-1 記錄當前是第幾個下部按鈕
arrowR.addEventListener('click', function () {
  // 11-1 設置節流閥
  if (flag) {
    flag = false;
    // 6-3 每點擊一次，就把pics往左移動1張圖片。當pics展示的是克隆的pic1時，點擊時，先快速把picI=0,pics的left設置為0，然後再開始動畫。
    if (picI === dots.children.length) {
      picI = 0
      pics.style.left = 0;
    }
    picI++
    animate(pics, -picWidth * picI, function () {
      flag = true; //11-2 打開節流閥
    });
    // 7 點擊右側按鈕時，底部的選中狀態一起變化
    dotI++;
    // 7-3 把所有的按鈕變成非選中狀態，然後選中當前按鈕
    for (let i = 0; i < dots.children.length; i++) {
      dots.children[i].className = '';
    }
    // 7-4 如果dotI<按鈕個數，則直接給序號為dotI的加active狀態，否則是dotI=按鈕個數，即到達了克隆的pic1了，這時要把首個按鈕選中，並且把dotI設為0.
    if (dotI < dots.children.length) {
      dots.children[dotI].className = 'active';
    } else {
      dots.children[0].className = 'active';
      dotI = 0;
    }
  }
})
// 8 點擊左邊的按鈕滾動圖片
arrowL.addEventListener('click', function () {
  // 11-3 設置節流閥
  if (flag) {
    flag = false;
    // 8-1 如果當前是首圖，則快速跳到克隆的pic1，再把pics依次往右移動
    if (picI === 0) {
      picI = dots.children.length
      pics.style.left = -picWidth * picI + "px"
      // 9 點擊左側按鈕時，底部按鈕選中狀態一起變化
      // 9-1設置底部選中按鈕序號
      dotI = picI
    }
    picI--;
    animate(pics, -picWidth * picI, function () {
      flag = true; //11-4 關閉節流閥
    });
    // 9-1
    dotI--;
    // 9-2 把所有的按鈕變成非選中狀態，然後選中當前按鈕
    for (let i = 0; i < dots.children.length; i++) {
      dots.children[i].className = '';
    }
    dots.children[dotI].className = 'active';
  }
})
// 10 自動播放，類似於設置了定時器定時點擊右邊的按鈕
var timer = setInterval(function () {
  arrowR.click()
}, 2000);
// 11 節流閥 防止連續點擊左右按鈕，圖片切換速度過快
var flag = true;

// 網頁滾動到精品推薦nav時，左邊的職業發展position由absolute變成fixed
var banner = document.querySelector('.banner');
var careerPlans = document.querySelector('.career-plans-tag');
var recommendNav = document.querySelector('.recommendation-nav');
var goTop = document.querySelector('.go-top');
document.addEventListener('scroll', function () {
  if (window.pageYOffset >= banner.offsetTop) {
    careerPlans.style.position = 'fixed';
    careerPlans.style.top = careerPlans.offsetTop + 'px';
  } else {
    careerPlans.style.position = 'absolute';
    careerPlans.style.top = '150px';
  }
  // 網頁滾動到精品推薦nav上邊框與顯示屏重合時，顯示返回頂部按鈕。
  if (window.pageYOffset >= recommendNav.offsetTop) {
    goTop.style.display = 'block';
  } else {
    goTop.style.display = 'none';
  }
})
// 點擊按鈕，返回頂部。
goTop.addEventListener('click', function () {
  animateY(window, 0);
})
// 垂直方向的緩動動畫函數
function animateY(obj, target, callback) {
  clearInterval(obj.timer);
  obj.timer = setInterval(function () {
    var step = (target - window.pageYOffset) / 10;
    step = step > 0 ? Math.ceil(step) : Math.floor(step);
    if (window.pageYOffset === target) {
      clearInterval(obj.timer);
      callback && callback();
      return;
    }
    window.scroll(0, window.pageYOffset + step);
  }, 15);
}
