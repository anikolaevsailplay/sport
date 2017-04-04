$( document ).ready(function() {

    $('.bns_open_hist').click(function(){
        $("body").addClass('no_scrol');
        $('.js_over_hist').fadeIn();
        return false;
    })

    $('.bns_info_mount_item_info a, .bns_gift_item_linck, .bns_qust_item, .bns_achiv_item').click(function(){
        $("body").addClass('no_scrol');
        $('.js_over_info').fadeIn();
        return false;
    })

    $('.bns_edit_profile').click(function(){
        $("body").addClass('no_scrol');
        $('.js_over_reg').fadeIn();
        return false;
    })

    $('.bns_overlay, .bns_close, .bns_reg_step5 .bns_btn').click(function(){
        $("body").removeClass('no_scrol');
        $('.bns_overlay').fadeOut();
        $(".bns_spis_main").getNiceScroll().hide();
        $('.js_over_reg').removeClass('js_over_reg_big');
        return false;
    })
    $('.bns_overlay_iner').click(function(event){
        event.stopPropagation();
    });

    if($('.bns_info_mount_item:not(.act) img').length>0){
        $('.bns_info_mount_item:not(.act) img').gray();
    }
    if($(' .bns_achiv_item:not(.act) img').length>0){
        $(' .bns_achiv_item:not(.act) img').gray();
    }
    $('.bns_tab_top_menu a').click(function(){
        $('.bns_tab').hide();
        $('.bns_tab_top_menu a').removeClass('act');
        $(this).addClass('act');
        $('.bns_tab_top_description').html($(this).attr('data-deac'))
        $($(this).attr('href')).fadeIn();
        return false;
    })
    $('.bns_reg_step1 .bns_btn').click(function () {
        $('.bns_reg_step1').removeClass('act');
        $('.bns_reg_step2').addClass('act');
        $('.bns_reg_step_item:nth-child(2)').addClass('act')
        return false;
    })
    $('.bns_reg_step2 .bns_btn').click(function () {
        $('.bns_reg_step2').removeClass('act');
        $('.bns_reg_step3').addClass('act');
        $('.bns_reg_step_item:nth-child(3)').addClass('act')
        return false;
    })
    $('.bns_reg_step3 .bns_btn').click(function () {
        $('.bns_reg_step3').removeClass('act');
        $('.bns_reg_step4').addClass('act');
        $('.bns_reg_step_item:nth-child(4)').addClass('act');
        $('.js_over_reg').addClass('js_over_reg_big');
        return false;
    })
    $('.bns_reg_step4 .bns_btn').click(function () {
        $('.bns_reg_step4').removeClass('act');
        $('.bns_reg_step5').addClass('act');
        $('.bns_reg_step').hide();
        $('.bns_reg_gift').addClass('fin');
        $('.bns_reg_gift').html('Вы получили 500 баллов!');
        $('.js_over_reg h3').html('Спасибо!')
        $('.js_over_reg').removeClass('js_over_reg_big');
        return false;
    })

    $('.bns_phone').mask("+7(999)999-99-99");

    $('.bns_input_block_d').mask("99",
        { completed: function () { $(this).next().focus(); } }
    );

    $('.bns_input_block_m').mask("99",
        { completed: function () { $(this).next().focus(); } }
    );

    $('.bns_input_block_y').mask("9999");

});
