
$(document).ready(function(){
    /*sidebar button on homepage*/
    $('#control-sidebar').click(function () {
        $(this).toggleClass('button--rotate');
        $('.wrapper-page--home').toggleClass('wrapper-page--compact');
        $('.sidebar-nav').toggleClass('sidebar-nav--compact');
    })

    if($(window).width() <1200){
        $('.wrapper-page--home').addClass('wrapper-page--compact');
        $('.sidebar-nav').addClass('sidebar-nav--compact');
        console.log('sm screen');
    }

    $(window).resize(function () {
        if($(window).width() <1200){
            $('.wrapper-page--home').addClass('wrapper-page--compact');
            $('.sidebar-nav').addClass('sidebar-nav--compact');
            console.log('sm screen');
        }
    });

    $('#vrm-list tr').click(function () {
        console.log('aaaaaaaaa');
        $('#vrm-list tr').removeClass('active');
        $(this).addClass('active');
        $('#remove-rvm').attr('disabled',false);
    })

    /*chart*/

    $(function(){
        $("#bars li .bar").each(function(key, bar){
            var percentage = $(this).data('percentage');

            $(this).animate({
                'height':percentage+'%'
            }, 1000);
        })
    });

    /*if($('.date-input').length > 0){
        $('.date-input').datepicker();
    }*/

});
