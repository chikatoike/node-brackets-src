/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, window, serverVariables, $ */

define(function (require, exports, module) {
    'use strict';

    function setTextContent(e, str) {
//        if (ie_lt9) {
//            e.innerHTML = "";
//            e.appendChild(window.document.createTextNode(str));
//        } else {
        e.textContent = str;
//        }
    }
    
    exports.elt = function (tag, content, className, style) {
        var e = window.document.createElement(tag),
            i;
        
        if (className) {
            e.className = className;
        }
        
        if (style) {
            e.style.cssText = style;
        }
        
        if (typeof content === "string") {
            setTextContent(e, content);
        } else if (content) {
            for (i = 0; i < content.length; ++i) {
                e.appendChild(content[i]);
            }
        }
        return e;
    };
    
    exports.stripTrailingSlash = function (str) {
        if (str.substr(-1) === '/') {
            return str.substr(0, str.length - 1);
        }
        return str;
    };
});
    