/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, unescape, window */

define(function (require, exports, module) {
    "use strict";
    
    var Commands                = brackets.getModule("command/Commands"),
        CommandManager          = brackets.getModule("command/CommandManager"),
        Menus                   = brackets.getModule("command/Menus"),
        KeyBindingManager       = brackets.getModule("command/KeyBindingManager");
    
    function setup() {
        var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
        var cmd = CommandManager.get(Commands.FILE_OPEN_FOLDER);
        cmd._enabled = false;
        
        menu.removeMenuItem(cmd);
        
        cmd = CommandManager.get(Commands.FILE_OPEN);
        menu.removeMenuItem(cmd);
    }
    
    exports.setup = setup;
});