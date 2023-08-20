<template>
	<view class="container">
		<view style="padding:10px;margin:1px 0 15px;background-color:#fff;">
			<u--text text="监测间隔(ms) 和 次数:" customStyle="padding-bottom:6px;font-size:12px;color:#3fd1ad"></u--text>
			<u-row :gutter="10">
				<u-col span="3">
					<u--input placeholder=" 输入间隔毫秒数" placeholderStyle="font-size: 12px" v-model="monitorInterval"
						border="surround" color="#666" customStyle="padding:4px;"></u--input>
				</u-col>
				<u-col span="3">
					<u--input placeholder=" 输入次数" placeholderStyle="font-size: 12px" v-model="monitorNumber"
						border="surround" color="#666" customStyle="padding:4px"></u--input>
				</u-col>
				<u-col span="3">
					<u-button type="warning" text="停止" @tap="stopMonitor()" size="small"
						:disabled="deviceInfo.monitorList && deviceInfo.monitorList.length == 0"></u-button>
				</u-col>
				<u-col span="3">
					<u-button type="success" text="监测" @tap="updateMonitorParameters()" size="small"
						:disabled="deviceInfo.monitorList &&  deviceInfo.monitorList.length == 0"></u-button>
				</u-col>
			</u-row>
		</view>

		<view class="charts-box" v-for="(chart, index) in monitorChart" :key="index">
			<qiun-data-charts type="area" :canvas2d="true" :reshow="reshow" :opts="chart.opts" :chartData="chart.data"
				:animation="false" tooltipFormat="tooltipStatistic" />
			<view style="position:relative;bottom:100px;">
				<u-loading-icon text="正在接收数据..." textSize="14" :show="chart.show"></u-loading-icon>
			</view>
		</view>

		<u-empty mode="data" :show="deviceInfo.monitorList && deviceInfo.monitorList.length === 0"
			marginTop="30"></u-empty>
	</view>
</template>

<script>
	import { listMonitor } from '@/apis/modules/deviceLog';

	export default {
		name: 'device-monitor',
		props: {
			show: {
				type: Boolean,
				default: false,
				required: true
			},
			device: {
				type: Object,
				default: null,
				required: true
			},
			productId: {
				type: Number,
				default: 0,
				required: true
			},
			serialNumber: {
				type: String,
				default: '',
				required: true
			}
		},
		watch: {
			// 兼容小程序
			show: function (newVal, oldVal) {
				this.reshow = newVal;
			},
			device: function (newVal, oldVal) {
				this.deviceInfo = newVal;
				this.initChart(); // 初始化图表
				uni.stopPullDownRefresh();
			},
			productId: function (newVal, oldVal) {
				this.currentProductId = newVal;
			},
			serialNumber: function (newVal, oldVal) {
				this.currentSerialNumber = newVal;
			}
		},
		data () {
			return {
				reshow: false,
				// 图表数据集合
				monitorChart: [{
					opts: {},
					data: {
						categories: [],
						series: []
					},
					show: false,
					id: ''
				}],
				// 设备信息
				deviceInfo: {
					monitorList: [],
				},
				// 当前产品ID
				currentProductId: 0,
				// 实时监测间隔
				monitorInterval: 1000,
				// 实时监测次数
				monitorNumber: 30,
				// 停止实时监测
				isStopMonitor: true
			};
		},
		created () {
			// 获取显示状态(兼容H5和APP)
			if (this.show != null) {
				this.reshow = this.show;
			}
			if (this.device.monitorList && this.device.monitorList.length !== 0) {
				this.deviceInfo = this.device;
				this.initChart(); // 初始化图表
				uni.stopPullDownRefresh();
			}
			if (this.productId != 0) {
				this.currentProductId = this.productId;
			}
			if (this.serialNumber != '' || this.serialNumber != null) {
				this.currentSerialNumber = this.serialNumber;
			}

			// 监听回调
			this.$nextTick(function () {
				this.mqttCallback();
			});
		},
		methods: {
			/* Mqtt回调处理  */
			mqttCallback () {
				this.$mqttTool.client.on('message', (topic, message, buffer) => {
					let topics = topic.split('/');
					let productId = topics[1];
					let deviceNum = topics[2];
					message = JSON.parse(message.toString());
					if (topics[3] == 'monitor' && !this.isStopMonitor) {
						console.log('接收到【实时监测】主题：', topic);
						console.log('接收到【实时监测】内容：', message);
						// 实时监测
						for (let k = 0; k < message.length; k++) {
							let value = message[k].value;
							let id = message[k].id;
							let remark = message[k].remark;
							// 数据加载到图表
							for (let i = 0; i < this.monitorChart.length; i++) {
								this.monitorChart[i].show = false;
								if (id == this.monitorChart[i].id) {
									if (this.monitorChart[i].data.series[0].data.length > 50) {
										this.monitorChart[i].data.series[0].data.shift();
									}
									this.monitorChart[i].data.categories.push(this.getTime());
									this.monitorChart[i].data.series[0].data.push(value);
									break;
								}
							}
						}
					}
				});
			},
			/** 更新实时监测参数*/
			updateMonitorParameters () {
				this.isStopMonitor = false;
				if (this.monitorInterval < 500 || this.monitorInterval > 10000) {
					uni.showToast({
						icon: 'none',
						title: '监测的间隔范围500-10000毫秒',
						duration: 3000
					});
					return;
				}
				if (this.monitorNumber == 0 || this.monitorNumber > 300) {
					uni.showToast({
						icon: 'none',
						title: '监测数量范围1-300',
						duration: 3000
					});
					return;
				}
				// 清空图表数据
				for (let i = 0; i < this.monitorChart.length; i++) {
					this.monitorChart[i].data.series[0].data = [];
					this.monitorChart[i].data.categories = [];
					this.monitorChart[i].show = true;
				}
				this.publishMonitor({
					name: '实时监测',
					value: this.monitorNumber
				});
			},
			/*停止实时监测*/
			stopMonitor () {
				this.isStopMonitor = true;
				// 发布指令
				this.publishMonitor({
					name: '停止监测',
					value: 0
				});
			},
			/* 发布消息 */
			publishMonitor (model) {
				// 实时监测
				let topic = '/' + this.currentProductId + '/' + this.currentSerialNumber + '/monitor/get';
				let message = '{"count":' + model.value + ',"interval":' + this.monitorInterval + '}';
				if (topic != '') {
					// 发布
					this.$mqttTool.publish(topic, message, model.name);
				}
			},
			// 获取当前时间
			getTime () {
				let date = new Date();
				let y = date.getFullYear();
				let m = date.getMonth() + 1;
				let d = date.getDate();
				let H = date.getHours();
				let mm = date.getMinutes();
				let s = date.getSeconds();
				m = m < 10 ? '0' + m : m;
				d = d < 10 ? '0' + d : d;
				H = H < 10 ? '0' + H : H;
				return y + '-' + m + '-' + d + ' ' + H + ':' + mm + ':' + s;
			},
			// 初始化图表
			initChart () {
				let color = ['#1890FF', '#91CB74', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452', '#9A60B4',
					'#ea7ccc'
				];
				this.monitorChart = [];
				if (this.deviceInfo.monitorList && this.deviceInfo.monitorList.length !== 0) {
					for (let i = 0; i < this.deviceInfo.monitorList.length; i++) {
						let data = {};
						let res = {
							categories: [],
							series: [{
								name: this.deviceInfo.monitorList[i].name + '（单位 ' + (this.deviceInfo
									.monitorList[i].datatype.unit !=
									undefined ? this.deviceInfo.monitorList[i].datatype.unit : '无') + '）',
								data: []
							}]
						};
						data = JSON.parse(JSON.stringify(res));
						let opts = {
							// 自定义名称和单位，用于图表提示框显示
							name: this.deviceInfo.monitorList[i].name,
							unit: this.deviceInfo.monitorList[i].datatype.unit,
							update: true,
							timing: 'easeOut',
							duration: 1000,
							color: [color[i % color.length]],
							padding: [15, 15, 0, 15],
							fontSize: 12,
							fontColor: '#666666',
							dataLabel: false, //是否显示值
							dataPointShape: true,
							dataPointShapeType: 'solid',
							touchMoveLimit: 60,
							enableScroll: true,
							enableMarkLine: false,
							legend: {
								show: true,
								position: 'bottom',
								float: 'center',
								padding: 5,
								margin: 5,
								backgroundColor: 'rgba(0,0,0,0)',
								borderColor: 'rgba(0,0,0,0)',
								borderWidth: 0,
								fontSize: 14,
								fontColor: '#333333',
								lineHeight: 16,
								hiddenColor: '#CECECE',
								itemGap: 10
							},
							xAxis: {
								disableGrid: true,
								disabled: true, // 隐藏分类名称
								axisLine: true,
								axisLineColor: '#CCCCCC',
								calibration: false,
								fontColor: '#666666',
								fontSize: 13,
								rotateLabel: false,
								rotateAngle: 45,
								itemCount: 30,
								boundaryGap: 'justify',
								splitNumber: 5,
								gridColor: '#CCCCCC',
								gridType: 'solid',
								dashLength: 1,
								gridEval: 1,
								scrollShow: false,
								scrollAlign: 'right',
								scrollColor: '#A6A6A6',
								scrollBackgroundColor: '#ccc',
								format: ''
							},
							yAxis: {
								gridType: 'dash',
								dashLength: 2,
								disabled: false,
								disableGrid: false,
								splitNumber: 5,
								gridColor: '#CCCCCC',
								padding: 10,
								showTitle: false,
								data: []
							},
							extra: {
								area: {
									type: 'curve',
									opacity: 0.5,
									addLine: true,
									width: 1,
									gradient: false
								},
								tooltip: {
									showBox: true,
									showArrow: true,
									showCategory: true,
									borderWidth: 0,
									borderRadius: 0,
									borderColor: '#000000',
									borderOpacity: 0.7,
									bgColor: '#000000',
									bgOpacity: 0.7,
									gridType: 'solid',
									dashLength: 4,
									gridColor: '#CCCCCC',
									fontColor: '#FFFFFF',
									splitLine: true,
									horizentalLine: false,
									xAxisLabel: false,
									yAxisLabel: false,
									labelBgColor: '#FFFFFF',
									labelBgOpacity: 0.7,
									labelFontColor: '#666666'
								},
								markLine: {
									type: 'solid',
									dashLength: 2,
									data: []
								}
							}
						};

						opts && this.monitorChart.push({
							opts: opts,
							data: data,
							show: false,
							id: this.deviceInfo.monitorList[i].id
						});
					}
				}
			}
		}
	};
</script>

<style scoped>
	.container {
		/* background-color: #fff; */
	}

	/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
	.charts-box {
		width: 100%;
		height: 150px;
		background-color: #ffffff;
		padding: 10px 0;
		margin-bottom: 15px;
	}
</style>