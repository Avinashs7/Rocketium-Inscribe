const asyncHandler=require('../utils/AsyncHandler.js');
const ApiResponse=require('../utils/ApiResponse.js');
const ApiError=require('../utils/ApiError.js');
const logger=require('../utils/Logger.js');
const Drawing =require('../models/drawings.model.js')
const mongoose=require('mongoose');


const addCanvas=asyncHandler(async(req,res)=>{
    const {name}=req.body;
    if(!name)
        throw new ApiError(405,'Canvas name is not present');
    const temp=await Drawing.findOne({name:name});

    if(temp)
        throw new ApiError(404,'Canvas already exists');

    const canvas=await Drawing.create({name:name});

    if(!canvas)
        throw new ApiError(500,'Internal server error');

    return res.send(new ApiResponse(200,canvas,'Canvas created successfully'));

});

const fetchCanvas=asyncHandler(async(req,res)=>{
    const {canvas_name}=req.params;
    
    if(!canvas_name)
        throw new ApiError(405,'Canvas name is not present');

    const canvas=await Drawing.findOne({name:canvas_name});
    if(!canvas)
        throw new ApiError(500,'Internal server error');

    return res.send(new ApiResponse(302,canvas,'Canvas fetched successfully'));
});

const fetchCanvasById=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    
    if(!id)
        throw new ApiError(405,'Canvas name is not present');

    const canvas=await Drawing.findById(new mongoose.Types.ObjectId(id));
    if(!canvas)
        throw new ApiError(500,'Internal server error');

    return res.send(new ApiResponse(302,canvas,'Canvas fetched by id successfully'));
});

const updateCanvas=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    
    const canvas=await Drawing.findById(new mongoose.Types.ObjectId(id));

    if(!canvas)
        throw new ApiError(404,'Canvas is not present');

    const newElement = {
        type: req.body.type,
        x: Number(req.body.x), 
        y: Number(req.body.y), 
        width: req.body.width ? Number(req.body.width) : undefined, 
        height: req.body.height ? Number(req.body.height) : undefined, 
        radius: req.body.radius ? Number(req.body.radius) : undefined, 
        text: req.body.text,
        font: req.body.font,
        fontSize: req.body.fontSize ? Number(req.body.fontSize) : undefined, 
        color: req.body.color || '#000000',
    };
    Object.keys(newElement).forEach((key) => {
        if (newElement[key] === undefined) {
            delete newElement[key];
        }
    });

    const response=await Drawing.findByIdAndUpdate( 
        new mongoose.Types.ObjectId(id),
        { 
            $push: {elements:newElement}
        },
        {
            new: true
        }
    )

    if(!response)
        throw new ApiError(500,'Internal server error');

    return res.send(new ApiResponse(200,response,'Appended new element'));
    
});

const clearCanvas=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    
    const canvas=await Drawing.findById(new mongoose.Types.ObjectId(id));

    if(!canvas)
        throw new ApiError(404,'Canvas is not present');

    const response=await Drawing.findByIdAndUpdate( 
        new mongoose.Types.ObjectId(id),
        { 
            $set: { 
                elements: []
            } 
        },
        {
            new: true
        }
    )

    if(!response)
        throw new ApiError(500,'Internal server error');

    return res.send(new ApiResponse(200,response,'Canvas elements are cleared'));
});

module.exports={
    addCanvas,
    fetchCanvas,
    updateCanvas,
    clearCanvas,
    fetchCanvasById
}