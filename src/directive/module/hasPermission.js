import store from '../../store'
export default {
  inserted (el, binding, vnode) {
    let permissionList = store.state.app.btns
    if (permissionList && permissionList.length && !permissionList.includes(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
}
