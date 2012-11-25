/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, unescape, window */

define(function (require, exports, module) {
    "use strict";
    
    var Commands                = brackets.getModule("command/Commands"),
        CommandManager          = brackets.getModule("command/CommandManager"),
        Menus                   = brackets.getModule("command/Menus"),
        KeyBindingManager       = brackets.getModule("command/KeyBindingManager"),
        DocumentManager         = brackets.getModule("document/DocumentManager"),
        ProjectManager          = brackets.getModule("project/ProjectManager"),
        Dialogs                 = brackets.getModule("widgets/Dialogs"),
        StringUtils             = brackets.getModule("utils/StringUtils"),
        Strings                 = require("strings");
    
    /**
     * List of constants for command IDs.
     */
    // FILE
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
            
    function removeMenuItemAndKeyBindings(menuId, commandId) {
        var menu = Menus.getMenu(menuId),
            cmd = CommandManager.get(commandId),
            bindings = KeyBindingManager.getKeyBindings(commandId);
        
        bindings.forEach(function (value, index) {
            KeyBindingManager.removeBinding(value.key);
        });
        menu.removeMenuItem(commandId);
    }
    
    function getErrorMessage(errorCode) {
        if (errorCode) {
            var message = Strings["ERROR_CODE_" + errorCode];
            if (message) {
                return message;
            }
        }
        return errorCode;
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
    
    function updateNavigation(entry) {
        ProjectManager.showInTree(entry)
            .done(function (selected) {
                var treeAPI = $.jstree._reference($("#project-files-container"));
                treeAPI.remove(selected);
            });
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
        brackets.app.nodeBrowse();
    }
    
    function handleSearchNPM() {
        brackets.app.nodeSearchNPM();
    }
    
    function handleModules() {
        brackets.app.nodeModules();
    }
    
    function handleStart() {
        brackets.app.nodeStart();
    }
    
    function handleStop() {
        brackets.app.nodeStop();
    }
    
    function handleTerminal() {
        brackets.app.nodeTerminal();
    }
    
    function handleOptions() {
        brackets.app.nodeOptions();
    }
    
    // Remove menu items and key bindings that don’t make sense when Brackets is used in client / server scenario.
    removeMenuItemAndKeyBindings(Menus.AppMenuBar.FILE_MENU, Commands.FILE_OPEN);
    removeMenuItemAndKeyBindings(Menus.AppMenuBar.FILE_MENU, Commands.FILE_OPEN_FOLDER);
    
    // Add new menu items
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    CommandManager.register("Delete", exports.FILE_DELETE, handleDelete);
    
    menu.addMenuItem(exports.FILE_DELETE, "Ctrl-Alt-D", Menus.AFTER, Commands.FILE_CLOSE_ALL);
    var cmenu = Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU);
    cmenu.addMenuItem(exports.FILE_DELETE);
    
    
    // Add Node menu
    menu = Menus.addMenu(Strings.NODE_MENU_NAME, exports.NODE_MENU, Menus.AFTER, Menus.AppMenuBar.DEBUG_MENU);
    
    // Add Browse menu item
    CommandManager.register(Strings.NODE_BROWSE, exports.NODE_BROWSE, handleBrowse);
    menu.addMenuItem(exports.NODE_BROWSE, "Ctrl-B");
    
    // Add Serach NPM menu item
    CommandManager.register(Strings.NODE_SERACH_NPM, exports.NODE_SERACH_NPM, handleSearchNPM);
    menu.addMenuItem(exports.NODE_SERACH_NPM);
    
    // Add Modules menu item
    CommandManager.register(Strings.NODE_MODULES, exports.NODE_MODULES, handleModules);
    menu.addMenuItem(exports.NODE_MODULES);
    
    // Add Start/Restart menu item
    CommandManager.register(Strings.NODE_START, exports.NODE_START, handleStart);
    menu.addMenuItem(exports.NODE_START);
    
    // Add Stop menu item
    CommandManager.register(Strings.NODE_STOP, exports.NODE_STOP, handleStop);
    menu.addMenuItem(exports.NODE_STOP);
    
    // Add Terminal menu item
    CommandManager.register(Strings.NODE_TERMINAL, exports.NODE_TERMINAL, handleStop);
    menu.addMenuItem(exports.NODE_TERMINAL);
    
    // Add Options menu item
    CommandManager.register(Strings.NODE_OPTIONS, exports.NODE_OPTIONS, handleStop);
    menu.addMenuItem(exports.NODE_OPTIONS);
});