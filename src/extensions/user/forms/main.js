/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, window, serverVariables, $ */

define(function (require, exports, module) {
    'use strict';
    
    var EditorManager                   = brackets.getModule("editor/EditorManager"),
        base_createEditorForDocument    = EditorManager._createEditorForDocument;
    
    function setTextContent(e, str) {
//        if (ie_lt9) {
//            e.innerHTML = "";
//            e.appendChild(window.document.createTextNode(str));
//        } else {
        e.textContent = str;
//        }
    }
    
    function elt(tag, content, className, style) {
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
    }
    
    function HttpEditor(document, makeMasterEditor, container, range) {
        
        this.document = document;
        this.rootElement = elt("h1", "TEST");
        
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
    
    function createHttpEditor(doc, makeMasterEditor, container, range) {
        var editor = new HttpEditor(doc, makeMasterEditor, container, range);
        
        $(editor).on("focus", function () {
            EditorManager._notifyActiveEditorChanged(this);
        });
        
        return editor;
    }
    
    EditorManager._createEditorForDocument = function (doc, makeMasterEditor, container, range) {
        var path = doc.file.fullPath;
        if (path.indexOf("http://") === 0 || path.indexOf("https://") === 0) {
            return createHttpEditor(doc, makeMasterEditor, container, range);
        } else {
            return base_createEditorForDocument(doc, makeMasterEditor, container, range);
        }
    };
});