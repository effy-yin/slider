
	$.fn.extend({
    	slideImage : function(options){
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
			}
			function _slideToRight(){
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
			}			
		}
	});

	
