/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, unescape, window */

define(function (require, exports, module) {
    "use strict";
    
    var Commands                = brackets.getModule("command/Commands"),
        CommandManager          = brackets.getModule("command/CommandManager"),
        Menus                   = brackets.getModule("command/Menus"),
        KeyBindingManager       = brackets.getModule("command/KeyBindingManager"),
        Strings                 = require("strings"),
        NodeCommands            = require("NodeCommands");
    
    function removeMenuItemAndKeyBindings(menuId, commandId) {
        var menu = Menus.getMenu(menuId),
            cmd = CommandManager.get(commandId),
            bindings = KeyBindingManager.getKeyBindings(commandId);
        
        bindings.forEach(function (value, index) {
            KeyBindingManager.removeBinding(value.key);
        });
        menu.removeMenuItem(commandId);
    }
        
    // Remove menu items and key bindings that don’t make sense when Brackets is used in client / server scenario.
    removeMenuItemAndKeyBindings(Menus.AppMenuBar.FILE_MENU, Commands.FILE_OPEN);
    removeMenuItemAndKeyBindings(Menus.AppMenuBar.FILE_MENU, Commands.FILE_OPEN_FOLDER);
    
// Apparently there is no way to remove menu divers and therefore this menu items are commented in the Brackets source.
//    removeMenuItemAndKeyBindings(Menus.AppMenuBar.FILE_MENU, Commands.FILE_LIVE_FILE_PREVIEW);
//    removeMenuItemAndKeyBindings(Menus.AppMenuBar.FILE_MENU, Commands.FILE_LIVE_HIGHLIGHT);
//    removeMenuItemAndKeyBindings(Menus.AppMenuBar.FILE_MENU, Commands.FILE_PROJECT_SETTINGS);
//    removeMenuItemAndKeyBindings(Menus.AppMenuBar.FILE_MENU, Commands.FILE_INSTALL_EXTENSION);
    
    // Add new menu items
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(NodeCommands.FILE_DELETE, "Ctrl-Alt-D", Menus.AFTER, Commands.FILE_CLOSE_ALL);
    var cmenu = Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU);
    cmenu.addMenuItem(NodeCommands.FILE_DELETE);
    
    // Add Project menu
    
    if (!Menus.AppMenuBar.PROJECT_MENU) {
        Menus.AppMenuBar.PROJECT_MENU = "project-menu";
    }
    
    menu = Menus.addMenu(Strings.PROJECT_MENU, Menus.AppMenuBar.PROJECT_MENU, Menus.AFTER, Menus.AppMenuBar.NAVIGATE_MENU);
    menu.addMenuItem(NodeCommands.PROJECT_LIVE, "Alt-Shift-L");
    menu.addMenuItem(NodeCommands.NODE_START);
    menu.addMenuItem(NodeCommands.NODE_STOP);
    menu.addMenuItem(NodeCommands.NODE_DEBUG);
    menu.addMenuItem(NodeCommands.NODE_DEBUG_BRK);
    menu.addMenuItem(NodeCommands.NODE_STOP_DEBUG);
    
    // Add Tools menu
    
    if (!Menus.AppMenuBar.TOOLS_MENU) {
        Menus.AppMenuBar.TOOLS_MENU = "tools-menu";
    }
    
    menu = Menus.addMenu(Strings.TOOLS_MENU, Menus.AppMenuBar.TOOLS_MENU, Menus.AFTER, Menus.AppMenuBar.PROJECT_MENU);
    menu.addMenuItem(NodeCommands.TOOLS_OPTIONS);
    
    NodeCommands.loadExtesions();
});