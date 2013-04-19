/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, window, serverVariables, $ */

define(function (require, exports, module) {
    'use strict';
    
    var util = require("./util");
        
    function FormEditor(document, makeMasterEditor, container, range) {
        
        this.document = document;
        this.rootElement = util.elt("div");
        this.rootElement.id = "form-root";
        this.rootElement.style.width = "100%";

        var self    = this,
            url     = util.stripTrailingSlash(window.location.pathname) + document.file.fullPath.substr(6),
            ext     = url.substr(url.lastIndexOf("."));
        
        if (ext === ".html") {
            // HTML form
            require(["text!" + url + "!strip"], function (html) {
                $(self.rootElement).html(html);
                self._appendRootElement(container);
            });
        } else {
            // Assume it is JavaScript function
            require([url], function (extension) {
                self._appendRootElement(container);
                extension(self);
            });
        }
        
        document.addRef();
        if (makeMasterEditor) {
            document._makeEditable(this);
        }
    }
    
    FormEditor.prototype._appendRootElement = function (container) {
        if (container.appendChild) {
            container.appendChild(this.rootElement);
        } else {
            container(this.rootElement);
        }
    };
    
    FormEditor.prototype.setVisible = function (show, refresh) {
        $(this.getRootElement()).css("display", (show ? "" : "none"));
        if (show && (refresh || refresh === undefined)) {
            this.refresh();
        }
    };
    
    FormEditor.prototype.destroy = function () {
        $(this.getRootElement()).remove();
        this.document.releaseRef();
    };
    
    FormEditor.prototype.focus = function () {
        
    };
    
    FormEditor.prototype.refresh = function () {
        
    };
    
    FormEditor.prototype.refreshAll = function () {
        
    };
    
    FormEditor.prototype.getSelection = function () {
        return { start: 0, end: 0 };
    };
    
    FormEditor.prototype.setSelection = function (start, end, center, centerOptions) {
        
    };
    
    FormEditor.prototype.getScrollPos = function () {
        return { x: 0, y: 0 };
    };
    
    FormEditor.prototype.setScrollPos = function (x, y) {
        
    };
    
    FormEditor.prototype.getRootElement = function () {
        return this.rootElement;
    };
    
    exports.Editor = FormEditor;
});