
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
        var width = $(this).width();
        var parentWidth = $(this).parent().width();
        if ($(this).attr("id") == null && width == parentWidth) {
            var path = $(this).attr("src");
            var newHtml = '<a class="fancybox" href="'+path+'"';
            if ($(this).next().is("em")) {
                var caption = $(this).next().text();
                newHtml += 'caption="'+caption+'"';
            }
            newHtml += '><img src="'+path+'" /></a>';
            $(this).replaceWith(newHtml);
        }
    });

    $(document).ready(function() {
        $(".fancybox").fancybox({
            helpers: {
                title: {
                    type: 'inside'
                },
                overlay: {
                    showEarly: false
                }
            },
            beforeLoad: function() {
                this.title = $(this.element).attr('caption');
            }
        });
	});
}