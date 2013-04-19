/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, window, serverVariables, $ */

define(function (require, exports, module) {
    'use strict';
    
    var EditorManager                   = brackets.getModule("editor/EditorManager"),
        base_createEditorForDocument    = EditorManager._createEditorForDocument,
        httpEditor                      = require("./HttpEditor"),
        formEditor                      = require("./FormEditor");
        
    function createHttpEditor(doc, makeMasterEditor, container, range) {
        var editor = new httpEditor.Editor(doc, makeMasterEditor, container, range);
        
        $(editor).on("focus", function () {
            EditorManager._notifyActiveEditorChanged(this);
        });
        
        return editor;
    }
    
    function createFormEditor(doc, makeMasterEditor, container, range) {
        var editor = new formEditor.Editor(doc, makeMasterEditor, container, range);
        
        $(editor).on("focus", function () {
            EditorManager._notifyActiveEditorChanged(this);
        });
        
        return editor;
    }
    
    EditorManager._createEditorForDocument = function (doc, makeMasterEditor, container, range) {
        var path = doc.file.fullPath;
        if (path.indexOf("http://") === 0 || path.indexOf("https://") === 0) {
            return createHttpEditor(doc, makeMasterEditor, container, range);
        } else if (path.indexOf("form://") === 0) {
            return createFormEditor(doc, makeMasterEditor, container, range);
        } else {
            return base_createEditorForDocument(doc, makeMasterEditor, container, range);
        }
    };
});