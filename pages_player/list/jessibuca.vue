<template>
  <view class="player-wrapper">
    <view class="container-shell">
      <view id="container" @tap='operate' :ref="'container'+refId"></view>
    </view>
    <view class="player-display"/>

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

    <view class="suspend" v-if="!playing" @tap='operate'>
      <text :class="!playing ? 'iconfont icon-bofang-':'iconfont icon-zanting-'"></text>
    </view>

    <slot></slot>
  </view>
</template>
<script>
import props from './props.js';

export default {
  name: 'jessibuca',
  mixins: [props],

  data() {
    return {
	    jessibuca: null,
      isScreen: false,
      isFulls: false,
      statisticsAll: null,
      playing: true,
      setVolume: 0,
    }
  },
  mounted() {
    this.create();
    window.onerror = (msg) => (this.err = msg);
  },
  methods: {
    create() {
      const mobile = document.body.clientWidth < 720
      const jessibuca = new window.Jessibuca(
          Object.assign({
                container: this.$refs['container' + this.refId],
                videoBuffer: Number(0.2),
                decoder: this.decoder + 'pages_player/js/jessibuca/decoder.js',
                timeout: 20,
                debug: false,
                isResize: false,
                loadingText: '商用版请购买授权,加载中',
                // hasAudio: false,
                showBandwidth: true,
                supportDblclickFullscreen: true,
                operateBtns: {
                  fullscreen: true,
                  screenshot: true,
                  play: false,
                  audio: false
                },
                background: this.poster,
                forceNoOffscreen: true,
                isNotMute: false,
                playbackForwardMaxRateDecodeIFrame: 4,
                playbackCurrentTimeMove: false
              },
              this.options
          )
      );
	  this.jessibuca = jessibuca
      const _this = this

      jessibuca.on('error', function (error) {
        console.log('error')
        console.log(error)
        _this.destroy()
      })
      jessibuca.on('pause', function (pause) {
        console.log('pause success!')
        console.log(pause)
      })
      jessibuca.on('stats', function (s) {
        console.log('stats is', s)
      })
      jessibuca.on('timeout', function () {
        console.log('timeout')
        _this.destroy()
        if (_this.retryCount <= 1) {
          _this.startPlay(_this.url)
          _this.retryCount++
        }
      })
      let pre = 0
      let cur = 0
      jessibuca.on('timeUpdate', function (ts) {
        cur = parseInt(ts / 60000)
        if (pre !== cur) {
          pre++
        }
      })

      if (this.videoVod) {
        console.log('create videoVod')
        jessibuca.on('playbackSeek', (timeObj) => {
          _this.seekPlay(timeObj)
        })
      }
      this.play();
    },

    /*播放/暂停视频*/
    play() {
      this.jessibuca.play("http://flv.bdplay.nodemedia.cn/live/bbb.flv");
      this.playing = true;
    },

    playing() {
      return this.playing;
    },

    fullsing() {
      return this.isFulls;
    },

    volumeing() {
      return this.setVolume;
    },

    maining() {
      return this.jessibuca
    },

    formFulls(data) {
      if (this.isFulls) {
        this.isFulls = false;
        document.getElementsByTagName('body')[0].style = 'transform:inherit;transform-origin:inherit';
        this.window.width = this.width;
        this.window.height = this.height;
        setTimeout(() => {
          this.jessibuca.resize();
        }, 50);

        this.$emit('colseFulls') //取消全屏事件
      } else {
        this.isFulls = true;
        document.getElementsByTagName('body')[0].style = 'transform:rotate(90deg);transform-origin:' + data.windowWidth / 2 + 'px ' + data.windowWidth / 2 + 'px';
        this.window.width = data.windowHeight + data.windowTop;
        this.window.height = data.windowWidth - data.windowTop;

        setTimeout(() => {
          this.jessibuca.resize();
        }, 50);
        this.$emit('openFulls') //打开全屏事件
      }
      ;
    },

    /*全屏事件*/
    isFullTap() {
      if (this.playing) {
        uni.getSystemInfo({
          success: (res) => {
            if (this.window.width < res.windowWidth && this.window.height < res.windowHeight) {
              this.formFulls(res);
            } else {
              this.formFulls(res);
            }
            ;
          }
        });
      }
    },

    /*截图事件*/
    printscreen() {
      if (this.playing) {
        this.jessibuca.screenshot(this.screensJosn.name, this.screensJosn.format, this.screensJosn.quality, this.screensJosn.type);
        this.$emit('printscreen', true)
      }
    },

    /*点击标题栏事件*/
    tapTbabar() {
      if (this.playing) {
        this.$emit('tapTbar')
      }
    },

    /*整体区域点击事件*/
    operate() {
      this.play()
    },

    /*滑块拖动事件*/
    sliderChange(e) {
      const mitu = parseFloat(Number(e.detail.value) / 100).toFixed(1);
      if (Number(mitu) < 0.1) {
        this.jessibuca.mute();
      } else {
        this.jessibuca.cancelMute();
      }
      this.jessibuca.setVolume(Number(mitu));
      this.$emit('volume', Number(mitu))
    },

    /*录屏事件*/
    screenVideo() {
      if (this.isScreen) {
        this.isScreen = false;
        this.jessibuca.stopRecordAndSave();
      } else {
        this.isScreen = true;
        this.jessibuca.startRecord(this.screenJosn.fileName, this.screenJosn.fileType);
      }
    },

    /*关闭视频,不释放底层资源*/
    close() {
      if (this.jessibuca) {
        this.jessibuca.close();
      }
    },

    /*关闭视频，释放底层资源*/
    destroy() {
      if (this.jessibuca) {
        this.jessibuca.destroy();
      }
    },

    /*静音*/
    mute() {
      if (this.jessibuca) {
        this.jessibuca.mute();
      }
    },

    /*取消静音*/
    cancelMute() {
      if (this.jessibuca) {
        this.jessibuca.cancelMute();
      }
    },
  },
  onUnload() {
    this.destroy();
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
	height: 600px;

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
}

.container-shell {
    position: relative;
    backdrop-filter: blur(5px);
    background: hsla(0, 0%, 50%, 0.5);
    padding: 10px 4px 10px 4px;
    /* border: 2px solid black; */
    width: 100%;
    border-radius: 5px;
    box-shadow: 0 10px 20px;
}

#container {
  background: rgba(13, 14, 27, 0.7);
  width: 80%;
  height: 100%;
  margin: 0 auto;
}

@media (max-width: 720px) {
  #container {
    width: 90vw;
    height: 52.7vw;
  }
}

.suspend {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9;

  text {
    font-size: 100 rpx;
    color: rgba(0, 0, 0, .9);
  }
}

.mint {
  display: flex;
  align-items: center;

  & > .iconfont {
    font-size: 48 rpx;
  }

  uni-slider {
    padding: 0 20 rpx;
    margin: 0;
  }
}


.title {
  .icon-fanhui {
    margin-right: 12 rpx;
  }

  display: flex;
  align-items: center;
  font-size: 28 rpx;
  padding: 20 rpx;

  .texts {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
  }
}

.tabbar {
  position: absolute;
  z-index: 9;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, .5);
  font-size: 28 rpx;
  color: #fff;
  width: 100%;
}

.full {
  position: absolute;
  z-index: 99;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0;
  width: 100%;

  .icon-fangda-, .icon-suoxiao-, .icon-camera-full, .icon-shipin, .icon-zanting- {
    font-size: 46 rpx;
    color: rgba(0, 0, 0, .7);
    margin-left: 24 rpx;

    &:nth-child(1) {
      margin-left: 0;
    }
  }
;

  .icon-shipin {
    font-size: 48 rpx;
  }

  .pad {
    padding: 20 rpx;
  }
}

;

.kBps {
  position: absolute;
  top: 14 rpx;
  right: 20 rpx;
  display: flex;
  align-items: center;
  color: #fff;
  background: rgba(0, 0, 0, .8);
  padding: 4 rpx 12 rpx;
  border-radius: 30 rpx;
  font-size: 10px;
  z-index: 99;

  & > .icon-dian {
    color: #00aa00;
    font-size: 40 rpx;
  }
;

  .li {
    padding: 0 10 rpx;
  }
}
</style>
