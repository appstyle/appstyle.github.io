~ function(window, undefined) {
	$(function() {
		var wrapOut = $('.wrap_out');
		var scenceWrap = $('.scence_wrap');
		var scenceCount = scenceWrap.size();
		var bodyWidth = parseInt($(document.body).width());
		var bodyHeight = $(document.body).height();

		var unitWidth = $('.nj_mod').width();
		var unitHeight = $('.nj_mod').height();
		var diff = 1400 / 730;
		var curRatio = unitWidth / unitHeight;

		//重设UI
		// function setUI() {
		// 	if (curRatio > diff) {
		// 		var h = unitHeight < 730 ? unitHeight : 730;
		// 		$('html').css('font-size', (h * 16) / 730 + 'px');
		// 	}else {
		// 		var w = bodyWidth > 1400 ? 1400 : bodyWidth;
		// 		$('html').css('font-size', (w * 16) / 1400 + 'px');
		// 	}
		// 	var headHeight = $('.nj_hd').height();
		// 	scenceWrap.css('height', parseInt(bodyHeight - headHeight) + 'px');
		// 	wrapOut.attr('data-index', 0).addClass('scence_shouji');
		// }
		// setUI();

		//滚动距离
		function scrollHandle(el, value) {
			$(el).attr('style', '-webkit-transform:translateY(' + value*100 + '%) translateZ(0);-moz-transform:translateY(' + value*100 + '%) translateZ(0);transform:translateY(' + value*100 + '%) ;');
		}

		//检测系统
		function testOS() {
			var sUserAgent = navigator.userAgent;
			var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
			var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
			if (isMac) return "Mac";
			if (isWin) {
				var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
				if (isWin2K) return "Win2000";
				var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 ||
					sUserAgent.indexOf("Windows XP") > -1;
				if (isWinXP) return "WinXP";
				var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
				if (isWin2003) return "Win2003";
				var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
				if (isWinVista) return "WinVista";
				var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
				if (isWin7) return "Win7";
			}
			return "other";
		}

		var mouseWheelCount = 0;
		var Timer = [];
		var backTimer = null;
		var myVideo = document.getElementById('udcvideo');
		var OS = testOS();

		var Yearbooks = {
			//init
			init: function() {
				Yearbooks.slide(mouseWheelCount);


			},
			//pause
			pause: function() {
				$.each(Timer, function(index, val) {
					clearInterval(val);
					Timer[index] = null;
				});
			},
			//playVideo
			playVideo: function() {
				Yearbooks.pause();
				if (myVideo) {
					$(myVideo).attr('autoplay', 'autoplay').attr('loop', 'loop');
					try {
						// myVideo.webkitRequestFullScreen();
						myVideo.play();
						var videoTimer = setInterval(function() {
							var isEnd = myVideo.ended;
							if (isEnd == true) {
								Yearbooks.init();
								clearInterval(videoTimer);
								// document.webkitCancelFullScreen();
							}
						}, 100);
					} catch (e) {
						console.log('视频格式不支持');
					}
				}
			},
			//slide
			slide: function(index, auto) {
				Yearbooks.pause();

				var time = 5000;
				// 页面数组
				var item = scenceWrap[index];
				var isAnimate = $(item).attr('node-type');
				var _html = '';
				var _this = $(item);
				var _li = _this.find('.pic_list li');
				var _length = _li.size();
				var nextBtn = _this.find('.next_btn');
				var prevBtn = _this.find('.prev_btn');
				var numList = _this.find('.number_list');
				var curIndex = _this.attr('node-data') ? parseInt(_this.attr('node-data')) : 0;
				var hasVideo = _this.attr('data-video');
				var isAuto = true;

				function lock() {
					if (Timer[index]) {
						clearInterval(Timer[index]);
						Timer[index] = null;
						var temp = setTimeout(function() {
							// moveAuto();
							clearTimeout(temp);
							temp = null;
						}, 0);
					}
				}

				//监控导航状态
				function watchIndex(curIndex) {
					var numItem = _this.find('.number_list li');
					numItem.eq(curIndex).addClass('on').siblings().removeClass('on');
					// moveAuto();
					if (hasVideo == 'true' && curIndex == 1) {
						Yearbooks.playVideo();
					} else {
						try {
							myVideo.currentTime = 0;
							myVideo.pause();
							$(myVideo).removeAttr('autoplay').removeAttr('loop');
						} catch (e) {
							console.log('视频报错');
						}
					}

				}

				//初始化
				function init() {
					clearInterval(Timer[index]);
					Timer[index] = null;

					//添加导航
					if (_length < 2) {
						nextBtn.hide();
						prevBtn.hide();
						return;
					}

					for (var i = 0; i < _length; i++) {
						if (i == 0) {
							_html += '<li class="on"></li>';
						} else {
							_html += '<li></li>';
						}

					}
					numList.html(_html);
					watchIndex(curIndex);
				}
				init();

				//下一张
				function moveNext() {
					curIndex++;
					curIndex = curIndex > (_length - 1) ? 0 : curIndex;
					_this.attr('node-data', curIndex);
					// if (isAnimate == 'false') {
					// 	_li.eq(curIndex).fadeIn().siblings().fadeOut();
					// } else {
						_li.eq(curIndex).show().siblings().hide();
					// }
					watchIndex(curIndex);
				}

				//上一张
				function movePrev() {
					curIndex--;
					curIndex = curIndex < 0 ? (_length - 1) : curIndex;
					_this.attr('node-data', curIndex);
					// if (isAnimate == 'false') {
					// 	_li.eq(curIndex).fadeIn().siblings().fadeOut();
					// } else {
						_li.eq(curIndex).show().siblings().hide();
					// }
					watchIndex(curIndex);
				}

				//自动切换
				function moveAuto() {
					if (auto != true) {
						if (index != 0 || curIndex != 1) {
							Timer[index] && clearInterval(Timer[index]);
							Timer[index] = setInterval(moveNext, time);
						}
					}
				}

				//导航切换
				function switchNav(e) {
					var target = $(e.target);
					if (target.is('li')) {
						curIndex = target.index();
						_this.attr('node-data', curIndex);
						// if (isAnimate == 'false') {
						// 	_li.eq(curIndex).fadeIn().siblings().fadeOut();
						// } else {
							_li.eq(curIndex).show().siblings().hide();
						// }
						watchIndex(curIndex);
					}
				}
				numList.click(function(e) {
					lock();
					switchNav(e);
				});
				// numList[0].addEventListener('tap', function(e) {
				// 	lock();
				// 	switchNav(e);
				// });

				//左右按钮切换
				nextBtn.click(function(e) {
					lock();
					moveNext();
				});
				_this[0].addEventListener('swipeLeft', function() {
					lock();
					moveNext();
				});

				prevBtn.click(function(e) {
					lock();
					movePrev();
				});
				_this[0].addEventListener('swipeRight', function() {
					lock();
					movePrev();
				});

				$(document).keydown(function(e) {
					var key = e.which;
					if (key == 39) {
						lock();
						moveNext();
					} else if (key == 37) {
						lock();
						movePrev();
					}
				});
			},

			//moveUnitHandle
			moveUnitHandle: function(index) {
				var unitDistance = $('.nj_mod').height();
				// var value = -unitDistance * index;
				var value = -1 * index;
				// 滚屏
				scrollHandle(wrapOut, value);
				Yearbooks.slide(mouseWheelCount);
			},

			// scroll
			scroll: function() {
				var iScrollList = $(".nj_page_list"),
					isMove = false;

				//添加导航
				if (scenceCount > 1) {
					var temp = '';
					for (var i = 0; i < scenceCount; i++) {
						temp += '<li></li>';
					}
					iScrollList.html(temp);
					iScrollList.find('li').eq(0).addClass('on');
				}

				var numList = $('.nj_page_list');
				var iScrollLi = $('.nj_page_list li');

				//导航聚焦
				function watchFocus(index) {
					var curScence = scenceWrap.eq(index).attr('data-scence');
					wrapOut.attr('data-index', index).attr('class', 'wrap_out').addClass(curScence);
					iScrollLi.eq(index).addClass('on').siblings().removeClass('on');
					var hasVideo = $(scenceWrap[index]).attr('data-video');
					var curslide = $(scenceWrap[index]).find('.number_list .on').index();
					if (hasVideo == 'true' && curslide == 1) {
						Yearbooks.playVideo();
					} else {
						try {
							myVideo.currentTime = 0;
							myVideo.pause();
							$(myVideo).removeAttr('autoplay').removeAttr('loop');
						} catch (e) {
							console.log('视频报错');
						}
					}
				}

				//根据导航滚动
				function switchScroll(e) {
					e.preventDefault();
					var target = $(e.target);
					if (target.is('li')) {
						var index = target.index();
						mouseWheelCount = index;
						Yearbooks.moveUnitHandle(index);
						watchFocus(index);
					}
				}
				numList.click(function(e) {
					switchScroll(e);
				});
				numList[0].addEventListener('tap', function(e) {
					switchScroll(e);
				});
				// @taizi
				$("#nav_btn").click(function(){
  					$("#nav_box").toggleClass("on");
  					$(this).toggleClass("close_btn")
				});
				$('#nav').find('div').each(function(){
					$(this).click(function(){
						$('#nav_box').toggleClass("on");
						$('#nav_btn').removeClass("close_btn");
						var index = $(this).index();
						Yearbooks.moveUnitHandle(index);
						watchFocus(index);
						
					})
				})


				function next() {
					mouseWheelCount++;
					mouseWheelCount = mouseWheelCount > (scenceCount - 1) ? (scenceCount - 1) : mouseWheelCount;
					Yearbooks.moveUnitHandle(mouseWheelCount);
					watchFocus(mouseWheelCount);
				}

				function prev() {
					mouseWheelCount--;
					mouseWheelCount = mouseWheelCount < 0 ? 0 : mouseWheelCount;
					Yearbooks.moveUnitHandle(mouseWheelCount);
					watchFocus(mouseWheelCount);
				}

				//滚轮
				$(window).on('mousewheel', function(event, delta, deltaX, deltaY) {
					if (isMove) {
						return;
					}
					isMove = true;
					var delay = (OS == 'Mac') ? 1000 : 200;
					var lockTimer = setTimeout(function() {
						isMove = false;
						clearTimeout(lockTimer);
					}, delay);
					if (deltaY > 0) {
						prev();
					} else {
						next();
					}
				});

				//手势
				document.body.addEventListener('swipeUp', next);
				document.body.addEventListener('swipeDown', prev);

				$(document).keydown(function(e) {
					var key = e.which;
					if (key == 40) {
						next();
					} else if (key == 38) {
						prev();
					} else if (key == 36) {
						mouseWheelCount = 0;
						Yearbooks.moveUnitHandle(0);
						watchFocus(0);
					} else if (key == 35) {
						mouseWheelCount = scenceCount - 1;
						Yearbooks.moveUnitHandle(scenceCount - 1);
						watchFocus(scenceCount - 1);
					}
				});
			}
		};

		//横竖屏切换
		$(window).on('orientationchange', function(e) {
			window.location.reload();
		    setTimeout(function(){ window.scrollTo(0, 1); }, 100); 
		});

		// 隐藏地址栏  & 处理事件的时候 ，防止滚动条出现
		
		
		Yearbooks.init();

		
		//手机或者pad竖屏
		if ((bodyWidth < bodyHeight && bodyWidth < 450) || bodyWidth == 768) {
			scenceWrap.css('height', 'auto');
			$('.nj_mod').css({
				'overflow': 'auto',
				'-webkit-overflow-scrolling': 'touch'
			});
			for (var i = 0; i < 8; i++) {
				Yearbooks.slide(i, true);
			}
			wrapOut.attr('class', 'wrap_out scence_shouji scence_zhuzhan scence_zhoubian scence_pinpai scence_yunying1 scence_yunying2 scence_shangye scence_builder');
		} else {
			document.addEventListener('touchstart', function(e) {
				e.preventDefault();
			});
			Yearbooks.scroll();
		}
	});

}(window);



