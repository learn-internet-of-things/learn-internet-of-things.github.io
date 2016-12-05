
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
        var clientWidth = $(this).get(0).clientWidth;
        var imageWidth = $(this).get(0).naturalWidth;
        if ($(this).attr("id") == null && clientWidth < imageWidth) {
            var path = $(this).attr("src");
            var newHtml = '<a class="fancybox" href="'+path+'"';
            if ($(this).next().is("em")) {
                var caption = $(this).next().text();
                newHtml += 'caption="'+caption+'"';
            }
            newHtml += '><img src="'+path+'" width="'+clientWidth+'px" /></a>';
            $(this).replaceWith(newHtml);
        }
    });

    $(document).ready(function() {
        $(".fancybox").fancybox({
            prevEffect: 'none',
            nextEffect: 'none',
            tpl: {
                image: '<a class="fancybox-image-zoom" href="javascript:$.fancybox.toggle();"><img class="fancybox-image" src="{href}" alt="" /></a>'
            },
            helpers: {
                title: {
                    type: 'inside'
                }
            },
            beforeLoad: function() {
                this.title = $(this.element).attr('caption');
            }
        });
	});
}