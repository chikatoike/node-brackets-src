/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, window, serverVariables, $ */

define(function (require, exports, module) {
    'use strict';
    
    var util = require("./util");
        
    function HttpEditor(document, makeMasterEditor, container, range) {
        
        this.document = document;
        document.addRef();
        
        this.rootElement = util.elt("iframe");
        this.rootElement.style.width = "100%";
        this.rootElement.seamless = "seamless";
        this.rootElement.src = document.file.fullPath;
        
        if (container.appendChild) {
            container.appendChild(this.rootElement);
        } else {
            container(this.rootElement);
        }
        
        if (makeMasterEditor) {
            document._makeEditable(this);
        }
    }
    
    HttpEditor.prototype.setVisible = function (show, refresh) {
        $(this.getRootElement()).css("display", (show ? "" : "none"));
        if (show && (refresh || refresh === undefined)) {
            this.refresh();
        }
    };
    
    HttpEditor.prototype.destroy = function () {
        $(this.getRootElement()).remove();
        this.document.releaseRef();
    };
    
    HttpEditor.prototype.focus = function () {
        
    };
    
    HttpEditor.prototype.refresh = function () {
        
    };
    
    HttpEditor.prototype.refreshAll = function () {
        
    };
    
    HttpEditor.prototype.getSelection = function () {
        return { start: 0, end: 0 };
    };
    
    HttpEditor.prototype.setSelection = function (start, end, center, centerOptions) {
        
    };
    
    HttpEditor.prototype.getScrollPos = function () {
        return { x: 0, y: 0 };
    };
    
    HttpEditor.prototype.setScrollPos = function (x, y) {
        
    };
    
    HttpEditor.prototype.getRootElement = function () {
        return this.rootElement;
    };
    
    exports.Editor = HttpEditor;
});