const toMM = (num:number) => (num<10?"0"+num:num); // 숫자를 2자리 문자열로 변환 (1 -> "01")
const timeStamp = (_time = new Date()) => `${toMM(_time.getHours())}:${toMM(_time.getMinutes())}:${toMM(_time.getSeconds())}`; // 현재 시간 또는 특정 시간을 HH:mm:ss 형식의 문자열로 반환
export default timeStamp;