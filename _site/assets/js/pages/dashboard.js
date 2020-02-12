$( document ).ready(function() {    
    setTimeout(function(){ Materialize.toast('Welcome to Leave Management System', 4000) }, 2000);
    
    
    
    // CounterUp Plugin
    $('.counter').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 5000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
                $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
            }
        });
    });
});