// Prints when each streamed widget chunk reaches the client; proves independent, timing-driven arrival.
const t0 = performance.now();
const res = await fetch(process.argv[2] ?? "http://localhost:3000");
const seen = new Set();

for await (const chunk of res.body) {
    for (const [, ms] of Buffer.from(chunk).toString().matchAll(/done \+(\d+)ms/g)) {
        if (!seen.has(ms)) console.log(`+${Math.round(performance.now() - t0)}ms  widget with server done +${ms}ms arrived`), seen.add(ms);
    }
}