const express = require('express');
const router = express.Router();
const UndoController = require("../controllers/undoController");
const appConfig = require("../../config/appConfig")
const auth = require('../middlewares/auth')


module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/Undo`;

    // params: key(String), value(Object)

    app.post(`${baseUrl}/addUndo`, auth.isAuthorized, UndoController.addUndoFunction);
    /**
     * @apiGroup Undo
     * @apiVersion  1.0.0
     * @api {post} /api/v1/Undo/addUndo api to Add Undo.
     *
     * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
     * @apiParam {string} listId Id of the list. (body params) (required)
     * @apiParam {string} itemId Id of the Item. (body params) (required)
     * @apiParam {string} subItemId Id of the Sub Item. (body params) (Optional)
     * @apiParam {string} key Action of the Undo. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Undo Added",
            "status": 200,
            "data": [
                {
                    "_id": "5bc88c95ecfe471824759870",
                    "createdOn": "2019-10-18T13:37:25.000Z",
                    "itemValues": null,
                    "key": "Item Add",
                    "subItemId": "undefined",
                    "itemId": "S1RqhZ8jQ",
                    "listId": "SkHeBWUo7",
                    "UndoId": "B1xCqnWIiX",
                    "__v": 0
                }
            ]
        }
    */

    app.post(`${baseUrl}/deleteUndo`, auth.isAuthorized, UndoController.deleteUndoFunction);

    /**
     * @apiGroup Undo
     * @apiVersion  1.0.0
     * @api {post} /api/v1/Undo/deleteUndo api to Delete Undo(Latest Object will be deleted).
     *
     * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
     * @apiParam {string} listId Id of the List. (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Undo Deleted",
            "status": 200,
            "data": [
                {
                    "_id": "5bc88c95ecfe471824759870",
                    "createdOn": "2019-10-18T13:37:25.000Z",
                    "itemValues": null,
                    "key": "Item Add",
                    "subItemId": "undefined",
                    "itemId": "S1RqhZ8jQ",
                    "listId": "SkHeBWUo7",
                    "UndoId": "B1xCqnWIiX",
                    "__v": 0
                }
            ]
        }
    */

    app.post(`${baseUrl}/getUndo`, auth.isAuthorized, UndoController.getUndoFunction);

}


/** Run this command : apidoc -i app/routes/ -o apidoc/ */
