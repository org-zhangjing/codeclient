import axios from '@/libs/api.request'
export const getWorkbenchs = () => {
  const user = JSON.parse(localStorage.userInfo)
  const id = user.id
  return axios.fetch({
    url: `/workbench/${id}`
  })
}

export const editSelfWorkbench = params => {
  return axios.post({
    url: '/workbench',
    data: params
  })
}
