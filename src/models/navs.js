/**
 * Created by mcake on 2017/3/14.
 */

import { permission, scrollNavItems } from '../locale';

export default {
  navItems: [
    {
      text: permission.apply,
      icon: 'permission',
      visible: true,
      path: '/permission.apply'
    },
    {
      text: permission.record,
      icon: 'record',
      visible: true,
      path: '/permission.record'
    },
    {
      text: permission.approval,
      icon: 'approval',
      visible: true,
      path: '/permission.approval'
    }],

  scrollNavItems: [
    {
      text: scrollNavItems.survey,
      path: "/survey"
    },
    {
      text: scrollNavItems.dataview,
      path: "/dataview"
    },
    {
      text: scrollNavItems.goodsInfo,
      path: "/goodsInfo"
    },
    {
      text: scrollNavItems.passflow,
      path: "/passflow"
    }]
}