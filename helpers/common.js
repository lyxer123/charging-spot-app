/**
 * 获取sip状态名称、颜色等信息
 * @param {Number} value 状态id
 * @returns {Object} { id, name, type }
 */
export function getSipStatusInfo (id) {
	if (id === 1) {
		return { id: id, name: '未使用', type: 'info' };
	} else if (id === 2) {
		return { id: id, name: '在线', type: 'success' };
	} else if (id === 3) {
		return { id: id, name: '离线', type: 'warning' };
	} else if (id === 4) {
		return { id: id, name: '禁用', type: 'info' };
	} else {
		return null;
	}
}

/**
 * 获取device状态名称、颜色等信息
 * @param {Number} value 状态id
 * @returns {Object} { id, name, type }
 */
export function getDeviceStatusInfo (id) {
	if (id === 1) {
		return { id: id, name: '未激活', type: 'info' };
	} else if (id === 2) {
		return { id: id, name: '禁用', type: 'info' };
	} else if (id === 3) {
		return { id: id, name: '在线', type: 'success' };
	} else if (id === 4) {
		return { id: id, name: '离线', type: 'warning' };
	} else {
		return null;
	}
}

/**
 * 获取状态名称、颜色等信息
 * @param {Number} value 定位方式id
 * @returns {Object} { id, name }
 */
export function getLocationWayInfo (id) {
	if (id === 1) {
		return { id: id, name: '自动定位' };
	} else if (id === 2) {
		return { id: id, name: '设备定位' };
	} else if (id === 3) {
		return { id: id, name: '自定义位置' };
	} else {
		return null;
	}
}