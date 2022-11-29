var startColor = "#24EBAF";
var colorSaturation = 17;//83;
var colorLightness = 53;
var pickColor = true;

var curve = {
    x: 110,
    y: 16,
    cpx: 8,
    cpy: 125,
    endx: 115,
    endy: 240
};

var colorPicker = createPickerInstance();

initLeftSlider(curve);
initRightSlider(curve);

function createPickerInstance() {
    let picker = new iro.ColorPicker("#picker", {
        width: 250,
        color: startColor,
        wheelAngle: 270,
        wheelDirection: "clockwise",
        //minimumMovement: 2.4,
        wheelLightness: false,
        handleSvg: '#custom-handle',
        layout: [
            {
                component: iro.ui.Wheel,
                options: {
                    borderColor: "#ffffff",
                },
            }
        ],
    });

    picker.on("input:change", function (color) {
        var currSaturation = parseInt(color.saturation);
        let newColor = "hsl(" + parseInt(color.hsl.h) + ", " + currSaturation + "%, " + colorLightness + "%)";

        updateSaturationSliderPosition(currSaturation);
        updateSlidersColor(color, newColor);
        updateColorHexBox(color.hsl.h, currSaturation, colorLightness);
        updateImageBackground(newColor)
    });

    return picker;
}
function initRightSlider(curve) {
    let percent = colorLightness / 100;//0.7;
    let curveEl = document.getElementById('curveRight');
    let thumbEl = document.getElementById('thumbRight');

    // get the XY at the specified percentage along the curve
    const getQuadraticBezierXYatPercent = (curve, percent) => {
        let x = Math.pow(1 - percent, 2) * curve.x + 2 * (1 - percent) * percent * curve.cpx + Math.pow(percent, 2) * curve.endx;
        let y = Math.pow(1 - percent, 2) * curve.y + 2 * (1 - percent) * percent * curve.cpy + Math.pow(percent, 2) * curve.endy;
        return {
            x,
            y
        };
    };
    const drawCurve = () => {
        curveEl.setAttribute('d', `M${curve.x},${curve.y} Q${curve.cpx},${curve.cpy} ${curve.endx},${curve.endy}`);
    };
    const drawThumb = percent => {
        let pos = getQuadraticBezierXYatPercent(curve, percent);

        thumbEl.setAttribute('cx', pos.x);
        thumbEl.setAttribute('cy', pos.y);
    };
    const moveThumb = e => {
        percent = parseInt(e.target.value);
        colorLightness = 100 - parseInt(e.target.value);
        drawThumb(percent / 100);

        var color = colorPicker.color;
        if (colorLightness > 70) {
            document.getElementsByClassName("hexValue")[0].style.color = "black";
        } else {
            document.getElementsByClassName("hexValue")[0].style.color = "white";
        }

        let light = "hsl(" + parseInt(color.hsl.h) + ", 100%, " + colorLightness + "%)";
        let dark = "hsl(" + parseInt(color.hsl.h) + ", 0%, " + colorLightness + "%)";

        var newColor = "hsl(" + parseInt(color.hsl.h) + ", " + parseInt(color.saturation) + "%, " + colorLightness + "%)";
        document.getElementsByClassName("hexValue")[0].innerHTML = hslToHex(parseInt(color.hsl.h), parseInt(color.saturation), colorLightness);
        document.getElementById("pathLeftColor").style.background = "linear-gradient(" + light + ", " + dark + ")";
        document.getElementsByClassName("color-overlay")[0].style.background = newColor;
        document.getElementById("colorPlace").style.background = newColor;
    };

    // event on the range input
    let rangeEl = document.getElementById('rangeRight');
    rangeEl.value = percent * 100;
    rangeEl.addEventListener('input', moveThumb);

    // init
    drawCurve();
    drawThumb(percent);
}
function initLeftSlider(curve) {
    let percent = colorSaturation / 100;//0.7;
    let curveEl = document.getElementById('curveLeft');
    let thumbEl = document.getElementById('thumbLeft');

    // get the XY at the specified percentage along the curve
    const getQuadraticBezierXYatPercent = (curve, percent) => {
        let x = Math.pow(1 - percent, 2) * curve.x + 2 * (1 - percent) * percent * curve.cpx + Math.pow(percent, 2) * curve.endx;
        let y = Math.pow(1 - percent, 2) * curve.y + 2 * (1 - percent) * percent * curve.cpy + Math.pow(percent, 2) * curve.endy;
        return {
            x,
            y
        };
    };
    const drawCurve = () => {
        curveEl.setAttribute('d', `M${curve.x},${curve.y} Q${curve.cpx},${curve.cpy} ${curve.endx},${curve.endy}`);
    };
    const drawThumb = percent => {
        let pos = getQuadraticBezierXYatPercent(curve, percent);

        thumbEl.setAttribute('cx', pos.x);
        thumbEl.setAttribute('cy', pos.y);
    };
    const moveThumb = e => {
        pickColor = e.pickColor;//!e.isTrusted;

        percent = e.target.value;
        colorSaturation = percent;//e.target.value;

        // if (!pickColor) {
        //     percent = e.target.value;
        // }

        drawThumb((100 - percent) / 100);

        var color = colorPicker.color;
        var newColor = "hsl(" + parseInt(color.hsl.h) + ", " + percent + "%, " + colorLightness + "%)";

        color.saturation = colorSaturation;

        updateSlidersColor(color);
        updateColorHexBox(color.hsl.h, colorSaturation, colorLightness);
        updateImageBackground(newColor);
    };

    // event on the range input
    let rangeEl = document.getElementById('rangeLeft');
    rangeEl.value = percent;

    rangeEl.addEventListener('input', moveThumb);

    // init
    drawCurve();
    drawThumb(percent);
}


$("#clear-mirror").on("click", function () {
    $(".image-2").toggle();
    $(".image-overlay").toggle(0);
})


function updateSaturationSliderPosition(saturation) {
    let rangeEl = document.getElementById('rangeLeft');
    var event = new Event('input');
    event.pickColor = true;

    rangeEl.value = saturation;
    rangeEl.dispatchEvent(event);
}

function updateColorHexBox(hue, saturation, lightness) {
    var currColorHex = hslToHex(hue, saturation, lightness);
    document.getElementsByClassName("hexValue")[0].innerHTML = currColorHex;
    document.getElementById("colorPlace").style.background = currColorHex;
}

function updateSlidersColor(color) {
    let light = "hsl(" + parseInt(color.hsl.h) + ", 100%, " + colorLightness + "%)";
    let dark = "hsl(" + parseInt(color.hsl.h) + ", 0%, " + colorLightness + "%)";

    if (pickColor) {
        document.getElementById("pathLeftColor").style.background = "linear-gradient(" + light + ", " + dark + ")";
    }

    var newColor = "hsl(" + parseInt(color.hsl.h) + ", " + colorSaturation + "%, 50%)";
    document.getElementById("pathRightColor").style.background = "linear-gradient(white," + newColor + ", black)";
}

function updateImageBackground(newColor) {
    document.getElementsByClassName("color-overlay")[0].style.background = newColor;
}
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}




//------------------------------- Calculator ----------------------------------------



var sliderValueDisplay = function (containerId, textValue) {
    var item = $("input#" + containerId);
    if (item) {
        $("input#" + containerId).val(textValue);
    }
};

/**
 * Recalculates the total price.
 */
var recalculateCalculator2 = function () {
    var thisForm = document.forms['calculator_2_form'];
    var calculator2Length = thisForm.elements['calculator_2_length'].value * 1;
    var calculator2Height = thisForm.elements['calculator_2_height'].value * 1;
    var calculator2BackSQM = (calculator2Length * calculator2Height) / 10000;
    var calculator2GlassWidth = thisForm.elements['calculator_2_glass_width'].value;
    //var calculator2Paint = thisForm.elements['calculator_2_paint'].value;
    var priceSQM = 188.4;//94.15 * 1.95583 * 1.2;
    // if (calculator2GlassWidth == 5) {
    //     priceSQM = 100.35 * 1.95583 * 1.2;
    // } else 

    if (calculator2GlassWidth == 6) {
        priceSQM = 242.4;//106.6 * 1.95583 * 1.2;
    }
    var calculator2Holes = thisForm.elements['calculator_2_holes'].value;
    // var pricePaint = 54;
    // if (calculator2Paint == 'Trendy') {
    //     pricePaint = 60;
    // } else if (calculator2Paint == 'Exclusive') {
    //     pricePaint = 78;
    // }

    var calculator2BackTotal = (calculator2BackSQM * priceSQM)
        + (calculator2Holes * 18);//* 12.13 * 1.2)
    //+ (((2 * (calculator2Length + calculator2Height)) / 100) * 1.00 * 1.95583 * 1.2);
    //+ (calculator2BackSQM * pricePaint);

    var totalValueSpan = $("span#total_calc_2_value").last();
    if (totalValueSpan) {
        $("span#total_calc_2_value").html("Общо: " + (Math.round(calculator2BackTotal * 100) / 100) + " лв.");
    }
};


var recalculateCalculator2_old = function () {
    var thisForm = document.forms['calculator_2_form'];
    var calculator2Length = thisForm.elements['calculator_2_length'].value * 1;
    var calculator2Height = thisForm.elements['calculator_2_height'].value * 1;
    var calculator2BackSQM = (calculator2Length * calculator2Height) / 10000;
    var calculator2GlassWidth = thisForm.elements['calculator_2_glass_width'].value;
    var calculator2Paint = thisForm.elements['calculator_2_paint'].value;
    var priceSQM = 94.15 * 1.95583 * 1.2;
    if (calculator2GlassWidth == 5) {
        priceSQM = 100.35 * 1.95583 * 1.2;
    } else if (calculator2GlassWidth == 6) {
        priceSQM = 106.6 * 1.95583 * 1.2;
    }
    var calculator2Holes = thisForm.elements['calculator_2_holes'].value;
    var pricePaint = 54;
    if (calculator2Paint == 'Trendy') {
        pricePaint = 60;
    } else if (calculator2Paint == 'Exclusive') {
        pricePaint = 78;
    }

    var calculator2BackTotal = (calculator2BackSQM * priceSQM)
        + (calculator2Holes * 12.13 * 1.2)
        + (((2 * (calculator2Length + calculator2Height)) / 100) * 1.00 * 1.95583 * 1.2)
        + (calculator2BackSQM * pricePaint);

    var totalValueSpan = $("span#total_calc_2_value").last();
    if (totalValueSpan) {
        $("span#total_calc_2_value").html((Math.round(calculator2BackTotal * 100) / 100));
    }
};

/**
 * Sends the purchase with all required elements.
 */
var sendPurchaseCalculator2 = function () {
    debugger;
    var thisForm = document.forms['calculator_2_form'];
    var calculator2Length = thisForm.elements['calculator_2_length'].value * 1;
    var calculator2Height = thisForm.elements['calculator_2_height'].value * 1;
    var calculator2BackSQM = (calculator2Length * calculator2Height) / 10000;
    var calculator2GlassWidth = thisForm.elements['calculator_2_glass_width'].value;
    //var calculator2Paint = thisForm.elements['calculator_2_paint'].value;

    var priceSQM = 94.15 * 1.95583 * 1.2;
    if (calculator2GlassWidth == 5) {
        priceSQM = 100.35 * 1.95583 * 1.2;
    } else if (calculator2GlassWidth == 6) {
        priceSQM = 106.6 * 1.95583 * 1.2;
    }
    var calculator2Holes = thisForm.elements['calculator_2_holes'].value;
    var pricePaint = 54;
    // if (calculator2Paint == 'Trendy') {
    //     pricePaint = 60;
    // } else if (calculator2Paint == 'Exclusive') {
    //     pricePaint = 78;
    // }

    var calculator2BackTotal = (calculator2BackSQM * priceSQM)
        + (calculator2Holes * 12.13 * 1.2)
        + (((2 * (calculator2Length + calculator2Height)) / 100) * 1.00 * 1.95583 * 1.2)
        + (calculator2BackSQM * pricePaint);

    var clientName = thisForm.elements['client_name'].value;
    var clientEmail = thisForm.elements['client_email'].value;
    var clientPhone = thisForm.elements['client_phone'].value;

    if (clientName.trim() == '') {
        alert('Грешка! Моля, въведете Вашите имена или име на фирма!');
        return;
    }
    if ((clientEmail.trim() == '') || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(clientEmail.trim()))) {
        alert('Грешка! Моля, въведете правилен E-mail адрес!');
        return;
    }
    if (clientPhone.trim() == '') {
        alert('Грешка! Моля, въведете Телефон за връзка!');
        return;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            alert('Вие успешно изпратихте Вашето запитване! Благодаря!');
        } else if (this.readyState == 4) {
            console.log('Error sending mail');
        }
    };
    xhttp.open('GET',
        '/statics/send_mail_calc2.php?'//gr=' + calculator2Paint
        + 'kl=' + calculator2Length
        + '&kh=' + calculator2Height
        + '&kb=' + calculator2BackSQM
        + '&kg=' + calculator2GlassWidth
        + '&pr=' + (Math.round(priceSQM * 100) / 100)
        + '&ko=' + calculator2Holes
        + '&kt=' + (Math.round(calculator2BackTotal * 100) / 100)
        + '&cn=' + clientName
        + '&ce=' + clientEmail
        + '&cp=' + clientPhone, true);
    xhttp.send();
};




































//------------Old--------------


// var sliderValueDisplay = function (containerId, textValue) {
//     var item = $("input#" + containerId);
//     if (item) {
//         $("input#" + containerId).val(textValue);
//     }
// };

// /**
//  * Recalculates the total price.
//  */
// var recalculateCalculator1 = function () {
//     var thisForm = document.forms["calculator_1_form"];
//     var calculator1Length =
//         thisForm.elements["calculator_1_length"].value * 1;
//     var calculator1Height =
//         thisForm.elements["calculator_1_height"].value * 1;
//     var calculator1BackSQM = (calculator1Length * calculator1Height) / 10000;
//     var calculator1GlassWidth =
//         thisForm.elements["calculator_1_glass_width"].value;

//     debugger;

//     var priceSQM = 283; //?old price 94.15 * 1.95583 * 1.2;
//     if (calculator1GlassWidth == 5) {
//         priceSQM = 312; // 100.35 * 1.95583 * 1.2;
//     } else if (calculator1GlassWidth == 6) {
//         priceSQM = 348; //106.6 * 1.95583 * 1.2;
//     }
//     var calculator1Holes = thisForm.elements["calculator_1_holes"].value;

//     var calculator1BackTotal =
//         calculator1BackSQM * priceSQM + calculator1Holes * 18 /* 12.13 * 1.2 */;
//     // +
//     //TODO: should this down below be kept?

//     // (((2 * (calculator1Length + calculator1Height)) / 100) * 1.00 * 1.95583 * 1.2);

//     var totalValueSpan = $("span#total_calc_1_value").last();
//     if (totalValueSpan) {
//         $("span#total_calc_1_value").html(
//             Math.round(calculator1BackTotal * 100) / 100
//         );
//     }
// };

// /**
//  * Sends the purchase with all required elements.
//  */

// var sendPurchaseCalculator1 = function () {
//     var thisForm = document.forms["calculator_1_form"];
//     var calculator1Length =
//         thisForm.elements["calculator_1_length"].value * 1;
//     var calculator1Height =
//         thisForm.elements["calculator_1_height"].value * 1;
//     var calculator1BackSQM = (calculator1Length * calculator1Height) / 10000;
//     var calculator1GlassWidth =
//         thisForm.elements["calculator_1_glass_width"].value;
//     debugger;
//     var priceSQM = 283; //94.15 * 1.95583 * 1.2;
//     if (calculator1GlassWidth == 5) {
//         priceSQM = 312; //100.35 * 1.95583 * 1.2;
//     } else if (calculator1GlassWidth == 6) {
//         priceSQM = 348; //106.6 * 1.95583 * 1.2;
//     }
//     var calculator1Holes = thisForm.elements["calculator_1_holes"].value;

//     var calculator1BackTotal =
//         calculator1BackSQM * priceSQM + calculator1Holes * 18 /* 12.13 * 1.2 */;
//     // +
//     //TODO: should this down below be kept?
//     // (((2 * (calculator1Length + calculator1Height)) / 100) * 1.00 * 1.95583 * 1.2);

//     var clientName = thisForm.elements["client_name"].value;
//     var clientEmail = thisForm.elements["client_email"].value;
//     var clientPhone = thisForm.elements["client_phone"].value;

//     if (clientName.trim() == "") {
//         alert("Грешка! Моля, въведете Вашите имена или име на фирма!");
//         return;
//     }
//     if (
//         clientEmail.trim() == "" ||
//         !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
//             clientEmail.trim()
//         )
//     ) {
//         alert("Грешка! Моля, въведете правилен E-mail адрес!");
//         return;
//     }
//     if (clientPhone.trim() == "") {
//         alert("Грешка! Моля, въведете Телефон за връзка!");
//         return;
//     }

//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             alert("Вие успешно изпратихте Вашето запитване! Благодаря!");
//         } else if (this.readyState == 4) {
//             console.log("Error sending mail");
//         }
//     };
//     xhttp.open(
//         "GET",
//         "/statics/send_mail_calc1.php?gr=" + // + rendingValues[ 2 ]
//         "&kl=" +
//         calculator1Length +
//         "&kh=" +
//         calculator1Height +
//         "&kb=" +
//         calculator1BackSQM +
//         "&kg=" +
//         calculator1GlassWidth +
//         "&pr=" +
//         Math.round(priceSQM * 100) / 100 +
//         "&ko=" +
//         calculator1Holes +
//         "&kt=" +
//         Math.round(calculator1BackTotal * 100) / 100 +
//         "&cn=" +
//         clientName +
//         "&ce=" +
//         clientEmail +
//         "&cp=" +
//         clientPhone,
//         true
//     );
//     xhttp.send();
// };