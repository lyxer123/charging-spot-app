<template>
	<page-meta><navigation-bar title="个人中心" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="container">
		<u-sticky offset-top="0">
			<view style="background-color:#007AFF;padding:20px;padding-top:30px; display:flex;align-items: center;">
				<view style="margin-right:10px;"><u--image src="/static/avatar.png" shape="square" radius="10"
						width="50" height="50"></u--image></view>
				<view>
					<u--text :text="profile.nickName" color="#ffffff" bold></u--text>
					<u--text text="蜂信物联-开源物联网平台" color="#ffffff" size="12"></u--text>
				</view>
			</view>
		</u-sticky>

		<view style="background-color:#ffffff;padding:20px">
			<u-grid :border="false" col="4">
				<u-grid-item>
					<u-icon name="/static/device_white.png" size="25" color="#fff" label="添加设备" labelPos="bottom"
						labelSize="11" space="5px" @click="openTop"
						customStyle="background-color:#f56c6c;border-radius:3px;padding:10px;"></u-icon>
				</u-grid-item>
				<u-grid-item>
					<u-icon name="/static/scene_white.png" size="25" label="添加场景" labelPos="bottom" labelSize="11"
						space="5px" @click="gotoScene()"
						customStyle="background-color:#3c9cff;border-radius:3px;padding:10px;"></u-icon>
				</u-grid-item>
				<u-grid-item>
					<u-icon name="/static/group_white.png" size="25" label="分组管理" labelPos="bottom" labelSize="11"
						space="5px" @click="gotoGroup()"
						customStyle="background-color:#f9ae3d;border-radius:3px;padding:10px;"></u-icon>
				</u-grid-item>

				<u-grid-item>
					<u-icon name="/static/simulate.png" size="25" color="#fff" label="设备模拟" labelPos="bottom"
						labelSize="11" space="5px" @click="gotoEmulator()"
						customStyle="background-color:#5ac725;border-radius:3px;padding:10px;"></u-icon>
				</u-grid-item>
			</u-grid>
		</view>

		<!-- 会员升级 -->
		<view class="vip-wrap">
			<view class="vip">
				<view class="left">
					<u--text text="普通会员" size="18"></u--text>
					<u--text type="info" size="14" text="当前账号未开通会员"></u--text>
				</view>
				<view class="right">
					<u-button type="warning" shape="circle" text="立即开通" @click="handleVipUpgrade"></u-button>
				</view>
			</view>
			<vip-model :show="isVipModel" @close="isVipModel = false"></vip-model>
		</view>

		<view class="group">
			<u-cell-group>
				<u-cell title="账号" isLink @click="gotoAccount()" size="large">
					<u-icon slot="icon" size="20" name="account" color="#2979ff"></u-icon>
					<text slot="value" class="u-slot-value"></text>
				</u-cell>
				<u-cell title="信息" isLink url="/pagesB/list/user/message" size="large">
					<u-icon slot="icon" size="20" name="email" color="#5ac725"></u-icon>
					<u-badge slot="value" :isDot="true" type="success"></u-badge>
				</u-cell>
				<!-- <u-cell title="设置" isLink url="/pages/tabBarB/user/setting" size="large">
					<u-icon slot="icon" size="20" name="setting" color="#0b969d"></u-icon>
					<text slot="value" class="u-slot-value"></text>
				</u-cell> -->
				<u-cell title="关于" isLink url="/pagesB/user/about" size="large">
					<u-icon slot="icon" size="20" name="info-circle" color="#d3077b"></u-icon>
					<text slot="value" class="u-slot-value"></text>
				</u-cell>
				<u-cell isLink size="large">
					<u-link slot="title" href="https://gitee.com/kerwincui/wumei-smart/tree/master/app" text="APP下载"
						color="#333"></u-link>
					<u-icon slot="icon" size="20" name="download" color="#f56c6c"></u-icon>
					<text slot="value" class="u-slot-value"></text>
				</u-cell>
				<!-- <u-cell title="手机监控" isLink url="/pagesB/tabBar/user/phone" size="large">
					<u-icon slot="icon" size="20" name="star-fill" color="#14cfa9"></u-icon>
					<text slot="value" class="u-slot-value"></text>
				</u-cell> -->
				<u-cell title="注销账号" isLink size="large" @click="handleUnsubscribe()">
					<u-icon slot="icon" size="20" name="warning" color="#cbbb10"></u-icon>
				</u-cell>
			</u-cell-group>
		</view>

		<view style="margin-top:10px;"><u-button :plain="true" size="large" text="退出账号" @click="handleExit"></u-button>
		</view>
		<u-modal :show="show" title="确认退出账号？" :showCancelButton="true" @cancel="cancelExit"
			@confirm="confirmExit"></u-modal>
		<u-popup :show="topShow" @close="closeTop" @open="openTop" mode="top" round="10">
			<view style="padding:20px 0 10px 0;">
				<u-grid :border="false" col="3">
					<u-grid-item>
						<u-icon name="/static/ap.png" size="25" color="#fff" label="配网添加" labelPos="bottom"
							labelSize="15" space="10px" @click="gotoAddDevice()"
							customStyle="background-color:#f56c6c;border-radius:3px;padding:10px;"></u-icon>
					</u-grid-item>
					<u-grid-item>
						<u-icon name="/static/scan.png" size="25" label="扫码添加" labelPos="bottom" labelSize="15"
							space="10px" @click="openScan"
							customStyle="background-color:#3c9cff;border-radius:3px;padding:10px;"></u-icon>
					</u-grid-item>
					<u-grid-item>
						<u-icon name="/static/relate.png" size="25" label="关联添加" labelPos="bottom" labelSize="15"
							space="10px" @click="gotoRelateDevice()"
							customStyle="background-color:#f9ae3d;border-radius:3px;padding:10px;"></u-icon>
					</u-grid-item>
				</u-grid>
				<view>
					<u-row>
						<u-col :span="4"><u--text type="info" text="适用于WIFI类型的设备" size="12"
								customStyle="padding:10px 15px;"></u--text></u-col>
						<u-col :span="4"><u--text type="info" text="适用于蜂窝网络/以太网类设备" size="12"
								customStyle="padding:10px 15px;"></u--text></u-col>
						<u-col :span="4"><u--text type="info" text="适用于蜂窝网络/以太网类设备,并支持批量操作" size="12"
								customStyle="padding:10px 15px;"></u--text></u-col>
					</u-row>
				</view>
			</view>
		</u-popup>

		<u-modal :show="modal.show" :content="modal.content" @confirm="confirm" @cancel="cancel"
			:showConfirmButton="modal.showConfirmButton" showCancelButton></u-modal>

		<u-modal :show="isUnsubscribe" title="账户注销确认" content='账户注销后,所有信息将被清空,且无法恢复,您是否要注销？' cancelText="暂不注销"
			confirmText="确认注销" showCancelButton="true" confirmColor="#606266" cancelColor="#2979ff"
			@cancel="isUnsubscribe = false" @confirm="confirmUnsubscribe"></u-modal>
	</view>
</template>

<script>
	import { logout } from '@/apis/modules/common';
	import { deviceRelateUser } from '@/apis/modules/device';
	import vipModel from '@/components/model/vip-model.vue';

	export default {
		components: {
			vipModel
		},
		data () {
			return {
				// 扫码模态窗
				modal: {
					show: false,
					showConfirmButton: false,
					content: ''
				},
				// 扫码获取的Json
				scanJson: {},
				// 退出模态窗
				show: false,
				// 顶部弹出层
				topShow: false,
				isUnsubscribe: false,
				isVipModel: false, // 是否会员升级
			};
		},
		created () {
			if (this.profile == null) {
				this.getProfile();
			}
		},
		methods: {
			// 退出系统
			handleExit () {
				this.show = true;
			},
			// 取消退出系统
			cancelExit () {
				this.show = false;
			},
			// 确认退出系统
			confirmExit () {
				logout().then(() => {
					this.clearToken();
					// 跳转
					uni.reLaunch({
						url: '/pages/login'
					});
				});
			},
			gotoAccount () {
				uni.$u.route('/pagesB/user/account');
			},
			// 添加设备
			gotoAddDevice () {
				this.topShow = false;
				uni.navigateTo({
					url: '/pagesA/list/home/deviceAdd'
				});
			},
			// 关联设备
			gotoRelateDevice () {
				this.topShow = false;
				uni.navigateTo({
					url: '/pagesA/list/home/deviceRelate'
				});
			},
			gotoEmulator () {
				uni.navigateTo({
					url: '/pagesB/list/user/emulator'
				});
			},
			gotoScene () {
				uni.navigateTo({
					url: '/pagesA/list/scene/sceneEdit'
				});
			},
			gotoGroup () {
				uni.navigateTo({
					url: '/pagesA/list/home/deviceGroup/list'
				});
			},
			// 清除token
			clearToken () {
				// 本地缓存存储token
				uni.setStorageSync('token', '');
			},
			getProfile () {
				// 调用用户信息接口
				this.$api.common
					.getProfile()
					.then(res => {
						//存储用户信息,TODO 需要调用一次，不然其他页面调用返回空
						uni.$u.vuex('profile', res.data);
						this.profile;
					})
					.catch(err => {
						this.$u.toast(err.msg);
					});
			},
			// 打开顶部弹窗
			openTop () {
				this.topShow = true;
			},
			// 关闭顶部弹窗
			closeTop () {
				this.topShow = false;
			},
			/***************************************扫码关联设备***********************************************/
			// 模态窗确定
			confirm () {
				this.cancel();
				let form = {
					deviceNumberAndProductIds: [{
						deviceNumber: this.scanJson.deviceNumber,
						productId: this.scanJson.productId
					}],
					userId: this.profile.userId
				};
				deviceRelateUser(form).then(res => {
					if (res.code == 200) {
						uni.showToast({
							icon: 'success',
							title: '保存成功'
						});
						this.topShow = false;
					} else {
						this.modal = {
							show: true,
							showConfirmButton: false,
							content: '发生错误：' + res.msg
						};
					}
				});
			},
			// 模态窗取消
			cancel () {
				this.modal = {
					show: false,
					showConfirmButton: false,
					content: ''
				};
			},
			// 扫码
			openScan () {
				// #ifndef MP-WEIXIN || APP-PLUS
				uni.showToast({
					icon: 'none',
					title: '扫码只支持App和小程序'
				});
				return;
				// #endif

				// 允许从相机和相册扫码
				uni.scanCode({
					success: res => {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						if (res.result.substr(0, 1) != '{') {
							console.log('坑点：解析二维码后第一个位置包含一个特殊字符，大部分编译器和调试工具识别不了这个特殊字符');
							res.result = res.result.substring(1);
						}
						// 解析JSON
						try {
							this.scanJson = JSON.parse(res.result);
							// type=1 代表扫码关联设备
							if (this.scanJson.type == 1) {
								this.modal = {
									show: true,
									showConfirmButton: true,
									content: '【设备编号:' + this.scanJson.deviceNumber + ', 产品名称:' + this
										.scanJson.productName + '】确定添加吗？'
								};
								return;
							}
							uni.showToast({
								icon: 'none',
								title: '解析二维码后，找不到对应处理类型'
							});
						} catch (error) {
							uni.showToast({
								icon: 'none',
								title: '解析二维码错误，格式不正确'
							});
						}
					}
				});
			},
			// 注销账户
			handleUnsubscribe () {
				this.isUnsubscribe = true;
			},
			confirmUnsubscribe () {
				logout().then(() => {
					this.clearToken();
					// 跳转
					uni.reLaunch({
						url: '/pages/login'
					});
				});
			},
			// 开通会员
			handleVipUpgrade () {
				this.isVipModel = true;
			}
		}
	};
</script>

<style lang="scss" scoped>
	page {
		background: #eef3f7;
	}

	.container {
		padding-bottom: 100px;

		.vip-wrap {
			margin: 10px 0;

			.vip {
				display: flex;
				flex-direction: row;
				padding: 10px 20px;
				align-items: center;
				background-color: #ffffff;

				.left {
					flex: 1;
				}
			}
		}

		.group {
			background-color: #ffffff;
			margin-top: 10px;
		}
	}
</style>