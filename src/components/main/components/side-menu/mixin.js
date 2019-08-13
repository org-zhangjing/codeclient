import CommonIcon from '_c/common-icon'
// import { showTitle } from '@/libs/util'
export default {
  components: {
    CommonIcon
  },
  methods: {
    // 左侧菜单不参与国际化
    showTitle (item) {
      // return showTitle(item, this)
      return item.meta.title
    },
    showChildren (item) {
      return item.children && (item.children.length > 1 || (item.meta && item.meta.showAlways))
    },
    getNameOrHref (item, children0) {
      return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name)
    }
  }
}
