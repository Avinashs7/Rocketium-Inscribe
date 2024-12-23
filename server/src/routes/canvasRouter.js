const { addCanvas,fetchCanvas, updateCanvas, clearCanvas, fetchCanvasById } = require('../controllers/canvas.controller');
const {Router}=require("express")
const router=Router()

router.post('/canvas',addCanvas);
router.get('/canvas/:canvas_name',fetchCanvas);
router.patch('/canvas/:id',updateCanvas);
router.delete('/canvas/:id',clearCanvas);
router.get('/canvas/id/:id',fetchCanvasById);

module.exports=router;