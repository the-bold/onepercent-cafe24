$('.prdTab-slider').slick({
	dots: true,
	infinite: true,
	speed: 500,
	fade: true,
	cssEase: 'linear',
	autoplay: true,
	autoplaySpeed: 2000,
	arrows: false,
	appendDots: $('.prdTab-indicators'),
    customPaging: function customPaging(slider, i) {
        return '<span class="prdTab-tit-' + (i + 1) + '"></span>';
    }
});