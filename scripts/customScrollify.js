$(function () {
	$.scrollify({

		section: ".panel",
		scrollbars: false,
		before: function (i, panels) {


			var ref = panels[i].attr("data-section-name");

			$(".pagination .active").removeClass("active");

			$(".pagination").find("a[href=\"#" + ref + "\"]").addClass("active");


			/* the following lines will hide the navigation dots when the first or last page is active. Otherwise, they are made visible*/
			var curSection = $.scrollify.current();
			var curSecName = $($(curSection).get(0)).attr("data-section-name")

			if (curSecName == "home" || curSecName == "end") {
				$(".pagination").css({ "visibility": "hidden" });
			}
			else {
				$(".pagination").css({ "visibility": "visible" });
			}

		},

		afterRender: function () {
			var pagination = "<ul class=\"pagination\">";
			var activeClass = "";
			$(".panel").each(function (i) {
				activeClass = "";
				if (i === 0) {
					activeClass = "active";
				}

				/*create for each page a navigation dot except for the first and last page*/
				if ($(this).attr("data-section-name") != "home" && $(this).attr("data-section-name") != "end") {
					pagination += "<li><a class=\""
					+ activeClass
					+ "\" href=\"#"
					+ $(this).attr("data-section-name")
					+ "\"><span class=\"hover-text\">"
					+ $(this).attr("data-section-name").charAt(0).toUpperCase()
					+ $(this).attr("data-section-name").slice(1)
					+ "</span></a></li>";
				}
			});

			pagination += "</ul>";

			$(".panel1").append(pagination);



			/*
	  
			Tip: The two click events below are the same:
	  
			$(".pagination a").on("click",function() {
			  $.scrollify.move($(this).attr("href"));
			});
	  
			*/
			$(".pagination a").on("click", $.scrollify.move);





		},
	});
});




$(".scroll,.scroll-btn").click(function (e) {
	e.preventDefault();
	$.scrollify.next();
});


/* when document is loaded, hide the navigation dots */
$(document).ready(function () {
	$(".pagination").css({ "visibility": "hidden" });
});

/*
 * jQuery Scrollify
 * Version 1.0.19
 *
 * Requires:
 * - jQuery 1.7 or higher
 *
 * https://github.com/lukehaas/Scrollify
 *
 * Copyright 2016, Luke Haas
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 
 */