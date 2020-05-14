import _ from "lodash"
import {LogflareHttpClient, LogflareTransport} from "logflare-transport-core"
import Transport from "winston-transport"

interface Info {
    message: string
    level: string
    metadata: object
}

function winstonToLogflareMapper(info: Info) {
    const {message, level, ...metadata} = info
    const cleanedMetadata = _(metadata)
        .toPairs()
        .reject(([key, value]) => _.isSymbol(key))
        .fromPairs()
        .value()

    return {
        message,
        metadata: {...cleanedMetadata, level},
        timestamp: new Date().toISOString(),
    }
}

class WinstonLogflareTransport extends Transport implements LogflareTransport {
    readonly httpClient: LogflareHttpClient

    constructor(opts: any) {
        super(opts)
        this.httpClient = new LogflareHttpClient(opts)
    }

    log(info: Info, callback: () => void) {
        setImmediate(() => {
            this.emit("logged", info)
        })

        const logEvent = winstonToLogflareMapper(info)
        try {
            this.httpClient.addLogEvent(logEvent)
        } finally {
            callback()
        }
    }
}

module.exports = WinstonLogflareTransport
