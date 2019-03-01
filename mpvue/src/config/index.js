import {
  get
} from '@/http/api'

const host = process.env.APIPORT
export default {
  get (params) {
    return get(`${host}/`, params)
  }
}
