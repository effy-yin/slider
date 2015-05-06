(function(window, $) {

	'use strict';

	function ImageSlider(slider, options) {
		var defaults = {
			slideList 		: 'ul',
			slideBtn  		: '.slide-btn',
			slideWidth		: 806,
			slideHeight		: 100,
			slideElemWidth	: 200,
			slideElemMargin	: 2,
			slideNum  		: 4,
			slideDuration	: 1000,
			slideInterval	: 3000,
			isAutoSlide 	: true,
			isLoopSlide   	: true
		}		
		this.options = $.extend(defaults, options);
		this.slider = $(slider);
		this.init();
	}

	ImageSlider.prototype = {

		init: function() {
			var _slider = this,
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
				if (!_slider.enable) return;	/*防止多次点击滚动按钮造成的bug*/
				if ($(this).hasClass('next')) {
					_slider.slideToLeft();	/*注意不同地方this的作用域*/
				} else {
					_slider.slideToRight();
				}
			});


			// if (this.options.isAutoSlide) {				
			// 	_slider.setAutoSlide();

			// 	this.slider.on('mouseenter', function() {
			// 		clearTimeout(_slider.timer);
			// 	}).on('mouseout', function() {
			// 		_slider.setAutoSlide();
			// 	});
			// }		

			/*事件执行顺序问题,不能放到if里面,把if判断放到setAutoSlide函数中 */
			this.setAutoSlide();

			this.slider.on('mouseenter', function() {
				clearTimeout(_slider.timer);
			}).on('mouseout', function() {
				_slider.setAutoSlide();
			});	

			// 注意 mouseenter 和 mouseover 区别
			this.slider.on('mouseover', function() {
				clearTimeout(_slider.timer);
			});
		},

		setAutoSlide: function() {
			// if (this.options.isAutoSlide) {
			// 	clearTimeout(this.timer);
			// 	var _slider = this;
			// 	this.timer = setTimeout(function() {
			// 		_slider.slideToLeft();
			// 		_slider.setAutoSlide();
			// 	}, this.options.slideInterval);
			// }
			var _slider = this;
			if (this.options.isAutoSlide) {
				clearTimeout(this.timer);
				this.timer = setInterval(function() {
					_slider.slideToLeft();
				}, this.options.slideInterval);
			}
		},

		slideToLeft: function() {
		
			var _slider = this;

			/*图片滚动期间点击滚动按钮无效*/
			_slider.enable = false;

			if (_slider.options.isLoopSlide) {
				var clone = _slider.slideList.children().slice(0, _slider.options.slideNum);
				_slider.slideList.append(clone.clone()); ///
				_slider.slideList.animate({left: '-=' + _slider.slideStep}, _slider.options.slideDuration, function() {
					clone.remove();
					/*图片滚动动画结束*/
					$(this).css({left: '+=' + _slider.slideStep});
					_slider.enable = true;
				});
			} else {
				if (-parseInt(_slider.slideList.css('left'))+_slider.slideStep+_slider.slider.width()>_slider.slideList.width()) {
					var newSlideStep = _slider.slideList.width() - _slider.slider.width() + parseInt(_slider.slideList.css('left')) - this.options.slideElemMargin;
					if (newSlideStep > 0) {
						_slider.slideList.animate({left: '-=' + newSlideStep}, _slider.options.slideDuration, function() {
							_slider.enable = true;
							console.log('end');
						});
					} else {
						_slider.enable = true;
						console.log('end');
					}			
				} else {
					_slider.slideList.animate({left: '-=' + _slider.slideStep}, _slider.options.slideDuration, function() {
						_slider.enable = true;	
					});
				}				
			}							
		},

		slideToRight: function() {
			this.enable = false;
			var _slider = this;
			if (this.options.isLoopSlide) {
				var clone = this.slideList.children().slice(-this.options.slideNum);
				this.slideList.prepend(clone.clone());
				this.slideList.css({left: '-=' + this.slideStep});
				this.slideList.animate({left: '+=' + this.slideStep}, this.options.slideDuration, function() {
					clone.remove();
					_slider.enable = true;
				});
			} else {
				if (parseInt(this.slideList.css('left')) + this.slideStep > 0) {					
					this.slideList.animate({left: 0}, this.options.slideDuration, function() {
						_slider.enable = true;
						console.log('end');
					})				
				} else {
					this.slideList.animate({left: '+=' + this.slideStep}, this.options.slideDuration, function() {			
						_slider.enable = true;
					});
				}
			}
		}
	}

	window.ImageSlider  = ImageSlider;

	$.fn.imageSlider = function(options) {
		
		var instance = new ImageSlider(this, options);

		//return instance;
		return $(this);
	};

})(window, jQuery);