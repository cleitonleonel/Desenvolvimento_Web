(function () {
	"use strict";
	document.getElementById('year').textContent = new Date().getFullYear();
	var header = document.getElementById('siteHeader');
	var backToTop = document.getElementById('back-to-top');
	
	function onScroll() {
		var scrolled = window.scrollY > 40;
		header.classList.toggle('scrolled', scrolled);
		backToTop.classList.toggle('show', window.scrollY > 600);
	}
	
	document.addEventListener('scroll', onScroll, {passive: true});
	onScroll();
	
	backToTop.addEventListener('click', function () {
		window.scrollTo({top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
	});
	
	var navToggle = document.getElementById('navToggle');
	var primaryNav = document.getElementById('primaryNav');
	
	navToggle.addEventListener('click', function () {
		var isOpen = primaryNav.classList.toggle('open');
		navToggle.setAttribute('aria-expanded', String(isOpen));
		navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
	});
	
	primaryNav.querySelectorAll('a').forEach(function (link) {
		link.addEventListener('click', function () {
			primaryNav.classList.remove('open');
			navToggle.setAttribute('aria-expanded', 'false');
		});
	});
	
	var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
	var revealEls = document.querySelectorAll('.reveal');
	
	if (reduceMotion || !('IntersectionObserver' in window)) {
		revealEls.forEach(function (el) {
			el.classList.add('in-view');
		});
	} else {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('in-view');
					io.unobserve(entry.target);
				}
			});
		}, {threshold: 0.15});
		revealEls.forEach(function (el) {
			io.observe(el);
		});
	}
	
	var counters = document.querySelectorAll('[data-count]');
	
	function animateCounter(el) {
		var target = parseInt(el.getAttribute('data-count'), 10);
		var unitEl = el.querySelector('.unit');
		var unitHTML = unitEl ? unitEl.outerHTML : '';
		if (reduceMotion) {
			el.innerHTML = target + unitHTML;
			return;
		}
		var start = 0;
		var duration = 1100;
		var startTime = null;
		
		function step(ts) {
			if (!startTime) startTime = ts;
			var progress = Math.min((ts - startTime) / duration, 1);
			var value = Math.floor(progress * target);
			el.innerHTML = value + unitHTML;
			if (progress < 1) requestAnimationFrame(step);
		}
		
		requestAnimationFrame(step);
	}
	
	if ('IntersectionObserver' in window) {
		var counterIO = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					animateCounter(entry.target);
					counterIO.unobserve(entry.target);
				}
			});
		}, {threshold: 0.6});
		counters.forEach(function (el) {
			counterIO.observe(el);
		});
	} else {
		counters.forEach(animateCounter);
	}
	
	var lightbox = document.getElementById('lightbox');
	var lightboxImg = document.getElementById('lightboxImg');
	var lightboxCaption = document.getElementById('lightboxCaption');
	var lightboxClose = document.getElementById('lightboxClose');
	
	document.querySelectorAll('.gallery button').forEach(function (btn) {
		btn.addEventListener('click', function () {
			var img = btn.querySelector('img');
			lightboxImg.src = img.src;
			lightboxImg.alt = img.alt;
			lightboxCaption.textContent = btn.getAttribute('data-caption') || img.alt;
			if (typeof lightbox.showModal === 'function') {
				lightbox.showModal();
			}
		});
	});
	
	lightboxClose.addEventListener('click', function () {
		lightbox.close();
	});
	lightbox.addEventListener('click', function (e) {
		var rect = lightbox.getBoundingClientRect();
		var inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
		if (!inside) lightbox.close();
	});
	
	var faqDetails = document.querySelectorAll('#curiosidades details');
	faqDetails.forEach(function (d) {
		d.addEventListener('toggle', function () {
			if (d.open) {
				faqDetails.forEach(function (other) {
					if (other !== d) other.open = false;
				});
			}
		});
	});
	
})();