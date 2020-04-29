function winstonToLogflareMapper({ message, level }) {
  return {
    message,
    metadata: { level },
  }
}

module.exports = { winstonToLogflareMapper }
