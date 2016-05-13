(function(window, $) {

	'use strict';

	function Slider(slider, options) {
		var defaults = {
			slideList 		: 'ul',
			slideBtn  		: '.slide-btn',
			slideWidth		: 806,
			slideHeight		: 100,
			slideElemWidth	: 200,
			slideElemMargin	: 2,
			slideNum  		: 4,
			slideDuration	: 2000,
			slideInterval	: 3000,
			isAutoSlide 	: true,
			isLoopSlide   	: true
		}		
		this.options = $.extend(defaults, options);
		this.slider = $(slider);
		this.init();
	}

	Slider.prototype = {

		init: function() {
			var _this = this,
				slideWidth,
				slideHeight,
				slideElemWidth,
				slideElemMargin;

			this.slideList = this.slider.find(this.options.slideList);
			this.slideElem = this.slideList.children();
			this.slideBtn = this.slider.find(this.options.slideBtn);

			slideWidth = this.options.slideWidth;
			slideHeight = this.options.slideHeight;
			slideElemWidth = this.options.slideElemWidth;
			slideElemMargin = this.options.slideElemMargin;
			this.slideStep = (slideElemWidth + slideElemMargin) * this.options.slideNum;

			this.slider.css({width: slideWidth, height: slideHeight});
			this.slideElem.css({width: slideElemWidth, height: slideHeight, marginRight: slideElemMargin});
			this.slideElem.find('img').css({width: slideElemWidth, height: slideHeight});

			/*执行图片滚动动画时闪烁bug修复
			 *需要初始化图片列表宽度，
			 *列表宽度为原列表宽度加上滑动窗口的宽度
			 */		
			if (this.options.isLoopSlide) {
				this.slideList.css({width: (slideElemWidth + slideElemMargin) * (this.slideElem.length + this.options.slideNum) , left: 0});
			} else {
				this.slideList.css({width: (slideElemWidth + slideElemMargin) * this.slideElem.length , left: 0});
			}

			this.enable = true; /**/
			this.timer = null;	/**/

			this.slideBtn.on('click', function() {
				if (!_this.enable) return;	/*防止多次点击滚动按钮造成的bug*/
				if ($(this).hasClass('next')) {
					_this.slideToLeft();	/*注意不同地方this的作用域*/
				} else {
					_this.slideToRight();
				}
			});


			// if (this.options.isAutoSlide) {				
			// 	_this.setAutoSlide();

			// 	this.slider.on('mouseenter', function() {
			// 		clearTimeout(_this.timer);
			// 	}).on('mouseout', function() {
			// 		_this.setAutoSlide();
			// 	});
			// }		

			/*事件执行顺序问题,不能放到if里面,把if判断放到setAutoSlide函数中 */
			this.setAutoSlide();

			this.slider.on('mouseenter', function() {
				clearTimeout(_this.timer);
			}).on('mouseout', function() {
				_this.setAutoSlide();
			});	

			// 注意 mouseenter 和 mouseover 区别
			this.slider.on('mouseover', function() {
				clearTimeout(_this.timer);
			});
		},

		setAutoSlide: function() {
			// if (this.options.isAutoSlide) {
			// 	clearTimeout(this.timer);
			// 	var _this = this;
			// 	this.timer = setTimeout(function() {
			// 		_this.slideToLeft();
			// 		_this.setAutoSlide();
			// 	}, this.options.slideInterval);
			// }
			var _this = this;
			if (this.options.isAutoSlide) {
				clearTimeout(this.timer);
				this.timer = setInterval(function() {
					_this.slideToLeft();
				}, this.options.slideInterval);
			}
		},

		slideToLeft: function() {
		
			var _this = this;

			/*图片滚动期间点击滚动按钮无效*/
			_this.enable = false;

			if (_this.options.isLoopSlide) {
				var clone = _this.slideList.children().slice(0, _this.options.slideNum);
				_this.slideList.append(clone.clone()); ///
				_this.slideList.animate({left: '-=' + _this.slideStep}, _this.options.slideDuration, function() {
					clone.remove();
					/*图片滚动动画结束*/
					$(this).css({left: '+=' + _this.slideStep});
					_this.enable = true;
				});
			} else {
				if (-parseInt(_this.slideList.css('left')) + _this.slideStep + _this.slider.width() > _this.slideList.width()) {
					var newSlideStep = _this.slideList.width() - _this.slider.width() + parseInt(_this.slideList.css('left')) - this.options.slideElemMargin;
					if (newSlideStep > 0) {
						_this.slideList.animate({left: '-=' + newSlideStep}, _this.options.slideDuration, function() {
							_this.enable = true;						
							console.log('end');
						});
					} else {
						_this.enable = true;
						_this.slideList.animate({left: 0}, _this.options.slideDuration);
						console.log('end');
					}			
				} else {
					_this.slideList.animate({left: '-=' + _this.slideStep}, _this.options.slideDuration, function() {
						_this.enable = true;	
					});
				}				
			}							
		},

		slideToRight: function() {			
			var _this = this;
			this.enable = false;
			if (this.options.isLoopSlide) {
				var clone = this.slideList.children().slice(-this.options.slideNum);
				this.slideList.prepend(clone.clone());
				this.slideList.css({left: '-=' + this.slideStep});
				this.slideList.animate({left: '+=' + this.slideStep}, this.options.slideDuration, function() {
					clone.remove();
					_this.enable = true;
				});
			} else {
				if (parseInt(this.slideList.css('left')) == 0) {
					this.slideList.animate({left: _this.options.slideWidth - _this.slideList.width() + _this.options.slideElemMargin}, this.options.slideDuration, function() {
						_this.enable = true;
						console.log('end');
					});		
				} else if (parseInt(this.slideList.css('left')) + this.slideStep > 0) {					
					this.slideList.animate({left: 0}, this.options.slideDuration, function() {
						_this.enable = true;
						console.log('end');
					});		
				} else {
					this.slideList.animate({left: '+=' + this.slideStep}, this.options.slideDuration, function() {			
						_this.enable = true;
					});
				}
			}
		}
	}

	window.Slider  = Slider;

	$.fn.Slider = function(options) {
		
		var instance = new Slider(this, options);

		//return instance;
		return $(this);
	};

})(window, jQuery);