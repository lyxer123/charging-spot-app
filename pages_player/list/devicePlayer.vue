<template>
	<view class="container">
		<u-loading-page :loading="loading" bg-color="#eef3f7" loadingText="FastBee.cn"></u-loading-page>
		<view class="card">
			<view class="player-wrapper">
				<div class="container-shell">
					<div id="container" @tap='operate' :ref="'container'+refId"></div>
				</div>
				<div class="player-display" />

				<view class="kBps"
					v-if="statisticsAll && (screensStats.abps || screensStats.buf || screensStats.fps || screensStats.ts || screensStats.vbps)">
					<text class="iconfont icon-dian"></text>
					<text class="li" v-if="screensStats.abps">{{ statisticsAll.abps }}abps</text>
					<text class="li" v-if="screensStats.buf">{{ statisticsAll.buf }}buf</text>
					<text class="li" v-if="screensStats.fps">{{ statisticsAll.fps }}fps</text>
					<text class="li" v-if="screensStats.ts">{{ statisticsAll.ts }}ts</text>
					<text class="li" v-if="screensStats.vbps">{{ statisticsAll.vbps }}vbps</text>
				</view>

				<view class="tabbar" v-if="isTabbar" @tap="tapTbabar">
					<view class="title">
						<text class="iconfont icon-fanhui"></text>
						<view class="texts">{{ title }}</view>
					</view>
				</view>
				<slot></slot>
			</view>

			<u-tabs class="tab_wrap" :list="[{ name: '设备直播' }, { name: '录像回放' }]" @click="tabClick"
				lineWidth="60"></u-tabs>

			<view class="opt_button_wrap">
				<view class="live_str_wrap" v-if="tabIndex == 0">
					<view class="play_btn_wrap">
						<button class="btn_icon" @click="operate" :disabled="playing">
							<u-icon name="play-circle" size="30"></u-icon>
						</button>
						<text class="btn_title">播放</text>
					</view>
					<view class="play_btn_wrap">
						<button class="btn_icon" @click="operate" :disabled="!playing">
							<u-icon name="pause-circle" size="30"></u-icon>
						</button>
						<text class="btn_title">暂停</text>
					</view>
					<view class="play_btn_wrap">
						<button class="btn_icon" @click="handlePtzScale(1)">
							<u-icon name="plus" size="30"></u-icon>
						</button>
						<text class="btn_title">放大</text>
					</view>
					<view class="play_btn_wrap">
						<button class="btn_icon" @click="handlePtzScale(2)">
							<u-icon name="minus" size="30"></u-icon>
						</button>
						<text class="btn_title">缩小</text>
					</view>
				</view>
				<view class="playback_wrap" v-if="tabIndex == 1">
					<u-row justify="space-between" gutter="0">
						<u-col span="6" align="center">
							<view class="date_wrap" @click="showcalendar = true">
								<u--input readonly placeholderStyle="color:#000;" placeholder="选择录像日期"
									customStyle="background:#f8f8f8;padding:6px 20px;width:111px;" shape="circle"
									suffixIcon="arrow-rightward" suffixIconStyle="color:#606266" fontSize="14px"
									:value="playbackDate"></u--input>
							</view>
						</u-col>
						<u-col span="6" align="center">
							<view>
								<u--input readonly placeholderStyle="color:#000;" placeholder="设备存储"
									customStyle="background:#f8f8f8;padding:6px 20px;width:111px;" shape="circle"
									suffixIcon="arrow-rightward" suffixIconStyle="color:#606266"
									fontSize="14px"></u--input>
							</view>
						</u-col>
					</u-row>
					<view class="button_wrap">
						<view class="play_btn_wrap">
							<button class="btn_icon" @click="operate" :disabled="playing">
								<u-icon name="play-circle" size="30"></u-icon>
							</button>
							<text class="btn_title">播放</text>
						</view>
						<view class="play_btn_wrap">
							<button class="btn_icon" @click="operate" :disabled="!playing">
								<u-icon name="pause-circle" size="30"></u-icon>
							</button>
							<text class="btn_title">暂停</text>
						</view>
						<view class="play_btn_wrap">
							<button class="btn_icon" @click="screenShot" :disabled="!playing">
								<u-icon name="cut" size="30"></u-icon>
							</button>
							<text class="btn_title">截图</text>
						</view>
					</view>
					<u-calendar :show="showcalendar" :minDate="minDate" :maxDate="maxDate" :defaultDate="defaultDate"
						@confirm="confirmCalendar" @close="closeCalendar"></u-calendar>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import props from './props.js';
	import {
		ptzdirection,
		ptzscale
	} from '@/apis/modules/sip';
	import {
		startPlay,
		playback,
		playbackStop,
		playbackPause,
		playbackReplay,
		playbackSeek,
		playbackSpeed,
		getDevRecord
	} from '@/apis/modules/player';
	export default {
		name: 'devicePlayer',
		mixins: [props],
		onLoad(option) {
			if (option.deviceId) {
				console.log(option, '携带参数')
				this.deviceId = option.deviceId
				this.channelId = option.channelSipId
			}
		},
		data() {
			return {
				// 设备升级模态窗
				show: false,
				showcalendar: false,
				// 加载图标
				loading: false,
				// 控制模块标题
				title: ' 设备通道 ',
				// 选项卡索引
				tabIndex: 0,
				scrollTop: 0,
				queryParams: {
					deviceSipId: '', //设备sipid
				},
				// 通道集合
				channelList: [],
				selectChannel: null,
				// 设备信息
				deviceInfo: {},
				deviceId: '',
				channelId: '',
				streamId: '',
				streaminfo: {
					ssrc: '',
					playurl: ''
				},
				jessibuca: null,
				operateBtns: {
					fullscreen: true,
					play: true,
					ptz: true,
					zoom: true,
					//record: true,
					//audio: true,
					//scale: true,
				},
				statisticsAll: null,
				playing: false,
				quieting: true,
				pausing: false,
				paused: false,
				queryDate: '',
				volume: 100,
				controSpeed: 30,
				retryCount: 0,
				videoVod: false,
				vodIndex: 0,
				vodData: {},
				minDate: "",
				maxDate: "",
				defaultDate: "",
				hisData: [],
				playbackDate: '',
			}
		},
		mounted() {
			window.onerror = (msg) => (this.err = msg);
			this.create();
		},
		methods: {
			confirmCalendar(n) {
				this.playbackDate = n[0];
				this.showcalendar = false;
				this.queryDate = n;
				if (!this.jessibuca) {
					this.create();
				}
				this.loadDevRecord();
			},
			closeCalendar(n) {
				this.showcalendar = false;
			},
			create() {
				const jessibuca = new window.JessibucaPro(
					Object.assign({
							container: this.$refs['container' + this.refId],
							videoBuffer: Number(0.2),
							decoder: this.decoder + 'pages_player/static/h5/js/jessibuca-pro/decoder-pro.js',
							timeout: 20,
							debug: false,
							isResize: false,
							useWCS: false,
							useMSE: false,
							useSIMD: true,
							wcsUseVideoRender: false,
							loadingText: '加载中...',
							hasAudio: true,
							isFlv: true,
							showBandwidth: true,
							supportDblclickFullscreen: true,
							operateBtns: this.operateBtns,
							ptzClickType: 'mouseDownAndUp',
							forceNoOffscreen: true,
							playbackForwardMaxRateDecodeIFrame: 4,
							playbackCurrentTimeMove: false,
							networkDelayTimeoutReplay: true
						},
						this.options
					)
				);
				this.jessibuca = jessibuca
				const _this = this
				jessibuca.on('error', function(error) {
					console.log('error')
					console.log(error)
					_this.destroy()
				})
				jessibuca.on('timeout', function() {
					console.log('timeout')
					if (_this.retryCount <= 2) {
						_this.replay()
						_this.retryCount++
					}
				})
				let pre = 0
				let cur = 0
				jessibuca.on('timeUpdate', function(ts) {
					cur = parseInt(ts / 60000)
					if (pre !== cur) {
						pre++
					}
				})

				if (this.videoVod) {
					jessibuca.on('playbackSeek', (timeObj) => {
						console.log('playbackSeek!')
						_this.seekPlay(timeObj)
					})
				}
				jessibuca.on(JessibucaPro.EVENTS.play, function(play) {
					console.log('play success!')
					_this.playing = true
				})
				jessibuca.on(JessibucaPro.EVENTS.pause, function(pause) {
					console.log('pause success!')
					console.log(pause)
					_this.playing = false
				})
				// jessibuca.on('stats', function (s) {
				//   console.log('stats is', s)
				// })
				jessibuca.on(JessibucaPro.EVENTS.ptz, (arrow) => {
					console.log('ptz arrow', arrow);
					_this.handlePtz(arrow);
				})
				jessibuca.on(JessibucaPro.EVENTS.crashLog, (value) => {
					console.error('crashLog: ', value);
					_this.$u.toast({
						type: 'error',
						message: JSON.stringify(value)
					})
				})
				jessibuca.on(JessibucaPro.EVENTS.close, () => {
					!this.isDebug && console.log('jessibuca close');
					setTimeout(() => {
						_this.cleanPlayer(true);
					}, 10)

				})
			},
			initUrl(data) {
				if (data) {
					this.streamId = data.ssrc
					this.streaminfo.ssrc = data.ssrc
					this.streaminfo.playurl = data.playurl
				} else {
					this.streamId = ''
					this.streaminfo.ssrc = ''
					this.streaminfo.playurl = ''
				}
			},
			cleanPlayer(stop) {
				this.destroy()
				if (stop) {
					this.stopPlay()
				}
				this.playing = false
			},
			destroy() {
				if (this.jessibuca) {
					this.jessibuca.destroy()
				}
				switch (this.tabIndex) {
					case 0:
						this.videoVod = false;
						this.operateBtns.ptz = true;
						this.operateBtns.zoom = true;
						break;
					case 1:
						this.videoVod = true;
						this.operateBtns.ptz = false;
						this.operateBtns.zoom = false;
						break;
				}
				this.create();
			},
			// 单击选显卡
			tabClick(item) {
				this.tabIndex = item.index;
				this.cleanPlayer(true);
				switch (this.tabIndex) {
					case 0:
						this.sendDevicePush();
						break;
					case 1:
						this.initCalendar();
						break;
				}
			},
			initCalendar() {
				this.defaultDate = new Date();
				let minstamp = new Date().getTime() - 1000 * 3600 * 24 * 28;
				let maxstamp = new Date().getTime() + 1000 * 3600 * 24;
				var mindate = new Date(minstamp);
				let minmonth = mindate.getMonth() + 1;
				let minday = mindate.getDate();
				if (minmonth <= 9) {
					minmonth = '0' + minmonth;
				}
				if (minday <= 9) {
					minday = '0' + minday;
				}
				var maxdate = new Date(maxstamp);
				let maxmonth = maxdate.getMonth() + 1;
				let maxday = maxdate.getDate();
				if (maxmonth <= 9) {
					maxmonth = '0' + maxmonth;
				}
				if (maxday <= 9) {
					maxday = '0' + maxday;
				}
				this.minDate = mindate.getFullYear() + '-' + minmonth + '-' + minday;
				this.maxDate = maxdate.getFullYear() + '-' + maxmonth + '-' + maxday;
			},
			//直播控制
			sendDevicePush: function() {
				console.log("通知设备推流1：" + this.deviceId + " : " + this.channelId);
				if (this.channelId) {
					startPlay(this.deviceId, this.channelId).then((response) => {
						console.log("开始播放：" + this.deviceId + " : " + this.channelId);
						let res = response.data;
						console.log("playurl：" + res.playurl);
						this.streamId = res.streamId;
						this.streaminfo.playurl = res.playurl;
						this.play();
					});
				}
			},
			play: function() {
				this.playing = true;
				this.jessibuca.play(this.streaminfo.playurl);
			},
			operate() {
				if (!this.videoVod) {
					if (this.streaminfo.playurl) {
						if (this.playing) {
							this.jessibuca.pause();
							this.pausing = true;
						} else {
							this.play();
							this.pausing = false;
						}
					} else {
						this.sendDevicePush();
					}
				} else {
					if (this.streaminfo.ssrc && this.playing) {
						this.pausing = true
						this.playing = false
						this.jessibuca.playbackPause()
					} else {
						this.pausing = false
						this.playing = true
						this.jessibuca.playbackResume()
					}
				}
			},
			stopPlay() {
				if (this.streamId && this.playing) {
					playbackStop(this.deviceId, this.channelId, this.streamId).then(res => {
						this.pausing = false
						this.playing = false
						if (this.jessibuca) {
							this.retryCount = 0
							this.destroy()
						}
						this.streamId = '';
						this.streaminfo = {
							ssrc: '',
							playurl: ''
						};
					})
				}
			},
			handlePtz(arrow) {
				let leftRight = 0;
				let upDown = 0;
				if (arrow === 'left') {
					leftRight = 2;
				} else if (arrow === 'right') {
					leftRight = 1;
				} else if (arrow === 'up') {
					upDown = 1;
				} else if (arrow === 'down') {
					upDown = 2;
				}
				var data = {
					leftRight: leftRight,
					upDown: upDown,
					moveSpeed: 125
				};
				ptzdirection(this.deviceId, this.channelId, data).then(async response => {
					//console.log("云台方向控制：" + JSON.stringify(response));
				});
			},
			handlePtzScale(inOut) {
				console.log('云台缩放：' + inOut);
				var data = {
					inOut: inOut,
					scaleSpeed: 30
				}
				ptzscale(this.deviceId, this.channelId, data);
				// 放大/缩小后自动关闭
				setTimeout(() => {
					ptzscale(this.deviceId, this.channelId, {
						inOut: 0,
						scaleSpeed: 30
					})
				}, 800);
			},

			//录像控制
			loadDevRecord() {
				this.cleanPlayer(false);
				if (this.deviceId && this.channelId) {
					const date = this.queryDate ? new Date(new Date(this.queryDate).toLocaleDateString()).getTime() :
						new Date(new Date().toLocaleDateString()).getTime()
					const start = date / 1000
					const end = Math.floor((date + 24 * 60 * 60 * 1000 - 1) / 1000)
					const query = {
						start: start,
						end: end,
					}
					getDevRecord(this.deviceId, this.channelId, query).then(async (response) => {
						if (response.data != null && response.data.recordItems != null) {
							this.hisData = response.data.recordItems
							const len = this.hisData.length
							if (len > 0) {
								if (this.hisData[0].start < start) {
									this.vodData = {
										start: start,
										end: end,
										base: start
									}
									this.hisData[0].start = start
								} else {
									this.vodData = {
										start: this.hisData[0].start,
										end: end,
										base: start
									}
								}
								this.playback(this.hisData)
							} else {
								this.$u.toast('当前通道没有录像');
							}
						} else {
							this.$u.toast('当前通道没有录像');
						}
					})
				}
			},
			triggerPlay(playTimes) {
				if (this.playing) {
					this.jessibuca.on('play', () => {
						this.quieting = this.jessibuca.quieting
					})
					if (this.videoVod) {
						this.jessibuca.playback(this.streaminfo.playurl, {
							playList: playTimes,
							fps: 20
						})
					}
				}
			},
			playback(playTimes) {
				if (this.deviceId && this.channelId) {
					this.pausing = false
					if (this.streaminfo.ssrc) {
						playbackStop(this.deviceId, this.channelId, this.streaminfo.ssrc).then(res => {
							const query = {
								start: this.vodData.start,
								end: this.vodData.end,
							}
							playback(this.deviceId, this.channelId, query).then(res => {
								this.playing = true
								console.log(res.data);
								this.initUrl(res.data)
							}).finally(() => {
								this.triggerPlay(playTimes)
							})
						})
					} else {
						const query = {
							start: this.vodData.start,
							end: this.vodData.end,
						}
						playback(this.deviceId, this.channelId, query).then(res => {
							console.log(res)
							this.playing = true
							this.initUrl(res.data)
						}).finally(() => {
							this.triggerPlay(playTimes)
						})
					}
				}
			},

			scalePlay() {
				if (this.streaminfo.ssrc && this.playing) {
					playbackSpeed(this.deviceId, this.channelId, this.streamId, this.speed).then(res => {
						//this.jessibuca.scale(this.speed)
					})
				}
			},
			seekPlay(s) {
				const curTime = this.vodData.base + s.hour * 3600 + s.min * 60 + s.second
				const seekRange = curTime - this.vodData.start
				if (this.streaminfo.ssrc && this.playing) {
					const query = {
						seek: seekRange,
					}
					playbackSeek(this.deviceId, this.channelId, this.streamId, query).then(res => {
						this.jessibuca.setPlaybackStartTime(curTime)
					})
				}
			},
			screenShot() {
				if (this.playing) {
					this.jessibuca.screenshot()
				}
			},
			replay() {
				this.cleanPlayer(false);
				if (this.videoVod) {
					this.playback(this.hisData);
				} else {
					this.play();
				}
			},
			changeSpeed() {
				if (this.speed !== val) {
					this.speed = val
					this.scalePlay()
				}
			}
		},
		onUnload() {
			this.cleanPlayer(true);
		}
	}
</script>

<style lang="scss">
	@import '/pages_player/static/icon/iconfont.css';

	.player-wrapper {
		display: flex;
		place-content: center;
		font-size: 12px;
		width: 100%;
		height: 260px;

		.player-display {
			position: absolute;
			left: 4px;
			bottom: 48px;
			display: flex;
			width: 150px;
			height: 30px;
			justify-content: center;
			color: #fff;
		}

		.container-shell {
			position: relative;
			width: 100%;
		}

		#container {
			background: rgba(13, 14, 27, 0.7);
			width: 100%;
			height: 100%;
		}
	}

	.tab_wrap {
		margin-top: 10px;
	}

	.opt_button_wrap {
		margin-top: 40px;

		.play_btn_wrap {
			display: inline-block;
			text-align: center;
			flex: 1;

			.btn_icon {
				display: inline-block;
				padding: 16px;
				border-radius: 50px;

				&::after {
					border: transparent;
				}
			}

			.btn_title {
				display: block;
				font-size: 14px;
				margin-top: 8px;
			}
		}

		.live_str_wrap {
			display: flex;
			flex-direction: row;
		}

		.playback_wrap {
			padding: 0 20px;

			.date_wrap {}

			.button_wrap {
				display: flex;
				flex-direction: row;
				margin-top: 56px;
			}
		}
	}
</style>
