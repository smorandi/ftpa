System.config({
    packages: {
        app: {
            format: 'register',
            defaultExtension: 'js'
        },
        "/angular2": {"defaultExtension": false}
    },
    map: {
        "/primeng": "node_modules/primeng"
    }
});

// System.get("/app/main.js")

System.import("app/main.js").then(m => console.log(m)).catch(
    console.error.bind(console)
);