<template>
	<view class="statistic-wrap">
		<view class="statistic-title">
			<view class="slave-wrap" v-if="isSubDev">
				<uni-data-select placeholder="请选择设备从机" v-model="queryParams.slaveId" :localdata="slaveList"
					@change="handleSlavechange" :clear="false"></uni-data-select>
			</view>
			<view class="time-wrap" @click="openCalendar">
				<u--input v-model="dateRangeText" placeholder=" 开始时间 - 结束时间" prefixIcon="search"
					prefixIconStyle="color: #909399" readonly :disabled="statisticList.length === 0"
					customStyle="height:20px;">
				</u--input>
				<u-calendar title="选择时间范围" :show="isShowCalendar" monthNum="12" :defaultDate="getDate(-1)"
					:minDate="getDate(-12)" mode="range" @confirm="handleCalendarConfirm"
					@close="handleCalendarClose"></u-calendar>
			</view>
			<view class="search-wrap">
				<u-row :gutter="10">
					<u-col span="6">
						<u--input placeholder="" placeholderStyle="font-size: 12px" v-model="queryParams.total"
							border="surround" color="#666" customStyle="padding:4px">
							<u--text text="最大数量:" slot="prefix" margin="0 3px 0 0" type="tips"></u--text>
						</u--input>
					</u-col>
					<u-col span="3">
						<u-button type="primary" text="查询" @tap="handleSearchTap()" size="small"></u-button>
					</u-col>
					<u-col span="3">
						<u-button type="error" text="清除" @tap="handleClearTap()" size="small"></u-button>
					</u-col>
				</u-row>
			</view>
		</view>
		<view v-if="statisticList.length !== 0" class="charts-box" v-for="(chart, index) in monitorChart" :key="index">
			<qiun-data-charts type="area" :canvas2d="true" :reshow="reshow" :opts="chart.opts" :chartData="chart.data"
				:ontouch="true" :onzoom="true" tooltipFormat="tooltipStatistic" />
		</view>

		<u-empty mode="data" :show="statisticList.length === 0" marginTop="30"></u-empty>
	</view>
</template>

<script>
	import { getDeviceHistory } from '@/apis/modules/deviceLog.js';

	export default {
		name: 'device-statistics',
		props: {
			show: {
				type: Boolean,
				default: false,
				required: true
			},
			device: {
				type: Object,
				default: null,
				require: true,
			}
		},
		watch: {
			// 兼容小程序
			show: function (newVal, oldVal) {
				this.reshow = newVal;
			},
			device: function (newVal, oldVal) {
				this.deviceInfo = newVal;
				this.isSubDev = newVal.subDeviceList && newVal.subDeviceList.length > 0;
				this.slaveList = this.getSlaveDatas(newVal.subDeviceList);
				// 监测数据
				if (this.isSubDev) {
					const slaveId = this.slaveList[0] && this.slaveList[0].value;
					this.queryParams.slaveId = slaveId;
					this.preSlaveId = slaveId;
					this.queryParams.serialNumber = newVal.subDeviceList[0].serialNumber;
					this.statisticList = newVal.cacheThingsModel["properties"].filter(item => {
						return item.tempSlaveId == this.queryParams.slaveId;
					}) || [];
				} else {
					this.queryParams.serialNumber = newVal.serialNumber;
					this.statisticList = newVal.statisticList || [];
				}
				this.getData();
			}
		},
		computed: {
			dateRangeText: {
				get() {
					if (this.queryParams.beginTime && this.queryParams.beginTime != '') {
						return '从 ' + this.queryParams.beginTime + ' 到 ' + this.queryParams.endTime;
					}
					return '';
				},
				set(val) {}
			}
		},
		data () {
			return {
				// 解决子组件中使用图表显示问题
				reshow: false,
				// 图表数据集合
				monitorChart: [{ name: '' }],
				// 查询参数
				queryParams: {
					serialNumber: '',
					slaveId: '',
					total: 30,
					beginTime: null,
					endTime: null
				},
				// 子设备
				isSubDev: false,
				slaveList: [],
				preSlaveId: '',
				// 时间范围组件显示
				isShowCalendar: false,
				// 监控物模型
				statisticList: [],
				// 设备信息
				deviceInfo: {},
			};
		},
		created () {
			// 获取显示状态(兼容H5和APP)
			if (this.show != null) {
				this.reshow = this.show;
			}
			if (this.device.statisticList && this.device.statisticList.length !== 0) {
				this.deviceInfo = this.device;
				this.isSubDev = this.device.subDeviceList && this.device.subDeviceList.length > 0;
				this.slaveList = this.getSlaveDatas(this.device.subDeviceList);
				// 监测数据
				if (this.isSubDev) {
					const slaveId = this.slaveList[0] && this.slaveList[0].value;
					this.queryParams.slaveId = slaveId;
					this.preSlaveId = slaveId;
					this.queryParams.serialNumber = this.device.subDeviceList[0].serialNumber;
					this.statisticList = this.device.cacheThingsModel["properties"].filter(item => {
						return item.tempSlaveId == this.queryParams.slaveId;
					}) || [];
				} else {
					this.queryParams.serialNumber = this.device.serialNumber;
					this.statisticList = this.device.statisticList || [];
				}
				this.getData();
			}
		},
		methods: {
			// 打开日期范围组件
			openCalendar () {
				if (this.monitorChart.length > 0) {
					this.isShowCalendar = true;
				}
			},
			// 关闭日期范围组件
			handleCalendarClose () {
				this.isShowCalendar = false;
			},
			// 确定选择日期范围
			handleCalendarConfirm (data) {
				if (null != data[0] && '' != data[0]) {
					this.queryParams.beginTime = data[0];
					this.queryParams.endTime = data[data.length - 1] + ' 23:59';
				}
				this.isShowCalendar = false;
			},
			// 查询
			handleSearchTap () {
				// chart 组件问题,需要自己控制是清除还是重新初始化图表
				if (this.preSlaveId === this.queryParams.slaveId) {
					this.clearChart();
				} else {
					this.initChart();
				}
				this.getHistory();
			},
			// 清除 
			handleClearTap () {
				this.queryParams.beginTime = null;
				this.queryParams.endTime = null;
				this.queryParams.total = 30;
				if (this.isSubDev) {
					this.handleSlavechange(this.slaveList[0].value)
				}
			},
			// 获取当前日期
			getDate (month) {
				let date = new Date();
				let y = date.getFullYear();
				let m = date.getMonth() + 1 + month;
				let d = date.getDate();
				m = m < 10 ? '0' + m : m;
				d = d < 10 ? '0' + d : d;
				return y + '-' + m + '-' + d;
			},
			// 获取统计数据
			getData () {
				this.initChart(); // 初始化图表
				this.getHistory(); // 获取统计数据
				uni.stopPullDownRefresh();
			},
			// 获取统计数据
			getHistory () {
				getDeviceHistory(this.queryParams).then(res => {
					for (let i = 0; i < this.statisticList.length; i++) {
						let obj = {
							categories: [],
							series: [{
								name: this.statisticList[i].name + '（单位 ' + (this
									.statisticList[i]
									.datatype.unit != undefined ? this.statisticList[i]
									.datatype.unit : '无') + '）',
								data: []
							}]
						};
						for (let key in res.data) {
							if (key === this.statisticList[i].id) {
								for (let j = 0; j < res.data[key].length; j++) {
									obj.categories.push(res.data[key][j].time);
									obj.series[0].data.push(Number(res.data[key][j].value));
								}
							}
						}
						let data = JSON.parse(JSON.stringify(obj));
						this.monitorChart[i].data = data;
					};
					// 数据请求成功后更新preSlaveId
					this.preSlaveId = this.queryParams.slaveId;
				})
			},
			// 初始化图表
			initChart () {
				let color = ['#1890FF', '#91CB74', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452', '#9A60B4',
					'#ea7ccc'
				];
				this.monitorChart = [];
				for (let i = 0; i < this.statisticList.length; i++) {
					let data = {};
					let opts = {
						// 自定义名称和单位，用于图表提示框显示
						name: this.statisticList[i].name,
						unit: this.statisticList[i].datatype.unit,
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
							itemCount: 100,
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
					this.monitorChart.push({
						opts: opts,
						data: data,
						show: false,
						id: this.statisticList[i].id
					});
				}
			},
			// 清空图标
			clearChart () {
				for (let i = 0; i < this.monitorChart.length; i++) {
					this.monitorChart[i].data.series[0].data = [];
					this.monitorChart[i].data.categories = [];
					this.monitorChart[i].show = true;
				}
			},
			// 获取子设备列表数据
			getSlaveDatas (data) {
				return data.map(item => ({ value: item.slaveId, text: `${item.deviceName}（从机地址：${item.slaveId}）` }));
			},
			// 从机选择
			handleSlavechange (value) {
				this.statisticList = this.deviceInfo.cacheThingsModel["properties"].filter(item => {
					return item.tempSlaveId === value;
				});
				this.queryParams.slaveId = value;
				this.queryParams.serialNumber = this.deviceInfo.subDeviceList.find(item => item.slaveId === value)
					.serialNumber;
			}
		}
	};
</script>

<style lang="scss">
	.statistic-wrap {

		.statistic-title {
			padding: 0px 10px 10px 10px;
			background-color: #ffffff;

			.slave-wrap {
				padding-top: 10px;
			}

			.time-wrap {
				padding-top: 10px;
			}

			.search-wrap {
				padding-top: 10px;
			}
		}

		/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
		.charts-box {
			width: 100%;
			height: 230px;
			background-color: #ffffff;
			padding: 10px 0;
			margin-top: 10px;
		}
	}
</style>