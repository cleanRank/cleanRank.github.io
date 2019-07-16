import * as loglevel from "loglevel"
import prefix from "loglevel-plugin-prefix"
import config from "@/lib/im_test/WebIMConfig.js"

loglevel.setLevel(config.loglevel)
prefix.apply(loglevel, { template: "[%t] %l (%n) logger: " })

export default loglevel
