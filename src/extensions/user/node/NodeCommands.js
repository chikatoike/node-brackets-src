/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, unescape, window, requirejs */

define(function (require, exports, module) {
    "use strict";
    
    var CommandManager          = brackets.getModule("command/CommandManager"),
        DocumentManager         = brackets.getModule("document/DocumentManager"),
        ProjectManager          = brackets.getModule("project/ProjectManager"),
        Dialogs                 = brackets.getModule("widgets/Dialogs"),
        StringUtils             = brackets.getModule("utils/StringUtils"),
        Strings                 = require("strings"),
        livePort,
        debugPort,
        debuggerPort,
        debugAppPort,
        liveWin,
        debuggerWin;
    
    /**
     * Replace Find in Files commands
     */
    //require("FindInFiles");
    
    /**
     * List of constants for command IDs.
     */
    exports.FILE_DELETE         = "node.file.delete";
    exports.PROJECT_LIVE        = "project.live";
    exports.NODE_START          = "node.start";
    exports.NODE_STOP           = "node.stop";
    exports.NODE_RESTART        = "node.restart";
    exports.NODE_DEBUG          = "node.debug";
    exports.NODE_DEBUG_BRK      = "node.debug-brk";
    exports.NODE_STOP_DEBUG     = "node.debug-stop";
    
    exports.TOOLS_OPTIONS        = "tools.options";
    
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
    
    function handleStart() {
        brackets.app.callCommand("app", "nodeStart", [], true, function (err, res) {
            var title, dialog, message;
            if (err) {
                dialog  = Dialogs.DIALOG_ID_ERROR;
                title   = Strings.ERROR_NODE_START_TITLE;
                message = err.message;
            } else {
                livePort = res.port;
                dialog  = Dialogs.DIALOG_ID_INFO;
                title   = Strings.INFO_NODE_START_TITLE;
                message = StringUtils.format(Strings.INFO_NODE_START_MESSAGE, livePort);
            }
            Dialogs.showModalDialog(
                dialog,
                title,
                message
            );
        });
    }
    
    function setLocation(win, url, delay) {
        if (delay) {
            window.setTimeout(function () {
                win.location = url;
            }, 1000);
        } else {
            win.location = url;
        }
    }
    
    function handleBrowse() {
        
        function openWindow(delay) {
            var loc = window.location,
                url = loc.protocol + "//" + loc.hostname + ":" + livePort;
            
            setLocation(liveWin, url, delay);
        }
        
        if (!liveWin || liveWin.closed) {
            liveWin = window.open("", "liveWin");
            liveWin.document.body.innerHTML = Strings.WAITING_SERVER;
        }
        
        if (livePort) {
            openWindow(false);
        } else {
            brackets.app.callCommand("app", "nodeStart", [], true, function (err, res) {
                var response = err || res;
                if (response.port) {
                    livePort = response.port;
                    openWindow(true);
                } else {
                    Dialogs.showModalDialog(
                        Dialogs.DIALOG_ID_ERROR,
                        Strings.ERROR_NODE_START_TITLE,
                        err.message
                    );
                }
            });
        }
    }
    
    function stopHandler(port, debug) {
        if (port) {
            brackets.app.callCommand("app", "nodeStop", [port], true, function (err, res) {
                var title, dialog, message;
                if (err) {
                    dialog  = Dialogs.DIALOG_ID_ERROR;
                    title   = Strings.ERROR_NODE_STOP_TITLE;
                    message = err.message;
                } else {
                    dialog  = Dialogs.DIALOG_ID_INFO;
                    title   = Strings.INFO_NODE_STOP_TITLE;
                    message = Strings.INFO_NODE_STOP_MESSAGE;
                    
                    if (debug) {
                        debugAppPort = null;
                        debugPort = null;
                        
                        if (debuggerWin) {
                            debuggerWin.close();
                            debuggerWin = null;
                        }
                    } else {
                        livePort = null;
                    }
                    
                    if (liveWin) {
                        liveWin.close();
                        liveWin = null;
                    }
                }
                
                Dialogs.showModalDialog(
                    dialog,
                    title,
                    message
                );
            });
        } else {
            Dialogs.showModalDialog(
                Dialogs.DIALOG_ID_ERROR,
                Strings.ERROR_NODE_STOP_TITLE,
                Strings.ERROR_SERVER_NOT_STARTED
            );
        }
    }
    
    function debugHandler(cmd) {
        
        function openDebugWindows(delay) {
            var loc = window.location,
                debuggerUrl = loc.protocol + "//" + loc.hostname + ":" + debuggerPort + "/debug?port=" + debugPort,
                appUrl = loc.protocol + "//" + loc.hostname + ":" + debugAppPort;
            
            setLocation(liveWin, appUrl, delay);
            setLocation(debuggerWin, debuggerUrl, delay);
        }
        
        function startAndOpen() {
            if (debuggerPort && debugPort && debugAppPort) {
                openDebugWindows(false);
            } else {
                brackets.app.callCommand("app", cmd, [], true, function (err, res) {
                    var response = err || res;
                    if (response.port) {
                        debugAppPort = response.port;
                        debugPort = response.debugPort;
                        debuggerPort = response.debuggerPort;
                        openDebugWindows(true);
                    } else {
                        Dialogs.showModalDialog(
                            Dialogs.DIALOG_ID_ERROR,
                            Strings.ERROR_NODE_START_TITLE,
                            err.message
                        );
                    }
                });
            }
        }
        
        function prepareLiveWin(cb) {
            if (!liveWin || liveWin.closed) {
                liveWin = window.open("", "liveWin");
                liveWin.document.body.innerHTML = Strings.WAITING_SERVER;
                $(liveWin.document).ready(cb);
            } else {
                cb();
            }
        }
        
        function prepareDebuggerWin(cb) {
            if (!debuggerWin || debuggerWin.closed) {
                debuggerWin = window.open("", "debuggerWin");
                debuggerWin.document.body.innerHTML = Strings.WAITING_SERVER;
                $(debuggerWin.document).ready(cb);
            } else {
                cb();
            }
        }
        
        prepareLiveWin(function () {
            prepareDebuggerWin(function () {
                startAndOpen();
            });
        });
    }
    
    function handleDebug() {
        debugHandler("nodeStartDebug");
    }
    
    function handleDebugBrk() {
        debugHandler("nodeStartDebugBrk");
    }
    
    function handleStopDebug() {
        stopHandler(debugAppPort, true);
    }
    
    function handleStop() {
        stopHandler(livePort, false);
    }
    
    function handleOptions() {
        alert("Error: Options not implemented yet");
    }
    
    function stripTrailingSlash(str) {
        if (str.substr(-1) === '/') {
            return str.substr(0, str.length - 1);
        }
        return str;
    }
    
    exports.loadExtesions = function () {
        brackets.app.callCommand("app", "getExtesions", [], true, function (err, res) {
            var baseUrl = stripTrailingSlash(window.location.pathname) + "/extensions.svc/",
                i,
                val,
                lIdx,
                fIdx,
                extName,
                paths;
            
            if (err) {
                Dialogs.showModalDialog(
                    Dialogs.DIALOG_ID_ERROR,
                    Strings.ERROR_EXT_LOAD_FAILED,
                    err.message
                );
            } else {
                for (i = 0; i < res.length; i++) {
                    paths = {};
                    val = res[i];
                    fIdx = val.indexOf("/");
                    lIdx = val.lastIndexOf("/");
                    extName = val.substr(0, fIdx);
                    paths[extName] = val.substr(0, lIdx);
                    
                    try {
                        requirejs.config({
                            baseUrl: baseUrl,
                            paths: paths
                        })([baseUrl + val]);
                    } catch (ex) {
                        console.log(ex);
                    }
                }
            }
        });
    };
        
    CommandManager.register(Strings.CMD_DELETE,     exports.FILE_DELETE,        handleDelete);
    CommandManager.register(Strings.CMD_BROWSE,     exports.PROJECT_LIVE,       handleBrowse);
    CommandManager.register(Strings.CMD_START,      exports.NODE_START,         handleStart);
    CommandManager.register(Strings.CMD_STOP,       exports.NODE_STOP,          handleStop);
    CommandManager.register(Strings.CMD_DEBUG,      exports.NODE_DEBUG,         handleDebug);
    CommandManager.register(Strings.CMD_DEBUG_BRK,  exports.NODE_DEBUG_BRK,     handleDebugBrk);
    CommandManager.register(Strings.CMD_STOP_DEBUG, exports.NODE_STOP_DEBUG,    handleStopDebug);
    CommandManager.register(Strings.CMD_OPTIONS,    exports.TOOLS_OPTIONS,      handleOptions);
});