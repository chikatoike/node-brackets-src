/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, unescape, window */

define(function (require, exports, module) {
    "use strict";
    
    var Commands                = brackets.getModule("command/Commands"),
        CommandManager          = brackets.getModule("command/CommandManager"),
        Menus                   = brackets.getModule("command/Menus"),
        KeyBindingManager       = brackets.getModule("command/KeyBindingManager");
            
    function removeMenuItemAndKeyBindings(menuId, commandId) {
        var menu = Menus.getMenu(menuId),
            cmd = CommandManager.get(commandId),
            bindings = KeyBindingManager.getKeyBindings(commandId);
        
        bindings.forEach(function (value, index) {
            KeyBindingManager.removeBinding(value.key);
        });
        menu.removeMenuItem(cmd);
    }
    
    // Remove menu items and key bindings that don’t make sense when Brackets is used in client / server scenario.
    removeMenuItemAndKeyBindings(Menus.AppMenuBar.FILE_MENU, Commands.FILE_OPEN);
    removeMenuItemAndKeyBindings(Menus.AppMenuBar.FILE_MENU, Commands.FILE_OPEN_FOLDER);
});