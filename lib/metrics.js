/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Gates Foundation
 - Name Surname <name.surname@gatesfoundation.com>

 - Pedro Barreto <pedrob@crosslaketech.com>
 - Rajiv Mothilal <rajivmothilal@gmail.com>
 - Miguel de Barros <miguel.debarros@modusbox.com>
 - Shashikant Hirugade <shashikant.hirugade@modusbox.com>

 --------------
 ******/
'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const client = require('prom-client')
/** Wrapper class for prom-client. */
class Metrics {
  constructor () {
    /** To make sure the setup is run only once */
    this._alreadySetup = false
    /** Object containing the histogram values */
    this._histograms = {}
    /** The options passed to the setup */
    this._options = { prefix: '', timeout: 0 }
    /**
         * Setup the prom client for collecting metrics using the options passed
         */
    this.setup = (options) => {
      if (this._alreadySetup) {
        return false
      }
      this._options = options
      // map the options to the normalised options specific to the prom-client
      let normalisedOptions = {
        prefix: this._options.prefix,
        timeout: this._options.timeout
      }
      if (this._options.defaultLabels !== undefined) {
        client.register.setDefaultLabels(this._options.defaultLabels)
      }
      client.collectDefaultMetrics(normalisedOptions)
      client.register.metrics()
      this._alreadySetup = true
      return true
    }
    /**
         * Get the histogram values for given name
         */
    this.getHistogram = (name, help, labelNames, buckets = [0.010, 0.050, 0.1, 0.5, 1, 2, 5]) => {
      try {
        if (this._histograms[name]) {
          return this._histograms[name]
        }
        this._histograms[name] = new client.Histogram({
          name: `${this.getOptions().prefix}${name}`,
          help: help || `${name}_histogram`,
          labelNames,
          buckets // this is in seconds - the startTimer().end() collects in seconds with ms precision
        })
        return this._histograms[name]
      } catch (e) {
        throw new Error(`Couldn't get metrics histogram for ${name}`)
      }
    }
    /**
         * Get the metrics
         */
    this.getMetricsForPrometheus = () => {
      return client.register.metrics()
    }
    /**
         * Get the options that are used to setup the prom-client
         */
    this.getOptions = () => {
      return this._options
    }
  }
}
exports.Metrics = Metrics
// # sourceMappingURL=metrics.js.map
