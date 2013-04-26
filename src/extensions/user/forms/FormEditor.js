/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, window, requirejs, $ */

define(function (require, exports, module) {
    'use strict';
    
    var util = require("./util");
        
    function FormEditor(document, makeMasterEditor, container, range) {
        
        this.document = document;
        this.rootElement = util.elt("div");
        this.rootElement.id = "form-root";
        this.rootElement.style.width = "100%";
        this._codeMirror = {
            getValue: function () {
                return "";
            }
        };

        var self    = this,
            baseUrl = util.stripTrailingSlash(window.location.pathname) + "/extensions.svc/",
            path    = document.file.fullPath.substr(22),
            ext     = path.substr(path.lastIndexOf(".")),
            lIdx    = path.lastIndexOf("/"),
            fIdx    = path.indexOf("/"),
            extName = path.substr(0, fIdx),
            paths   = {};
        
        paths[extName] = path.substr(0, lIdx);
        
        var req = requirejs.config({
            baseUrl: baseUrl,
            paths: paths
        });
        
        if (ext === ".html") {
            // HTML form
            req(["text!" + baseUrl + path + "!strip"], function (html) {
                $(self.rootElement).html(html);
                self._appendRootElement(container);
            });
        } else {
            // Assume it is JavaScript function
            req([baseUrl + path], function (extension) {
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
        $(this).trigger("closing");
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