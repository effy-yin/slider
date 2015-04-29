(function(window, $) {

	'use strict';

	function ImageSlider (slider, options) {
		var defaults= {
			slideList 		: 'ul',
			slideBtn  		: '.slide-btn',
			slideNum  		: 4,
			slideDuration	: 1000,
			slideInterval	: 3000,
			autoSlide 		: true,
			loopSlide   	: true
		}		
		this.options = $.extend(defaults, options);
		this.slider = $(slider);
		this.init();
	}

	ImageSlider.prototype = {

		init: function() {
			this.slideList = this.slider.find(this.options.slideList);
			this.slideElem = this.slideList.children();
			this.slideBtn = this.slider.find(this.options.slideBtn);

			this.slideElemW = this.slideElem.width();
			this.slideStep = this.slideElemW * this.options.slideNum;

			/*执行图片滚动动画时闪烁bug修复
			 *需要初始化图片列表宽度，
			 *列表宽度为原列表宽度加上滑动窗口的宽度
			 */		
			if(this.options.loopSlide) {
				this.slideList.css({width: this.slideElemW * (this.slideElem.length + this.options.slideNum) , left: 0});
			} else {
				this.slideList.css({width: this.slideElemW * this.slideElem.length , left: 0});
			}

			this.enable = true; /**/
			this.timer = null;	/**/

			var _slider = this; /*注意不同地方this的作用域*/

			this.slideBtn.on('click', function() {
				if(!_slider.enable) return;	/*防止多次点击滚动按钮造成的bug*/
				if($(this).hasClass('next')) {
					_slider.slideToLeft();
				} else {
					_slider.slideToRight();
				}
			});


			// if(this.options.autoSlide) {				
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
			// if(this.options.autoSlide) {
			// 	clearTimeout(this.timer);
			// 	var _slider = this;
			// 	this.timer = setTimeout(function() {
			// 		_slider.slideToLeft();
			// 		_slider.setAutoSlide();
			// 	}, this.options.slideInterval);
			// }
			
			if(this.options.autoSlide) {
				clearTimeout(this.timer);
				var _slider = this;
				this.timer = setInterval(function() {
					_slider.slideToLeft();
				}, this.options.slideInterval);
			}
		},

		slideToLeft: function() {

			/*图片滚动期间点击滚动按钮无效*/
			this.enable = false; 			
			var _slider = this;
			if(this.options.loopSlide) {
				var clone = this.slideList.children().slice(0, this.options.slideNum);
				this.slideList.append(clone.clone()); ///
				this.slideList.animate({left: '-=' + this.slideStep}, this.options.slideDuration, function() {
					clone.remove();
					/*图片滚动动画结束*/
					$(this).css({left: '+=' + _slider.slideStep});
					_slider.enable = true;
				});
			} else {
				if(-parseInt(this.slideList.css('left'))+this.slideStep+this.slider.width()>this.slideList.width()) {
					var newSlideStep = this.slideList.width() - this.slider.width() + parseInt(this.slideList.css('left'));
					if(newSlideStep > 0) {
						this.slideList.animate({left: '-=' + newSlideStep}, this.options.slideDuration, function() {
							_slider.enable = true;
						});
					} else {
						_slider.enable = true;
					}			
				} else {
					this.slideList.animate({left: '-=' + this.slideStep}, this.options.slideDuration, function() {
						_slider.enable = true;	
					});
				}				
			}							
		},

		slideToRight: function() {
			this.enable = false;
			var _slider = this;
			if(this.options.loopSlide) {
				var clone = this.slideList.children().slice(-this.options.slideNum);
				this.slideList.prepend(clone.clone());
				this.slideList.css({left: '-=' + this.slideStep});
				this.slideList.animate({left: '+=' + this.slideStep}, this.options.slideDuration, function() {
					clone.remove();
					_slider.enable = true;
				});
			} else {
				if(parseInt(this.slideList.css('left')) + this.slideStep > 0) {					
					this.slideList.animate({left: 0}, this.options.slideDuration, function() {
						_slider.enable = true;
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