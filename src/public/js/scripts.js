$(document).ready(function () {
    var aboutJoItems = $('.about-jo-item')

    $('.about-jo-item').on('click', function () {
        aboutJoItems.each(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active')
            }
        });
        $(this).addClass('active')
        var selectedItem = '#' + $(this).attr('name')
        if ($(selectedItem).hasClass('item-content-active')) {
            return
        }
        $('.item-content-active').addClass('item-content')
        $('.item-content-active').removeClass('item-content-active')
        $(selectedItem).removeClass('item-content')
        $(selectedItem).addClass('item-content-active')

    })
})