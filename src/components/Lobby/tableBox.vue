<template>
	<div class="table">
		<div class="header-table">
			<div class="img">
				<el-icon class="warning" color="#212121">
					<Warning />
				</el-icon>
				<img src="../../assets/images/home-table-header.png" class="header-image">
			</div>
			<div class="header-middle">
				<div class="top">
					<span><span style="color:#1AD2C8 ;">Rapid </span><span>9D13</span></span>
				</div>
				<div class="bottom">
					<span>B13</span>
					<span>P21</span>
					<span>T5</span>
				</div>
			</div>
			<div class="header-right">
				<div class="header-right-top">
					<span>
						Bet range
						30K - 1,000K
					</span>
					<span class="arrow-down"><img src="../../assets/images/arrow-down.png" width="13.59"
							height="13.59"></span>
				</div>
				<div class="header-right-bottom">
					<span class="box-area">
						<IconUser />
						0
						<IconDollars />
						0
					</span>
				</div>
			</div>
		</div>
		<div class="canvas-container">
			<div class="canvas-container-left">
				<canvas ref="canvasRef" width="142.67" height="142.67"></canvas>
			</div>
			<div class="canvas-container-right">
				<div class="right-top">
					<canvas ref="canvasRightTopRef" width="234" height="71.33"></canvas>
				</div>
				<div class="right-middle"></div>
				<div class="right-bottom">
					<div class="bottom-left"></div>
					<div class="bottom-right"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { ElIcon } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'
import IconUser from '@/components/icons/IconUser.vue'
import IconDollars from '@/components/icons/IconDollars.vue'
const props = defineProps({
	table_name: String,
	table_id: String,
	routeInfo: Array,
	rangeInfo: Object,
})

const canvasRef = ref()

const canvasRightTopRef = ref()

onMounted(() => {
	drawCanvas()

})


function clickTable() {
	console.log('点击牌桌-牌桌信息-props:', props);
}



// 绘制右边canvas

let step = 0

const drawCanvasRightTop = () => {
	const canvasRightTop = canvasRightTopRef.value;
	if (canvasRightTop) {
		// 获取画布
		const ctxRight = canvasRightTop.getContext('2d')

		let total = 108 // 总的格数 行 6 列 18 列

		// // 计算每个方格的宽度和高度
		const gridWidth = canvasRightTop.width / 18;
		const gridHeight = canvasRightTop.height / 6;

		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 18; j++) {

				ctxRight.beginPath();
				ctxRight.rect(j * gridWidth, i * gridHeight, gridWidth, gridHeight);
				ctxRight.strokeStyle = '#ccc'; 
				// ctxRight.lineWidth  = 1;
				ctxRight.stroke();
				ctxRight.closePath();
				
				if(step<20){

					// 在方格内画圆圈
					const  circleX = j * gridWidth + gridWidth / 2;
	
					const  circleY = i * gridHeight + gridHeight / 2;
	
					const  circleRadius = Math.min(gridWidth, gridHeight) / 3; // 圆圈半径取较小的方格边长的1/3
					
					ctxRight.beginPath();
	
					ctxRight.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
					ctxRight.lineWidth  = 1;
					// 设置圆圈颜色
					ctxRight.strokeStyle = 'blue'; // 设置圆圈边界颜色
					ctxRight.stroke();
					ctxRight.closePath();
					step ++
				}

			}
		}



	}

}

// 绘制左边canvas
const drawCanvasLeft = () => {
	const canvas = canvasRef.value

	if (canvas) {
		// 获取画布
		const ctx = canvas.getContext('2d')

		let total = 36;

		let drawBall = 0

		// 计算每个方格的宽度和高度
		const gridWidth = canvas.width / 6;
		const gridHeight = canvas.height / 6;

		// 循环绘制方格和小球
		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 6; j++) {

				if (drawBall < 3) {

					// 绘制小球

					ctx.fillStyle = 'green';

					let ballSize = gridWidth / 2.2; // 小球大小
					let xPos = i * gridWidth + Math.random() * (gridWidth - ballSize * 2) + ballSize; // 在方格内随机位置生成小球
					let yPos = j * gridHeight + Math.random() * (gridHeight - ballSize * 2) + ballSize;


					ctx.beginPath();
					ctx.arc(xPos, yPos, ballSize, 0, Math.PI * 2);
					ctx.fill();
					ctx.closePath();


					// 在小球中心绘制字符（'B'或'P'）
					ctx.fillStyle = 'white';
					ctx.font = 'bold 14px Arial'; // 设置字体样式和大小
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					let res = Math.random() < 0.5 ? 'B' : 'P'
					ctx.fillText(res, xPos, yPos); // 随机绘制字符'B'或'P'



					// 在每个小球的左上角边界上绘制一个填充为蓝色的小球
					var borderBallSize = ballSize / 3; // 边界小球大小
					ctx.beginPath();
					ctx.arc(xPos - ballSize + borderBallSize, yPos - ballSize + borderBallSize, borderBallSize, 0, Math.PI * 2);
					ctx.fillStyle = 'blue'; // 填充为蓝色
					ctx.fill();
					ctx.closePath();


					// 在每个小球的右下角边界上绘制一个填充为蓝色的小球
					var borderBallSize = ballSize / 3; // 边界小球大小
					ctx.beginPath();
					ctx.arc(xPos + ballSize - borderBallSize, yPos + ballSize - borderBallSize, borderBallSize, 0, Math.PI * 2);
					ctx.fillStyle = 'blue'; // 填充为蓝色
					ctx.fill();
					ctx.closePath();

					drawBall++

				}
			}
		}
	}
}


const drawCanvas = () => {
	drawCanvasLeft()
	drawCanvasRightTop()
}
defineExpose({ clickTable })

</script>
<style scoped lang="less">
.table {
	width: 100%;
	background: #ffffff;
	height: 185px;
	margin: 0 2px;
	display: flex;
	flex-direction: column;

	.header-table {
		width: 100%;
		height: 40px;
		background: #000000;
		display: flex;
		align-items: center;
		position: relative;
		.img {
			width: 60px;
			height: 35px;
			margin: 7px 0 0 7px;
			border: 1px solid #212121;
			border-radius: 3px;
			position: relative;
	
			.warning {
				position: absolute;
				right: 0;
			}
	
			.header-image {
				width: 56px;
				height: 33px;
			}
		}
	}


	.header-middle {
		height: 35px;
		margin-left: 8px;

		.top {
			height: 20px;
			width: 68px;
			display: flex;
			font-size: 12px;
			justify-content: center;
			border-radius: 3px;
			border: 1px solid #1AD2C8;
		}

		.bottom {
			font-size: 12px;
			display: flex;
			justify-content: space-between;
		}
	}

	.header-right {
		height: 35px;
		position: absolute;
		right: 0;
		display: flex;
		flex-direction: column;

		.header-right-top {
			flex: 1;
			height: 13px;
			font-size: 12px;
			display: flex;
			align-items: center;

			.arrow-down {
				width: 13.59px;
				height: 13.59px;
			}
		}

		.header-right-bottom {
			flex: 1;

			.box-area {
				position: absolute;
				right: 0;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-right: 5px;
			}
		}
	}

	.canvas-container {
		display: flex;

		.canvas-container-left {
			width: 143px;
			height: 143px;
			background: url('../../assets/images/canvas-container-letf-bg.png');
			background-size: cover;
		}

		.canvas-container-right {
			display: flex;
			flex-direction: column;
			width: 100%;

			.right-top {
				height: 71.9px;
				// background: url('../../assets/images/home/top.png');
				background-size: 100% 100%;
			}

			.right-middle {
				height: 35px;
				background: url('../../assets/images/home/middle.png');
				background-size: 100% 100%;
			}

			.right-bottom {
				display: flex;

				.bottom-left {
					width: 100%;
					height: 34px;
					background: url('../../assets/images/home/bottom-left.png');
					background-size: cover;
				}

				.bottom-right {
					height: 34px;
					width: 100%;
					background: url('../../assets/images/home/bottom-left.png');
					background-size: cover;
				}
			}

		}
	}
}
</style>
