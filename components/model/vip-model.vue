<template>
	<u-popup :show="isShow" :round="10" :closeOnClickOverlay="false" mode="bottom" closeable overlay @close="hadleClose"
		@open="hadleOpen">
		<view class="vip-wrap">
			<view class="title">
				<u--text type="info" text="当前账号未开通会员"></u--text>
			</view>
			<view class="recharge">
				<view class="recharge-item" :class="current == index ? 'recharge-item-active': ''"
					v-for="(item, index) in memberGrade" :key="index" @click="handleRechargeItem(index)">
					<view class="recharge-tag">
						<text class="recharge-tag-text"
							v-if="parseInt(item.validDay) > 0">{{ item.validDay }}天有效期</text>
						<text class="recharge-tag-text" v-else>永久有效期</text>
					</view>
					<text class="recharge-item-duration">{{ item.name }}</text>
					<view class="recharge-item-price">
						<text class="rmb">￥</text>
						<text class="recharge-item-price-text">{{ item.catchValue }}</text>
					</view>
					<text class="recharge-item-des"
						v-if="item.validDay > 30">折合￥{{ Math.round((item.catchValue/item.validDay)*30 * 100) / 100 }}/月</text>
				</view>
			</view>
			<view class="agreement">
				<checkbox-group @change="handleClauseCheckbox">
					<label>
						<checkbox :checked="isClause" style="transform:scale(0.6)" />
					</label>
					<text class="check_text">
						<text>已阅读并勾选</text>
						<text class="service" @click="handleService">《会员服务协议》</text>
					</text>
				</checkbox-group>
			</view>
			<view class="bug-btn-wrap">
				<u-button type="warning" shape="circle" text="立即购买" @click="handleBug"></u-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false,
				required: true
			},
		},
		watch: {
			// 兼容小程序
			show: function (newVal, oldVal) {
				this.isShow = newVal;
			},
		},
		data () {
			return {
				isShow: false,
				// 会员信息
				memberGrade: [{
					name: '年度会员',
					validDay: 365,
					catchValue: 33
				}, {
					name: '月度会员',
					validDay: 30,
					catchValue: 5
				}],
				current: 0, // 当前会员类型选项
				isClause: false, // 勾选协议
			};
		},
		created () {
			// 获取设备状态(兼容H5和APP)
			if (this.show) {
				this.isShow = this.show;
			}
		},
		methods: {
			hadleClose (e) {
				this.$emit('close');
			},
			hadleOpen (e) {
				this.$emit('open', e);
			},
			// 选择会员类型
			handleRechargeItem (index) {
				this.current = index
			},
			// 勾选协议
			handleClauseCheckbox () {
				this.isClause = !this.isClause;
			},
			// 购买
			handleBug () {
				if (this.isClause) {
					uni.showToast({
						icon: 'none',
						title: '功能开发中，敬请期待！'
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '请先阅读并勾选协议'
					})
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.vip-wrap {
		padding: 10px;

		.title {
			padding: 10px
		}

		.recharge {
			position: relative;
			margin: 10px;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;

			&-tag {
				position: absolute;
				top: -2rpx;
				left: -2rpx;
				width: 170rpx;
				height: 36rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				background-image: url('/static/tag.png');
				background-size: 100%;

				&-text {
					font-size: 20rpx;
					color: #FFFFFF;
					text-align: center;
				}
			}

			&-item {
				position: relative;
				padding: 40rpx 0;
				width: 40%;
				height: 123px;
				flex-shrink: 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				border: solid 1rpx #CBCCCE;
				border-radius: 12rpx;

				&:not(:first-child) {
					margin-left: 30px;
				}

				&-active {
					border: solid 2rpx #EDD2A9;
					background-color: #FBF1E5;
				}

				&-duration {
					margin: 10px 0;
					font-size: 16px;
					color: #1C1C1C;
				}

				&-price {
					margin-bottom: 20rpx;
					display: flex;
					flex-direction: row;
					align-items: baseline;

					&-text {
						font-size: 38px;
						color: #E3BE83;
					}
				}

				&-des {
					font-size: 22rpx;
					color: #A5A3A2;
				}
			}
		}

		.agreement {
			padding: 10px;
			font-size: 14px;

			.check_text {
				display: inline-block;
				vertical-align: middle;
			}

			.service {
				color: #3c9cff;
			}
		}

		.bug-btn-wrap {
			margin-top: 10px;
			padding: 20px;
		}
	}
</style>