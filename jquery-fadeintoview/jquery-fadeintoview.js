if (!window["$"]) {
	console.log("jquery-fadeintoview.js: Error >> JQuery must be defined");
}

/**
 * @component fadeIntoView
 * Makes elements with fade-into-view class fade into view when they enter the viewport
 * @note: Relies on elements having a class fade-into-view and a unique id
 * @requires JQuery http://www.jquery.com
 * @requires JQuery Velocity http://julian.com/research/velocity/
 * @author Daniel Ivanovic dan.ivanovic@antiblanks.com
 */
(function ($) {
    $.fn.fadeIntoView = function(options) {
    	var ANIMATE_IN = "in";
    	var ANIMATE_OUT = "out";
    	var SCROLL_DIRECTION_UP = "up";
    	var SCROLL_DIRECTION_DOWN = "down";

    	var self = this;
    	var animations = {}; // @note: Populated with references to active animations
    	var lastWindowScrollTop = 0;

    	options = $.extend({
    		"padding": $(window).height()/3,
    		"applyBlur": true,
    		"hiddenOpacity": 0.6
    	}, options);

    	function validatePadding() {
			// @note: Make sure that the padding is not more than half the window height
	    	if (options.padding * 3 >= $(window).height()) {
	    		options.padding = $(window).height()/3;
	    	}
    	};

    	var fadeIntoView = function() {
    		var windowScrollTop = $(window).scrollTop();
			var windowHeight = $(window).height();
			var windowPadding = options.padding;
    		var scrollDirection = windowScrollTop > lastWindowScrollTop 
        		? SCROLL_DIRECTION_DOWN 
        		: SCROLL_DIRECTION_UP;

    		$.each(self.find(".fade-into-view"), function(index, item) {
	        	var itemTopOffset = $(item).offset().top;
	        	var itemBottomOffset = $(item).offset().top + $(item).outerHeight();
	        	var canAnimateIn = animations[$(item).attr("id")] == null || animations[$(item).attr("id")] == ANIMATE_OUT;
	        	var canAnimateOut = animations[$(item).attr("id")] == null || animations[$(item).attr("id")] == ANIMATE_IN;
	        	var doAnimateIn = false;
	        	var doAnimateOut = false;

	        	if (scrollDirection == SCROLL_DIRECTION_DOWN && 
	        		canAnimateIn && 
	        		itemTopOffset >= windowScrollTop && 
	        		itemTopOffset <= windowScrollTop + windowHeight - windowPadding &&
	        		itemBottomOffset >= windowScrollTop + windowPadding) {
	        		doAnimateIn = true;
	        	}

	        	if (scrollDirection == SCROLL_DIRECTION_UP && 
	        		canAnimateIn && 
	        		itemBottomOffset >= windowScrollTop + windowPadding && 
	        		itemBottomOffset <= windowScrollTop + windowHeight - windowPadding) {
	        		doAnimateIn = true;
	        	}

	        	if (scrollDirection == SCROLL_DIRECTION_DOWN && 
	        		canAnimateOut && 
	        		itemBottomOffset < windowScrollTop + windowPadding) {
	        		doAnimateOut = true;
	        	}

	        	if (scrollDirection == SCROLL_DIRECTION_UP && 
	        		canAnimateOut && 
	        		itemTopOffset > windowScrollTop + windowHeight - windowPadding) {
	        		doAnimateOut = true;
	        	}

	        	if (doAnimateIn) {
	        		$(item).stop();
	        		if (options.applyBlur)
	        			$(item).removeClass("fade-out-blur").addClass("fade-in-blur");
	        		$(item).velocity({
	        			"opacity": 1
	        		}, 500);
	        		animations[$(item).attr("id")] = ANIMATE_IN;
	        	}
	        	else if (doAnimateOut) {
	        		$(item).stop();
	        		if (options.applyBlur)
	        			$(item).removeClass("fade-in-blur").addClass("fade-out-blur");
	        		$(item).velocity({
	        			"opacity": options.hiddenOpacity
	        		}, 500);
	        		animations[$(item).attr("id")] = ANIMATE_OUT;
	        	}
	        });

			lastWindowScrollTop = windowScrollTop;
    	};

        $(window).scroll(fadeIntoView);
        $(window).resize(function() {
        	validatePadding();
        });

        validatePadding();
        fadeIntoView();
        return self;
    };
}(jQuery));
