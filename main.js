const Transport = require("winston-transport")
const { winstonToLogflareMapper } = require("./utils")
const axios = require("axios")

module.exports = class WinstonLogflareTransport extends Transport {
  constructor(opts) {
    super(opts)
    const { apiKey, apiUrl, sourceToken, maxBatchSize } = opts
    this.apiKey = apiKey
    this.apiUrl = apiUrl || "https://logflare.app/logs"
    this.sourceToken = sourceToken
    this.maxBatchSize = maxBatchSize || 1
    this.batch = []
  }

  log(info, callback) {
    const logEvent = winstonToLogflareMapper(info)

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
      console.log(err)
    }
  }
}
