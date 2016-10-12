
$(function() {
    makeImagesPopup();
    loadHeadingsIntoScrollSpy();
   
    $(document).tooltip({
        position: {
            my: "left+10 bottom+60"
        },
        track: true
    });

    $('map').imageMapResize();

    $(".affix").width($("#affix-helper").width());
    $(window).resize(function() {
        $(".affix").width($("#affix-helper").width());
    });
});

function loadHeadingsIntoScrollSpy() {
    var html = "";
    $("#content h2").each(function() {
        var ref = "#" + $(this).attr("id");
        var txt = $(this).html();
        var anchorLink = '<a class="anchorLink" href="'+ref+'"><span class="glyphicon glyphicon-link"></span></a>';
        html   += "<li><a href='" + ref + "'>" + txt + "</a></li>";

        $(this).html(txt + anchorLink);
    });
    $("#scrollSpyList").html(html);

    if (html === "") {
        $("#sliding-content-nav").css("opacity", "0.0");
    }
}

/* CONTENT IMAGE POPUPS */
function makeImagesPopup() {
    $(".post img").each(function() {
        if ($(this).attr("id") == null) {
            var path = $(this).attr("src");
            var newHtml = '<a class="fancybox" href="'+path+'"><img src="'+path+'" /></a>';
            $(this).replaceWith(newHtml);
        }
    });

    $(document).ready(function() {
		$(".fancybox").fancybox();
	});
}