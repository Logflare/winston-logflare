import Transport from "winston-transport"
import {winstonToLogflareMapper} from "./utils"
import _ from "lodash"
import axios from "axios"

const defaultOptions = {
    maxBatchSize: 50,
    batchFlushInterval: 1000,
    apiUrl: "https://logflare.app/logs",
}

export default class WinstonLogflareTransport extends Transport {
    constructor(opts) {
        super(opts)
        if (_.isUndefined(opts.apiKey)) {
            throw "Logflare API key for Winston transport is NOT configured!"
        } else {
            this.apiKey = opts.apiKey
        }

        if (_.isUndefined(opts.sourceToken)) {
            throw "Logflare source token for Winston transport is NOT configured!"
        } else {
            this.sourceToken = opts.sourceToken
        }

        this.apiUrl = opts.apiUrl || defaultOptions.apiUrl
        this.maxBatchSize = opts.maxBatchSize || defaultOptions.maxBatchSize

        this.batch = []
        setInterval(() => {
            this.postBatch()
        }, this.batchFlushInterval)
    }

    log(info, callback) {
        const logEvent = winstonToLogflareMapper(info)
        console.log(logEvent)

        this.insertToBatch(logEvent)

        if (this.batchLength() >= this.maxBatchSize) {
            this.postBatch()
        }

        callback()
    }

    insertToBatch(logEvent) {
        this.batch.push(logEvent)
    }

    batchLength() {
        return this.batch.length
    }

    async postBatch() {
        const batch = this.batch
        this.batch = []
        const data = {
            source: this.sourceToken,
            batch: batch,
        }

        try {
            await axios.post(this.apiUrl, data, {
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": this.apiKey,
                },
            })
        } catch (err) {
            throw "Logflare winston transport error: some logs not sent"
        }
    }
}
