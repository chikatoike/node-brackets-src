/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, window, serverVariables, $ */

define(function (require, exports, module) {
    'use strict';
    
    var EditorManager                   = brackets.getModule("editor/EditorManager"),
        NativeFileError                 = brackets.getModule("file/NativeFileError"),
        base_createEditorForDocument    = EditorManager._createEditorForDocument,
        httpEditor                      = require("./HttpEditor"),
        formEditor                      = require("./FormEditor"),
        util                            = require("./util"),
        forms                           = {};
        
    function createHttpEditor(doc, makeMasterEditor, container, range) {
        var editor = new httpEditor.Editor(doc, makeMasterEditor, container, range);
        forms[doc.file.fullPath] = doc.diskTimestamp;
        doc.isForm = true;
        
        $(editor).on("focus", function () {
            EditorManager._notifyActiveEditorChanged(this);
        });
        
        $(editor).on("closing", function () {
            delete forms[doc.file.fullPath];
        });
        
        return editor;
    }
    
    function createFormEditor(doc, makeMasterEditor, container, range) {
        var editor = new formEditor.Editor(doc, makeMasterEditor, container, range);
        forms[doc.file.fullPath] = doc.diskTimestamp;
        doc.isForm = true;
        
        $(editor).on("focus", function () {
            EditorManager._notifyActiveEditorChanged(this);
        });
        
        $(editor).on("closing", function () {
            delete forms[doc.file.fullPath];
        });
        
        return editor;
    }
    
    EditorManager._createEditorForDocument = function (doc, makeMasterEditor, container, range) {
        var path = doc.file.fullPath;
        if (util.startsWith(path, ["http://", "https://"])) {
            return createHttpEditor(doc, makeMasterEditor, container, range);
        } else if (util.startsWith(path, "form://")) {
            return createFormEditor(doc, makeMasterEditor, container, range);
        } else {
            return base_createEditorForDocument(doc, makeMasterEditor, container, range);
        }
    };
    
    brackets.fs._baseStat = brackets.fs.stat;
    brackets.fs.stat = function (path, callback) {
        if (util.startsWith(path, ["http://", "https://", "form://"])) {
            var timestamp = forms[path];
            if (timestamp) {
                callback(null, {
                    isFile: function () {
                        return true;
                    },
                    isDirectory: function () {
                        return false;
                    },
                    mtime: timestamp,
                    filesize: 0
                });
            } else {
                callback(new Error(NativeFileError.NOT_FOUND_ERR));
            }
        } else {
            brackets.fs._baseStat(path, callback);
        }
    };
});