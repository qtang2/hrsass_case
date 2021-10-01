import request from '@/utils/request'

/**
 * Get roles list
 * ***/
export function getRoleList(params) {
  // params is page number and page size
  return request({
    url: '/sys/role',
    params
  })
}
export function getCompanyInfo(companyId) {
  // params is page number and page size
  return request({
    url: `/company/${companyId}`
  })
}
export function deleteRole(id) {
  // params is page number and page size
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}
export function addRole(data) {
  return request({
    url: `/sys/role`,
    data,
    method: 'post'
  })
}
