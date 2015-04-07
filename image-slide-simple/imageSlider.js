(function(window, $) {
	function ImageSlider(slider, options) {
		defaults= {
			slideList 	: 'ul',
			slideBtn  	: '.slide-btn',
			slideNum  	: 4,
			slideTime 	: 1000,
			slideInterval: 3000,
			autoSlide 	: true
		}		
		this.options = $.extend(defaults, options);
		this.slider = slider;
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
		init: function() {
			this.slideList = this.slider.find(this.options.slideList);
			this.slideElem = this.slideList.children();
			this.slideBtn = this.slider.find(this.options.slideBtn);
			this.enable = this.options.autoSlide;

			this.slideElemW = this.slideElem.width();
			this.slideStep = this.slideElemW * this.options.slideNum;

			/*执行图片滚动动画时会闪烁bug修复
			 *需要初始化图片列表宽度，
			 *列表宽度为原列表宽度加上滑动窗口的宽度
			 */
			this.slideList.css({width: this.slideElemW * (this.options.slideNum + this.slideElem.length) , left: 0});

			var _slider = this;
			this.slideBtn.on('click', function() {
				if($(this).hasClass('next')) {
					_slider.slideToLeft();
				} else {
					_slider.slideToRight();
				}
			});

			this.inter = null;
			
			if(this.options.autoSlide) {
				$(document).ready(function() {
					_slider.setAutoSlide();
				});
				this.slider.on('mouseenter', function() {
					clearTimeout(_slider.inter);
				}).on('mouseout', function() {
					_slider.setAutoSlide();
				});
			}				
		},

		setAutoSlide: function() {
			clearTimeout(this.inter);
			var _slider = this;
			this.inter = setTimeout(function() {
				_slider.slideToLeft();
				_slider.setAutoSlide();
			}, this.options.slideInterval);
		},

		slideToLeft: function() {
			var slider = this;
			var clone = this.slideList.children().slice(0, this.options.slideNum);
			this.slideList.append(clone.clone()); ///
			this.slideList.animate({left: '-=' + this.slideStep}, this.options.slideTime, function() {
				clone.remove();
				$(this).css({left: '+=' + slider.slideStep});
			})
		},

		slideToRight: function() {
			var clone = this.slideList.children().slice(-this.options.slideNum);
			this.slideList.prepend(clone.clone());
			this.slideList.css({left: '-=' + this.slideStep});
			this.slideList.animate({left: '+=' + this.slideStep}, this.options.slideTime, function() {
				clone.remove();
			})
			
		}
	}

	$.fn.imageSlider = function(options) {
		
		var instance = new ImageSlider(this, options);

		//return instance;
		return $(this);
	};

})(window, jQuery);