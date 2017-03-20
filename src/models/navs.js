/**
 * Created by mcake on 2017/3/14.
 */

import {permission, scrollNavItems} from '../locale';

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
    },
    {
      text: permission.members,
      icon: 'users',
      visible: true,
      path: '/permission.members'
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
    }/*,
    {
      text: scrollNavItems.passflow,
      path: "/passflow"
    }*/]
}