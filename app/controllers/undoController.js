const mongoose = require('mongoose');
const response = require('../libs/responseLib')
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib')
const shortid = require('shortid');
const time = require('../libs/timeLib');


/* Models */
const UndoModel = mongoose.model('Undo')
const ItemModel = mongoose.model('Item')


// start addUndoFunction 
/* params: key , value */

let addUndoFunction = (req, res) => {
    console.log(req.body)

    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.listId && req.body.key) {
                resolve(req)
            } else {
                logger.error('parameter Missing During Undo Creation', 'UndoController: addUndoFunctio()', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }// end validate user input 

    let findItems = () => {
        return new Promise((resolve, reject) => {
            if (req.body.key == 'Item Add') {
                resolve(null)
            }
            else {
                ItemModel.findOne({ 'itemId': req.body.itemId })
                    .select()
                    .lean()
                    .exec((err, ItemDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'Item Controller: getItemDetails', 10)
                            let apiResponse = response.generate(true, 'Failed To Find Items', 500, null)
                            reject(apiResponse)
                        } else if (check.isEmpty(ItemDetails)) {
                            logger.info('No Item Found', 'Item  Controller:getItemDetailsFunction')
                            let apiResponse = response.generate(true, 'No Item Found', 404, null)
                            reject(apiResponse)
                        } else {
                            let apiResponse = response.generate(false, 'Item Found', 200, ItemDetails)
                            resolve(ItemDetails)
                        }
                    })
            }
        })
    }// end findItems

    let updateUndo = (ItemDetails) => {
        return new Promise((resolve, reject) => {
            let newUndo = new UndoModel({
                UndoId: shortid.generate(),
                listId: req.body.listId,
                key: req.body.key,
                createdOn: time.now(),
                itemId: req.body.itemId,
                subItemId: req.body.subItemId
            })

            newUndo.itemValues = ItemDetails

            newUndo.save((err, newItem) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'UndoController: addItem', 10)
                    let apiResponse = response.generate(true, 'Failed to add Undo Item', 500, null)
                    reject(apiResponse)
                } else {
                    let newItemObj = newItem.toObject();
                    resolve(newItemObj)
                }
            })

        })
    }// end updateUndo function


    validateUserInput(req, res)
        .then(findItems)
        .then(updateUndo)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Undo item Added', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}// end addUndoFunction 

// start deleteUndoFunction

let deleteUndoFunction = (req, res) => {

    let findUndo = () => {
        return new Promise((resolve, reject) => {
            UndoModel.findOne({ 'listId': req.body.listId }).sort({ $natural: -1 })
                .select()
                .lean()
                .exec((err, UndoDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'Undo Controller: v', 10)
                        let apiResponse = response.generate(true, 'Failed To Find Item Details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(UndoDetails)) {
                        logger.info('No Histoy Found', 'Undo  Controller:findUndo')
                        let apiResponse = response.generate(true, 'No Undo Found', 404, null)
                        reject(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'Undo Found', 200, UndoDetails)
                        resolve(UndoDetails)
                    }
                })
        })
    }// end findUndo

    let updateUndo = (UndoDetails) => {
        return new Promise((resolve, reject) => {

            UndoModel.findOneAndRemove({ 'UndoId': UndoDetails.UndoId }).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'Item Controller: deleteItem', 10)
                    let apiResponse = response.generate(true, 'Failed To delete Item', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Item Found', 'Item Controller: deleteItem')
                    let apiResponse = response.generate(true, 'No Item Found', 404, null)
                    reject(apiResponse)
                } else {

                    let apiResponse = response.generate(false, 'Undo Deleted', 200, UndoDetails)
                    resolve(apiResponse)
                }
            });// end find and remove

        })
    }// end updateUndo function

    findUndo(req, res)
        .then(updateUndo)
        .then((resolve) => {
            //let apiResponse = response.generate(false, 'Undo Deleted', 200, resolve)
            res.send(resolve)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}// end deleteUndoFunction 


let getUndoFunction = (req, res) => {

    let findUndo = () => {
        return new Promise((resolve, reject) => {
            UndoModel.find().sort({ $natural: -1 })
                .select()
                .lean()
                .exec((err, UndoDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'Undo Controller: v', 10)
                        let apiResponse = response.generate(true, 'Failed To Find Item Details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(UndoDetails)) {
                        logger.info('No Histoy Found', 'Undo  Controller:findUndo')
                        let apiResponse = response.generate(true, 'No Undo Found', 404, null)
                        reject(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'Undo Found', 200, UndoDetails)
                        resolve(apiResponse)
                    }
                })
        })
    }// end findUndo

    findUndo(req, res)
        .then((resolve) => {

            res.send(resolve)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}// end deleteUndoFunction 

module.exports = {
    addUndoFunction: addUndoFunction,
    deleteUndoFunction: deleteUndoFunction,
    getUndoFunction: getUndoFunction
}// end exports