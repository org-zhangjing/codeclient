'use strict'
function getTree (tree = []) {
  let arr = []
  if (!!tree && tree.length !== 0) {
    tree.forEach(item => {
      let obj = {}
      obj.title = item.orgName || item.menuLabel || item.name
      obj.attr = item
      obj.expand = true
      obj.selected = false
      obj.checked = item.checked || false
      obj.children = getTree(item.children) // 递归调用
      arr.push(obj)
    })
  }
  return arr
}

function getTree1 (tree = [], ids = []) {
  let arr = []
  if (!!tree && tree.length !== 0) {
    tree.forEach(item => {
      let obj = {}
      let flag = ids.indexOf(item.id)
      if (flag !== -1) {
        obj.checked = true
      }
      obj.title = item.orgName || item.menuLabel || item.name
      obj.attr = item
      obj.expand = true
      obj.selected = false
      obj.children = getTree1(item.children, ids) // 递归调用
      arr.push(obj)
    })
  }
  return arr
}
function getTree2 (tree = [], ids = []) {
  let arr = []
  if (!!tree && tree.length !== 0) {
    tree.forEach(item => {
      let obj = {}
      let flag = ids.indexOf(item.id)
      if (flag !== -1) {
        obj.checked = true
      }
      obj.title = item.orgName || item.menuLabel || item.name
      obj.attr = item
      obj.expand = true
      obj.selected = false
      // obj.checked = item.checked || false
      obj.children = getTree1(item.children, ids) // 递归调用
      arr.push(obj)
    })
  }
  return arr
}

// 将一个array对象根据pidStr的关系进行子孙查找
function transData (array, idStr, pidStr, chindrenStr) {
  const result = []
  const hash = {}
  const pid = pidStr
  for (let i = 0; i < array.length; i++) {
    hash[array[i][idStr]] = array[i]
  }
  for (let j = 0; j < array.length; j++) {
    const aVal = array[j]
    const hashVP = hash[aVal[pid]] // 当前对象&pid对象
    if (hashVP) {
      !hashVP[chindrenStr] && (hashVP[chindrenStr] = [])
      hashVP[chindrenStr].push(aVal)
    } else {
      result.push(aVal)
    }
  }
  return result
}

// 从Data中查找指定id的数据
function getByID (Data, ID) {
  var Deep, T, F
  for (F = Data.length; F;) {
    T = Data[--F]
    if (ID === T.id) return T
    if (T.children) {
      Deep = getByID(T.children, ID)
      if (Deep) return Deep
    }
  }
}

// 从Data中查找指定checked的数据
function getIdsByChecked (Data, ID) {
  var Deep, T, F
  for (F = Data.length; F;) {
    T = Data[--F]
    if (T.attr && T.checked) {
      ID.push(T.attr.id)
    }
    if (T.children) {
      Deep = getIdsByChecked(T.children, ID)
      if (Deep) return Deep
    }
  }
  return ID
}

// 从Data中查找指定id的数据
function getInfoById (Data, ID) {
  var Deep, T, F
  for (F = Data.length; F;) {
    T = Data[--F]
    if (T.attr && ID === T.attr.id) return T
    if (T.children) {
      Deep = getInfoById(T.children, ID)
      if (Deep) return Deep
    }
  }
}

// 从Data中查找指定name的数据
function getByName (Data, name) {
  var Deep, T, F
  for (F = Data.length; F;) {
    T = Data[--F]
    if (name === T.name) {
      return T
    }
    if (T.children) {
      Deep = getByName(T.children, name)
      if (Deep) return Deep
    }
  }
}

// 查找树中已选中的值
function getCheckedFromTree (data = [], retArr = []) {
  data.forEach(item => {
    if (item.children && item.children.length) {
      getCheckedFromTree(item.children, retArr)
    } else {
      if (item.checked) {
        retArr.push(item)
      }
    }
  })
  return retArr
}

// 查找某对象中的value的数组值中已选中的项
function getCheckedFromMap (object = {}) {
  const retArr = []
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const selectArr = object[key]
      selectArr.forEach(item => {
        if (item && item.checked) retArr.push(item)
      })
    }
  }
  return retArr
}

function getMenuTree (tree = []) {
  let arr = []
  if (!!tree && tree.length !== 0) {
    tree.forEach(item => {
      let obj = {}
      obj.id = item.id
      obj.attr = item
      obj.label = item.menuLabel
      obj.children = getMenuTree(item.children) // 递归调用
      arr.push(obj)
    })
  }
  return arr
}

export { getMenuTree, getTree, transData, getByID, getCheckedFromTree, getCheckedFromMap, getTree2, getByName, getTree1, getInfoById, getIdsByChecked }
