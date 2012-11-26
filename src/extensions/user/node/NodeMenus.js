/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, unescape, window */

define(function (require, exports, module) {
    "use strict";
    
    var Commands                = brackets.getModule("command/Commands"),
        CommandManager          = brackets.getModule("command/CommandManager"),
        Menus                   = brackets.getModule("command/Menus"),
        KeyBindingManager       = brackets.getModule("command/KeyBindingManager"),
        StringUtils             = brackets.getModule("utils/StringUtils"),
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
    
    // Add new menu items
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(NodeCommands.FILE_DELETE, "Ctrl-Alt-D", Menus.AFTER, Commands.FILE_CLOSE_ALL);
    var cmenu = Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU);
    cmenu.addMenuItem(NodeCommands.FILE_DELETE);
    
    // Add Node menu
    menu = Menus.addMenu(Strings.NODE_MENU, NodeCommands.NODE_MENU, Menus.AFTER, Menus.AppMenuBar.DEBUG_MENU);
    menu.addMenuItem(NodeCommands.NODE_BROWSE, "Ctrl-B");
    menu.addMenuItem(NodeCommands.NODE_SERACH_NPM);
    menu.addMenuItem(NodeCommands.NODE_MODULES);
    menu.addMenuItem(NodeCommands.NODE_START);
    menu.addMenuItem(NodeCommands.NODE_STOP);
    menu.addMenuItem(NodeCommands.NODE_TERMINAL);
    menu.addMenuItem(NodeCommands.NODE_OPTIONS);
});