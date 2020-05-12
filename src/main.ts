import Transport from "winston-transport"
import {winstonToLogflareMapper} from "./utils"
import {
    LogflareHttpClient,
    LogflareTransport,
} from "../../logflare-transport-core-js/src/http_client"

export default class WinstonLogflareTransport extends Transport
    implements LogflareTransport {
    readonly httpClient: LogflareHttpClient

    constructor(opts) {
        super(opts)
        this.httpClient = new LogflareHttpClient(opts)
    }

    log(info: {message: string; info: object}, callback) {
        const logEvent = winstonToLogflareMapper(info)
        this.httpClient.addLogEvent(logEvent)
        callback()
    }
}
