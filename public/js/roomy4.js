
function changeMode(e){
  e = e || window.event;
  document.documentElement.classList.toggle("dark-mode");
  document.querySelectorAll('.inverted').forEach((result) => {
    result.classList.toggle('invert');
  });
};

// $(document).ready(function(){       
//     var scroll_pos = 0;
//     $(document).scroll(function() {
//         scroll_pos = $(this).scrollTop();
//         if (scroll_pos > 150) {
//             scroll_pos = 150;
//         };
//         $(".box4 .content1 .myfloatbox #myInput").animate({
//             width : (75+0.75*scroll_pos)+"px"
//         });
//     });
// });

// $(document).ready(function(){  
//     $(document).scroll(function() {
//         if($(".box4 .content1 .myfloatbox #myInput").width() <= "150"){
//             $(".box4 .content1 .myfloatbox #myInput").animate({
//                 width : "+=10"
//             });
//         }
//     });
// });

$(function() {
  $(window).scroll(function(event) {
    $("body").toggleClass("scrolled-down-20",scrollY > 300);
  }).scroll();
});

// $(document).ready(function(){     
//   $(document).scroll(function() {
//     $(".box4 .content1 .myfloatbox #myInput").animate({
//       width : "150px",
//       padding: "0.5em"
//     });
//     $(".box4 .content1 .myfloatbox .btn1").animate({
//       width : "50px",
//       padding: "0.58em 1em"
//     });
//     $(".box4 .content1 .myfloatbox .btn1 .fa.fa-search").css({
//       display: "unset"
//     });
//   });
// });

// $("#mylikebtn").on("click",function(){
//   this.html("<i class='fas fa-heart'></i>");
//   // this.innerHtml = "<i class='fas fa-heart'></i>";
// });

$(document).ready(function(){
  $(".box4 .incon5 #mylikebtn").click(function(){
    if( $(this).attr("class") === "far fa-heart"){
      $(this).attr( "class", "fas fa-heart" );
    } else {
      $(this).attr( "class", "far fa-heart" );
    } 
  });
});

// ScrollReveal().reveal('.jumbotron-text', { duration: 2000 });
// ScrollReveal().reveal('.indexCards', {
//   interval: 150, mobile: true, viewFactor: 0.3
// });

// (function () {
//   'use strict';
//   window.addEventListener('load', function () {
//     // Fetch all the forms we want to apply custom Bootstrap validation styles to
//     var forms = document.getElementsByClassName('needs-validation');
//     // Loop over them and prevent submission
//     var validation = Array.prototype.filter.call(forms, function (form) {
//       form.addEventListener('submit', function (event) {
//         if (form.checkValidity() === false) {
//           event.preventDefault();
//           event.stopPropagation();
//         }
//         form.classList.add('was-validated');
//       }, false);
//     });
//   }, false);
// })();

// var sticky = $("#myscroll").offset().top=703;
// $(window).bind('scroll',function(){
//   if($(window).scrollTop()>sticky){
//     $('#mynavbar1').addClass('sticky');
//     $('body').addClass('newmargin');
//   }else{
//     $('#mynavbar1').removeClass('sticky');
//     $('body').removeClass('newmargin');
//   }
// });

// $("#myhome").on("click",function(){
//   $(".sidenav").toggleClass("changewidth");
//   $(".box1 .content2").toggleClass("changeAlignment");
// });

$('.regular').slick({
      infinite:true,
      arrows:false,
      autoplay:true,
      speed:7000,
      autoplaySpeed:0,
      slidesToShow: 1,
      slidesToScroll : 1
    });

// $(".vertical").slick({
//         autoplay:true,
//         draggable:true,
//         dots: false,
//         vertical: true,
//         centerMode: true,
//         infinite:true
//       });

$(document).on('click', '.dropdown-menu', function (e) {
  e.stopPropagation();
});

// make it as accordion for smaller screens
if ($(window).width() < 992) {
  $('.dropdown-menu a').click(function(e){
    e.preventDefault();
      if($(this).next('.submenu').length){
        $(this).next('.submenu').toggle();
      }
      $('.dropdown').on('hide.bs.dropdown', function () {
     $(this).find('.submenu').hide();
  })
  });
}

$(function () {
  $('[data-toggle="popover"]').popover()
})

// $(document).ready(function(){
//   $("#myInput").on("keyup", function() {
//     var value = $(this).val().toLowerCase();
//     $("#myList").filter(function() {
//       $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
//     });
//   });
// });

// $("#myInput").on("keyup", function() {
//   var value = this.value.toLowerCase();
//   $("#mythumb").filter(function() {
//     return $(this).text().toLowerCase().indexOf(value) > -1;
//   }).hide();
// });



// var x = true;
//   if(x = false){
//     return roomy.filter( item => item.text !== 'value');
//   }else{
//     return roomy;
//   }

// document.getElementById("myP").style.visibility = "hidden";


// var slickdata = '<div class="thumbnail">'+
//       '<div class="col-lg-5 col-xs-5 c1">'+
//       '  <h1>3500</h1>'+
//       '  <h5>+ 5000(Deposit)</h5>'+
//       '</div>'+
//       '<div class="col-lg-7 col-xs-7 c2">'+
//       '  <button class="btn btn-default"><i class="fa fa-phone"></i></button>'+
//       '  <button class="btn btn-default"><i class="fa fa-map-marker"></i></button>'+
//       '  <button class="btn btn-default"><i class="fa fa-envelope"></i></button>'+
//       '</div>'+
//       '<hr>'+
//       '<div class="col-lg-12 c3">'+
//       '  <h3>1 Room with attach bathroom</h3>'+
//       '  <h5>353, E-4, Arera Colony, Bhopal</h5>'+
//       '</div>'+
//       '<div class="col-lg-12 c4">'+
//       '  <h5>Windows, Single, Independent, Attach Bathroom, Furniture, Bills included</h5>'+
//       '</div>'+
//       '<div class="col-lg-4 col-xs-4 c5" style="opacity:0.2;"><i class="fa fa-plus"></i></div>'+
//       '<div class="col-lg-8 col-xs-8 c6">'+
//       '  <button class="btn btn-default b1">Interested</button>'+
//       '  <button class="btn btn-default b2">Add to cart</button><br>'+
//       '  <button class="btn btn-default b3">Sujjest to a friend</button>'+
//       '</div>'+
//       '<div class="col-lg-12 c7">'+
//       '  <a href="#">For Complaints and Other issues click here</a>'+
//       '</div>'+
//       '</div>';

// var count = 0;
// $('.add').on('click', function() {
//     $('.slider').slick('slickAdd', slickdata);
//     count += 1;
//     $("#mynumber").text(count);
// });

// var madd = document.querySelector(".add");
// var mslider = document.querySelector(".slider");
// madd.onclick = function(){
//   mslider.slick('slickAdd', slickdata);
// };

// $('.add').on('click', function() {
//     $('.slider').slick('slickAdd', slickdata);
// });

$('#password, #confirm_password').on('keyup', function () {
  if ($('#password').val() == $('#confirm_password').val()) {
    $('#message').html('Matching').css('color', 'white');
  } else 
    $('#message').html('Not Matching').css('color', 'red');
});

$('#ownerpassword, #confirm_owner_password').on('keyup', function () {
  if ($('#ownerpassword').val() == $('#confirm_owner_password').val()) {
    $('#ownermessage').html('Matching').css('color', 'white');
  } else 
    $('#ownermessage').html('Not Matching').css('color', 'red');
});

// for(var i = 0; i<10; i++){
// 	$("section ul").append("<li><div class="thumbnail"></div></li>");
// }

// var isThumb=document.querySelector(".box3 .content2 .thumbnail");
// var mysection = document.querySelector(".box3 .content2 .slider");

// for(var i=0 ; i<10 ; i++){
//     var newThumb = document.createElement(isThumb);
//     mysection.appendChild(newThumb);
// }
// var isThumb = $(".box3 .content2 .thumbnail");

// $(".box3 .content2 .slider").function(){
// 	for(var i=0 ; i<10 ; i++){
// 		$(this).createElement(BUTTON);
// 	}
// };