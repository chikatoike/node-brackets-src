/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, window, serverVariables, $ */

define(function (require, exports, module) {
    'use strict';
    
    var EditorManager       = brackets.getModule("editor/EditorManager");
    
    EditorManager._base_createFullEditorForDocument = EditorManager._createFullEditorForDocument;
    EditorManager._createFullEditorForDocument = function (document) {
        this._base_createFullEditorForDocument(document);
    };
});