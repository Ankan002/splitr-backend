"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "startServer", {
    enumerable: true,
    get: ()=>startServer
});
const _express = _interopRequireDefault(require("express"));
const _cors = _interopRequireDefault(require("cors"));
const _expressFileupload = _interopRequireDefault(require("express-fileupload"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const startServer = ()=>{
    const app = (0, _express.default)();
    app.use((0, _cors.default)());
    app.use((0, _expressFileupload.default)({
        useTempFiles: true
    }));
    app.get("/", (req, res)=>{
        return res.status(200).json({
            success: true,
            message: "Welcome to Splitr API!!"
        });
    });
    app.listen(process.env["PORT"], ()=>console.log(`App is running at ${process.env["PORT"]}`));
};
