import request from '@/utils/request'

/**
 * Get departments data
 */

export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

export function addDepartments(data) {
  return request({
    // restful api rules: address same , diffrent method will be handled in different ways
    url: `/company/department`,
    method: 'post',
    data
  })
}

export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}

