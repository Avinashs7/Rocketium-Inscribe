const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['rectangle', 'circle', 'text']
    },
    x: { 
        type: Number, 
        required: true 
    },
    y: { 
        type: Number, 
        required: true 
    },
    width: { 
        type: Number,
        required: function() { return this.type === 'rectangle'; }
    },
    height: { 
        type: Number,
        required: function() { return this.type === 'rectangle'; }
    },
    radius: {
        type: Number,
        required: function() { return this.type === 'circle'; }
    },
    text: {
        type: String,
        required: function() { return this.type === 'text'; }
    },
    font: {
        type: String,
        required: function() { return this.type === 'text'; }
    },
    fontSize: {
        type: Number,
        required: function() { return this.type === 'text'; }
    },
    color: { 
        type: String, 
        default: '#000000' 
    }
});

const drawingSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    elements: [elementSchema],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Drawing = mongoose.model('Drawing', drawingSchema);

module.exports = Drawing;