# winston-logflare

This module provides a transport for winston logger that forwards messages to [Logflare][logflare] app.

## Installation

```bash
$ npm install winston-logflare
```

# Usage example

```js
const winston = require("winston")
const LogflareTransport = require("winston-logflare")

const apiKey = "..."
const sourceToken = "..."

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: {env: "staging"},
    transports: [
        new LogflareTransport({
            apiKey,
            sourceToken,
            batchFlushInterval: 1000, // optional config setting
        }),
    ],
})

logger.log("info", "info message", {property: "value"})
logger.log("error", "Error occured!")
```

## License

Licensed under [MIT](./LICENSE).

[logflare]: https://logflare.app/