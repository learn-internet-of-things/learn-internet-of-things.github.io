
$(function() {
    $(document).tooltip({
        position: {
            my: "left+10 bottom+60"
        },
        track: true
    });

    $('map').imageMapResize();

    buildScrollingContentNavigation();
});

function buildScrollingContentNavigation() {
    var index = 0;
    var sidenav = "";
    var hasElements = false;
    $("h2").each(function() {
        setAnchor($(this), index);
        sidenav += buildLink(index, $(this).html());
        hasElements = true;
        index++;
    });

    $("#sliding-content-nav .panel-body").html(sidenav);
    $("#sliding-content-nav").stick_in_parent({offset_top: 15});

    if (!hasElements) {
        $("#sliding-content-nav").css("opacity", ".0");
    }
}

function setAnchor(element, id) {
    element.attr("id", "anchor-" + id);
}

function buildLink(index, text) {
    return "<a href='#anchor-" + index + "'>" + text + "</a><br />";
}