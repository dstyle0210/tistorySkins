import path from "path";
import express from "express";




function start(){
    const app = express();
    const PORT = 3000;

    app.set("view engine", "ejs");
    app.set("views", path.join(process.cwd(), "dist"));

    app.use("/", express.static(path.join(process.cwd(), "dist")));

    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
};

export default start;