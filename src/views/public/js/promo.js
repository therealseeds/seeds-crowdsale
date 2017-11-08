$('#promoForm').hide();
$("#show").on("click", function(event) {
  event.preventDefault();
  $('#promoForm').slideToggle(300);
  var margin = $('#buy-seeds-btn').css("margin-top");
  if (margin == "-70px") {
    $('#buy-seeds-btn').css("margin-top", "-30px");
  } else {
    $('#buy-seeds-btn').css("margin-top", "-70px");
  }
});
