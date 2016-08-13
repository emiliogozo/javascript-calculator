$(document).ready(function () {
    var valStr = "";
    var isTotal = false;

    var DISPLAY_LEN = 8;

    $("button").click(function () {
        var btnVal = $(this).val();  // value of the clicked button
        var updateSecondaryDisplay = true;

        switch (btnVal) {
            case ".": // decimal point
                var startIdx = valStr.regexLastIndexOf(/[\+\-x\/]/) + 1;
                if (startIdx == -1)
                    startIdx = 0;
                if (!(valStr.slice(startIdx))) {
                    // if start of a digit, add a leading zero
                    valStr = valStr.slice(0, startIdx) + "0";
                } else if (valStr.slice(startIdx).indexOf(".") != -1 || isTotal) {
                    // do not append if a decimal already exists
                    return true;
                }
                updateSecondaryDisplay = false;
                break;
            case "+":
            case "-":
            case "x":
            case "/":
                if (!(valStr)) {
                    // do not append if display is empty
                    return true;
                }
                // remove the preceeding character if it is an operator
                if (isCharOperator(valStr.slice(-1))) {
                    valStr = valStr.slice(0, -1);
                }
                updateSecondaryDisplay = false;
                break;
            case "=":
            case "del":
            case "ac":
                break;
            default:
                if (valStr === "0" || (isTotal && !(isCharOperator(valStr.slice(-1))))) {
                    valStr = "";
                } else if (valStr.slice(-1) == "0" && isCharOperator(valStr.slice(-2))) {
                    valStr = valStr.slice(0, -1);
                }
                isTotal = false;

        }

        if (btnVal == "del") {
            if (!isTotal || isCharOperator(valStr.slice(-1))) {
                valStr = valStr.slice(0, -1);
            } else {
                valStr = "";
            }
        } else if (btnVal == "ac") {
            valStr = "";
        } else if (btnVal == "=") {
            var total = compute(valStr);
            if (total) {
                valStr = total;
                isTotal = true;
            }
        } else {
            valStr += btnVal;
        }

        $("#calc-main-display").text(valStr.slice(-13));

        if (updateSecondaryDisplay) {
            if (btnVal == "=") {
                $("#calc-sec-display").text("");
            } else {
                $("#calc-sec-display").text(compute(valStr));
            }
        }

    });

    function isCharOperator(str) {
        var operators = /[\+\-x\/]/;
        return operators.test(str);
    }

    function compute(str) {
        var endOp = str.slice(-1);
        var operators = /[\+\-x\/]/;

        if (operators.test(endOp)) {
            str = str.slice(0, -1);
        }

        if (operators.test(str)) {
            str = str.replace(/x/g, "*");
            str = eval(str).toPrecision(DISPLAY_LEN);

            var zeroes = str.match(/\.[0-9]*0+$/);
            if (zeroes) {
                zeroes = zeroes[0].match(/0+/);
            }
            if (zeroes) {
                str = str.slice(0, -zeroes[0].length);
            }

            if (str.slice(-1) == ".") {
                str = str.slice(0, -1);
            }

            return str;
        } else {
            return "";
        }

    }

    String.prototype.regexIndexOf = function (regex, startpos) {
        var indexOf = this.substring(startpos || 0).search(regex);
        return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    }

    String.prototype.regexLastIndexOf = function (regex, startpos) {
        regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiLine ? "m" : ""));
        if (typeof (startpos) == "undefined") {
            startpos = this.length;
        } else if (startpos < 0) {
            startpos = 0;
        }
        var stringToWorkWith = this.substring(0, startpos + 1);
        var lastIndexOf = -1;
        var nextStop = 0;
        while ((result = regex.exec(stringToWorkWith)) != null) {
            lastIndexOf = result.index;
            regex.lastIndex = ++nextStop;
        }
        return lastIndexOf;
    }
});