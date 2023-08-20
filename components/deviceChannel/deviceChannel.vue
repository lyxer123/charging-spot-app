<template>
	<view class="container">
		<u-loading-page :loading="loading" bg-color="#eef3f7" loadingText="FastBee.cn"></u-loading-page>
		<view class="card" v-if="!loading">

			<view style="height:500px;">
				<view style="height:250px;background-color:#000;line-height:200px;">
					<u--text text="2.0版本支持视频,并采用商用版本播放器" align="center" color="#fff;" bold></u--text>
				</view>
				<u-tabs :list="[{ name: '设备直播' }, { name: '录像回放' }]" @click="tabClick" lineWidth="60"></u-tabs>
				<u-row justify="space-between" gutter="0" customStyle="margin-top:10px;" v-if="tabIndex == 0">
					<u-col span="6">
						<view style="width: 100%; height: 150px" class="flexCenter" >
						    <!-- 一个图片 -->
						    <view id="ptz-img-container" @touchstart.stop.prevent="handlePtzTouchStart" @touchend.stop.prevent="handlePtzTouchEnd" style="margin-left: 40rpx">
						        <image :src="ptzImgSrc" style="width: 150px; height: 150px"></image>
						    </view>
						</view>
					</u-col>
					<u-col span="6">
						<u-button type="error" text="放大" size="small" customStyle="width:50px;margin-bottom:10px;">
						</u-button>
						<u-button type="warning" text="缩小" size="small" customStyle="width:50px;"></u-button>
					</u-col>
				</u-row>

				<view style="padding-top:10px;">
					<u-row justify="space-between" gutter="0" customStyle="margin-top:10px;" v-if="tabIndex == 1">
						<u-col span="3">
							<u-button type="success" text="播放" size="small" customStyle="width:60%;"></u-button>
						</u-col>
						<u-col span="3">
							<u-button type="error" text="暂停" size="small" customStyle="width:60%;"></u-button>
						</u-col>
						<u-col span="3">
							<u-button type="primary" text="全屏" size="small" customStyle="width:60%;"></u-button>
						</u-col>
						<u-col span="3">
							<u-button type="warning" text="截图" size="small" customStyle="width:60%;"></u-button>
						</u-col>
					</u-row>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import {
		listChannel,
		ptzdirection,
		ptzscale
	} from '@/apis/modules/sip';
	import projectConfig from '@/env.config.js';

	export default {
		props: {
			device: {
				type: Object,
				default: null,
				required: true
			}
		},
		watch: {
			// 兼容小程序
			device: function(newVal, oldVal) {
				this.deviceInfo = newVal;
				this.loading = false;
				this.getList();
			}
		},
		data() {
			return {
				// 设备升级模态窗
				show: false,
				// 加载图标
				loading: true,
				// 控制模块标题
				title: ' 设备通道 ',
				// 通道集合
				channelList: [],
				selectChannel: null,
				// 通道总数
				total: 0,
				// 选项卡索引
				tabIndex: 0,
				scrollTop: 0,
				queryParams: {
					deviceSipId: '', //设备sipid
				}, //设备列表筛选条件表单
				ptzImgSrc: '/static/image/selfDevice/yuntai.png',
				// 设备信息
				deviceInfo: {

				}
			};
		},
		created() {
			// 获取设备状态(兼容H5和APP)
			if (this.device !== null && Object.keys(this.device).length !== 0) {
				this.deviceInfo = this.device;
				this.loading = false;
			};
		},
		methods: {
			radioChange(e) {
				console.log(e);
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				console.log(e);
			},
			/** 查询监控设备通道信息列表 */
			getList() {
				this.loading = true;
				this.queryParams.deviceSipId = this.device.serialNumber;
				listChannel(this.queryParams).then((response) => {
					this.channelList = response.rows;
					this.total = response.total;
					this.loading = false;
				});
			},

			handlePtzTouchStart: function (event) {
			    uni.createSelectorQuery()
			        .in(this)
			        .select('#ptz-img-container')
			        .boundingClientRect((rect) => {
			            let { clientX, clientY } = event.touches[0];
			            let rectLeft = rect.left;
			            let rectTop = rect.top;
			            let width = 60;
			            var centerLeft = 84 + rectLeft;
			            var centerTop = 84 + rectTop;
			            var left = clientX - centerLeft;
			            var top = clientY - centerTop;
			            if (centerLeft < clientX && clientX < centerLeft + width && centerTop < clientY && clientY < centerTop + width) {
			                console.log('xxxxxxx');
			                return;
			            }
			            console.log('rectLeft', rectLeft, 'rectTop', rectTop, 'event.touches[0]', event.touches[0]);
			            console.log('点击了页面方位：pageY', clientY);
			            console.log('云盘位置：top', rect.top);
			            let ptzStatus = 5;
			            if (Math.abs(left) > Math.abs(top)) {
			                if (left > 0) {
			                    ptzStatus = 3;
			                } else {
			                    ptzStatus = 2;
			                }
			            } else {
			                if (top > 0) {
			                    ptzStatus = 1;
			                } else {
			                    ptzStatus = 0;
			                }
			            }
			            this.handlePtzControl(ptzStatus);
			        })
			        .exec();
			},

			handlePtzControl: function (position) {
			    let baseUrl = '/static/image/selfDevice/yuntai/';
			    // 设置
			    let ptzImgSrc = baseUrl + 'yuntai.png';
			    console.log(position, 'position', 'position');
				let leftRight = 0;
				let upDown = 0;
			    switch (position) {
			        case 0:
			            ptzImgSrc = 'yuntai_shang.png';
						upDown = 1;
			            break;
			        case 1:
			            ptzImgSrc = 'yuntai_xia.png';
						upDown = 2;
			            break;
			        case 2:
			            ptzImgSrc = 'yuntai_zuo.png';
						leftRight = 2;
			            break;
			        case 3:
			            ptzImgSrc = 'yuntai_you.png';
						leftRight = 1;
			            break;
			    }
			    this.ptzImgSrc = baseUrl + ptzImgSrc;
			    var data = {
			    	leftRight: 0,
			    	upDown: 0,
			    	moveSpeed: 125
			    };
				ptzdirection(this.deviceId,this.channelId,data).then(async response => {
					console.log("云台方向控制：" + JSON.stringify(response));
				});
			},

			handlePtzTouchEnd(e) {
				var data = {
					leftRight: 0,
					upDown: 0,
					moveSpeed: 125
				};
				this.ptzImgSrc='/static/image/selfDevice/yuntai.png';
				ptzdirection(this.deviceId,this.channelId,data).then(async response => {
					console.log("云台方向控制：" + JSON.stringify(response));
				});
			},
		  // 单击选显卡
		  tabClick(item) {
			this.tabIndex = item.index;
		  },

		}
	};
</script>

<style lang="scss" scoped>
	.container {}

	.card {
		box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.1);
		border-radius: 6px;
		background-color: #fff;
		margin: 10px;
		margin-top: 20px;
		padding: 0;
	}
</style>
