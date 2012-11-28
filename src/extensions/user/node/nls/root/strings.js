// English - root strings

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define */

define({
    /**
     * Menu and commands
     */
    "CMD_DELETE"                : "Delete",
        
    "NODE_MENU"                 : "Node",
    "CMD_BROWSE"                : "Browse Live",
    "CMD_SERACH_NPM"            : "Search NPM",
    "CMD_MODULES"               : "Manage Modules",
    "CMD_START"                 : "Start Live Server",
    "CMD_STOP"                  : "Stop Live Server",
    "CMD_RESTART"               : "Restart Live Server",
    "CMD_TERMINAL"              : "Text Terminal",
    "CMD_OPTIONS"               : "Options",
    
    /**
     * Errors
     */
    "ERROR_REJECTED_REQUEST"    : "A request to <strong>\"{0}\"</strong> server was rejected. Please make sure the server is up and running.",
    "ERROR_SERVER_ERROR"        : "The server returned an error; status: {0}, state: {1}",
    "ERROR_DEL_FILE_TITLE"      : "Error Deleting File",
    "ERROR_DEL_FILE_MESSAGE"    : "<p>An error has occurred while deleting file: \"{0}\";</p>Error Message: <strong>{1}</strong>",
    "ERROR_DEL_FOLDER_TITLE"    : "Error Deleting Folder",
    "ERROR_DEL_FOLDER_MESSAGE"  : "<p>An error has occurred while deleting folder: \"{0}\";</p><strong>Error Message:</strong> {1}",
    "ERROR_CODE_EPERM"          : "Operation not permitted. Please check the permissions of the file or directory and make sure it is not read-only or locked by other process.",
    "ERROR_NODE_START_TITLE"    : "Could Not Start Server",
    "ERROR_NODE_STOP_TITLE"     : "Error Stopping Server",
    
    /**
     * Dialogs
     */
    "DELETE_FOLDER_TITLE"       : "Delete Folder",
    "DELETE_FOLDER_MESSAGE"     : "<p>Are you sure you want to permanently delete this folder and all subfolders and files?</p><strong>{0}</strong>",
    "DELETE_FILE_TITLE"         : "Delete File",
    "DELETE_FILE_MESSAGE"       : "<p>Are you sure you want to permanently delete this file?</p><strong>{0}</strong>",
    "INFO_NODE_START_TITLE"     : "Live Server Started",
    "INFO_NODE_START_MESSAGE"   : "Listening on port: {0}",
    "INFO_NODE_STOP_TITLE"      : "Live Server",
    "INFO_NODE_STOP_MESSAGE"    : "Server is stopped."
});