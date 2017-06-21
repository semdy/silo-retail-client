/**
 * Created by mcake on 2017/3/14.
 */

import {permission, scrollNavItems, user} from '../locale';

export default {
  navItems: [
    {
      text: permission.apply,
      icon: 'permission',
      visible: true,
      admin: false,
      path: '/permission.apply'
    },
    {
      text: permission.record,
      icon: 'record',
      visible: true,
      admin: false,
      path: '/permission.record'
    },
    {
      text: permission.approval,
      icon: 'approval',
      visible: false,
      admin: true,
      path: '/permission.approval'
    },
    {
      text: permission.members,
      icon: 'users',
      visible: false,
      admin: true,
      path: '/permission.members'
    },
    {
      text: user.LOGOUT,
      icon: 'logout',
      visible: true,
      admin: false,
      path: '/user.login'
    }],

  scrollNavItems: [
    {
      text: scrollNavItems.survey,
      path: "/report.survey"
    },
    {
      text: scrollNavItems.dataview,
      path: "/report.sale"
    },
    {
      text: scrollNavItems.distribution,
      path: "/report.distribution"
    },
    {
      text: scrollNavItems.payment,
      path: "/report.payment"
    },
    {
      text: scrollNavItems.goodsInfo,
      path: "/report.goodsInfo"
    },
    {
      text: scrollNavItems.passflow,
      path: "/report.passflow"
    }]
}