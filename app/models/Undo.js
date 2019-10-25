'use strict'

/**
 * Module Dependencies
*/

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;
 
let UndoSchema = new Schema({
  
  undoId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  
  listId: {
    type: String,
    default: '',
  },

  itemId: {
    type: String,
    default: '',
  },

  subItemId: {
    type: String,
    default: '',
  },

  key: {
    type: String,
    default: '',
  },
  
  itemValues:[],
  
  createdOn: {
    type: Date,
    default: Date.now()
  },

})


mongoose.model('Undo', UndoSchema);