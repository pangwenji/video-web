<template>
	<div class="table">
		<div class="header-table">
			<div class="img">
				<el-icon class="warning" color="#212121">
					<Warning />
				</el-icon>
				<img :src="cover" class="header-image" alt="cover">
			</div>
			<div class="header-content">
				<div class="header-top">
					<div class="table-id"> <span style="color:#1AD2C8 ;"> {{ code }} </span> </div>
					<div class="header-table-limit" @mouseenter="showRoomLimitRed = true" @mouseleave="showRoomLimitRed = false">
						<span>
							下注区间
							{{ betRange.min }} - {{ betRange.max }}
						</span>
						<span class="arrow-down"><img src="../../assets/images/arrow-down.png" width="13.59" height="13.59"
								alt="icon-arrow"></span>
					</div>
				</div>
				<div class="header-table-bet-infos">
					<div class="info-left">
						<div class="info-left-item banker-win-num">
							庄 {{ bankerWinNum }}
						</div>
						<div class="info-left-item player-win-num">
							闲 {{ playerWinNum }}
						</div>
						<div class="info-left-item tie-win-num">
							和 {{ tieWinNum }}
						</div>
					</div>
					<div class="info-right">
						<span class="info-right-total info-right-total-people">{{ totalPeople }}</span>
						<span class="info-right-total info-right-total-money">{{ totalMoney }}</span>
					</div>
				</div>
			</div>
			<div class="border-wrapper border-wrapper" v-if="showRoomLimitRed">
				<table class="base-table">
					<thead>
						<tr>
							<th>玩法</th>
							<th>本台限红</th>
							<th>您的盘口</th>
							<th>下注区间</th>
						</tr>
						<tr>
							<th colspan="4" class="divider">
								<div></div>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="limit in tableLimitData">
							<td>{{ limit.play_style_name }}</td>
							<td>{{ tool.convertAmountNum(limit.table_red.min) }} - {{ tool.convertAmountNum(limit.table_red.max) }}</td>
							<td>{{ tool.convertAmountNum(limit.self_red.min) }} - {{ tool.convertAmountNum(limit.self_red.max) }}</td>
							<td>{{ tool.convertAmountNum(limit.public_red.min) }} - {{ tool.convertAmountNum(limit.public_red.max) }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="canvas-container">
			<routeMaps ref="routeMapRef" :mapList="records" :mapId="props.code" class="route-maps-wrap"
				v-bind:style="scaleRate" />
		</div>
	</div>
</template>
<script setup>
import { onMounted, ref, onBeforeMount, toRefs, reactive, computed, nextTick, watch } from 'vue'
import { ElIcon } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'
// import IconUser from '@/components/icons/IconUser.vue'
// import IconDollars from '@/components/icons/IconDollars.vue'
import routeMaps from '@/components/routeMaps/index.vue'
// import routeMaps from '@/components/routeMaps/map2.vue'
import tool from '@/utils/tool'


// 当前桌台的 庄闲和 赢的局数
const bankerWinNum = ref(0)
const playerWinNum = ref(0)
const tieWinNum = ref(0)
const totalPeople = ref(0)
const totalMoney = ref(0)

const props = defineProps({
	code: String,
	id: Number,
	class_id: Number,
	cover: String,
	status: Number,
	bet_total_max: String,
	records: Object,
	table_red_limit_rules: Object,
	self_red_limit_rules: Object,
	public_red_limit_rules: Object,
	table_rank_data: Object, // 桌台对局数据
})

const { code, id, class_id, cover, status, bet_total_max, records, table_red_limit_rules, self_red_limit_rules, public_red_limit_rules, table_rank_data } = toRefs(props)

const routeMapRef = ref(null)

const scaleRateX = ref(0)
const scaleRateY = ref(0)

function playStyleDict(content) {
	if (content === "1") {
		return "庄/闲"
	}
	if (content === "2") {
		return "对子"
	}
	if (content === "3") {
		return "和"
	}
	if (content === "4") {
		return "Super6"
	}
}

const betRange = ref({
	min: 0,
	max: 20000
})

watch(records, (val) => {
	console.log(`${table_rank_data.value.table_id}路图records更新`);
}, {
	deep: true
})

watch(table_rank_data, val => {
	const { table_id, total_money, total_people, winner } = val
	totalPeople.value = total_people
	totalMoney.value = total_money
	if (winner) {
		bankerWinNum.value = winner.banker
		playerWinNum.value = winner.player
		tieWinNum.value = winner.tie
	}
})

const scaleRate = computed(() => {
	return {
		// transform: `scale(${scaleRateX.value}, ${scaleRateY.value})`,
		transform: `scale(${scaleRateX.value}`,
	}
})
const showRoomLimitRed = ref(false)
const tableLimitData = ref([])
onBeforeMount(() => {
	const playStyleKeys = Object.keys(table_red_limit_rules.value)
	for (let i in playStyleKeys) {
		if(playStyleDict(playStyleKeys[i]) !== "Super6") {
			tableLimitData.value.push({
				play_style_name: playStyleDict(playStyleKeys[i]),
				table_red: table_red_limit_rules.value[playStyleKeys[i]],
				self_red: self_red_limit_rules.value[playStyleKeys[i]],
				public_red: public_red_limit_rules.value[playStyleKeys[i]]
			})
		}
	}
	betRange.value = {
		min: tool.convertAmountNum(public_red_limit_rules.value["1"].min),
		max: tool.convertAmountNum(public_red_limit_rules.value["1"].max),
	}
})

onMounted(() => {
	window.addEventListener('resize', () => {
		changeCanvasSize()
	})
	nextTick(() => {
	})
	setTimeout(()=> {
		changeCanvasSize()
	})
})

function changeCanvasSize() {
	const canvasContainerWrap = document.getElementsByClassName('canvas-container')[0]
	const canvasEleList = document.getElementsByClassName('route-maps-wrap')
	if (canvasContainerWrap) {
		scaleRateX.value = canvasContainerWrap.clientWidth / canvasEleList[0].clientWidth
		let canvasWrapLists = document.getElementsByClassName('canvas-container')
		for(let ele in canvasWrapLists) {
			if(canvasWrapLists[ele] && canvasWrapLists[ele].nodeName === "DIV") {
				scaleRateY.value = canvasWrapLists[ele].clientHeight / canvasEleList[0].clientHeight
				canvasWrapLists[ele].style.height = `${scaleRateX.value * canvasEleList[0].clientHeight}px`
			}
		}
	}
}

</script>
<style scoped lang="less">
.table {
	width: 100%;
	background: #ffffff;
	// height: 208px;
	margin: 0 2px;
	display: flex;
	flex-direction: column;

	.header-table {
		width: 100%;
		// height: 40px;
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

		.header-content {
			flex: 1;
			display: flex;
			flex-direction: column;

			.header-top {
				width: 100%;
				display: flex;
				padding-top: 9px;
				padding-left: 6px;

				.table-id {
					height: 20px;
					width: 68px;
					display: flex;
					font-size: 12px;
					justify-content: center;
					border-radius: 3px;
					border: 1px solid #1AD2C8;
				}

				.header-table-limit {
					flex: 1;
					font-size: 12px;
					padding-right: 6px;
					display: flex;
					align-items: flex-start;
					justify-content: flex-end;

					.arrow-down {
						width: 13.59px;
						height: 13.59px;
					}
				}
			}

			.header-table-bet-infos {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.info-left {
					flex: 1;
					text-align: left;
					display: flex;
					padding-left: 6px;
					font-size: 12px;

					.info-left-item {
						margin-right: 11px;

						&.banker-win-num {
							color: #c33;
						}

						&.player-win-num {
							color: #0073e6;
						}

						&.tie-win-num {
							color: #3c3;
						}
					}
				}

				.info-right {
					flex: 1;
					text-align: right;
					padding-right: 6px;
					display: flex;
					justify-content: flex-end;

					.info-right-total {
						display: flex;
						align-items: center;
						margin-right: 4px;

						&::before {
							content: "";
							background-repeat: no-repeat;
							background-position: 50%;
							background-size: 100% 100%;
							width: 16px;
							height: 16px;
							display: inline-block;
							margin-right: 3px;
						}
					}

					.info-right-total-people {
						&::before {
							background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjIgKDY3MTQ1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5pY29uX3Blb3BsZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJTeW1ib2xzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iMDItaWMtLy1zeXN0ZW0xNi0vLXBlb3BsZSIgZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSIjRkZGRkZGIj4KICAgICAgICAgICAgPGcgaWQ9ImljX3Blb3BsZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4wMDAwMDAsIDMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMTMiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJHcm91cC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgMC4zMzMzMzMpIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGVsbGlwc2UgaWQ9Ik92YWwtNCIgY3g9IjUiIGN5PSIyLjE1Mzg0NjE1IiByeD0iMi4xNDI4NTcxNCIgcnk9IjIuMTUzODQ2MTUiPjwvZWxsaXBzZT4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTAsOS4xNjc2NTI4NiBDMCw5LjE2NzY1Mjg2IDIuMDI2NTMxNTEsNS43NDM4MTA4OSA0Ljk3NDI0NDM5LDUuNzQzNTg5NzYgQzYuNDQ4MjIzNTMsNS43NDM0NzkxOSA4LjE1MjUzNjM2LDYuMTc5MjEzNzYgOS45NDg5Nzk1OSw5LjE2NzY1Mjg2IEwwLDkuMTY3NjUyODYgWiIgaWQ9IlBhdGgtMyI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
						}
					}

					.info-right-total-money {
						&::before {
							background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjIgKDY3MTQ1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5pY29uX2Ftb3VudDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJTeW1ib2xzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iMDItaWMtLy1zeXN0ZW0xNi0vLWFtb3VudCIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTUuNSwxNCBDMy4wMTQ3MTg2MywxNCAxLDExLjk4NTI4MTQgMSw5LjUgQzEsNy4wMTQ3MTg2MyAzLjAxNDcxODYzLDUgNS41LDUgQzcuOTg1MjgxMzcsNSAxMCw3LjAxNDcxODYzIDEwLDkuNSBDMTAsMTEuOTg1MjgxNCA3Ljk4NTI4MTM3LDE0IDUuNSwxNCBaIE02LDYuMjM2OTg3NzkgTDYsNS40IEw1LDUuNCBMNSw2LjIxNDIwNzY4IEM0LjQyMzU2MDY4LDYuMjU5MzE4NTMgMy45Mzg2Mzg1NCw2LjQxMjMyNzE3IDMuNTUyLDYuNjggQzMuMDg0LDYuOTkyIDIuODU2LDcuNDM2IDIuODU2LDggQzIuODU2LDguNTI4IDMuMDk2LDguOTQ4IDMuNTc2LDkuMjQ4IEMzLjg0OTA4MzI4LDkuNDMwMDU1NTIgNC4zMjcxNjAwNSw5LjYwMTMyMTkgNSw5Ljc2MTc5OTE2IEw1LDExLjY2OTY4MzggQzQuNzM3ODY0NTcsMTEuNjMzNjQ2NSA0LjUzNzY1MDczLDExLjU2MTE5MjIgNC4zOTIsMTEuNDU2IEM0LjE3NiwxMS4yODggNC4wMiwxMC45ODggMy45NDgsMTAuNTY4IEwyLjcsMTAuNTY4IEMyLjgzMDQ1MDIyLDExLjg3MjUwMjIgMy41OTExNjkzNSwxMi41OTU5NzUzIDUsMTIuNzIwNTc2NiBMNSwxMy40IEw2LDEzLjQgTDYsMTIuNzE4ODY1NiBDNy40NzcxMTY0MSwxMi41OTY2NjA5IDguMjIsMTEuOTQ0ODIyMSA4LjIyLDEwLjc3MiBDOC4yMiwxMC4yMiA3Ljk2OCw5Ljc4OCA3LjQ3Niw5LjQ3NiBDNy4xNTUzNjUyNiw5LjI2OTg3NzY3IDYuNjU5ODg5MzEsOS4wNzQ2ODI5MSA2LDguOTExMjcxNDUgTDYsNy4zMTYwOTkwNCBDNi4xMzIxOTExLDcuMzUxMjI4NjEgNi4yNDQ3OTM0LDcuMzk5MTk1NiA2LjMzNiw3LjQ2IEM2LjU0LDcuNTkyIDYuNjg0LDcuODIgNi43OCw4LjE1NiBMOC4wMTYsOC4xNTYgQzcuODkxODU0NDksNy4wMjgzNDQ5NyA3LjIxNDcyODI5LDYuMzkxMjM3MzQgNiw2LjIzNjk4Nzc5IFogTTUsNy4yNjA4ODg4OSBMNSw4LjY0MDY5MTQyIEM0Ljg1NDg2MjEsOC41OTQ5NTcyMyA0Ljc0MDY3NzQyLDguNTUzNjM0NDEgNC42NTYsOC41MTYgQzQuMzIsOC4zNiA0LjE1Miw4LjE4IDQuMTUyLDcuOTY0IEM0LjE1Miw3LjcyNCA0LjI2LDcuNTMyIDQuNDg4LDcuNDEyIEM0LjYxNiw3LjMzMiA0Ljc4NjY2NjY3LDcuMjg0IDUsNy4yNjA4ODg4OSBaIE02LDExLjY1NTAwMzEgTDYsMTAuMDE0ODUzNyBDNi4xNTkzNTAzNSwxMC4wNjM0Mzk3IDYuMjc5NjQzNTgsMTAuMTA3ODIxOCA2LjM2LDEwLjE0OCBDNi43MiwxMC4zMTYgNi45MTIsMTAuNTU2IDYuOTEyLDEwLjg1NiBDNi45MTIsMTEuMjg3MzkxIDYuNjA0MTgxNTYsMTEuNTU3NTQzOSA2LDExLjY1NTAwMzEgWiIgaWQ9IkNvbWJpbmVkLVNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC43OTI5Njc1LDggTDE1LDggTDE1LDkgTDEwLjk3NzU3ODUsOSBDMTAuOTQ2NjMyMiw4LjY1NjU5MDIzIDEwLjg4NDEyMDcsOC4zMjIyODIzNiAxMC43OTI5Njc1LDggWiBNMTAuOTc3NTc4NSwxMCBMMTUsMTAgTDE1LDExIEwxMC43OTI5Njc1LDExIEMxMC44ODQxMjA3LDEwLjY3NzcxNzYgMTAuOTQ2NjMyMiwxMC4zNDM0MDk4IDEwLjk3NzU3ODUsMTAgWiBNOC42NjMwNzkxMyw1IEM3Ljc2ODQwNTQzLDQuMzY5OTcwNjkgNi42Nzc0MDgzNiw0IDUuNSw0IEM0Ljk3OTk4ODEyLDQgNC40NzY4MzE3OSw0LjA3MjE2NzE2IDQsNC4yMDcwMzI0OSBMNCw0IEwxMiw0IEwxMiw1IEw4LjY2MzA3OTEzLDUgWiBNMTAuNDAwMjkwNCwxMiBMMTUsMTIgTDE1LDEzIEw5Ljc0MjgzNzg5LDEzIEM5Ljk5NjQ2NjEsMTIuNjkyODkyMyAxMC4yMTczOTQyLDEyLjM1Nzc4MTcgMTAuNDAwMjkwNCwxMiBaIE05Ljc0MjgzNzg5LDYgTDEyLDYgTDEyLDcgTDEwLjQwMDI5MDQsNyBDMTAuMjE3Mzk0Miw2LjY0MjIxODI5IDkuOTk2NDY2MSw2LjMwNzEwNzcxIDkuNzQyODM3ODksNiBaIE00LDIgTDEyLDIgTDEyLDMgTDQsMyBMNCwyIFoiIGlkPSJDb21iaW5lZC1TaGFwZSI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
						}
					}
				}
			}
		}

		.border-wrapper {
			font-size: 12px;
			color: #fff;
			cursor: pointer;
			display: flex;
			justify-content: center;
			padding: 0;
			border: 1px solid #ffe7a3;
			border-radius: 4px;
			background: linear-gradient(0deg, #020202, #2e2a21);
			position: absolute;
			top: 30px;
			right: 10px;
			z-index: 3;
			box-sizing: border-box;

			.base-table {
				position: relative;
				border-collapse: separate;
				border-spacing: 0;
				width: 100%;
				margin: 0 6px 8px;
				font-size: 12px;
				color: #f2f2f2;
				text-align: center;

				&::before {
					position: absolute;
					z-index: -1;
					display: block;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					content: "";
					background: url('@/assets/images/dialog_title_light.png') no-repeat;
					background-position: top;
					background-size: 100%;

				}

				thead {
					color: #d7b66f;
				}

				tbody {
					tr:nth-child(odd) {
						padding: 0 11px;
					}
				}

				td {
					vertical-align: middle;
					padding: 0 6px;
				}
			}
		}
	}

	.canvas-container {
		display: flex;
		overflow: hidden;

		.route-maps-wrap {
			will-change: transform;
			transform-origin: top left;
		}
	}
}
</style>
