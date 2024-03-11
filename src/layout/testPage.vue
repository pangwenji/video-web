<script setup>
import { onBeforeMount, ref, computed, onMounted } from 'vue'
import routeMaps from '@/components/routeMaps/index.vue'
// import routeMaps from '@/components/routeMaps/map2.vue'
import Roadmap from '@/components/routeMaps/js/Roadmap'
import askForRoad2 from '@/components/routeMaps/askForRoad2.vue';
import askForRoad from '@/components/routeMaps/askForRoad.vue';
import { watch } from 'vue';

const mapList = ref([])
const cacheMapList = ref([])
const routeMapRef = ref()

const tableId = ref("RY11")
const defaultRoundNumber = ref(150949)

// 设置 庄闲和对应的颜色
const colorRec = {
	"Player": "#2033d9",
	"Banker": "#d9202c",
	"Tie": "#21d924",
}

const askForRoadRef = ref()

const enumInfoList = {
	winner: {
		'1': {
			name: "Player",
			text: "闲",
		},
		"2": {
			name: "Tie",
			text: "和"
		},
		"3": {
			name: "Banker",
			text: "庄",
		}
	},
	pair: {
		"1": "", // 没有对子
		"2": "Player", // 闲家对子
		"3": "Banker", //庄家对子
		"4": "Player,Banker", // 庄家闲家都是对子
	}
}


watch(mapList, val => {
	console.log('testPage-数据更新', val);
	cacheMapList.value = mapList.value
	routeMapRef.value && routeMapRef.value.reDrawCanvas(cacheMapList.value)
	// 主动调用
	askForRoadRef.value && askForRoadRef.value.init(val)
}, {
	deep: true,
	immediate: true
})

onBeforeMount(() => {
	mapList.value = [
		{
			// 闲
			"table_id": 1,
			"round_id": "RY1123L150953",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"hex\":\"[05] [33] [47] [90] [03] [45] [37]\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":3,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"binary\":[5,51,71,144,3,69,55],\"player_pointer\":6,\"banker_pointer\":6,\"poker_info\":{\"banker\":{\"2\":{\"flower\":\"\♣\",\"poker_seq_number\":\"2\",\"rank\":\"4\",\"pointer\":4},\"9\":{\"flower\":\"\♥\",\"poker_seq_number\":\"9\",\"rank\":\"10\",\"pointer\":10},\"7\":{\"flower\":\"\♥\",\"poker_seq_number\":\"7\",\"rank\":\"K\",\"pointer\":10}},\"player\":{\"1\":{\"flower\":\"\♠\",\"poker_seq_number\":\"1\",\"rank\":\"7\",\"pointer\":7},\"8\":{\"flower\":\"\♣\",\"poker_seq_number\":\"8\",\"rank\":\"7\",\"pointer\":7},\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150953\"}"
		},
		{
			// 庄
			"table_id": 1,
			"round_id": "RY1123L150949",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150959\"}"
		},
		{
			// 闲
			"table_id": 1,
			"round_id": "RY1123L150953",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"hex\":\"[05] [33] [47] [90] [03] [45] [37]\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":3,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"binary\":[5,51,71,144,3,69,55],\"player_pointer\":6,\"banker_pointer\":6,\"poker_info\":{\"banker\":{\"2\":{\"flower\":\"\♣\",\"poker_seq_number\":\"2\",\"rank\":\"4\",\"pointer\":4},\"9\":{\"flower\":\"\♥\",\"poker_seq_number\":\"9\",\"rank\":\"10\",\"pointer\":10},\"7\":{\"flower\":\"\♥\",\"poker_seq_number\":\"7\",\"rank\":\"K\",\"pointer\":10}},\"player\":{\"1\":{\"flower\":\"\♠\",\"poker_seq_number\":\"1\",\"rank\":\"7\",\"pointer\":7},\"8\":{\"flower\":\"\♣\",\"poker_seq_number\":\"8\",\"rank\":\"7\",\"pointer\":7},\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150953\"}"
		},
		{
			// 庄
			"table_id": 1,
			"round_id": "RY1123L150950",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150959\"}"
		},
		{
			// 闲
			"table_id": 1,
			"round_id": "RY1123L150953",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"hex\":\"[05] [33] [47] [90] [03] [45] [37]\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":3,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"binary\":[5,51,71,144,3,69,55],\"player_pointer\":6,\"banker_pointer\":6,\"poker_info\":{\"banker\":{\"2\":{\"flower\":\"\♣\",\"poker_seq_number\":\"2\",\"rank\":\"4\",\"pointer\":4},\"9\":{\"flower\":\"\♥\",\"poker_seq_number\":\"9\",\"rank\":\"10\",\"pointer\":10},\"7\":{\"flower\":\"\♥\",\"poker_seq_number\":\"7\",\"rank\":\"K\",\"pointer\":10}},\"player\":{\"1\":{\"flower\":\"\♠\",\"poker_seq_number\":\"1\",\"rank\":\"7\",\"pointer\":7},\"8\":{\"flower\":\"\♣\",\"poker_seq_number\":\"8\",\"rank\":\"7\",\"pointer\":7},\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150953\"}"
		},
		{
			// 庄
			"table_id": 1,
			"round_id": "RY1123L150951",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150959\"}"
		},


		// 第二列
		{
			// 庄
			"table_id": 1,
			"round_id": "RY1123L150952",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150959\"}"
		},
		{
			// 庄
			"table_id": 1,
			"round_id": "RY1123L150952",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150959\"}"
		},
		{
			// 庄
			"table_id": 1,
			"round_id": "RY1123L150952",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150959\"}"
		},
		{
			// 庄
			"table_id": 1,
			"round_id": "RY1123L150952",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150959\"}"
		},
		{
			// 和
			"table_id": 1,
			"round_id": "RY1123L150974",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Tie win\",\"winner_mark\":2,\"type\":\"G\",\"hex\":\"[05] [38] [47] [91] [03] [45] [44]\",\"winner_seq\":\"8\",\"winner_pair\":\"Player only\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"614438\",\"poker_message_type\":\"poker_result\",\"binary\":[5,56,71,145,3,69,68],\"player_pointer\":0,\"banker_pointer\":2,\"poker_info\":{\"banker\":{\"7\":{\"flower\":\"\♣\",\"poker_seq_number\":\"7\",\"rank\":\"Q\",\"pointer\":10},\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"3\",\"pointer\":3},\"3\":{\"flower\":\"\♦\",\"poker_seq_number\":\"3\",\"rank\":\"J\",\"pointer\":10}},\"player\":{\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"3\",\"pointer\":3},\"4\":{\"flower\":\"\♣\",\"poker_seq_number\":\"4\",\"rank\":\"A\",\"pointer\":1},\"2\":{\"flower\":\"\♥\",\"poker_seq_number\":\"2\",\"rank\":\"A\",\"pointer\":1}}},\"bureau_number\":\"RY1123L150974\"}"
		},
		{
			// 和
			"table_id": 1,
			"round_id": "RY1123L150974",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Tie win\",\"winner_mark\":2,\"type\":\"G\",\"hex\":\"[05] [38] [47] [91] [03] [45] [44]\",\"winner_seq\":\"8\",\"winner_pair\":\"Player only\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"614438\",\"poker_message_type\":\"poker_result\",\"binary\":[5,56,71,145,3,69,68],\"player_pointer\":0,\"banker_pointer\":2,\"poker_info\":{\"banker\":{\"7\":{\"flower\":\"\♣\",\"poker_seq_number\":\"7\",\"rank\":\"Q\",\"pointer\":10},\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"3\",\"pointer\":3},\"3\":{\"flower\":\"\♦\",\"poker_seq_number\":\"3\",\"rank\":\"J\",\"pointer\":10}},\"player\":{\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"3\",\"pointer\":3},\"4\":{\"flower\":\"\♣\",\"poker_seq_number\":\"4\",\"rank\":\"A\",\"pointer\":1},\"2\":{\"flower\":\"\♥\",\"poker_seq_number\":\"2\",\"rank\":\"A\",\"pointer\":1}}},\"bureau_number\":\"RY1123L150974\"}"
		},


		// 第三列
		{
			// 闲
			"table_id": 1,
			"round_id": "RY1123L150953",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"hex\":\"[05] [33] [47] [90] [03] [45] [37]\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":3,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"binary\":[5,51,71,144,3,69,55],\"player_pointer\":6,\"banker_pointer\":6,\"poker_info\":{\"banker\":{\"2\":{\"flower\":\"\♣\",\"poker_seq_number\":\"2\",\"rank\":\"4\",\"pointer\":4},\"9\":{\"flower\":\"\♥\",\"poker_seq_number\":\"9\",\"rank\":\"10\",\"pointer\":10},\"7\":{\"flower\":\"\♥\",\"poker_seq_number\":\"7\",\"rank\":\"K\",\"pointer\":10}},\"player\":{\"1\":{\"flower\":\"\♠\",\"poker_seq_number\":\"1\",\"rank\":\"7\",\"pointer\":7},\"8\":{\"flower\":\"\♣\",\"poker_seq_number\":\"8\",\"rank\":\"7\",\"pointer\":7},\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150953\"}"
		},
		{
			// 闲
			"table_id": 1,
			"round_id": "RY1123L150954",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"hex\":\"[05] [33] [47] [90] [03] [45] [37]\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"binary\":[5,51,71,144,3,69,55],\"player_pointer\":6,\"banker_pointer\":6,\"poker_info\":{\"banker\":{\"2\":{\"flower\":\"\♣\",\"poker_seq_number\":\"2\",\"rank\":\"4\",\"pointer\":4},\"9\":{\"flower\":\"\♥\",\"poker_seq_number\":\"9\",\"rank\":\"10\",\"pointer\":10},\"7\":{\"flower\":\"\♥\",\"poker_seq_number\":\"7\",\"rank\":\"K\",\"pointer\":10}},\"player\":{\"1\":{\"flower\":\"\♠\",\"poker_seq_number\":\"1\",\"rank\":\"7\",\"pointer\":7},\"8\":{\"flower\":\"\♣\",\"poker_seq_number\":\"8\",\"rank\":\"7\",\"pointer\":7},\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150954\"}"
		},


		{
			// 闲
			"table_id": 1,
			"round_id": "RY1123L150955",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"hex\":\"[05] [33] [47] [90] [03] [45] [37]\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"binary\":[5,51,71,144,3,69,55],\"player_pointer\":6,\"banker_pointer\":6,\"poker_info\":{\"banker\":{\"2\":{\"flower\":\"\♣\",\"poker_seq_number\":\"2\",\"rank\":\"4\",\"pointer\":4},\"9\":{\"flower\":\"\♥\",\"poker_seq_number\":\"9\",\"rank\":\"10\",\"pointer\":10},\"7\":{\"flower\":\"\♥\",\"poker_seq_number\":\"7\",\"rank\":\"K\",\"pointer\":10}},\"player\":{\"1\":{\"flower\":\"\♠\",\"poker_seq_number\":\"1\",\"rank\":\"7\",\"pointer\":7},\"8\":{\"flower\":\"\♣\",\"poker_seq_number\":\"8\",\"rank\":\"7\",\"pointer\":7},\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150955\"}"
		},
		{
			// 庄
			"table_id": 1,
			"round_id": "RY1123L150956",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150956\"}"
		},
		{
			// 和
			"table_id": 1,
			"round_id": "RY1123L150974",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Tie win\",\"winner_mark\":2,\"type\":\"G\",\"hex\":\"[05] [38] [47] [91] [03] [45] [44]\",\"winner_seq\":\"8\",\"winner_pair\":\"Player only\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"614438\",\"poker_message_type\":\"poker_result\",\"binary\":[5,56,71,145,3,69,68],\"player_pointer\":0,\"banker_pointer\":2,\"poker_info\":{\"banker\":{\"7\":{\"flower\":\"\♣\",\"poker_seq_number\":\"7\",\"rank\":\"Q\",\"pointer\":10},\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"3\",\"pointer\":3},\"3\":{\"flower\":\"\♦\",\"poker_seq_number\":\"3\",\"rank\":\"J\",\"pointer\":10}},\"player\":{\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"3\",\"pointer\":3},\"4\":{\"flower\":\"\♣\",\"poker_seq_number\":\"4\",\"rank\":\"A\",\"pointer\":1},\"2\":{\"flower\":\"\♥\",\"poker_seq_number\":\"2\",\"rank\":\"A\",\"pointer\":1}}},\"bureau_number\":\"RY1123L150974\"}"
		},
		{
			// 和
			"table_id": 1,
			"round_id": "RY1123L150974",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Tie win\",\"winner_mark\":2,\"type\":\"G\",\"hex\":\"[05] [38] [47] [91] [03] [45] [44]\",\"winner_seq\":\"8\",\"winner_pair\":\"Player only\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"614438\",\"poker_message_type\":\"poker_result\",\"binary\":[5,56,71,145,3,69,68],\"player_pointer\":0,\"banker_pointer\":2,\"poker_info\":{\"banker\":{\"7\":{\"flower\":\"\♣\",\"poker_seq_number\":\"7\",\"rank\":\"Q\",\"pointer\":10},\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"3\",\"pointer\":3},\"3\":{\"flower\":\"\♦\",\"poker_seq_number\":\"3\",\"rank\":\"J\",\"pointer\":10}},\"player\":{\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"3\",\"pointer\":3},\"4\":{\"flower\":\"\♣\",\"poker_seq_number\":\"4\",\"rank\":\"A\",\"pointer\":1},\"2\":{\"flower\":\"\♥\",\"poker_seq_number\":\"2\",\"rank\":\"A\",\"pointer\":1}}},\"bureau_number\":\"RY1123L150974\"}"
		},

		// 第四列
		{
			// 庄
			"table_id": 1,
			"round_id": "RY1123L150957",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150957\"}"
		},
		{
			// 庄
			"table_id": 1,
			"round_id": "RY1123L150958",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150958\"}"
		},
		{
			// 庄
			"table_id": 1,
			"round_id": "RY1123L150959",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150959\"}"
		},
		{
			// 庄
			"table_id": 1,
			"round_id": "RY1123L150960",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150960\"}"
		},
		{
			// 庄
			"table_id": 1,
			"round_id": "RY1123L150961",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150961\"}"
		},
		{
			// 庄
			"table_id": 1,
			"round_id": "RY1123L150962",
			"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150962\"}"
		},
		// {
		// 	// 庄
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150963",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150963\"}"
		// },


		// {
		// 	// 闲
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150957",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"hex\":\"[05] [33] [47] [90] [03] [45] [37]\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"binary\":[5,51,71,144,3,69,55],\"player_pointer\":6,\"banker_pointer\":6,\"poker_info\":{\"banker\":{\"2\":{\"flower\":\"\♣\",\"poker_seq_number\":\"2\",\"rank\":\"4\",\"pointer\":4},\"9\":{\"flower\":\"\♥\",\"poker_seq_number\":\"9\",\"rank\":\"10\",\"pointer\":10},\"7\":{\"flower\":\"\♥\",\"poker_seq_number\":\"7\",\"rank\":\"K\",\"pointer\":10}},\"player\":{\"1\":{\"flower\":\"\♠\",\"poker_seq_number\":\"1\",\"rank\":\"7\",\"pointer\":7},\"8\":{\"flower\":\"\♣\",\"poker_seq_number\":\"8\",\"rank\":\"7\",\"pointer\":7},\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150957\"}"
		// },
		// {
		// 	// 闲
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150958",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"hex\":\"[05] [33] [47] [90] [03] [45] [37]\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"binary\":[5,51,71,144,3,69,55],\"player_pointer\":6,\"banker_pointer\":6,\"poker_info\":{\"banker\":{\"2\":{\"flower\":\"\♣\",\"poker_seq_number\":\"2\",\"rank\":\"4\",\"pointer\":4},\"9\":{\"flower\":\"\♥\",\"poker_seq_number\":\"9\",\"rank\":\"10\",\"pointer\":10},\"7\":{\"flower\":\"\♥\",\"poker_seq_number\":\"7\",\"rank\":\"K\",\"pointer\":10}},\"player\":{\"1\":{\"flower\":\"\♠\",\"poker_seq_number\":\"1\",\"rank\":\"7\",\"pointer\":7},\"8\":{\"flower\":\"\♣\",\"poker_seq_number\":\"8\",\"rank\":\"7\",\"pointer\":7},\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150958\"}"
		// },
		// {
		// 	// 庄
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150959",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150959\"}"
		// },
		// {
		// 	// 闲
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150960",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"hex\":\"[05] [33] [47] [90] [03] [45] [37]\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"binary\":[5,51,71,144,3,69,55],\"player_pointer\":6,\"banker_pointer\":6,\"poker_info\":{\"banker\":{\"2\":{\"flower\":\"\♣\",\"poker_seq_number\":\"2\",\"rank\":\"4\",\"pointer\":4},\"9\":{\"flower\":\"\♥\",\"poker_seq_number\":\"9\",\"rank\":\"10\",\"pointer\":10},\"7\":{\"flower\":\"\♥\",\"poker_seq_number\":\"7\",\"rank\":\"K\",\"pointer\":10}},\"player\":{\"1\":{\"flower\":\"\♠\",\"poker_seq_number\":\"1\",\"rank\":\"7\",\"pointer\":7},\"8\":{\"flower\":\"\♣\",\"poker_seq_number\":\"8\",\"rank\":\"7\",\"pointer\":7},\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150960\"}"
		// },


		// {
		// 	// 闲
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150961",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"hex\":\"[05] [33] [47] [90] [03] [45] [37]\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"binary\":[5,51,71,144,3,69,55],\"player_pointer\":6,\"banker_pointer\":6,\"poker_info\":{\"banker\":{\"2\":{\"flower\":\"\♣\",\"poker_seq_number\":\"2\",\"rank\":\"4\",\"pointer\":4},\"9\":{\"flower\":\"\♥\",\"poker_seq_number\":\"9\",\"rank\":\"10\",\"pointer\":10},\"7\":{\"flower\":\"\♥\",\"poker_seq_number\":\"7\",\"rank\":\"K\",\"pointer\":10}},\"player\":{\"1\":{\"flower\":\"\♠\",\"poker_seq_number\":\"1\",\"rank\":\"7\",\"pointer\":7},\"8\":{\"flower\":\"\♣\",\"poker_seq_number\":\"8\",\"rank\":\"7\",\"pointer\":7},\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150961\"}"
		// },
		// {
		// 	// 庄
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150962",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150962\"}"
		// },
		// {
		// 	// 庄
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150963",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":3,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150963\"}"
		// },
		// {
		// 	// 闲
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150964",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"hex\":\"[05] [33] [47] [90] [03] [45] [37]\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"binary\":[5,51,71,144,3,69,55],\"player_pointer\":6,\"banker_pointer\":6,\"poker_info\":{\"banker\":{\"2\":{\"flower\":\"\♣\",\"poker_seq_number\":\"2\",\"rank\":\"4\",\"pointer\":4},\"9\":{\"flower\":\"\♥\",\"poker_seq_number\":\"9\",\"rank\":\"10\",\"pointer\":10},\"7\":{\"flower\":\"\♥\",\"poker_seq_number\":\"7\",\"rank\":\"K\",\"pointer\":10}},\"player\":{\"1\":{\"flower\":\"\♠\",\"poker_seq_number\":\"1\",\"rank\":\"7\",\"pointer\":7},\"8\":{\"flower\":\"\♣\",\"poker_seq_number\":\"8\",\"rank\":\"7\",\"pointer\":7},\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150964\"}"
		// },
		// {
		// 	// 庄
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150965",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150965\"}"
		// },
		// {
		// 	// 闲
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150966",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"hex\":\"[05] [33] [47] [90] [03] [45] [37]\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":3,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"binary\":[5,51,71,144,3,69,55],\"player_pointer\":6,\"banker_pointer\":6,\"poker_info\":{\"banker\":{\"2\":{\"flower\":\"\♣\",\"poker_seq_number\":\"2\",\"rank\":\"4\",\"pointer\":4},\"9\":{\"flower\":\"\♥\",\"poker_seq_number\":\"9\",\"rank\":\"10\",\"pointer\":10},\"7\":{\"flower\":\"\♥\",\"poker_seq_number\":\"7\",\"rank\":\"K\",\"pointer\":10}},\"player\":{\"1\":{\"flower\":\"\♠\",\"poker_seq_number\":\"1\",\"rank\":\"7\",\"pointer\":7},\"8\":{\"flower\":\"\♣\",\"poker_seq_number\":\"8\",\"rank\":\"7\",\"pointer\":7},\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150966\"}"
		// },



		// {
		// 	// 庄
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150967",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150967\"}"
		// },
		// {
		// 	// 闲
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150968",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"hex\":\"[05] [33] [47] [90] [03] [45] [37]\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"binary\":[5,51,71,144,3,69,55],\"player_pointer\":6,\"banker_pointer\":6,\"poker_info\":{\"banker\":{\"2\":{\"flower\":\"\♣\",\"poker_seq_number\":\"2\",\"rank\":\"4\",\"pointer\":4},\"9\":{\"flower\":\"\♥\",\"poker_seq_number\":\"9\",\"rank\":\"10\",\"pointer\":10},\"7\":{\"flower\":\"\♥\",\"poker_seq_number\":\"7\",\"rank\":\"K\",\"pointer\":10}},\"player\":{\"1\":{\"flower\":\"\♠\",\"poker_seq_number\":\"1\",\"rank\":\"7\",\"pointer\":7},\"8\":{\"flower\":\"\♣\",\"poker_seq_number\":\"8\",\"rank\":\"7\",\"pointer\":7},\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150968\"}"
		// },
		// {
		// 	// 庄
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150969",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150969\"}"
		// },
		// {
		// 	// 庄
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150970",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150970\"}"
		// },
		// {
		// 	// 闲
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150971",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"hex\":\"[05] [33] [47] [90] [03] [45] [37]\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"binary\":[5,51,71,144,3,69,55],\"player_pointer\":6,\"banker_pointer\":6,\"poker_info\":{\"banker\":{\"2\":{\"flower\":\"\♣\",\"poker_seq_number\":\"2\",\"rank\":\"4\",\"pointer\":4},\"9\":{\"flower\":\"\♥\",\"poker_seq_number\":\"9\",\"rank\":\"10\",\"pointer\":10},\"7\":{\"flower\":\"\♥\",\"poker_seq_number\":\"7\",\"rank\":\"K\",\"pointer\":10}},\"player\":{\"1\":{\"flower\":\"\♠\",\"poker_seq_number\":\"1\",\"rank\":\"7\",\"pointer\":7},\"8\":{\"flower\":\"\♣\",\"poker_seq_number\":\"8\",\"rank\":\"7\",\"pointer\":7},\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150971\"}"
		// },
		// {
		// 	// 闲
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150972",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"hex\":\"[05] [33] [47] [90] [03] [45] [37]\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"binary\":[5,51,71,144,3,69,55],\"player_pointer\":6,\"banker_pointer\":6,\"poker_info\":{\"banker\":{\"2\":{\"flower\":\"\♣\",\"poker_seq_number\":\"2\",\"rank\":\"4\",\"pointer\":4},\"9\":{\"flower\":\"\♥\",\"poker_seq_number\":\"9\",\"rank\":\"10\",\"pointer\":10},\"7\":{\"flower\":\"\♥\",\"poker_seq_number\":\"7\",\"rank\":\"K\",\"pointer\":10}},\"player\":{\"1\":{\"flower\":\"\♠\",\"poker_seq_number\":\"1\",\"rank\":\"7\",\"pointer\":7},\"8\":{\"flower\":\"\♣\",\"poker_seq_number\":\"8\",\"rank\":\"7\",\"pointer\":7},\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150972\"}"
		// },
		// {
		// 	// 闲
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150973",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"hex\":\"[05] [33] [47] [90] [03] [45] [37]\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"binary\":[5,51,71,144,3,69,55],\"player_pointer\":6,\"banker_pointer\":6,\"poker_info\":{\"banker\":{\"2\":{\"flower\":\"\♣\",\"poker_seq_number\":\"2\",\"rank\":\"4\",\"pointer\":4},\"9\":{\"flower\":\"\♥\",\"poker_seq_number\":\"9\",\"rank\":\"10\",\"pointer\":10},\"7\":{\"flower\":\"\♥\",\"poker_seq_number\":\"7\",\"rank\":\"K\",\"pointer\":10}},\"player\":{\"1\":{\"flower\":\"\♠\",\"poker_seq_number\":\"1\",\"rank\":\"7\",\"pointer\":7},\"8\":{\"flower\":\"\♣\",\"poker_seq_number\":\"8\",\"rank\":\"7\",\"pointer\":7},\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"RY1123L150973\"}"
		// },
		// {
		// 	// 和
		// 	"table_id": 1,
		// 	"round_id": "RY1123L150974",
		// 	"original_data": "{\"table_id\":\"RY11\",\"winner\":\"Tie win\",\"winner_mark\":2,\"type\":\"G\",\"hex\":\"[05] [38] [47] [91] [03] [45] [44]\",\"winner_seq\":\"8\",\"winner_pair\":\"Player only\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"614438\",\"poker_message_type\":\"poker_result\",\"binary\":[5,56,71,145,3,69,68],\"player_pointer\":0,\"banker_pointer\":2,\"poker_info\":{\"banker\":{\"7\":{\"flower\":\"\♣\",\"poker_seq_number\":\"7\",\"rank\":\"Q\",\"pointer\":10},\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"3\",\"pointer\":3},\"3\":{\"flower\":\"\♦\",\"poker_seq_number\":\"3\",\"rank\":\"J\",\"pointer\":10}},\"player\":{\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"3\",\"pointer\":3},\"4\":{\"flower\":\"\♣\",\"poker_seq_number\":\"4\",\"rank\":\"A\",\"pointer\":1},\"2\":{\"flower\":\"\♥\",\"poker_seq_number\":\"2\",\"rank\":\"A\",\"pointer\":1}}},\"bureau_number\":\"RY1123L150974\"}"
		// }
	]
})

function addBankerWin() {
	const round_id = `${tableId.value}${defaultRoundNumber.value}`
	defaultRoundNumber.value += 1
	const item = {
			// 庄
			"table_id": 1,
			"round_id": round_id, //"RY1123L150949",
			"original_data": `{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"hex\":\"[05] [36] [47] [c0] [03] [42] [32]\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"binary\":[5,54,71,192,3,66,50],\"player_pointer\":4,\"banker_pointer\":0,\"poker_info\":{\"banker\":{\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"10\",\"pointer\":10},\"3\":{\"flower\":\"\♣\",\"poker_seq_number\":\"3\",\"rank\":\"7\",\"pointer\":7},\"1\":{\"flower\":\"\♣\",\"poker_seq_number\":\"1\",\"rank\":\"8\",\"pointer\":8}},\"player\":{\"4\":{\"flower\":\"\♠\",\"poker_seq_number\":\"4\",\"rank\":\"6\",\"pointer\":6},\"2\":{\"flower\":\"\♦\",\"poker_seq_number\":\"2\",\"rank\":\"Q\",\"pointer\":10},\"8\":{\"flower\":\"\♠\",\"poker_seq_number\":\"8\",\"rank\":\"5\",\"pointer\":5}}}}`
		}
	mapList.value.push(item)
}

function addPlayerWin() {
	const round_id = `${tableId.value}${defaultRoundNumber.value}`
	defaultRoundNumber.value += 1
	const item = {
			// 庄
			"table_id": 1,
			"round_id": round_id, //"RY1123L150949",
			"original_data": `{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"hex\":\"[05] [33] [47] [90] [03] [45] [37]\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":3,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"binary\":[5,51,71,144,3,69,55],\"player_pointer\":6,\"banker_pointer\":6,\"poker_info\":{\"banker\":{\"2\":{\"flower\":\"\♣\",\"poker_seq_number\":\"2\",\"rank\":\"4\",\"pointer\":4},\"9\":{\"flower\":\"\♥\",\"poker_seq_number\":\"9\",\"rank\":\"10\",\"pointer\":10},\"7\":{\"flower\":\"\♥\",\"poker_seq_number\":\"7\",\"rank\":\"K\",\"pointer\":10}},\"player\":{\"1\":{\"flower\":\"\♠\",\"poker_seq_number\":\"1\",\"rank\":\"7\",\"pointer\":7},\"8\":{\"flower\":\"\♣\",\"poker_seq_number\":\"8\",\"rank\":\"7\",\"pointer\":7},\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"5\",\"pointer\":5}}},\"bureau_number\":\"${round_id}\"}`
		}
	mapList.value.push(item)
}

function addTieWin() {
	const round_id = `${tableId.value}${defaultRoundNumber.value}`
	defaultRoundNumber.value += 1
	const item = {
			// 和
			"table_id": 1,
			"round_id": round_id, //"RY1123L150949",
			"original_data": `{\"table_id\":\"RY11\",\"winner\":\"Tie win\",\"winner_mark\":2,\"type\":\"G\",\"hex\":\"[05] [38] [47] [91] [03] [45] [44]\",\"winner_seq\":\"8\",\"winner_pair\":\"Player only\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"614438\",\"poker_message_type\":\"poker_result\",\"binary\":[5,56,71,145,3,69,68],\"player_pointer\":0,\"banker_pointer\":2,\"poker_info\":{\"banker\":{\"7\":{\"flower\":\"\♣\",\"poker_seq_number\":\"7\",\"rank\":\"Q\",\"pointer\":10},\"5\":{\"flower\":\"\♠\",\"poker_seq_number\":\"5\",\"rank\":\"3\",\"pointer\":3},\"3\":{\"flower\":\"\♦\",\"poker_seq_number\":\"3\",\"rank\":\"J\",\"pointer\":10}},\"player\":{\"6\":{\"flower\":\"\♣\",\"poker_seq_number\":\"6\",\"rank\":\"3\",\"pointer\":3},\"4\":{\"flower\":\"\♣\",\"poker_seq_number\":\"4\",\"rank\":\"A\",\"pointer\":1},\"2\":{\"flower\":\"\♥\",\"poker_seq_number\":\"2\",\"rank\":\"A\",\"pointer\":1}}},\"bureau_number\":\"${round_id}\"}`
		}
	mapList.value.push(item)
}

function clearMapList() {
	mapList.value = []
	cacheMapList.value = []
}


</script>
<template>
	<div class="test-page">
		<div class="wrap">
			<div class="route">
				<routeMaps ref="routeMapRef" :mapList="mapList" :mapId="tableId" class="route-maps-wrap" />
				<askForRoad ref="askForRoadRef" :map-list="cacheMapList" :round-id="tableId" />
				<!-- <askForRoad2 ref="askForRoadRef" :map-list="cacheMapList" :round-id="tableId" /> -->
			</div>
			<div class="btn-box">
				<el-row class="mb-4">
					<el-button type="danger" @click="addBankerWin">庄Banker</el-button>
					<el-button type="primary" @click="addPlayerWin">闲Player</el-button>
					<el-button type="success" @click="addTieWin">和Tie</el-button>
					<el-button type="info" @click="clearMapList">清空</el-button>
				</el-row>
			</div>
		</div>
	</div>
</template>

<style scoped lang="less">
.test-page {
	display: flex;
	height: 100%;
	align-items: center;
	justify-content: center;

	.wrap {
		.route {
			display: flex;
		}

		.btn-box {
			margin-top: 10px;
		}
	}
}
</style>
