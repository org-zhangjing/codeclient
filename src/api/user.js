import axios from '@/libs/api.request'
export const login = ({ name, password }) => {
  const data = {
    name,
    password
  }
  return axios.post({
    url: '/login',
    data
  })
}

export const getUserInfo = (token) => {
  return axios.fetch({
    url: '/login',
    params: {
      token
    }
  })
}

export const logout = (token) => {
  return axios.post({
    url: '/users/logout'
  })
}

export const getUnreadCount = () => {
  return axios.fetch({
    url: '/message/count'
  })
}

export const getMessage = () => {
  return axios.fetch({
    url: '/message/init'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.fetch({
    url: '/message/content',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.post({
    url: '/message/has_read',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.post({
    url: '/message/remove_readed',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.post({
    url: '/message/restore',
    data: {
      msg_id
    }
  })
}
// /**
//  * 修改密码
//  * @param {object} params
//  */
export const updatePassWord = params => {
  return axios.put({
    url: '/message/restore',
    data: params
  })
}

export const listUserMenus = () => {
  const user = JSON.parse(localStorage.userInfo)
  const id = user.id
  return axios.fetch({
    url: `/auth/user/${id}`
    // url: '/auth/user'
  })
}
