import { useStrict } from 'mobx'
import { inject, observer } from 'mobx-react'
import Store from './store'

useStrict(true)

export const store = new Store()
window.store = store // for debugging

export const connect = (comp) => inject('store')(observer(comp))
