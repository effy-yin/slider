(function(window, $) {

	ImageSlider = function(slider, options) {
		defaults= {
			slideList 	: 'ul',
			slideBtn  	: '.slide-btn',
			slideNum  	: 4,
			slideDuration 	: 1000,
			slideInterval: 3000,
			autoSlide 	: true,
			loopSlide   : true
		}		
		this.options = $.extend(defaults, options);
		this.slider = $(slider);
		this.init();
	}

	ImageSlider.prototype = {
		/*slider: null,
		slideList: null,
		slideBtn: null,
		inter: null,
		slideElemW: 0,
		slideStep: 0,
		enble: true*/
		enable: true,
		init: function() {
			this.slideList = this.slider.find(this.options.slideList);
			this.slideElem = this.slideList.children();
			this.slideBtn = this.slider.find(this.options.slideBtn);

			this.slideElemW = this.slideElem.width();
			this.slideStep = this.slideElemW * this.options.slideNum;

			/*执行图片滚动动画时会闪烁bug修复
			 *需要初始化图片列表宽度，
			 *列表宽度为原列表宽度加上滑动窗口的宽度
			 */		
			if(this.options.loopSlide) {
				this.slideList.css({width: this.slideElemW * (this.options.slideNum + this.slideElem.length) , left: 0});
			} else {
				this.slideList.css({width: this.slideElemW * this.slideElem.length , left: 0});
			}

			this.enable = true; /**/
			this.inter = null;	/**/

			var _slider = this; /*注意不同地方this的作用域*/

			this.slideBtn.on('click', function() {
				if(!_slider.enable) return;	/*防止多次点击滚动按钮造成的bug*/
				if($(this).hasClass('next')) {
					_slider.slideToLeft();
				} else {
					_slider.slideToRight();
				}
			});


			if(this.options.autoSlide) {				
				/*_slider.setAutoSlide();

				this.slider.on('mouseenter', function() {
					clearTimeout(_slider.inter);
				}).on('mouseout', function() {
					_slider.setAutoSlide();
				});*/
			}		
			/*事件执行顺序问题,不能放到if里面,把if判断放到setAutoSlide函数中 */
			this.setAutoSlide();

			this.slider.on('mouseenter', function() {
				clearTimeout(_slider.inter);
			}).on('mouseout', function() {
				_slider.setAutoSlide();
			});		
		},

		setAutoSlide: function() {
			clearTimeout(this.inter);
			if(this.options.autoSlide) {
				var _slider = this;
				this.inter = setTimeout(function() {
					_slider.slideToLeft();
					_slider.setAutoSlide();
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
							alert('已到头')
						})
					} else {
						_slider.enable = true;
						alert('已到头1')
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
						alert('已到头')
					})				
				} else {
					this.slideList.animate({left: '+=' + this.slideStep}, this.options.slideDuration, function() {
						_slider.enable = true;				
					});
				}
			}

		}
	}

	$.fn.imageSlider = function(options) {
		
		var instance = new ImageSlider(this, options);

		//return instance;
		return $(this);
	};

})(window, jQuery);