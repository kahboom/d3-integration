export default {
  getIntlMessage: function(component, status) {
    let result;
    try {
      if (component && status && this[status]) {
        result = component.getIntlMessage(this[status].i18n);
      }
    } catch (e) {
      console.log('get intl message from status key fail');
    } finally {
      if (!result) {
        //result = '---';
        result = status ? status : '---';
      }
    }
    return result;
  },
  getIntlMessageFromStatusValue: function(component, statusValue) {
    if (statusValue) {
      let statusArray = statusValue.split('_');
      let status;
      statusArray.forEach(function(item, i) {
        if (i > 0) {
          let temp = item.split('');
          item = temp[0].toUpperCase() + temp.splice(1).join('');
          status += item;
        } else {
          status = item;
        }
      });
      if (status) {
        return this.getIntlMessage(component, status);
      }
    }
    return '---';
  },
  unknown: {
    value: 'unknown',
    i18n: 'status.unknown.name'
  },
  empty: {
    value: 'empty',
    i18n: 'status.empty.name'
  },
  provision: {
    value: 'provision',
    i18n: 'status.provision.name'
  },
  provisioning: {
    value: 'provisioning',
    i18n: 'status.provision.name'
  },
  PROVISIONING: {
    value: 'PROVISIONING',
    i18n: 'status.provision.name'
  },
  running: {
    value: 'running',
    i18n: 'status.running.name'
  },
  RUNNING: {
    value: 'RUNNING',
    i18n: 'status.running.name'
  },
  PROVISIONFAIL: {
    value: 'PROVISIONFAIL',
    i18n: 'status.provisionFail.name'
  },
  provisionfail: {
    value: 'provisionfail',
    i18n: 'status.provisionFail.name'
  },
  provision_fail: {
    value: 'provision_fail',
    i18n: 'status.provisionFail.name'
  },
  delete: {
    value: 'delete',
    i18n: 'status.delete.name'
  },
  setting: {
    value: 'setting',
    i18n: 'status.setting.name'
  },
  disable: {
    value: 'disable',
    i18n: 'status.disable.name'
  },
  error: {
    value: 'error',
    i18n: 'status.error.name'
  },
  update: {
    value: 'update',
    i18n: 'status.update.name'
  },
  UPDATING: {
    value: 'update',
    i18n: 'status.update.name'
  },
  repairing: {
    value: 'repairing',
    i18n: 'status.repairing.name'
  },
  repaired: {
    value: 'repaired',
    i18n: 'status.repaired.name'
  },
  repair_failed: {
    value: 'repair_failed',
    i18n: 'status.repair_failed.name'
  },
  repair_fail: {
    value: 'repair_fail',
    i18n: 'status.repair_failed.name'
  },
  repairFailed: {
    value: 'repair_failed',
    i18n: 'status.repair_failed.name'
  },
  repairFail: {
    value: 'repair_fail',
    i18n: 'status.repair_failed.name'
  },
  provisionFail: {
    value: 'provision_fail',
    i18n: 'status.provisionFail.name'
  },
  updateFail: {
    value: 'update_fail',
    i18n: 'status.updateFail.name'
  },
  UPDATE_FAIL: {
    value: 'UPDATE_FAIL',
    i18n: 'status.updateFail.name'
  },
  UPDATEFAIL: {
    value: 'UPDATEFAIL',
    i18n: 'status.updateFail.name'
  },
  deleteFail: {
    value: 'delete_fail',
    i18n: 'status.deleteFail.name'
  },
  deleteFailDeleting: {
    value: 'delete_fail_deleting',
    i18n: 'status.deleteFailDeleting.name'
  },
  runningDeleting: {
    value: 'running_deleting',
    i18n: 'status.runningDeleting.name'
  },
  provisionDeleting: {
    value: 'provision_deleting',
    i18n: 'status.provisionDeleting.name'
  },
  provisionFailDeleting: {
    value: 'provision_fail_deleting',
    i18n: 'status.provisionFailDeleting.name'
  },
  errorDeleting: {
    value: 'error_deleting',
    i18n: 'status.errorDeleting.name'
  },
  deleting: {
    value: 'deleting',
    i18n: 'status.deleting.name'
  },
  DELETING: {
    value: 'DELETING',
    i18n: 'status.deleting.name'
  },
  none: {
    value: 'none',
    i18n: 'status.none.name'
  },
  preview: {
    value: 'preview',
    i18n: 'status.preview.name'
  },
  extend: {
    value: 'extend',
    i18n: 'status.extend.name'
  },
  container: {
    value: 'container',
    i18n: 'status.container.name'
  },
  active: {
    value: 'active',
    i18n: 'status.active.name'
  },
  inactive: {
    value: 'inactive',
    i18n: 'status.inactive.name'
  },
  stopped: {
    value: 'stopped',
    i18n: 'status.stopped.name'
  },
  InProgress: {
    value: 'InProgress',
    i18n: 'status.InProgress.name'
  },
  inProgress: {
    value: 'InProgress',
    i18n: 'status.InProgress.name'
  },
  Completed: {
    value: 'Completed',
    i18n: 'status.Completed.name'
  },
  completed: {
    value: 'Completed',
    i18n: 'status.Completed.name'
  },
  signing: {
    value: 'signing',
    i18n: 'status.signing.name'
  },
  signed: {
    value: 'signed',
    i18n: 'status.signed.name'
  },
  rejection: {
    value: 'rejection',
    i18n: 'status.rejection.name'
  },
  signingResend: {
    value: 'signingResend',
    i18n: 'status.signingResend.name'
  },
  ENABLE: {
    value: 'ENABLE',
    i18n: 'status.ENABLE.name'
  },
  PAUSE: {
    value: 'PAUSE',
    i18n: 'status.PAUSE.name'
  },
  END: {
    value: 'END',
    i18n: 'status.END.name'
  },
  DISABLE: {
    value: 'DISABLE',
    i18n: 'status.DISABLE.name'
  },
  Up: {
    value: 'Up',
    i18n: 'status.Up.name'
  },
  Down: {
    value: 'Down',
    i18n: 'status.Down.name'
  },
  ASSIGNED: {
    value: 'ASSIGNED',
    i18n: 'status.ASSIGNED.name'
  },
  NONASSIGNED: {
    value: 'NONASSIGNED',
    i18n: 'status.NONASSIGNED.name'
  }
};
