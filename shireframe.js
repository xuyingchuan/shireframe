define('shireframeUrl', function(){
	return require.toUrl('.');
});
define(['angular', '_', '$', 'shireframeUrl', 'fonts','css!style'], function(angular, _, $, url, fontsPromise){
sh = angular.module("Shireframe", []);
sh.service('templateUrl', ['$sce', function($sce){
	return function(u){
		return $sce.trustAsResourceUrl(url + u);
	};
}]);

function linkedDirective(name, f){
	sh.directive(name, function(){
		return {restrict: 'AEC', link: f};
	});
}

function blockyClass(name, cls, inline){
	linkedDirective(name, function(s, e){
		e.addClass(inline ? "display-inline-block" : "display-block");
		e.addClass(cls ? cls : _.kebabCase(name));
	});
}

function iconicDirective(name){
	linkedDirective(name, function(s, e, a){
		e.addClass(name);
		for(var k in a){
			if(a.hasOwnProperty(k) && k.indexOf("$") === -1){
				e.addClass(name + "-" + _.kebabCase(k));
				e.addClass(name + "-" + k);
			}
		}
	});
}

function textDirective(service){
	sh.directive("text" + _.capitalize(service), [service, function(s){
		return {
			restrict: 'AEC',
			link: function(scope, elem){
				elem.html(s());
			}
		};
	}]);
}

blockyClass("box", null, true);

iconicDirective("glyphicon");
iconicDirective("fa");

blockyClass("row");
[1,2,3,4,5,6,7,8,9,10,11,12].forEach(function(e){
	blockyClass("col" + e, "col-xs-" + e);
	blockyClass("colOffset" + e, "col-xs-offset-" + e);
});

var seed = 1;

function srand(){
	seed = (seed * 9301 + 49297) % 233280;
	return seed / 233280;
}

function srandInt(max){
	return Math.floor(srand() * max);
}

function srandIntMin(min, maxOffset){
	return srandInt(maxOffset) + min;
}

function srandLetterCode(){
	return srandInt(10) + '0'.charCodeAt(0);
}

linkedDirective("kitten", function(s, e, a){
	var id = String.fromCharCode(srandLetterCode(), srandLetterCode(), srandLetterCode());
	var size = a.size;
	e.addClass('kitten');
	e.css('background-image', 'url(http://thecatapi.com/api/images/get?size=small&image_id=' + id + ')');
	if(size) {
		e.css('width', size);
		e.css('height', size);
	}
});
sh.directive("browserChrome", ['templateUrl', function(templateUrl){
	return {
		transclude: true,
		templateUrl: templateUrl("browserChrome.html"),
	};
}]);

textDirective("title");
textDirective("url");

sh.service("title", function($window){
	return function(){
		return $window.document.title ? $window.document.title : "AWESOME";
	};
});

sh.service("url", function(title){
	return function(){
		return "http://" + _.kebabCase(title()) + ".com";
	};
});
sh.run(function($rootScope){
	$rootScope._ = _;
});
var bootstrapDeferred = $.Deferred();
$(function(){
	$('body').append('<svg xmlns="http://www.w3.org/2000/svg" height="10"><defs><filter id="sketchy-filter" x="0" y="0" height="100%" width="100%" color-interpolation-filters="sRGB"><feTurbulence result="turbulenceresult" type="fractalNoise" numOctaves="2" baseFrequency="0.015" in="SourceGraphic" /><feDisplacementMap in2="turbulenceresult" in="SourceGraphic" xChannelSelector="R" yChannelSelector="B" scale="7" /></filter></defs></svg>');
			
	$('body').css("filter", "url('#sketchy-filter')");
	$('body').css("-webkit-filter", "url('#sketchy-filter')");
	angular.bootstrap(document, ["Shireframe"]);
	done = true;
	setTimeout(function(){
		bootstrapDeferred.resolve();
	}, 0);
});
var loadPromise = $.when(fontsPromise, bootstrapDeferred.promise());
return function(f){
	loadPromise.then(f);
};
});
