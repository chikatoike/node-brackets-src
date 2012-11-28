/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, unescape, window */

define(function (require, exports, module) {
    "use strict";
    
    var CommandManager          = brackets.getModule("command/CommandManager"),
        DocumentManager         = brackets.getModule("document/DocumentManager"),
        ProjectManager          = brackets.getModule("project/ProjectManager"),
        Dialogs                 = brackets.getModule("widgets/Dialogs"),
        StringUtils             = brackets.getModule("utils/StringUtils"),
        Strings                 = require("strings");
    
    /**
     * List of constants for command IDs.
     */
    exports.FILE_DELETE         = "node.file.delete";
    exports.NODE_MENU           = "node-menu";
    exports.NODE_BROWSE         = "node.browse";
    exports.NODE_SERACH_NPM     = "node.search-npm";
    exports.NODE_MODULES        = "node.modules";
    exports.NODE_START          = "node.start";
    exports.NODE_STOP           = "node.stop";
    exports.NODE_RESTART        = "node.restart";
    exports.NODE_TERMINAL       = "node.terminal";
    exports.NODE_OPTIONS        = "node.options";
    
    function getErrorMessage(errorCode) {
        if (errorCode) {
            var message = Strings["ERROR_CODE_" + errorCode];
            if (message) {
                return message;
            }
        }
        return errorCode;
    }
    
    function updateNavigation(entry) {
        ProjectManager.showInTree(entry)
            .done(function (selected) {
                var treeAPI = $.jstree._reference($("#project-files-container"));
                treeAPI.remove(selected);
            });
    }
    
    function showYesNoDialog(title, message, itemPath, callback) {
        Dialogs.showModalDialog(
            "yes-no-dialog",
            title,
            StringUtils.format(message, StringUtils.htmlEscape(itemPath))
        ).done(function (id) {
            if (id === "yes") {
                callback();
            }
        });
    }
    
    function showErrorDialog(title, message, itemPath, err) {
        Dialogs.showModalDialog(
            Dialogs.DIALOG_ID_ERROR,
            title,
            StringUtils.format(message, StringUtils.htmlEscape(itemPath),
                               StringUtils.htmlEscape(getErrorMessage(err.code)))
        );
    }
    
    function handleDelete() {
        var entry = ProjectManager.getSelectedItem();
        if (!entry) {
            var doc = DocumentManager.getCurrentDocument();
            entry = doc && doc.file;
        }
        if (entry.isFile === true) {
            showYesNoDialog(Strings.DELETE_FILE_TITLE,
                            Strings.DELETE_FILE_MESSAGE,
                            entry.fullPath,
                            function () {
                    brackets.fs.unlink(entry.fullPath, function (err) {
                        if (err) {
                            showErrorDialog(Strings.ERROR_DEL_FILE_TITLE,
                                            Strings.ERROR_DEL_FILE_MESSAGE,
                                            entry.fullPath,
                                            err
                                           );
                        } else {
                            DocumentManager.notifyFileDeleted(entry);
                            updateNavigation(entry);
                        }
                    });
                });
        } else if (entry.isDirectory === true) {
            showYesNoDialog(Strings.DELETE_FOLDER_TITLE,
                            Strings.DELETE_FOLDER_MESSAGE,
                            entry.fullPath,
                            function () {
                    brackets.fs.rmdirRecursive(entry.fullPath, function (err) {
                        if (err) {
                            showErrorDialog(Strings.ERROR_DEL_FOLDER_TITLE,
                                            Strings.ERROR_DEL_FOLDER_MESSAGE,
                                            entry.fullPath,
                                            err
                                           );
                        } else {
                            updateNavigation(entry);
                        }
                    });
                });
        }
    }
    
    function handleBrowse() {
        alert("Error: Browse not implemented yet");
    }
    
    function handleSearchNPM() {
        alert("Error: Search NPM not implemented yet");
    }
    
    function handleModules() {
        alert("Error: Modules not implemented yet");
    }
    
    function handleStart() {
        brackets.app.callCommand("app", "nodeStart", [], true, function (err, res) {
            var title, dialog, message;
            if (err) {
                dialog  = Dialogs.DIALOG_ID_ERROR;
                title   = Strings.ERROR_NODE_START_TITLE;
                message = err.message;
            } else {
                dialog  = Dialogs.DIALOG_ID_INFO;
                title   = Strings.INFO_NODE_START_TITLE;
                message = StringUtils.format(Strings.INFO_NODE_START_MESSAGE, res.port);
            }
            Dialogs.showModalDialog(
                dialog,
                title,
                message
            );
        });
    }
    
    function handleStop() {
        brackets.app.callCommand("app", "nodeStop", [], true, function (err, res) {
            var title, dialog, message;
            if (err) {
                dialog  = Dialogs.DIALOG_ID_ERROR;
                title   = Strings.ERROR_NODE_STOP_TITLE;
                message = err.message;
            } else {
                dialog  = Dialogs.DIALOG_ID_INFO;
                title   = Strings.INFO_NODE_STOP_TITLE;
                message = Strings.INFO_NODE_STOP_MESSAGE;
            }
            Dialogs.showModalDialog(
                dialog,
                title,
                message
            );
        });
    }
    
    function handleTerminal() {
        alert("Error: Terminal not implemented yet");
    }
    
    function handleOptions() {
        alert("Error: Options not implemented yet");
    }

    
    CommandManager.register(Strings.CMD_DELETE,     exports.FILE_DELETE,        handleDelete);
    CommandManager.register(Strings.CMD_BROWSE,     exports.NODE_BROWSE,        handleBrowse);
    CommandManager.register(Strings.CMD_SERACH_NPM, exports.NODE_SERACH_NPM,    handleSearchNPM);
    CommandManager.register(Strings.CMD_MODULES,    exports.NODE_MODULES,       handleModules);
    CommandManager.register(Strings.CMD_START,      exports.NODE_START,         handleStart);
    CommandManager.register(Strings.CMD_STOP,       exports.NODE_STOP,          handleStop);
    CommandManager.register(Strings.CMD_TERMINAL,   exports.NODE_TERMINAL,      handleTerminal);
    CommandManager.register(Strings.CMD_OPTIONS,    exports.NODE_OPTIONS,       handleOptions);
});