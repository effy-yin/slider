(function($) {
	'use strict';

	function Slider(options) {
		var defaults = {
			wrapper: 'ul',
			interval: '1500',
			height: '60px'
		}
		this.settings = $.extend(defaults, options);
		this.$wrapper = $(this.settings.wrapper);
		this.timer = null;	
		this.init();
		this.bindHandler();
	}
	Slider.prototype = {
		init: function() {
			var _self = this;
			_self.timer = setInterval(function() {
				_self.showNext();
			}, _self.settings.interval);
		},
		showNext: function() {
			var $last = this.$wrapper.children().last();
			$last.css({'height': '0'})
				.prependTo(this.$wrapper)
				.animate({'height': this.settings.height});
		},
		bindHandler: function() {
			var _self = this;
			this.$wrapper.hover(function() {
				clearInterval(_self.timer);
			}, function() {
				_self.timer = setInterval(function() {
					_self.showNext();
				}, _self.settings.interval);
			});
		}
	}

	window.Slider = Slider;
})(jQuery);