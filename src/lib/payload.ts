import { getPayload as get } from 'payload'
import config from '@payload-config'

/** One Payload instance per server process. */
export const getPayload = () => get({ config })
