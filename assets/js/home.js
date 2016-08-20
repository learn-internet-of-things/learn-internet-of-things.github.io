
$(function() {
    $(document).tooltip({
        position: {
            my: "left+10 bottom+60"
        },
        track: true
    });
});

$(function() {
    $('map').imageMapResize();
});

$(function() {
    buildScrollingContentNavigation();
});

function buildScrollingContentNavigation() {
    var index = 0;
    var sidenav = "";
    $("h2").each(function() {
        setAnchor($(this), index);
        sidenav += buildLink(index, $(this).html());
    });
    $("#sliding-content-nav .panel-body").html(sidenav);
    $("#sliding-content-nav").stick_in_parent({offset_top: 15});
}

function setAnchor(element, id) {
    element.attr("id", "anchor-" + id);
}

function buildLink(index, text) {
    return "<a href='#anchor-" + index + "'>" + text + "</a><br />";
}