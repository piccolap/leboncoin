$(".showNumber").click(function() {
    var id = $(this).attr("id");
    $.get("/annonce/" + id + "/getNumber", function(data) {
        var number = data.number;
        $(".number").text(number).toggleClass('d-none');
        $(".showNumber").toggleClass('d-none');
    });
    $(".number").click(function() {
        $(".number").addClass('d-none');
        $(".showNumber").removeClass('d-none');
    });
});

