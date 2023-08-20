<template>
	<view class="view__wrapper">
		<view class="price__wrapper">
			<view>
				<u--text text="存在未支付订单，"></u--text>
			</view>
			<view>
				<u--text
					:text="unAmount || '0.00'"
					lines="1"
					:bold="true"
					:size="20"
					type="primary"
					:iconStyle="iconStyle"
					mode="price"
				></u--text>
			</view>
		</view>
		<!-- <span>存在未支付订单，金额{{unAmount || '0.00'}}元</span> -->
		<view class="btn__wrapper">
			<u-button type="primary" :custom-style="customStyle1" @click="handlePay">去支付</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				amount: 120.00,
				customStyle1: {
					width: '130px'
				},
				iconStyle: {
					fontSize: '10px',
					color: '#007aff'
				},
			}
		},
		onLoad(option) {
			// console.log(option)
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
.price__wrapper {
	display: flex;
	align-items: center;
}
.view__wrapper {
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
}
.btn__wrapper {
	position: absolute;
	bottom: 100rpx;
}
</style>
