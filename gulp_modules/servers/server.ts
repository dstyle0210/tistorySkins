import { createCanvas } from "canvas";
import path from "path";
import https from "https";
import express from "express";
import selfsigned from "selfsigned";

async function start() {
    const app = express();
    const PORT = 3000;

    // 로컬 개발용 셀프사인 인증서 생성
    const pems = await selfsigned.generate(
        [{ name: "commonName", value: "localhost" }],
        { keySize: 2048, algorithm: "sha256" }
    );

    app.set("view engine", "ejs");
    app.set("views", path.join(process.cwd(), "dist"));

    // 더미 이미지: /dummy/200x200, /dummy/100x50 등
    app.get("/dummy/:size", (req, res) => {
        const [w, h] = (req.params.size || "200x200").split("x").map((n) => parseInt(n, 10) || 200);
        const width = Math.min(2000, Math.max(1, w));
        const height = Math.min(2000, Math.max(1, h));

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // 배경
        ctx.fillStyle = "#e0e0e0";
        ctx.fillRect(0, 0, width, height);
        // 테두리
        ctx.strokeStyle = "#999";
        ctx.lineWidth = Math.max(1, Math.min(width, height) / 100);
        ctx.strokeRect(0, 0, width, height);
        // 크기 텍스트
        const text = `${width} × ${height}`;
        ctx.fillStyle = "#666";
        ctx.font = `bold ${Math.min(width, height) / 8}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, width / 2, height / 2);

        res.setHeader("Content-Type", "image/png");
        canvas.createPNGStream().pipe(res);
    });

    app.use("/", express.static(path.join(process.cwd(), "dist")));

    const server = https.createServer({ key: pems.private, cert: pems.cert },app);

    server.listen(PORT, () => {
        console.log(`Server is running at https://localhost:${PORT}`);
        console.log(
            "Note: 브라우저에서 셀프사인 인증서 경고가 나오면 '고급' → '안전하지 않음(으)로 이동'을 선택하면 됩니다."
        );
    });
}

export default start;
