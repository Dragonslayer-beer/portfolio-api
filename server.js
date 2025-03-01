const morgan = require('morgan')
const express = require("express")

const cors = require("cors")
const path = require("path")

const app = express()
const { handleError } = require("./middleware/ErrorHandler");


const corsOption = {
    origin: "*", // ["http://x.com", "http://b.com"]
    optionsSuccessStatus: 200
}

app.use(cors(corsOption))

morgan.token('splitter', (req) => {
    return "\x1b[36m--------------------------------------------\x1b[0m\n";
});
morgan.token('statusColor', (req, res, args) => {
    // get the status code if response written
    var status = (typeof res.headersSent !== 'boolean' ? Boolean(res.header) : res.headersSent)
        ? res.statusCode
        : undefined

    // get status color
    var color = status >= 500 ? 31 // red
        : status >= 400 ? 33 // yellow
            : status >= 300 ? 36 // cyan
                : status >= 200 ? 32 // green
                    : 0; // no color

    return '\x1b[' + color + 'm' + status + '\x1b[0m';
});
app.use(morgan(`:splitter\x1b[33m:method\x1b[0m \x1b[36m:url\x1b[0m :statusColor :response-time ms - length|:res[content-length]`));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.resolve(__dirname + '/public')));


app.use("/images", express.static(path.join(__dirname, "./uploaded")))




const public_router = require('./routes/public');
app.use('/', public_router)

const api_router = require('./routes/api');
app.use('/api', api_router)


app.use((err, req, res, next) => {
  handleError(err, req, res, next);
});

const host = '0.0.0.0';
const port = process.env.PORT || 4000;

const server = app.listen(port, host , async function () {
    const serverInfo = server.address();

    console.log("Server running on http://" + serverInfo.address + ":" + serverInfo.port)
})