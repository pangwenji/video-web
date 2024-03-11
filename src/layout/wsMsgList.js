import { ref, watch } from 'vue';
import mySocket from '@/utils/mySocket';
import { roomDetail } from './videoRoom.vue';

const { status, data, open, close, send } = mySocket();
export const wsMsgList = ref([]);
watch(data, val => {
console.log('接收到的ws消息', val);
wsMsgList.value.push(val);
});
watch(status, val => {
console.log('ws-status', val);
if (val === "OPEN") {
send(JSON.stringify({
event: "join_table",
data: {
table_code: roomDetail.value.code
}
}));
}
});
