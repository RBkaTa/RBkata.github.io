window.onscroll = function () { on_scroll() };
var isOnTop = true;

function on_scroll() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        set_position_bot();
    } else {
        set_position_top();
    }
}


function fast_scroll_btn_click() {
    if (isOnTop) {
        document.querySelector("#slide_2_img").scrollIntoView({ behavior: 'smooth', block: "center", inline: "nearest" });

        set_position_bot();
    } else {
        document.querySelector("#slide_1").scrollIntoView({ behavior: 'smooth', block: "center", inline: "nearest" });

        set_position_top();
    }

}

function set_position_top() {
    document.querySelector("#arrow img").classList.remove("arrow-down");
    document.querySelector("#arrow img").classList.add("arrow-up");

    isOnTop = true;
}

function set_position_bot() {
    document.querySelector("#arrow img").classList.remove("arrow-up");
    document.querySelector("#arrow img").classList.add("arrow-down");

    isOnTop = false;
}